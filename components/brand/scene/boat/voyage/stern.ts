import gsap from "gsap";
import { Vector3 } from "three";

import { DRIP, DUST, SPRAY } from "@/components/brand/scene/bursts";
import { HULL } from "@/components/brand/scene/boat/hull";
import type { Note } from "@/components/brand/scene/boat/notes";
import { POUND, tiltOver, TRAWL_REST } from "@/components/brand/scene/boat/trawl";

import { SURFACE, type Crew, type Script } from "./script";

/** World units a second, trawling ahead. */
export const AHEAD = 1.15;
/** The most of a run spent dragging the net; the warp is paid out to suit. */
const WARP = 5;

/** Over the stern, down to the water, and let go: it lies where it lands. */
export async function shoot(crew: Crew, { play, scratch }: Script) {
  const { trawl, bursts, ripples, now } = crew;
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
 * Ahead to x, paying out warp: the net lies where it was shot until the warps come taut, then is
 * dragged astern through a shoal rising in its path. Resolves to the notes it caught.
 */
export async function trawlRun(crew: Crew, { ctx, steam, wait }: Script, x: number, room: number) {
  const { trawl, swarm, bursts, now, travel } = crew;
  const caught: Note[] = [];
  const shoal: Note[] = [];
  const block = trawl.block(new Vector3());
  const lying = trawl.mouth(new Vector3());
  // Enough warp that the net is dragged about half the run; the rest is slack taken up.
  const depth = block.y - crew.water(lying.x, lying.z);
  const reach = Math.min(WARP, Math.abs(x - travel.x) * 0.45);
  const warp = Math.hypot(depth, reach);
  // The water the mouth will sweep, from where it lies to where it ends up astern of the block.
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

/** A spot in the pound the catch has not already covered, in the boat's frame. */
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

/** Winched in, hoisted, swung inboard over the pound, and the cod-end untied onto the deck. */
export async function haul(crew: Crew, { play, scratch }: Script, caught: Note[]) {
  const { body, trawl, swarm, bursts, now, landed } = crew;
  const p = trawl.pose;
  const block = new Vector3();
  await play((tl) =>
    tl
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
              // Lying on its side where it fell, the way a catch lands.
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
