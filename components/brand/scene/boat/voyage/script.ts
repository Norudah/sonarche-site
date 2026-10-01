import gsap from "gsap";
import { Vector3, type Group } from "three";

import { DUST, SPARK, type createBursts } from "@/components/brand/scene/bursts";
import type { createRipples, RingSpec } from "@/components/brand/scene/ripples";
import type { createCabin } from "@/components/brand/scene/boat/cabin";
import type { createCargo } from "@/components/brand/scene/boat/cargo";
import type { Container } from "@/components/brand/scene/boat/container";
import type { createCrane } from "@/components/brand/scene/boat/crane/crane";
import type { createSwarm, Note } from "@/components/brand/scene/boat/notes";
import type { createTrawl } from "@/components/brand/scene/boat/trawl";

export type Crew = {
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
  /** How far either side of the middle the vessel steams, set by the frame's width. */
  roam: () => number;
  /** The boat's scale. */
  size: number;
  water: (x: number, z: number) => number;
  /** Tweened here, read by the boat every frame. */
  travel: { x: number; surfacing: number };
  /** What the vessel is looking at, and the note the stream swirls into. */
  focus: { note: Note | null; watched: boolean; load: number };
  /** The trawl's catch, lying in the pound for the crew to take. */
  landed: Note[];
};

/** Where something breaks the surface. */
export const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };

/*
 * Each step of the voyage is a timeline, awaited in turn. Reverting the context on teardown leaves
 * the pending timeline unfinished, so the voyage simply stops where it was.
 */
export function createScript(crew: Crew) {
  const { body, cabin, bursts, now, travel } = crew;
  const ctx = gsap.context(() => {});

  function play(build: (tl: gsap.core.Timeline) => void): Promise<void> {
    return new Promise((resolve) =>
      ctx.add(() => {
        build(gsap.timeline({ onComplete: resolve }));
      }),
    );
  }

  const toWorld = (v: Vector3) => body.localToWorld(v.clone());

  /** The hatch slams on what the box got, a light coming on for each. */
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

  return {
    ctx,
    play,
    wait: (seconds: number) => play((tl) => tl.to({}, { duration: seconds })),
    /** Under way to x at a speed; `each` runs every frame of the passage. */
    steam(x: number, speed: number, each?: () => void) {
      const duration = Math.max(0.5, Math.abs(x - travel.x) / speed);
      return play((tl) => tl.to(travel, { x, duration, ease: "sine.inOut", onUpdate: each }));
    },
    shut,
    toWorld,
    scratch: new Vector3(),
  };
}

export type Script = ReturnType<typeof createScript>;
