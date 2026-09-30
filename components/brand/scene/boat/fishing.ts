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
import { HULL } from "./hull";
import { POUND, tiltOver, TRAWL_REST, type createTrawl } from "./trawl";

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
  /** The trawl's catch, lying in the pound for the crew to take. */
  landed: Note[];
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
/** At most this much of the net's run is spent dragging it, world units: the warp is paid out to suit. */
const WARP = 5;
/** How much catch the pound holds before the trawl waits for the crew to clear it. */
const POUND_ROOM = 8;

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createVoyage(crew: Crew) {
  const { body, sail, cabin, cargo, crane, trawl, swarm, ripples, bursts, now, travel, focus, landed } = crew;
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

  /** Over the stern, down to the water, and let go: it lies where it lands. */
  async function shoot() {
    const p = trawl.pose;
    await play((tl) => tl.to(p, { tilt: 0.45, duration: 1.5, ease: "power2.inOut" }));
    const block = trawl.block(new Vector3());
    const water = crew.water(block.x, block.z);
    const drop = (block.y - water) / crew.size - 0.3;
    await play((tl) =>
      tl
        .to(p, { drop, duration: 1.3, ease: "power1.in" })
        .call(() => {
          bursts.fire(scratch.set(block.x, water + 0.1, block.z), now(), SPRAY);
          ripples.spawn(block.x, block.z, now(), SURFACE);
          p.warp = block.y - water;
        })
        .to(p, { hang: 0, duration: 0.6, ease: "power1.inOut" }),
    );
  }

  /**
   * Ahead to x, paying out warp as it goes: the net lies where it was shot
   * until the warps come taut, then is dragged astern; a shoal comes up in the
   * water it will sweep, and goes in at the mouth and down to the cod-end.
   */
  async function run(x: number, room: number) {
    const caught: Note[] = [];
    const shoal: Note[] = [];
    const block = trawl.block(new Vector3());
    const lying = trawl.mouth(new Vector3());
    // Enough warp that the net is dragged about half the run: the rest is slack taken up.
    const depth = block.y - crew.water(lying.x, lying.z);
    const reach = Math.min(WARP, Math.abs(x - travel.x) * 0.45);
    const warp = Math.hypot(depth, reach);
    // The water the mouth will sweep: from where it lies to where it ends up, astern of the block.
    const end = block.x + (x - travel.x) + reach;
    const from = lying.x - 0.5;
    for (let i = 0; i < room && from - end > 0.6; i++) {
      const nx = end + 0.3 + (from - end - 0.3) * ((i + 0.5) / room);
      const nz = lying.z + (Math.random() - 0.5) * 1.4;
      ctx.add(() => gsap.delayedCall(0.6 + i * 0.45, () => void shoal.push(swarm.summon(nx, nz))));
    }
    ctx.add(() => gsap.to(trawl.pose, { warp, duration: 3, ease: "power1.inOut" }));
    const mouth = new Vector3();
    await steam(x, AHEAD, () => {
      trawl.mouth(mouth);
      const spread = trawl.spread();
      for (const n of shoal) {
        if (caught.includes(n) || n.state !== "afloat") continue;
        if (Math.abs(n.pos.x - mouth.x) > 0.7 || Math.abs(n.pos.z - mouth.z) > spread) continue;
        caught.push(n);
        swarm.grip(n, trawl.holder);
        // In at the mouth, and down the length of the net to the cod-end.
        const pocket = trawl.pocket(caught.length - 1);
        ctx.add(() => gsap.to(n.local, { x: pocket.x, y: pocket.y, z: pocket.z, duration: 1.4, ease: "power1.inOut" }));
        bursts.fire(mouth, now(), SPRAY);
      }
    });
    await wait(0.8);
    // Any it missed are the sea's again.
    shoal.filter((n) => !caught.includes(n)).forEach((n) => (n.claimed = false));
    return caught;
  }

  /** Somewhere in the pound the catch has not already covered, in the boat's frame. */
  function spot(taken: Vector3[]): Vector3 {
    let best = new Vector3();
    let room = -1;
    for (let k = 0; k < 14; k++) {
      const c = new Vector3(
        POUND.from + 0.45 + Math.random() * (POUND.to - POUND.from - 0.9),
        HULL.deck + 0.14,
        POUND.back + 0.45 + Math.random() * (POUND.front - POUND.back - 0.8),
      );
      const d = Math.min(9, ...taken.map((t) => t.distanceTo(c)));
      if (d > room) {
        room = d;
        best = c;
      }
    }
    taken.push(best);
    return best;
  }

  /** Winched in, hoisted, swung inboard over the pound, and emptied onto the deck. */
  async function haul(caught: Note[]) {
    const p = trawl.pose;
    const block = new Vector3();
    await play((tl) =>
      tl
        // The warps come in and drag the net up to the stern.
        .to(p, {
          warp: 0,
          duration: 3,
          ease: "power1.inOut",
          onUpdate: () => {
            trawl.block(block);
            p.warp = Math.max(p.warp, block.y - crew.water(block.x, block.z) + 0.2);
          },
        })
        .call(() => {
          trawl.block(block);
          p.drop = (block.y - crew.water(block.x, block.z)) / crew.size - 0.3;
          bursts.fire(trawl.mouth(scratch), now(), SPRAY);
        })
        // Out of the water, and up under the block, dripping.
        .to(p, { hang: 1, fill: caught.length ? 1 : 0, duration: 0.8, ease: "power2.out" })
        .to(p, { drop: TRAWL_REST.drop, duration: 1.8, ease: "power2.inOut" })
        .call(() => bursts.fire(trawl.mouth(scratch), now(), DRIP), [], "<0.3")
        .call(() => bursts.fire(trawl.mouth(scratch), now(), DRIP), [], "<0.6"),
    );
    if (!caught.length) {
      await play((tl) => tl.to(p, { ...TRAWL_REST, duration: 1.4, ease: "power2.inOut" }));
      return;
    }

    const taken = landed.map((n) => n.local);
    await play((tl) => {
      tl.to(p, { tilt: tiltOver((POUND.from + POUND.to) / 2 + 0.3), duration: 2, ease: "power2.inOut" })
        .to({}, { duration: 0.3 })
        // The cod-end untied: the catch spills out onto the deck.
        .to(p, { open: 1, duration: 0.3, ease: "power2.out" });
      caught.forEach((n, i) => {
        tl.call(
          () => {
            const at = spot(taken);
            swarm
              .toss(n, at.clone().setY(at.y + swarm.top(n) * 0.35), {
                holder: body,
                arc: 0.35,
                duration: 0.5,
                tumble: 5 + i,
                spin: 2,
              })
              .then(() => {
                // Lying where it fell, on its side, the way a catch lands.
                n.pitch = 0.45 + Math.random() * 0.3;
                n.localRoll = (Math.random() < 0.5 ? -1 : 1) * (1.25 + Math.random() * 0.3);
                n.localYaw = Math.random() - 0.5;
                bursts.fire(body.localToWorld(at.clone()), now(), DUST);
                landed.push(n);
              });
          },
          [],
          `<${0.05 + i * 0.16}`,
        );
      });
      tl.to(p, { fill: 0, duration: 0.6 }, "<")
        .to({}, { duration: 0.6 })
        .to(p, { open: 0, duration: 0.3 })
        .to(p, { ...TRAWL_REST, duration: 1.8, ease: "power2.inOut" });
    });
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
      // The pound is not full: shoot, and trawl a run ahead.
      const room = Math.max(0, Math.min(5, POUND_ROOM - landed.length));
      if (room > 1) {
        await shoot();
        const caught = await run(-r, room);
        stern = haul(caught);
      } else {
        await steam(-r, AHEAD);
      }
      // Stopped: the trawl comes in while the crane fishes.
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
