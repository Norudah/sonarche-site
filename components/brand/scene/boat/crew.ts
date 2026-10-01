import gsap from "gsap";
import { Vector3, type Group } from "three";

import { SPARK, type createBursts } from "@/components/brand/scene/bursts";
import { LETTERBOX, type createCabin } from "./cabin";
import type { Side, createCargo } from "./cargo";
import type { Container } from "./container";
import { createDeckhand } from "./deckhand";
import type { createFunnel } from "./funnel";
import { HULL, sideAt } from "./hull";
import type { Kit } from "./materials";
import type { Note, createSwarm } from "./notes";

/* Two deckhands empty the full boxes (and the trawl's catch on deck), carry each note to the head
   and post it through the letterbox; the head reads it and the funnel sings. */

type CrewOptions = {
  kit: Kit;
  body: Group;
  cabin: ReturnType<typeof createCabin>;
  cargo: ReturnType<typeof createCargo>;
  funnel: ReturnType<typeof createFunnel>;
  swarm: ReturnType<typeof createSwarm>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** The trawl's catch, lying on the deck for the aft deckhand to take. */
  landed: Note[];
  /** What each deckhand watches while it has nothing to carry. */
  watch: Record<Side, () => Vector3>;
};

/** The walkway along the rail, on the camera's side, narrowing with the hull towards the ends. */
const walkZ = (x: number) => Math.min(2.02, sideAt(x, 0).z - 0.55);
const SPEED = 1.35;
const HOME: Record<Side, number> = { crane: -3.35, trawl: 4.7 };

export function createCrew({ kit, body, cabin, cargo, funnel, swarm, bursts, now, landed, watch }: CrewOptions) {
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

    /** Takes the last note out of a box, through its doors, and hoists it. */
    async function takeFrom(box: Container): Promise<Note> {
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
      await hoist(note);
      ctx.add(() =>
        gsap
          .timeline()
          .to(box.doors, { open: 0, duration: 0.4, ease: "power2.in" }, 0.2)
          .call(() => box.bump(0.4)),
      );
      return note;
    }

    /** Picks a note up off the deck where the trawl dropped it. */
    async function pickUp(note: Note) {
      const { x, z } = note.local;
      await walk(x, Math.min(walkZ(x), z + 0.6));
      await face(x, z);
      d.state.stance = "reach";
      await wait(0.2);
      await hoist(note);
    }

    async function hoist(note: Note) {
      d.state.stance = "carry";
      note.pitch = 0;
      await swarm.toss(note, at.set(0, swarm.top(note), 0), { holder: d.load, arc: 0.45, duration: 0.4 });
      note.localRoll = 0;
      carrying = note;
    }

    /** Puts the note in its arms into a box, through its doors. */
    async function stowIn(box: Container, note: Note) {
      box.busy = true;
      await walk(box.landing.x, box.landing.z);
      const centre = box.toBoat.elements;
      await face(centre[12], centre[14]);
      await play((tl) => tl.to(box.doors, { open: 1, duration: 0.45, ease: "back.out(1.6)" }));
      d.state.stance = "reach";
      carrying = null;
      const slot = box.held.length;
      const rest = box.slot(slot);
      await swarm.toss(note, box.threshold, { holder: box.group, arc: 0.2, duration: 0.35 });
      await swarm.toss(note, at.set(rest.x, rest.y + swarm.top(note), rest.z), {
        holder: box.group,
        arc: 0.1,
        duration: 0.45,
      });
      note.localYaw = 0;
      box.held.push(note);
      box.light(slot, true);
      bursts.fire(toBoat(box.lamp(slot)), now(), SPARK);
      d.state.stance = "idle";
      await play((tl) => tl.to(box.doors, { open: 0, duration: 0.4, ease: "power2.in" }).call(() => box.bump(0.4)));
      box.busy = false;
    }

    /** To the letterbox, a turn at it, and the note posted. */
    async function post(note: Note) {
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

    async function shift() {
      await wait(Math.random() * 2);
      while (running) {
        // The trawl's catch first, off the deck: mostly to the head, some into the box.
        if (side === "trawl" && landed.length) {
          const note = landed.shift()!;
          await pickUp(note);
          const box = Math.random() < 0.35 ? cargo.pick(side) : undefined;
          if (box) await stowIn(box, note);
          else await post(note);
          continue;
        }
        // A full box: emptied to the head, one note at a time.
        const box =
          cargo.full(side) ??
          (side === "trawl" ? cargo.working.find((c) => c.spec.side === side && !c.busy && c.held.length) : undefined);
        if (box) {
          box.busy = true;
          while (running && box.held.length) await post(await takeFrom(box));
          box.busy = false;
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
