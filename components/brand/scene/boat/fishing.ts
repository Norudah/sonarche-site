import gsap from "gsap";
import { Mesh, Object3D, SphereGeometry, Vector3, type Group } from "three";

import { BITE, DRIP, DUST, SPARK, SPRAY, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import type { createCabin } from "./cabin";
import type { createCargo } from "./cargo";
import type { Container } from "./container";
import { GRASP } from "./crane/claw";
import { REST, type Pose, type createCrane } from "./crane/crane";
import type { createFunnel } from "./funnel";
import { ACCENT, type Kit } from "./materials";
import type { createNote } from "./note";

/*
 * The day's work, told as a sequence of causes.
 *
 * The ark pings; where the ring passes, the water stirs, the stream's pixels
 * swirl in and a note breaks the surface. The vessel turns its eyes to it and
 * sails over, bringing its stern round to it while the crane, already
 * unfolding, swings out. The jib's head stops over the note, the cable pays
 * out, the claw opens on the way down, closes on the note (a snap, chips of
 * light) and yanks it clear, water running off it. The crane swings it over
 * one of the open boxes in the hold (never the same one twice running if it
 * can help it), whose hatch opens ahead of it; it is lowered in below the
 * rim, let go, and lands with a thud the box bounces to. The claw comes up,
 * the hatch slams in a puff of dust, a light comes on over the doors. The
 * vessel is pleased with itself — ^^ — and the funnel coughs a note into the
 * air. When the whole hold is full, its lights are carried along the deck to
 * the archive at the bow, and the hold is empty again.
 *
 * Nothing appears or vanishes without a cause on screen: that is the brief.
 *
 * Each step is a timeline, awaited in turn; tearing the scene down reverts
 * the context, the pending timeline never completes, and the voyage simply
 * stops where it was.
 */

type Crew = {
  kit: Kit;
  /** The scene-level layer the note lives in when nothing is holding it. */
  world: Group;
  sail: Group;
  body: Group;
  cabin: ReturnType<typeof createCabin>;
  cargo: ReturnType<typeof createCargo>;
  crane: ReturnType<typeof createCrane>;
  funnel: ReturnType<typeof createFunnel>;
  note: ReturnType<typeof createNote>;
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** Half the width of the patrol, world units. */
  patrol: number;
  /** How high the hull rides: the frame the crane's aim is solved in. */
  ride: number;
  /** Tweened here, read by the boat every frame. */
  travel: { x: number; surfacing: number };
  /** The note: in the water, in the claw, and whether the boat's eyes are on it. */
  catchState: { afloat: boolean; carried: boolean; watched: boolean; load: number };
  hop: (k: number) => void;
};

/** The ark's sonar looking for music: a quick, light ring. */
const SEEK: RingSpec = { strength: 0.8, speed: 26, width: 2 };
/** A note breaking the surface: a small, bright ring. */
const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };
/** Where notes surface, in the boat's frame at its station: off the stern, on the camera's side. */
const SPOT = { x: [-11.2, -9.2], z: [1.1, 2.7] };
/** The note's centre when afloat, and how deep it starts. */
const FLOAT_Y = 0.25;
const DEEP = -1.4;
/** How high the claw carries a note over the hold before it lowers it in. */
const LIFT = 1.7;

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createVoyage(crew: Crew) {
  const { sail, body, cabin, cargo, crane, funnel, note, ripples, bursts, now, travel, catchState } = crew;
  const ctx = gsap.context(() => {});
  let running = true;

  /** Plays a timeline built by `build`, resolved when it ends. */
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

  // A stand-in for the boat where it is about to stop, to aim the crane before it gets there.
  const station = new Object3D();
  function stationAt(x: number) {
    station.position.set(x, crew.ride, 0);
    station.updateMatrixWorld(true);
    return station;
  }

  /** `angle`, wrapped to the turn nearest `from`: the crane slews the short way. */
  function near(pose: Pose, from: number): Pose {
    let a = pose.slew;
    while (a - from > Math.PI) a -= Math.PI * 2;
    while (a - from < -Math.PI) a += Math.PI * 2;
    return { ...pose, slew: a };
  }

  const spot = new Vector3();
  const scratch = new Vector3();
  const toWorld = (v: Vector3) => body.localToWorld(v.clone());

  // --- One catch -------------------------------------------------------------

  async function find(): Promise<number> {
    const to = crew.patrol ? (travel.x > 0 ? -1 : 1) * crew.patrol * (0.35 + Math.random() * 0.65) : travel.x;
    spot.set(to + between(SPOT.x), FLOAT_Y, between(SPOT.z));

    // The ping goes out; where it passes the spot, the water stirs.
    const seekAt = sail.position.x;
    ripples.spawn(seekAt, 0, now(), SEEK);
    cabin.kick();
    crew.hop(0.35);
    await wait(Math.hypot(spot.x - seekAt, spot.z) / SEEK.speed);
    if (!running) return to;

    note.dress(Math.random() < 0.8, Math.random() < 0.35);
    note.group.position.set(spot.x, DEEP, spot.z);
    note.group.rotation.set(0, 0, 0);
    note.group.scale.setScalar(0.4);
    note.group.visible = true;
    note.shine.v = 0;
    catchState.afloat = true;
    ripples.spawn(spot.x, spot.z, now(), SURFACE);

    await play((tl) =>
      tl
        .to(travel, { surfacing: 1, duration: 0.5 }, 0)
        .call(
          () => {
            bursts.fire(spot, now(), SPRAY);
            ripples.spawn(spot.x, spot.z, now(), SURFACE);
            catchState.watched = true;
            crew.hop(0.45);
          },
          [],
          0.7,
        )
        .to(note.group.position, { y: FLOAT_Y, duration: 1.1, ease: "back.out(2.4)" }, 0.6)
        .to(note.group.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "elastic.out(1, 0.5)" }, 0.6)
        .to(travel, { surfacing: 0, duration: 1 }, 1.4)
        .to({}, { duration: 0.35 }),
    );
    return to;
  }

  async function approach(to: number) {
    const aim = near(crane.reach(spot.clone().setY(FLOAT_Y + note.top()), stationAt(to), 1.6, 1.4), crane.pose.slew);
    const trip = 2.4 + Math.abs(to - travel.x) * 0.24;
    await play((tl) => {
      tl.to(travel, { x: to, duration: trip, ease: "sine.inOut" }, 0);
      // The crane unfolds while the boat is still coming round: first the
      // jib, then the swing out.
      move(tl, { shoulder: aim.shoulder, elbow: aim.elbow }, trip * 0.55, "power2.inOut", trip * 0.25);
      move(tl, { slew: aim.slew, cable: aim.cable, grip: 0.35 }, trip * 0.6, "power2.inOut", trip * 0.4);
      tl.to({}, { duration: 0.3 });
    });
  }

  async function grab() {
    // Settled now: aim at where the note really is, then go down for it.
    const top = note.top();
    const target = note.group.position.clone().setY(FLOAT_Y + top);
    const over = near(crane.reach(target, body, 1.4, 1.4), crane.pose.slew);
    const down = over.cable + 1.4 - GRASP;
    const held = new Vector3(0, -(GRASP + top), 0);

    await play((tl) => {
      move(tl, { ...over, grip: 0.2 }, 0.6, "power2.inOut");
      tl.to(crane.pose, { cable: down, duration: 0.85, ease: "power1.inOut" })
        .to(crane.pose, { grip: 0, duration: 0.4, ease: "power2.out" }, "<")
        // The bite.
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
            catchState.afloat = false;
            catchState.carried = true;
            crane.holder.attach(note.group);
          },
          [],
          "<0.12",
        )
        .to(note.group.position, { x: held.x, y: held.y, z: held.z, duration: 0.2, ease: "power2.out" }, "<")
        .to(note.group.rotation, { x: 0, y: 0, z: 0, duration: 0.2 }, "<")
        .fromTo(note.squash, { y: 0.8 }, { y: 1, duration: 0.3, ease: "power2.out" }, "<")
        .to(crane.pose, { grip: 1, duration: 0.2 })
        // The yank: out of the water in a spray, the note stretched by it.
        .to(crane.pose, { cable: over.cable - 0.4, duration: 0.75, ease: "power3.out" })
        .call(
          () => {
            spot.copy(target).setY(0.1);
            bursts.fire(spot, now(), SPRAY);
            ripples.spawn(spot.x, spot.z, now(), SURFACE);
          },
          [],
          "<",
        )
        .fromTo(note.squash, { y: 1.35 }, { y: 1, duration: 0.9, ease: "elastic.out(1.2, 0.35)" }, "<")
        .to(catchState, { load: 1, duration: 0.6 }, "<")
        .call(() => bursts.fire(note.group.getWorldPosition(scratch), now(), DRIP), [], "<0.2")
        .call(() => bursts.fire(note.group.getWorldPosition(scratch), now(), DRIP), [], "<0.3");
    });
  }

  async function stow(box: Container) {
    const top = note.top();
    // The note's top when it rests on the floor, and the hook above that.
    const resting = toWorld(box.floor).add(scratch.set(0, 0.06 + top * 2, 0));
    const over = near(crane.reach(resting, body, GRASP + LIFT, 0.6), crane.pose.slew);
    const slot = box.stored;

    await play((tl) => {
      move(tl, over, 1.7, "power2.inOut")
        .to(box.hatch, { open: 1, duration: 0.6, ease: "back.out(1.6)" }, "<0.8")
        .call(() => box.bump(0.25), [], "<0.1")
        // In, below the rim.
        .to(crane.pose, { cable: over.cable + LIFT, duration: 1.05, ease: "power1.inOut" }, ">0.1")
        .to(note.shine, { v: 1, duration: 0.8 }, "<0.3")
        // Let go: it drops the last hair onto the floor and the box takes the weight.
        .to(crane.pose, { grip: 0, duration: 0.22, ease: "power2.out" })
        .call(
          () => {
            box.group.attach(note.group);
            catchState.carried = false;
            box.bump(0.9);
            ctx.add(() => gsap.fromTo(note.squash, { y: 0.78 }, { y: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }));
          },
          [],
          "<0.08",
        )
        .to(catchState, { load: 0, duration: 0.4 }, "<")
        .to(note.group.position, { y: `-=${0.05}`, duration: 0.12, ease: "power2.in" }, "<")
        // Out, shutting as it rises; the hatch slams behind it.
        .to(crane.pose, { cable: over.cable - 0.2, duration: 0.65, ease: "power2.in" }, ">0.1")
        .to(crane.pose, { grip: 1, duration: 0.35 }, "<0.2")
        .to(box.hatch, { open: 0, duration: 0.42, ease: "power3.in" }, "<0.15")
        .call(() => {
          note.group.visible = false;
          crew.world.attach(note.group);
          box.bump(1.3);
          bursts.fire(toWorld(box.seam), now(), DUST);
          box.light(slot, true);
          ctx.add(() =>
            gsap.fromTo(box.lights[slot], { emissiveIntensity: 6 }, { emissiveIntensity: 1.8, duration: 0.7 }),
          );
          bursts.fire(toWorld(box.lamp(slot)), now(), SPARK);
          box.stored += 1;
          catchState.watched = false;
        })
        .to(box.hatch, { open: 0.08, duration: 0.09, ease: "power1.out" })
        .to(box.hatch, { open: 0, duration: 0.25, ease: "bounce.out" })
        // Pleased with itself.
        .call(
          () => {
            cabin.happy();
            cabin.kick();
            crew.hop(0.6);
            funnel.toot();
          },
          [],
          "<0.1",
        );
    });
  }

  async function home() {
    await play((tl) => {
      move(tl, near({ ...REST }, crane.pose.slew), 1.5, "power2.inOut");
    });
  }

  // --- The archive ---------------------------------------------------------------

  const orbGeometry = crew.kit.keep(new SphereGeometry(0.17, 24, 16));
  const orbInk = crew.kit.glow(ACCENT, ACCENT, 3);
  const orbs = cargo.hold.flatMap((c) =>
    c.lights.map(() => {
      const orb = new Mesh(orbGeometry, orbInk);
      orb.visible = false;
      body.add(orb);
      return orb;
    }),
  );

  /** The whole hold is full: every light is carried along the deck into the archive at the bow. */
  async function archive() {
    const target = cargo.archive.lamp(1);
    let n = 0;
    await play((tl) => {
      cargo.hold.forEach((c) => {
        c.lights.forEach((_, i) => {
          const orb = orbs[n++];
          const from = c.lamp(i);
          const arc = { p: 0 };
          tl.call(
            () => {
              orb.visible = true;
              orb.position.copy(from);
              c.light(i, false);
              bursts.fire(toWorld(from), now(), SPARK);
            },
            [],
            n === 1 ? 0 : ">-0.75",
          ).to(arc, {
            p: 1,
            duration: 1.1,
            ease: "power1.inOut",
            onUpdate: () => {
              orb.position.lerpVectors(from, target, arc.p);
              orb.position.y += Math.sin(arc.p * Math.PI) * 2.6;
            },
            onComplete: () => {
              orb.visible = false;
              cabin.kick();
              cargo.archive.bump(0.5);
              bursts.fire(toWorld(target), now(), SPARK);
              ctx.add(() =>
                gsap.fromTo(cargo.archive.lights, { emissiveIntensity: 5 }, { emissiveIntensity: 1.8, duration: 0.5 }),
              );
            },
          });
        });
        tl.call(() => {
          c.stored = 0;
        });
      });
      tl.call(
        () => {
          cabin.happy();
          crew.hop(0.8);
          funnel.toot();
        },
        [],
        ">0.2",
      ).call(() => funnel.toot(), [], ">0.45");
    });
    await wait(1.2);
  }

  async function voyage() {
    await wait(0.4);
    while (running) {
      const box = cargo.pick();
      if (!box) {
        await archive();
        continue;
      }
      const to = await find();
      await approach(to);
      await grab();
      await stow(box);
      await home();
      await wait(0.5);
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
