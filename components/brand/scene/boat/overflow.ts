import gsap from "gsap";
import { Vector3, type Group, type Object3D } from "three";

import { DUST, SPARK, type createBursts } from "@/components/brand/scene/bursts";
import { ROOF } from "./cabin";
import type { createCargo } from "./cargo";
import { createDeckhand } from "./deckhand";
import { HULL } from "./hull";
import type { Kit } from "./materials";
import type { Note, createSwarm } from "./notes";

/* The footer's moored ark, overflowing: notes everywhere, the crew dancing, and every so often one
   slides off the deck into the harbour while a box pops another out. */

type OverflowOptions = {
  kit: Kit;
  body: Group;
  cargo: ReturnType<typeof createCargo>;
  swarm: ReturnType<typeof createSwarm>;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** The gear's own holders: the claw, and the trawl's bag with its pockets. */
  claw: Object3D;
  trawl: { holder: Object3D; pocket: (i: number) => Vector3; pose: { fill: number } };
  grasp: number;
};

const D = HULL.deck;

/** Loose notes about the deck, in the boat's frame: x, y over the deck, z, pitch, roll. */
const LOOSE: [number, number, number, number, number][] = [
  [-4.05, 0, 1.85, Math.PI / 2, 0.3],
  [-1.9, 0, 2.05, 0, -0.5],
  [2.2, 0, 2.1, Math.PI / 2, -0.8],
  [4.25, 0, 2.0, 0, 0.45],
  [6.4, 0, 1.55, Math.PI / 2, 1.2],
  [0.55, ROOF, 0.2, 0, 0.35],
  [-3.2, 0.85, 0.35, 0, -0.25],
  [3.35, 3.6, -1.05, 0, 0.2],
  [-6.95, 2.5, -1.4, 0, -0.4],
  [5.1, 2.5, -1.5, 0, 0.6],
  [6.6, 1.25, 0.4, 0, -0.3],
];

/** Heaps on the deck where there was no room left: x, z, how many. */
const HEAPS: [number, number, number][] = [
  [-2.3, 1.75, 4],
  [2.45, 1.7, 3],
  [-8.1, 1.2, 3],
  // The last haul, still lying in the pound.
  [6.4, 0.2, 4],
  [7.7, -0.2, 3],
];

export function stow({ kit, body, cargo, swarm, bursts, now, claw, trawl, grasp }: OverflowOptions) {
  const ctx = gsap.context(() => {});
  let running = true;
  const top = (n: Note) => swarm.top(n);

  // Every box full, lit, and more.
  for (const box of cargo.working) {
    for (let i = 0; i < box.spec.slots; i++) {
      const rest = box.slot(i);
      const n = swarm.place(box.group, rest);
      n.local.y += top(n);
      box.held.push(n);
      box.light(i, true);
    }
  }
  const [bigBox, shortBox, storeBox] = cargo.working;
  // Hatches that will not close on what is poking out of them.
  for (const [box, open] of [
    [bigBox, 0.32],
    [storeBox, 0.26],
  ] as const) {
    box.hatch.open = open;
    const [, , h] = box.spec.size;
    for (const [x, z, roll] of [
      [-0.2, -0.45, 0.35],
      [0.22, 0.4, -0.3],
      [0.05, 0, 0.05],
    ]) {
      const n = swarm.place(box.group, new Vector3(x, h - 0.15, z), 0.2, roll);
      n.local.y += top(n) * 0.4;
    }
  }
  // Doors held ajar by the one leaning out.
  for (const box of [shortBox, storeBox]) {
    box.doors.open = 0.28;
    const n = swarm.place(box.group, box.threshold.clone().setZ(box.threshold.z + 0.3), 0.3, 0.5);
    n.local.y += top(n) * 0.8;
  }

  const loose: Note[] = LOOSE.map(([x, y, z, pitch, roll]) => {
    const n = swarm.place(body, new Vector3(x, D + y, z), Math.random() - 0.5, roll);
    n.pitch = pitch;
    n.local.y += pitch ? 0.1 : top(n) * Math.cos(roll);
    return n;
  });

  // Heaped where they were put down: a layer lying flat, one leaning on top.
  for (const [x, z, count] of HEAPS) {
    for (let i = 0; i < count; i++) {
      const up = i === count - 1;
      const n = swarm.place(
        body,
        new Vector3(x + (i % 2 ? 0.28 : -0.22) * (i < 2 ? 1 : 0.4), D, z + (i % 3) * 0.12 - 0.1),
        Math.random() * 2,
        up ? 0.5 : 0,
      );
      n.pitch = up ? 0.3 : Math.PI / 2;
      n.local.y += up ? top(n) * 0.9 + 0.12 : 0.1 + Math.floor(i / 2) * 0.2;
    }
  }

  // One still in the claw, the trawl's bag full.
  const hung = swarm.place(claw, new Vector3(0, 0, 0));
  hung.local.y = -(grasp + top(hung));
  for (let i = 0; i < 3; i++) swarm.place(trawl.holder, trawl.pocket(i));
  trawl.pose.fill = 1;

  // The crew, off duty.
  const dancers = [-2.9, 2.75].map((x, i) => {
    const d = createDeckhand(kit);
    d.group.position.set(x, D, 2.05);
    d.group.rotation.y = (i ? -1 : 1) * 0.3;
    body.add(d.group);
    return d;
  });

  function play(build: (tl: gsap.core.Timeline) => void): Promise<void> {
    return new Promise((resolve) =>
      ctx.add(() => {
        build(gsap.timeline({ onComplete: resolve }));
      }),
    );
  }

  /** A loose note tips off, lands on the deck, and goes over the side. */
  async function spill() {
    const i = Math.floor(Math.random() * loose.length);
    const n = loose[i];
    await play((tl) =>
      tl.to(n, { localRoll: n.localRoll + 0.35, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" }),
    );
    const deck = new Vector3(n.local.x + (Math.random() - 0.5), D + top(n), 2.25);
    await swarm.toss(n, deck, { holder: body, arc: 0.7, duration: 0.55, tumble: 6, spin: 2 });
    n.pitch = 0;
    n.localRoll = 0.4;
    bursts.fire(body.localToWorld(deck.clone()), now(), DUST);
    await play((tl) => tl.to({}, { duration: 0.9 }));
    const sea = body.localToWorld(new Vector3(deck.x + 0.6, 0, 4.2)).setY(0.25);
    await swarm.toss(n, sea, { arc: 1.3, duration: 0.8, tumble: 7, spin: 3, land: "float" });

    // Another is squeezed out to take its place.
    const box = cargo.working[Math.floor(Math.random() * cargo.working.length)];
    const [, , h] = box.spec.size;
    const fresh = swarm.place(box.group, new Vector3(0, h * 0.5, 0));
    const [x, y, z, pitch, roll] = LOOSE[i];
    await play((tl) =>
      tl.to(box.hatch, { open: box.hatch.open + 0.5, duration: 0.15, ease: "power2.out" }).call(() => box.bump(1)),
    );
    await swarm.toss(fresh, new Vector3(x, D + y + (pitch ? 0.1 : top(fresh)), z), {
      holder: body,
      arc: 1.2,
      duration: 0.75,
      tumble: 4,
    });
    fresh.pitch = pitch;
    fresh.localRoll = roll;
    bursts.fire(body.localToWorld(new Vector3(x, D + y, z)), now(), SPARK);
    ctx.add(() => gsap.to(box.hatch, { open: Math.max(0, box.hatch.open - 0.5), duration: 0.4, ease: "bounce.out" }));
    loose[i] = fresh;
  }

  async function harbour() {
    await play((tl) => tl.to({}, { duration: 3 }));
    while (running) {
      await spill();
      await play((tl) => tl.to({}, { duration: 5 + Math.random() * 4 }));
    }
  }
  harbour();

  return {
    update(t: number, dt: number) {
      dancers.forEach((d, i) => {
        const beat = Math.floor(t * 2 + i) % 2 === 0;
        d.state.stance = beat ? "carry" : "idle";
        d.group.rotation.y = (i ? -1 : 1) * 0.3 + Math.sin(t * 2 + i) * 0.35;
        d.group.position.y = D + Math.abs(Math.sin(t * Math.PI * 2 + i)) * 0.06;
        d.update(t, dt, 0);
      });
    },
    dispose() {
      running = false;
      ctx.revert();
    },
  };
}
