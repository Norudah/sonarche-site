import gsap from "gsap";
import { Vector3, type Group } from "three";

import { BITE, DRIP, DUST, SPARK, SPRAY, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import type { createCabin } from "./cabin";
import type { createCargo } from "./cargo";
import type { Container } from "./container";
import { GRASP } from "./crane/claw";
import { CLEAR, REST, type Pose, type createCrane } from "./crane/crane";
import type { createSwarm, Note } from "./notes";
import { tiltOver, TRAWL_REST, type createTrawl } from "./trawl";

/*
 * The day's work, told as a sequence of causes: a vessel under way, fishing
 * two ways, one at each end, feeding the hold on either side of the head.
 *
 * It steams across the frame and back, all the time. At one end of its run
 * it shoots the trawl off the stern, and as it gets under way the net streams
 * out astern on its warps and sweeps up a shoal rising in its path. At the
 * other end it stops: the trawl is hauled, the gantry tips the full bag over
 * one of the boxes at its foot and the cod-end is untied over the hatch. And
 * while it lies stopped, the crane at the bow fishes: the ark pings; where the
 * ring passes a note breaks the surface; the vessel turns its eyes to it; the
 * crane unfolds, goes down for it, bites, yanks it clear; then carries it the
 * way a real operator would, up, clear of the deck, across at that height, a
 * stop over the box while the swing dies out and the hatch opens, and only
 * then down, slowly, straight in through the roof. Then back across the frame
 * it goes, stowing on the way.
 *
 * Emptying the boxes is the crew's job (crew.ts). Each step is a timeline,
 * awaited in turn; tearing the scene down reverts the context, the pending
 * timeline never completes, and the voyage stops where it was.
 */

type Crew = {
  body: Group;
  sail: Group;
  cabin: ReturnType<typeof createCabin>;
  cargo: ReturnType<typeof createCargo>;
  crane: ReturnType<typeof createCrane>;
  trawl: ReturnType<typeof createTrawl>;
  swarm: ReturnType<typeof createSwarm>;
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** How far either side of the middle the vessel steams, world units: set by the frame's width. */
  roam: () => number;
  /** The boat's scale: offsets in its frame to the world. */
  size: number;
  /** The water's height at a point. */
  water: (x: number, z: number) => number;
  /** Tweened here, read by the boat every frame. */
  travel: { x: number; surfacing: number };
  /** What the vessel is looking at, and the note the stream swirls into. */
  focus: { note: Note | null; watched: boolean; load: number };
};

/** The ark's sonar looking for music: a quick, light ring. */
const SEEK: RingSpec = { strength: 0.8, speed: 26, width: 2 };
const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };
/** Where the crane's notes surface, in the boat's frame: off the bow, on the camera's side. */
const CRANE_SPOT = { x: [-13.3, -11.8], z: [1.2, 2.4] };
/** How far above the floor of its box the claw lets a note go. */
const SET_DOWN = 0.05;
/** World units a second: ahead, trawling, and astern, going back for another run. */
const AHEAD = 1.15;
const ASTERN = 0.75;

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createVoyage(crew: Crew) {
  const { body, sail, cabin, cargo, crane, trawl, swarm, ripples, bursts, now, travel, focus } = crew;
  const ctx = gsap.context(() => {});
  let running = true;

  function play(build: (tl: gsap.core.Timeline) => void): Promise<void> {
    return new Promise((resolve) =>
      ctx.add(() => {
        build(gsap.timeline({ onComplete: resolve }));
      }),
    );
  }
  const wait = (seconds: number) => play((tl) => tl.to({}, { duration: seconds }));
  const move = (tl: gsap.core.Timeline, to: Partial<Pose>, duration: number, ease: string, at?: gsap.Position) =>
    tl.to(crane.pose, { ...to, duration, ease, overwrite: "auto" }, at);

  /** The slew, wrapped to the turn nearest `from`: the crane swings the short way. */
  function near<T extends { slew: number }>(pose: T, from: number): T {
    let a = pose.slew;
    while (a - from > Math.PI) a -= Math.PI * 2;
    while (a - from < -Math.PI) a += Math.PI * 2;
    return { ...pose, slew: a };
  }

  const scratch = new Vector3();
  const toWorld = (v: Vector3) => body.localToWorld(v.clone());
  const inBox = (box: Container, v: Vector3) => v.clone().applyMatrix4(box.toBoat);

  /** A box that has received: the hatch slams on what it got, a light on for each. */
  function shut(tl: gsap.core.Timeline, box: Container, at?: gsap.Position) {
    tl.to(box.hatch, { open: 0, duration: 0.42, ease: "power3.in" }, at)
      .call(() => {
        box.bump(1.3);
        bursts.fire(toWorld(box.seam), now(), DUST);
        box.held.forEach((n, i) => {
          if (box.lights[i].emissiveIntensity > 0) return;
          box.light(i, true);
          ctx.add(() =>
            gsap.fromTo(box.lights[i], { emissiveIntensity: 6 }, { emissiveIntensity: 1.8, duration: 0.7 }),
          );
          bursts.fire(toWorld(box.lamp(i)), now(), SPARK);
          n.shine = 0;
        });
        cabin.kick();
      })
      .to(box.hatch, { open: 0.08, duration: 0.09, ease: "power1.out" })
      .to(box.hatch, { open: 0, duration: 0.25, ease: "bounce.out" });
  }

  /** Under way to x, at a speed; `each` runs every frame of the passage. */
  function steam(x: number, speed: number, each?: () => void) {
    const duration = Math.max(0.5, Math.abs(x - travel.x) / speed);
    return play((tl) => tl.to(travel, { x, duration, ease: "sine.inOut", onUpdate: each }));
  }

  // --- The crane -----------------------------------------------------------------

  async function fishBow(box: Container): Promise<() => Promise<void>> {
    const spot = body.localToWorld(new Vector3(between(CRANE_SPOT.x), 0, between(CRANE_SPOT.z)));

    // The ping goes out; where it passes the spot, the water stirs.
    ripples.spawn(sail.position.x, 0, now(), SEEK);
    cabin.kick();
    await wait(Math.hypot(spot.x - sail.position.x, spot.z) / SEEK.speed);
    const note = swarm.summon(spot.x, spot.z);
    focus.note = note;
    const top = swarm.top(note);

    // The crane unfolds towards it as it comes up.
    const aim = near(crane.reach(spot.clone().setY(crew.water(spot.x, spot.z) + top), body, 1.6, 1.4), crane.pose.slew);
    await play((tl) => {
      tl.to(travel, { surfacing: 1, duration: 0.5 }, 0)
        .call(() => void (focus.watched = true), [], 0.7)
        .to(travel, { surfacing: 0, duration: 1 }, 1.3);
      move(tl, { reach: aim.reach, lift: aim.lift }, 1.5, "power2.inOut", 0.2);
      move(tl, { slew: aim.slew, cable: aim.cable, grip: 0.35 }, 1.7, "power2.inOut", 0.5);
      tl.to({}, { duration: 0.2 });
    });

    // Over where the note really is, and down for it.
    const target = note.pos.clone().setY(note.pos.y + top);
    const over = near(crane.reach(target, body, 1.4, 1.4), crane.pose.slew);
    const down = over.cable + 1.4 - GRASP;
    await play((tl) => {
      move(tl, { ...over, grip: 0.2 }, 0.6, "power2.inOut");
      tl.to(crane.pose, { cable: down, duration: 0.85, ease: "power1.inOut" })
        .to(crane.pose, { grip: 0, duration: 0.4, ease: "power2.out" }, "<")
        .to(crane.pose, { grip: 1.08, duration: 0.24, ease: "back.out(3)" })
        .call(
          () => {
            bursts.fire(
              crane
                .hookAt()
                .clone()
                .setY(crane.hookAt().y - 0.9),
              now(),
              BITE,
            );
            swarm.grip(note, crane.holder);
            note.localYaw = 0;
          },
          [],
          "<0.12",
        )
        .to(note.local, { x: 0, y: -(GRASP + top), z: 0, duration: 0.2, ease: "power2.out" }, "<0.01")
        .fromTo(note, { squash: 0.8 }, { squash: 1, duration: 0.3, ease: "power2.out" }, "<")
        .to(crane.pose, { grip: 1, duration: 0.2 })
        // The yank: out of the water in a spray, the note stretched by it.
        .to(crane.pose, { cable: over.cable - 0.4, duration: 0.75, ease: "power3.out" })
        .call(
          () => {
            bursts.fire(scratch.copy(target).setY(crew.water(target.x, target.z) + 0.1), now(), SPRAY);
            ripples.spawn(target.x, target.z, now(), SURFACE);
          },
          [],
          "<",
        )
        .fromTo(note, { squash: 1.35 }, { squash: 1, duration: 0.9, ease: "elastic.out(1.2, 0.35)" }, "<")
        .to(focus, { load: 1, duration: 0.6 }, "<")
        .call(() => bursts.fire(swarm.where(note, scratch), now(), DRIP), [], "<0.2")
        .call(() => bursts.fire(swarm.where(note, scratch), now(), DRIP), [], "<0.3");
    });

    return () => stowBow(box, note, top);
  }

  async function stowBow(box: Container, note: Note, top: number) {
    const slot = box.held.length;
    const floor = toWorld(inBox(box, box.slot(slot)));
    // Carried high, then down onto the floor: the hook ends up this far over it.
    const landing = GRASP + top * 2 + SET_DOWN;
    const drop = box.height + 0.35;
    const high = near(crane.hang(floor, body, landing + drop), crane.pose.slew);

    await play((tl) => {
      // Up, clear of the deck, where it is.
      move(tl, { lift: CLEAR, cable: 0.9 }, 0.9, "power2.inOut");
      // Across, at that height.
      move(tl, { slew: high.slew, reach: high.reach }, 1.8, "power2.inOut", ">-0.1");
      tl.to(box.hatch, { open: 1, duration: 0.6, ease: "back.out(1.6)" }, "<0.9")
        .call(() => box.bump(0.25), [], "<0.1")
        // The stop: the operator lets the swing die out before setting it down.
        .to(crane.pose, { cable: high.cable, steady: 1, duration: 0.7, ease: "power2.out" }, ">")
        .to({}, { duration: 0.35 })
        // Down, slowly, straight in through the roof.
        .to(crane.pose, { cable: high.cable + drop, duration: 1.8, ease: "sine.inOut" })
        .to(note, { shine: 1, duration: 0.8 }, "<0.6")
        // Let go: it drops the last hair onto the floor and the box takes the weight.
        .to(crane.pose, { grip: 0, duration: 0.22, ease: "power2.out" })
        .call(
          () => {
            swarm.grip(note, box.group);
            const rest = box.slot(slot);
            note.local.set(rest.x, rest.y + top, rest.z);
            note.localYaw = 0;
            box.held.push(note);
            focus.load = 0;
            focus.watched = false;
            box.bump(0.9);
            ctx.add(() =>
              gsap.fromTo(note, { squash: 0.78 }, { squash: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }),
            );
          },
          [],
          "<0.08",
        )
        // Out, shutting as it rises; the hatch slams behind it.
        .to(crane.pose, { cable: high.cable - 0.2, duration: 0.8, ease: "power2.in" }, ">0.15")
        .to(crane.pose, { grip: 1, steady: 0, duration: 0.35 }, "<0.25");
      shut(tl, box, "<0.2");
      move(tl, near({ ...REST }, high.slew), 2.3, "power2.inOut", ">0.1");
    });
    box.busy = false;
  }

  // --- The trawl -----------------------------------------------------------------

  /** Over the stern and down to the water. */
  async function shoot() {
    const p = trawl.pose;
    await play((tl) => tl.to(p, { tilt: 0.45, duration: 1.5, ease: "power2.inOut" }));
    // Paid out until the beam is on the water under the block.
    const block = trawl.mouth(scratch).y + (0.3 + p.drop) * crew.size;
    const water = crew.water(scratch.x, scratch.z);
    const drop = (block - water) / crew.size - 0.3;
    await play((tl) =>
      tl
        .to(p, { drop, duration: 1.3, ease: "power1.in" })
        .call(() => {
          trawl.mouth(scratch);
          bursts.fire(scratch.setY(water + 0.1), now(), SPRAY);
          ripples.spawn(scratch.x, scratch.z, now(), SURFACE);
        })
        // Streamed: the net lies back on the water, ready to be towed.
        .to(p, { hang: 0, duration: 1.4, ease: "power1.inOut" }),
    );
  }

  /** Ahead to x with the net streaming astern, a shoal rising in its path. */
  async function run(x: number, room: number) {
    const caught: Note[] = [];
    const shoal: Note[] = [];
    const start = travel.x;
    // The net trails this far astern of the boat's middle: the shoal is strung across its path.
    const astern = 10 * crew.size + 6;
    for (let i = 0; i < room + 1 && room > 0; i++) {
      const f = (i + 0.7) / (room + 1.4);
      const nx = start + (x - start) * f + astern;
      const nz = (Math.random() - 0.35) * 0.8;
      ctx.add(() => gsap.delayedCall(0.4 + i * 0.5, () => void shoal.push(swarm.summon(nx, nz))));
    }
    const mouth = new Vector3();
    await steam(x, AHEAD, () => {
      if (trawl.pose.hang > 0.3) return;
      trawl.mouth(mouth);
      for (const n of shoal) {
        if (caught.length >= room || caught.includes(n) || n.state !== "afloat") continue;
        if (Math.hypot(n.pos.x - mouth.x, n.pos.z - mouth.z) > 1.4) continue;
        caught.push(n);
        swarm.grip(n, trawl.holder);
        const pocket = trawl.pocket(caught.length - 1);
        ctx.add(() => gsap.to(n.local, { x: pocket.x, y: pocket.y, z: pocket.z, duration: 0.4, ease: "power2.out" }));
        bursts.fire(mouth, now(), SPRAY);
      }
    });
    // Any it missed are the sea's again.
    shoal.filter((n) => !caught.includes(n)).forEach((n) => (n.claimed = false));
    return caught;
  }

  /** In, up, inboard over the box, and the cod-end untied over its hatch. */
  async function haul(box: Container, caught: Note[]) {
    const p = trawl.pose;
    const mouth = new Vector3();
    await play((tl) =>
      tl
        .to(p, { hang: 1, fill: caught.length ? 1 : 0.2, duration: 1.8, ease: "power2.inOut" })
        .call(() => {
          trawl.mouth(mouth);
          bursts.fire(mouth, now(), SPRAY);
        })
        .to(p, { drop: TRAWL_REST.drop, duration: 1.6, ease: "power2.inOut" })
        .call(() => bursts.fire(trawl.mouth(mouth), now(), DRIP), [], "<0.4")
        .call(() => bursts.fire(trawl.mouth(mouth), now(), DRIP), [], "<0.5"),
    );
    if (!caught.length) {
      await play((tl) => tl.to(p, { ...TRAWL_REST, duration: 1.6, ease: "power2.inOut" }));
      box.busy = false;
      return;
    }

    await play((tl) => {
      tl.to(p, { tilt: tiltOver(box.spec.x), duration: 2, ease: "power2.inOut" })
        .to(box.hatch, { open: 1, duration: 0.6, ease: "back.out(1.6)" }, "<1.2")
        .to({}, { duration: 0.35 })
        .to(p, { open: 1, fill: 0.2, duration: 0.4, ease: "power2.out" });
      caught.forEach((n, i) => {
        tl.call(
          () => {
            const slot = box.held.length;
            box.held.push(n);
            const rest = box.slot(slot);
            swarm
              .toss(n, new Vector3(rest.x, rest.y + swarm.top(n), rest.z), {
                holder: box.group,
                arc: 0.05,
                duration: 0.5,
                tumble: 4 + i,
              })
              .then(() => {
                n.pitch = 0;
                n.localRoll = 0;
                n.localYaw = 0;
                n.shine = 0.6;
                box.bump(0.7);
              });
          },
          [],
          `<${0.1 + i * 0.2}`,
        );
      });
      tl.to({}, { duration: 0.8 }).to(p, { open: 0, duration: 0.3 });
      shut(tl, box, "<");
      tl.to(p, { ...TRAWL_REST, duration: 1.8, ease: "power2.inOut" }, ">0.1");
    });
    box.busy = false;
  }

  async function voyage() {
    let bow: Promise<void> = Promise.resolve();
    let stern: Promise<void> = Promise.resolve();
    await wait(0.4);
    while (running) {
      const r = crew.roam();
      // Astern across the frame, stowing on the way, to the start of a run.
      await steam(r, ASTERN);
      await stern;
      const net = cargo.pick("trawl");
      if (net) {
        net.busy = true;
        await shoot();
      }
      // Ahead, trawling.
      const caught = await run(-r, net ? net.spec.slots - net.held.length : 0);
      // Stopped: the trawl comes in while the crane fishes.
      stern = net ? haul(net, caught) : Promise.resolve();
      await bow;
      const box = cargo.pick("crane");
      if (box) {
        box.busy = true;
        const stow = await fishBow(box);
        bow = stow();
      } else {
        await wait(2);
      }
    }
  }

  return {
    start() {
      voyage();
    },
    dispose() {
      running = false;
      ctx.revert();
    },
  };
}
