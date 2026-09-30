import gsap from "gsap";
import { Vector3, type Group } from "three";

import { SPARK, type createBursts } from "../bursts";
import { LETTERBOX, type createCabin } from "./cabin";
import type { Side, createCargo } from "./cargo";
import type { Container } from "./container";
import { createDeckhand } from "./deckhand";
import type { createFunnel } from "./funnel";
import { HULL, sideAt } from "./hull";
import type { Kit } from "./materials";
import type { Note, createSwarm } from "./notes";

/*
 * The crew: two deckhands, one for the crane's boxes, one for the trawl's —
 * the part of the vessel that is not machinery.
 *
 * When a box on its side is full, a deckhand walks to it along the rail,
 * swings its doors open, takes a note out, hoists it over its head and
 * carries it to the head amidships. There it waits its turn at the
 * letterbox, bends, and posts the note through, flat; the flap snaps, the head
 * gulps and reads it, and the funnel sings. Back for the next one, until the
 * box is empty and its lights are all out; then it goes back to standing
 * about, watching the gear work.
 *
 * This is what the fishing is for: the notes come in from the sea (the
 * internet, if you like), and the head is where they are sorted and kept.
 */

type CrewOptions = {
  kit: Kit;
  body: Group;
  cabin: ReturnType<typeof createCabin>;
  cargo: ReturnType<typeof createCargo>;
  funnel: ReturnType<typeof createFunnel>;
  swarm: ReturnType<typeof createSwarm>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** What each deckhand watches while it has nothing to carry. */
  watch: Record<Side, () => Vector3>;
};

/** The walkway along the rail, on the camera's side, narrowing with the hull towards the ends. */
const walkZ = (x: number) => Math.min(2.02, sideAt(x, 0).z - 0.55);
const SPEED = 1.35;
const HOME: Record<Side, number> = { crane: -3.35, trawl: 3.2 };

export function createCrew({ kit, body, cabin, cargo, funnel, swarm, bursts, now, watch }: CrewOptions) {
  const ctx = gsap.context(() => {});
  let running = true;

  function play(build: (tl: gsap.core.Timeline) => void): Promise<void> {
    return new Promise((resolve) =>
      ctx.add(() => {
        build(gsap.timeline({ onComplete: resolve }));
      }),
    );
  }
  const wait = (s: number) => play((tl) => tl.to({}, { duration: s }));

  // One at a time at the letterbox.
  let queue: Promise<void> = Promise.resolve();
  function turn(): Promise<() => void> {
    let release!: () => void;
    const mine = new Promise<void>((r) => (release = r));
    const ready = queue.then(() => release);
    queue = queue.then(() => mine);
    return ready;
  }

  const toBoat = (v: Vector3) => body.localToWorld(v.clone());

  function hand(side: Side) {
    const d = createDeckhand(kit);
    d.group.position.set(HOME[side], HULL.deck, walkZ(HOME[side]));
    body.add(d.group);
    const motion = { speed: 0 };
    const at = new Vector3();
    // The note in its arms, kept face-on to the camera whichever way it walks.
    let carrying: Note | null = null;

    async function face(x: number, z: number) {
      const yaw = Math.atan2(x - d.group.position.x, z - d.group.position.z);
      let delta = yaw - d.group.rotation.y;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      await play((tl) =>
        tl.to(d.group.rotation, { y: d.group.rotation.y + delta, duration: 0.25, ease: "power1.inOut" }),
      );
    }

    /** Along the walkway to x, then in to (x, z) if it is off the walkway. */
    async function walk(x: number, z = walkZ(x)) {
      const p = d.group.position;
      if (Math.abs(p.z - walkZ(p.x)) > 0.05) await step(p.x, walkZ(p.x));
      if (Math.abs(p.x - x) > 0.05) await step(x, walkZ(x));
      if (Math.abs(z - walkZ(x)) > 0.05) await step(x, z);
    }

    async function step(x: number, z: number) {
      const p = d.group.position;
      const distance = Math.hypot(x - p.x, z - p.z);
      await face(x, z);
      await play((tl) =>
        tl
          .to(motion, { speed: SPEED, duration: 0.15 }, 0)
          .to(p, { x, z, duration: distance / SPEED, ease: "none" }, 0)
          .to(motion, { speed: 0, duration: 0.15 }, `>-0.1`),
      );
    }

    async function unload(box: Container) {
      box.busy = true;
      while (running && box.held.length) {
        await walk(box.landing.x, box.landing.z);
        const centre = box.toBoat.elements;
        await face(centre[12], centre[14]);
        d.state.stance = "reach";
        await play((tl) => tl.to(box.doors, { open: 1, duration: 0.45, ease: "back.out(1.6)" }));

        // The last one in comes out first: slid to the threshold, then up into its arms.
        const i = box.held.length - 1;
        const note = box.held.pop()!;
        box.light(i, false);
        note.shine = 0;
        await swarm.toss(note, box.threshold, { holder: box.group, arc: 0.12, duration: 0.45 });
        d.state.stance = "carry";
        await swarm.toss(note, at.set(0, swarm.top(note), 0), { holder: d.load, arc: 0.45, duration: 0.4 });
        note.localRoll = 0;
        carrying = note;
        ctx.add(() =>
          gsap
            .timeline()
            .to(box.doors, { open: 0, duration: 0.4, ease: "power2.in" }, 0.2)
            .call(() => box.bump(0.4)),
        );

        // To the letterbox, and wait for a turn at it.
        const sign = Math.sign(d.group.position.x - LETTERBOX.x) || 1;
        await walk(LETTERBOX.x + sign * 1.3);
        const done = await turn();
        await walk(LETTERBOX.x + sign * 0.02, LETTERBOX.z + 0.62);
        await face(LETTERBOX.x, LETTERBOX.z - 1);
        cabin.open();
        carrying = null;
        note.localYaw = 0;
        d.state.stance = "post";
        await play((tl) =>
          tl.to(note, { pitch: Math.PI / 2, duration: 0.35, ease: "power2.inOut" }, 0).to({}, { duration: 0.25 }),
        );
        // Posted: through the slot and out of sight.
        await swarm.toss(note, at.set(LETTERBOX.x, HULL.deck + LETTERBOX.y, LETTERBOX.z - 0.5), {
          holder: body,
          arc: 0.04,
          duration: 0.4,
        });
        swarm.retire(note);
        bursts.fire(toBoat(at.set(LETTERBOX.x, HULL.deck + LETTERBOX.y, LETTERBOX.z + 0.1)), now(), SPARK);
        cabin.swallow(() => funnel.toot());
        d.state.stance = "idle";
        await step(d.group.position.x + sign * 1.1, walkZ(d.group.position.x + sign * 1.1));
        done();
      }
      box.busy = false;
    }

    async function shift() {
      await wait(Math.random() * 2);
      while (running) {
        const box = cargo.full(side);
        if (box) {
          await unload(box);
          continue;
        }
        if (Math.abs(d.group.position.x - HOME[side]) > 0.1) await walk(HOME[side]);
        await face(d.group.position.x + (side === "crane" ? -1 : 1), walkZ(d.group.position.x) + 0.4);
        await wait(0.6);
      }
    }

    return {
      start: shift,
      update(t: number, dt: number) {
        // Idle, it watches its side's gear at work.
        if (d.state.stance === "idle" && motion.speed < 0.05) {
          body.worldToLocal(at.copy(watch[side]()));
          const toward = Math.atan2(at.x - d.group.position.x, at.z - d.group.position.z) - d.group.rotation.y;
          d.state.look = Math.max(-1.1, Math.min(1.1, Math.atan2(Math.sin(toward), Math.cos(toward))));
        } else {
          d.state.look = 0;
        }
        if (carrying) carrying.localYaw = -d.group.rotation.y;
        d.update(t, dt, motion.speed);
      },
    };
  }

  const hands = [hand("crane"), hand("trawl")];

  return {
    start() {
      hands.forEach((h) => h.start());
    },
    update(t: number, dt: number) {
      hands.forEach((h) => h.update(t, dt));
    },
    dispose() {
      running = false;
      ctx.revert();
    },
  };
}
