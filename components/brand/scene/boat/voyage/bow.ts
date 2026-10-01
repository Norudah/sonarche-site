import gsap from "gsap";
import { Vector3 } from "three";

import { BITE, DRIP, SPRAY } from "@/components/brand/scene/bursts";
import type { RingSpec } from "@/components/brand/scene/ripples";
import type { Container } from "@/components/brand/scene/boat/container";
import { GRASP } from "@/components/brand/scene/boat/crane/claw";
import { CLEAR, REST, type Pose } from "@/components/brand/scene/boat/crane/crane";
import type { Note } from "@/components/brand/scene/boat/notes";

import { SURFACE, type Crew, type Script } from "./script";

/** The ark's sonar looking for music: a quick, light ring. */
const SEEK: RingSpec = { strength: 0.8, speed: 26, width: 2 };
/** Where the crane's notes surface, in the boat's frame: off the bow, on the camera's side. */
const CRANE_SPOT = { x: [-13.3, -11.8], z: [1.2, 2.4] };
/** How far above its box's floor the claw lets a note go. */
const SET_DOWN = 0.05;

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

/** The slew wrapped to the turn nearest `from`, so the crane swings the short way. */
function near<T extends { slew: number }>(pose: T, from: number): T {
  let a = pose.slew;
  while (a - from > Math.PI) a -= Math.PI * 2;
  while (a - from < -Math.PI) a += Math.PI * 2;
  return { ...pose, slew: a };
}

/*
 * The ark pings, a note surfaces where the ring passes, and the crane goes down for it, bites and
 * yanks it clear. Resolves to the stowing, which the voyage runs while it gets under way again.
 */
export async function fishBow(crew: Crew, script: Script, box: Container): Promise<() => Promise<void>> {
  const { body, sail, cabin, crane, swarm, ripples, bursts, now, travel, focus } = crew;
  const { play, wait, scratch } = script;
  const move = (tl: gsap.core.Timeline, to: Partial<Pose>, duration: number, ease: string, at?: gsap.Position) =>
    tl.to(crane.pose, { ...to, duration, ease, overwrite: "auto" }, at);

  const spot = body.localToWorld(new Vector3(between(CRANE_SPOT.x), 0, between(CRANE_SPOT.z)));

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

  return () => stowBow(crew, script, box, note, top, move);
}

/* Carried the way an operator would: up clear of the deck, across at that height, a stop while the
   swing dies and the hatch opens, then slowly straight down through the roof. */
async function stowBow(
  crew: Crew,
  script: Script,
  box: Container,
  note: Note,
  top: number,
  move: (tl: gsap.core.Timeline, to: Partial<Pose>, duration: number, ease: string, at?: gsap.Position) => void,
) {
  const { body, crane, swarm, focus } = crew;
  const { ctx, play, shut, toWorld } = script;
  const slot = box.held.length;
  const floor = toWorld(box.slot(slot).clone().applyMatrix4(box.toBoat));
  const landing = GRASP + top * 2 + SET_DOWN;
  const drop = box.height + 0.35;
  const high = near(crane.hang(floor, body, landing + drop), crane.pose.slew);

  await play((tl) => {
    move(tl, { lift: CLEAR, cable: 0.9 }, 0.9, "power2.inOut");
    move(tl, { slew: high.slew, reach: high.reach }, 1.8, "power2.inOut", ">-0.1");
    tl.to(box.hatch, { open: 1, duration: 0.6, ease: "back.out(1.6)" }, "<0.9")
      .call(() => box.bump(0.25), [], "<0.1")
      .to(crane.pose, { cable: high.cable, steady: 1, duration: 0.7, ease: "power2.out" }, ">")
      .to({}, { duration: 0.35 })
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
          ctx.add(() => gsap.fromTo(note, { squash: 0.78 }, { squash: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }));
        },
        [],
        "<0.08",
      )
      .to(crane.pose, { cable: high.cable - 0.2, duration: 0.8, ease: "power2.in" }, ">0.15")
      .to(crane.pose, { grip: 1, steady: 0, duration: 0.35 }, "<0.25");
    shut(tl, box, "<0.2");
    move(tl, near({ ...REST }, high.slew), 2.3, "power2.inOut", ">0.1");
  });
  box.busy = false;
}
