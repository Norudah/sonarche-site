import gsap from "gsap";
import { Object3D, Vector3, type Group } from "three";

import { BITE, DRIP, DUST, SPARK, SPRAY, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import type { createCabin } from "./cabin";
import type { createCargo } from "./cargo";
import type { Container } from "./container";
import { GRASP } from "./crane/claw";
import { CLEAR, REST, type Pose, type createCrane } from "./crane/crane";
import { NET_BASE, NET_REST, type createNet } from "./net";
import { FLOAT_Y, type Note, type createSwarm } from "./notes";

/*
 * The day's work, told as a sequence of causes: two ways of fishing, one at
 * each end, feeding the hold on either side of the head.
 *
 * Aft, the crane. The ark pings; where the ring passes, the water stirs, the
 * stream's pixels swirl in and a note breaks the surface. The vessel turns its
 * eyes to it and sails over, the crane unfolding on the way. The jib's head
 * stops over the note, the claw opens on the way down, bites (a snap, chips
 * of light), and yanks it clear, water running off it. Then it handles the
 * load the way a real operator would: up, clear of everything on deck; across
 * at that height; a stop over the box while the swing dies out and the hatch
 * opens; and only then down, slowly, straight in through the roof. Let go, a
 * thud the box bounces to, the claw out, the hatch slammed in a puff of dust,
 * a light on over the doors.
 *
 * Forward, the net. A shoal rises off the bow; the pole swings out, the hoop
 * rolls mouth-first and dips, and the net is dragged through them in a
 * spray; rolled mouth-up it comes out full and dripping, swings over one of
 * the forward boxes, and pours them in through the hatch.
 *
 * The two run side by side: while one is stowing, the other is out fishing.
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
  net: ReturnType<typeof createNet>;
  swarm: ReturnType<typeof createSwarm>;
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** How far either way the boat moves between catches, world units. */
  patrol: number;
  /** How high the hull rides, and the boat's scale: the frame the gear's aim is solved in. */
  ride: number;
  size: number;
  /** Tweened here, read by the boat every frame. */
  travel: { x: number; surfacing: number };
  /** What the vessel is looking at, and the note the stream swirls into. */
  focus: { note: Note | null; watched: boolean; load: number };
  hop: (k: number) => void;
};

/** The ark's sonar looking for music: a quick, light ring. */
const SEEK: RingSpec = { strength: 0.8, speed: 26, width: 2 };
const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };
const WAKE: RingSpec = { strength: 0.6, speed: 8, width: 1.4 };
/** Where the crane's notes surface, in the boat's frame at its station: off the stern, on the camera's side. */
const CRANE_SPOT = { x: [-13.3, -11.8], z: [1.2, 2.4] };
/** Where the net's shoals surface: off the bow, on the camera's side. */
const NET_SPOT = { x: [11.2, 12.1], z: [1.6, 2.5] };
/** How far above the floor of its box the claw lets a note go. */
const SET_DOWN = 0.05;

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createVoyage(crew: Crew) {
  const { body, sail, cabin, cargo, crane, net, swarm, ripples, bursts, now, travel, focus } = crew;
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

  // A stand-in for the boat where it is about to stop, to aim before it gets there.
  const station = new Object3D();
  function stationAt(x: number) {
    station.position.set(x, crew.ride, 0);
    station.scale.setScalar(crew.size);
    station.updateMatrixWorld(true);
    return station;
  }

  /** The slew, wrapped to the turn nearest `from`: gear swings the short way. */
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
        crew.hop(0.3);
        cabin.kick();
      })
      .to(box.hatch, { open: 0.08, duration: 0.09, ease: "power1.out" })
      .to(box.hatch, { open: 0, duration: 0.25, ease: "bounce.out" });
  }

  // --- The crane -----------------------------------------------------------------

  async function fishAft(box: Container): Promise<() => Promise<void>> {
    const to = crew.patrol ? (Math.random() * 2 - 1) * crew.patrol : travel.x;
    const spot = new Vector3(to + between(CRANE_SPOT.x) * crew.size, FLOAT_Y, between(CRANE_SPOT.z) * crew.size);

    // The ping goes out; where it passes the spot, the water stirs.
    ripples.spawn(sail.position.x, 0, now(), SEEK);
    cabin.kick();
    crew.hop(0.3);
    await wait(Math.hypot(spot.x - sail.position.x, spot.z) / SEEK.speed);
    const note = swarm.summon(spot.x, spot.z);
    focus.note = note;
    await play((tl) =>
      tl
        .to(travel, { surfacing: 1, duration: 0.5 }, 0)
        .call(
          () => {
            focus.watched = true;
            crew.hop(0.45);
          },
          [],
          0.7,
        )
        .to(travel, { surfacing: 0, duration: 1 }, 1.3)
        .to({}, { duration: 0.2 }),
    );

    // Over to it, the crane unfolding on the way.
    const top = swarm.top(note);
    const aim = near(crane.reach(spot.clone().setY(FLOAT_Y + top), stationAt(to), 1.6, 1.4), crane.pose.slew);
    const trip = 1.8 + Math.abs(to - travel.x) * 0.3;
    await play((tl) => {
      tl.to(travel, { x: to, duration: trip, ease: "sine.inOut" }, 0);
      move(tl, { reach: aim.reach, lift: aim.lift }, trip * 0.6, "power2.inOut", trip * 0.15);
      move(tl, { slew: aim.slew, cable: aim.cable, grip: 0.35 }, trip * 0.65, "power2.inOut", trip * 0.35);
      tl.to({}, { duration: 0.25 });
    });

    // Settled: aim at where the note really is, and go down for it.
    const target = note.pos.clone().setY(FLOAT_Y + top);
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
            bursts.fire(scratch.copy(target).setY(0.1), now(), SPRAY);
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

    return () => stowAft(box, note, top);
  }

  async function stowAft(box: Container, note: Note, top: number) {
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

  // --- The net -------------------------------------------------------------------

  async function fishForward(box: Container): Promise<() => Promise<void>> {
    const room = Math.min(3, box.spec.slots - box.held.length);
    const base = body.localToWorld(NET_BASE.clone()).setY(0);
    const centre = new Vector3(sail.position.x + between(NET_SPOT.x) * crew.size, 0, between(NET_SPOT.z) * crew.size);
    const reach = Math.hypot(centre.x - base.x, centre.z - base.z);
    const heading = Math.atan2(-(centre.z - base.z), centre.x - base.x);
    const along = (a: number) => new Vector3(base.x + Math.cos(a) * reach, 0, base.z - Math.sin(a) * reach);

    // A shoal comes up, strung along the net's path.
    ripples.spawn(base.x, base.z, now(), SEEK);
    await wait(0.4);
    const shoal: Note[] = [];
    for (let i = 0; i < room; i++) {
      const p = along(heading + (i - (room - 1) / 2) * 0.16);
      shoal.push(swarm.summon(p.x + (Math.random() - 0.5) * 0.3, p.z));
      await wait(0.25);
    }
    await wait(1);

    // Out and down: the hoop rolled mouth-first, dragged through them.
    const water = along(heading + 0.5);
    const start = near(net.aim(water, body, 1.8, 0), net.pose.slew);
    const low = net.aim(water, body, 0.05, Math.PI / 2);
    const caught: Note[] = [];
    let lastWake = 0;
    const hoop = new Vector3();
    await play((tl) =>
      tl
        .to(net.pose, { ...start, duration: 1.9, ease: "power2.inOut" })
        .to(net.pose, { lift: low.lift, roll: low.roll, duration: 0.7, ease: "power2.in" })
        .call(() => {
          net.hoopAt(hoop);
          bursts.fire(hoop.setY(0.1), now(), SPRAY);
          ripples.spawn(hoop.x, hoop.z, now(), SURFACE);
        })
        .to(net.pose, {
          slew: start.slew - 1,
          duration: 1.7,
          ease: "sine.inOut",
          onUpdate: () => {
            net.hoopAt(hoop);
            if (now() - lastWake > 0.22) {
              lastWake = now();
              ripples.spawn(hoop.x, hoop.z, now(), WAKE);
            }
            for (const n of shoal) {
              if (caught.includes(n) || n.state !== "afloat") continue;
              if (Math.hypot(n.pos.x - hoop.x, n.pos.z - hoop.z) > 1.1) continue;
              caught.push(n);
              swarm.grip(n, net.holder);
              const pocket = net.pocket(caught.length - 1, room);
              ctx.add(() =>
                gsap.to(n.local, { x: pocket.x, y: pocket.y, z: pocket.z, duration: 0.3, ease: "power2.out" }),
              );
              bursts.fire(hoop.setY(0.15), now(), SPRAY);
            }
          },
        })
        // Rolled mouth-up to trap them, and out, full and dripping.
        .to(net.pose, { roll: 0, lift: low.lift + 2.4, fill: 1, duration: 0.9, ease: "power2.out" })
        .call(() => bursts.fire(net.hoopAt(hoop), now(), DRIP), [], "<0.3")
        .call(() => bursts.fire(net.hoopAt(hoop), now(), DRIP), [], "<0.35"),
    );
    // Any it missed are the sea's again.
    shoal.filter((n) => !caught.includes(n)).forEach((n) => (n.claimed = false));
    return () => pourForward(box, caught);
  }

  async function pourForward(box: Container, caught: Note[]) {
    const mouth = toWorld(inBox(box, new Vector3(0, box.height, 0)));
    const over = near(net.aim(mouth, body, 2.3, 0), net.pose.slew);
    await play((tl) => {
      tl.to(net.pose, { lift: over.lift, duration: 0.8, ease: "power2.inOut" })
        .to(net.pose, { slew: over.slew, reach: over.reach, duration: 1.9, ease: "power2.inOut" })
        .to(box.hatch, { open: 1, duration: 0.6, ease: "back.out(1.6)" }, "<1.1")
        .to({}, { duration: 0.4 })
        // Tipped out over the hatch: they tumble in, one after another.
        .to(net.pose, { roll: 2.3, fill: 0, duration: 0.6, ease: "power2.inOut" });
      caught.forEach((n, i) => {
        tl.call(
          () => {
            const slot = box.held.length;
            box.held.push(n);
            const rest = box.slot(slot);
            swarm
              .toss(n, new Vector3(rest.x, rest.y + swarm.top(n), rest.z), {
                holder: box.group,
                arc: 0.2,
                duration: 0.55,
                tumble: 5 + i,
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
          `<${0.2 + i * 0.18}`,
        );
      });
      tl.to({}, { duration: 0.9 }).to(net.pose, { roll: 0, duration: 0.5, ease: "power2.out" });
      shut(tl, box, "<");
      tl.to(net.pose, { ...near({ ...NET_REST }, over.slew), duration: 1.8, ease: "power2.inOut" }, ">0.1");
    });
    box.busy = false;
  }

  async function voyage() {
    await wait(0.5);
    let aft: Promise<void> = Promise.resolve();
    let forward: Promise<void> = Promise.resolve();
    while (running) {
      await aft;
      const a = cargo.pick("crane");
      if (a) {
        a.busy = true;
        const stow = await fishAft(a);
        aft = stow();
      }
      await forward;
      const f = cargo.pick("net", 2);
      if (f) {
        f.busy = true;
        const pour = await fishForward(f);
        forward = pour();
      }
      if (!a && !f) await wait(1.5);
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
