import {
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
  type Object3D,
  type Vector4,
} from "three";

import { SPARK, SPRAY, type BurstKind, type createBursts } from "@/components/brand/scene/bursts";
import type { createRipples, RingSpec } from "@/components/brand/scene/ripples";
import type { Glyphs } from "./glyphs";
import { createHalos } from "./halos";
import { ACCENT, INK } from "./materials";

/*
 * Every note in the scene. Wild ones rise, drift and sink back all over the sea; the gear claims
 * some. A note is always somewhere definite (water, claw, net, box, arms, mid-toss, the hatch) and
 * whatever holds it (`holder`) carries it: nothing teleports. Drawn in one instanced mesh per glyph,
 * tinted per note, plus one halo layer.
 */

type NoteState = "deep" | "rising" | "afloat" | "sinking" | "held" | "tossed" | "flying";

export type Note = {
  glyph: number;
  tint: Color;
  size: number;
  state: NoteState;
  /** World position when nothing holds it. */
  pos: Vector3;
  yaw: number;
  roll: number;
  /** π/2 lies it flat, the way it goes through a slot. */
  pitch: number;
  holder: Object3D | null;
  /** Position in its holder's frame. */
  local: Vector3;
  localYaw: number;
  localRoll: number;
  /** Stretch along its height. */
  squash: number;
  /** 0..1 scale as it appears or goes. */
  pop: number;
  /** 0..1 extra light in the dark of a hold. */
  shine: number;
  timer: number;
  /** Someone is coming for it, so it will not sink. */
  claimed: boolean;
  phase: number;
  /** One of the sea's own: it resurfaces elsewhere once done with. */
  wild: boolean;
  toss?: Toss;
};

type Toss = {
  from: Vector3;
  to: Vector3;
  holder: Object3D | null;
  arc: number;
  duration: number;
  age: number;
  spin: number;
  /** End-over-end turn rate. */
  tumble: number;
  land: "hold" | "float" | "sink";
  done: () => void;
};

type SwarmOptions = {
  glyphs: Glyphs;
  bursts: ReturnType<typeof createBursts>;
  ripples: ReturnType<typeof createRipples>;
  now: () => number;
  water: (x: number, z: number) => number;
  /** How many the sea keeps afloat, and how far out. */
  population: number;
  reach: number;
};

const MAX = 64;
const NOTE_SIZE = 0.46;
const FLOAT_Y = 0.25;
const DEEP = -1.6;
const RISE = 1.3;
const SINK = 1.9;
const WIND = -0.22;
const FLICK: RingSpec = { strength: 0.6, speed: 9, width: 1.3 };

/** Weighted warm: against an indigo sea the ambers read at any distance, the blues only close up. */
const TINTS = [
  [INK.amber, 5],
  ["#f7c25c", 3],
  [INK.amberBand, 2],
  [ACCENT, 2],
  ["#6163f2", 1],
  [INK.rail, 1],
] as const;
const PALETTE = TINTS.flatMap(([c, w]) => Array.from({ length: w }, () => new Color(c)));

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function createSwarm({ glyphs, bursts, ripples, now, water, population, reach }: SwarmOptions) {
  const ink = new MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 0.55,
    roughness: 0.3,
  });
  // The glow takes each note's own colour, not the material's.
  ink.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      "#include <emissivemap_fragment>\n#ifdef USE_INSTANCING_COLOR\n totalEmissiveRadiance *= vColor.rgb;\n#endif",
    );
  };
  const meshes = glyphs.shapes.map((shape) => {
    const m = new InstancedMesh(shape, ink, MAX);
    m.frustumCulled = false;
    for (let i = 0; i < MAX; i++) m.setColorAt(i, PALETTE[0]);
    m.count = 0;
    return m;
  });

  const halos = createHalos(MAX);

  const notes: Note[] = Array.from({ length: MAX }, (_, i) => ({
    glyph: 0,
    tint: PALETTE[0],
    size: NOTE_SIZE,
    state: "deep" as NoteState,
    pos: new Vector3(0, DEEP, 0),
    yaw: 0,
    roll: 0,
    pitch: 0,
    holder: null,
    local: new Vector3(),
    localYaw: 0,
    localRoll: 0,
    squash: 1,
    pop: 0,
    shine: 0,
    // Staggered so the sea fills in over the first seconds.
    timer: i < population ? rand(0.2, 6) : Infinity,
    claimed: false,
    phase: Math.random() * TAU,
    wild: i < population,
  }));
  let boatX = 0;
  let lastRipple = -10;

  function dress(n: Note) {
    n.glyph = Math.floor(Math.random() * glyphs.shapes.length);
    n.tint = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    n.squash = 1;
    n.shine = 0;
    n.roll = 0;
    n.pitch = 0;
    n.yaw = rand(-0.5, 0.5);
  }

  function rise(n: Note, x: number, z: number) {
    dress(n);
    n.size = NOTE_SIZE * rand(0.88, 1.1);
    n.pos.set(x, DEEP, z);
    n.state = "rising";
    n.holder = null;
    n.timer = 0;
    n.pop = 0.3;
  }

  /** Somewhere in the sea, away from the boat and its gear. */
  function wander(n: Note) {
    for (let tries = 0; tries < 12; tries++) {
      const near = Math.random() < 0.3;
      const z = near ? rand(0.5, 5) : -Math.pow(Math.random(), 0.7) * reach;
      const x = rand(-reach, reach) * (near ? 0.6 : 1);
      if (Math.abs(x - boatX) < 15 && z > -5) continue;
      rise(n, x, z);
      return;
    }
    n.timer = 1;
  }

  const top = (n: Note) => glyphs.halfHeight[n.glyph] * n.size;

  /** Under, out of sight: wild notes come back up in a while, the rest wait to be called. */
  function rest(n: Note, wait = rand(0.5, 3.5)) {
    n.state = "deep";
    n.holder = null;
    n.claimed = false;
    n.timer = n.wild ? wait : Infinity;
  }

  const m = new Matrix4();
  const local = new Matrix4();
  const q = new Quaternion();
  const e = new Euler();
  const s = new Vector3();
  const at = new Vector3();
  const counts = [0, 0, 0, 0];

  function where(n: Note, out: Vector3) {
    if (n.holder) {
      n.holder.updateWorldMatrix(true, false);
      return out.copy(n.local).applyMatrix4(n.holder.matrixWorld);
    }
    return out.copy(n.pos);
  }

  function step(n: Note, dt: number) {
    switch (n.state) {
      case "deep":
        n.timer -= dt;
        if (n.timer <= 0) wander(n);
        return;
      case "rising": {
        n.timer += dt;
        const p = Math.min(1, n.timer / RISE);
        const k = 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);
        const level = water(n.pos.x, n.pos.z);
        const wasUnder = n.pos.y < level;
        n.pos.y = level + DEEP + (FLOAT_Y - DEEP) * k;
        n.pop = Math.min(1, 0.3 + p * 1.4);
        if (wasUnder && n.pos.y >= level) surface(n);
        if (p >= 1) {
          n.state = "afloat";
          n.timer = rand(7, 16);
        }
        return;
      }
      case "afloat":
        n.pos.x += WIND * dt * (n.claimed ? 0 : 1);
        n.pos.y = water(n.pos.x, n.pos.z) + FLOAT_Y;
        n.timer -= dt;
        if (!n.claimed && n.timer <= 0) {
          n.state = "sinking";
          n.timer = 0;
        }
        return;
      case "sinking": {
        n.timer += dt;
        const p = Math.min(1, n.timer / SINK);
        n.pos.y = water(n.pos.x, n.pos.z) + FLOAT_Y + (DEEP - FLOAT_Y) * p * p;
        n.roll = p * 0.9;
        if (p >= 1) rest(n);
        return;
      }
      case "tossed": {
        const toss = n.toss!;
        toss.age += dt;
        const p = Math.min(1, toss.age / toss.duration);
        toss.holder?.updateWorldMatrix(true, false);
        const target = toss.holder ? at.copy(toss.to).applyMatrix4(toss.holder.matrixWorld) : at.copy(toss.to);
        n.pos.lerpVectors(toss.from, target, p);
        n.pos.y += toss.arc * 4 * p * (1 - p);
        n.yaw += toss.spin * dt;
        n.roll += toss.tumble * dt;
        if (p < 1) return;
        n.toss = undefined;
        if (toss.land === "hold" && toss.holder) {
          n.holder = toss.holder;
          n.local.copy(toss.to);
          n.localYaw = n.yaw % TAU;
          n.localRoll = 0;
          n.state = "held";
        } else {
          n.pos.y = water(n.pos.x, n.pos.z) + FLOAT_Y;
          n.roll = 0;
          splash(n);
          n.state = toss.land === "sink" ? "sinking" : "afloat";
          n.timer = toss.land === "sink" ? 0 : rand(3, 7);
          n.claimed = false;
        }
        toss.done();
        return;
      }
      case "flying": {
        n.timer += dt;
        const a = n.timer;
        n.pos.x += (WIND * 2.5 + Math.cos(a * 5) * 0.8) * dt;
        n.pos.y += (2.6 * Math.exp(-a * 1.6) + 0.35) * dt;
        n.roll = Math.sin(a * 5 + 1) * 0.3;
        n.pop = Math.min(1, a * 5) * (1 + Math.sin(Math.min(1, a * 3) * Math.PI) * 0.25);
        if (a > 1.9) {
          bursts.fire(n.pos, now(), CHIME);
          rest(n, rand(1, 4));
        }
        return;
      }
      case "held":
        return;
    }
  }

  function surface(n: Note) {
    const t = now();
    if (Math.abs(n.pos.x - boatX) < 30 && n.pos.z > -18 && t - lastRipple > 0.35) {
      lastRipple = t;
      ripples.spawn(n.pos.x, n.pos.z, t, FLICK);
    }
    if (n.pos.z > -8) bursts.fire(n.pos, t, n.claimed ? SPRAY : SPLASH_SMALL);
  }

  function splash(n: Note) {
    const t = now();
    ripples.spawn(n.pos.x, n.pos.z, t, FLICK);
    bursts.fire(n.pos, t, SPRAY);
  }

  function draw(t: number) {
    counts.fill(0);
    let h = 0;
    for (const n of notes) {
      if (n.state === "deep") continue;
      const afloat = n.state === "afloat" || n.state === "rising";
      const bob = afloat ? Math.sin(t * 2.1 + n.phase) * 0.06 : 0;
      const sway = n.state === "held" ? Math.sin(t * 1.7 + n.phase) * 0.12 : 0;
      const scale = n.size * n.pop;
      s.set(scale / Math.sqrt(n.squash), scale * n.squash, scale / Math.sqrt(n.squash));

      if (n.holder) {
        e.set(n.pitch, n.localYaw + sway * (1 - n.pitch), n.localRoll + sway * 0.4 * (1 - n.pitch));
        q.setFromEuler(e);
        local.compose(n.local, q, s);
        n.holder.updateWorldMatrix(true, false);
        m.multiplyMatrices(n.holder.matrixWorld, local);
      } else {
        const turn = afloat ? Math.sin(t * 0.8 + n.phase) * 0.7 : 0;
        e.set(n.pitch, n.yaw + turn, n.roll + (afloat ? Math.sin(t * 1.3 + n.phase) * 0.1 : 0));
        q.setFromEuler(e);
        at.copy(n.pos);
        at.y += bob;
        m.compose(at, q, s);
      }

      const mesh = meshes[n.glyph];
      const i = counts[n.glyph]++;
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, n.tint);

      at.setFromMatrixPosition(m);
      halos.set(
        h++,
        at,
        scale * (2.8 + n.shine * 1.4),
        n.tint,
        (0.5 + Math.sin(t * 3 + n.phase) * 0.1 + n.shine * 0.4) * Math.min(1, n.pop),
      );
    }
    meshes.forEach((mesh, g) => {
      mesh.count = counts[g];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    halos.commit(h);
  }

  /** A note to use: one in reserve if there is one, else one of the sea's own. */
  function free(): Note {
    return notes.find((n) => n.state === "deep" && !n.wild) ?? notes.find((n) => n.state === "deep")!;
  }

  return {
    meshes,
    halos: halos.mesh,
    notes,
    top,
    where,
    /** The boat's place, so the sea leaves its working water clear. */
    follow(x: number) {
      boatX = x;
    },
    /** Called up by the sonar: a note that will surface at (x, z) and wait there. */
    summon(x: number, z: number): Note {
      const n = free();
      rise(n, x, z);
      n.claimed = true;
      return n;
    },
    /** A note placed straight into a holder, for a hold that is already full. */
    place(holder: Object3D, at: Vector3, yaw = 0, roll = 0): Note {
      const n = free();
      dress(n);
      n.size = NOTE_SIZE;
      n.holder = holder;
      n.local.copy(at);
      n.localYaw = yaw;
      n.localRoll = roll;
      n.pop = 1;
      n.state = "held";
      n.claimed = true;
      return n;
    },
    /** Takes a note into `holder`, where it is now: the caller moves `local` from there. */
    grip(n: Note, holder: Object3D) {
      holder.updateWorldMatrix(true, false);
      const worldAt = where(n, new Vector3());
      n.local.copy(worldAt).applyMatrix4(m.copy(holder.matrixWorld).invert());
      n.localYaw = n.holder ? n.localYaw : n.yaw;
      n.localRoll = 0;
      n.holder = holder;
      n.state = "held";
      n.claimed = true;
    },
    /** Throws a note along an arc to a point, in `holder`'s frame if given. */
    toss(
      n: Note,
      to: Vector3,
      { holder = null, arc = 1, duration = 0.6, spin = 0, tumble = 0, land = "hold" }: Partial<Omit<Toss, "to">> = {},
    ): Promise<void> {
      return new Promise((done) => {
        const from = where(n, new Vector3());
        n.holder = null;
        n.pos.copy(from);
        n.state = "tossed";
        holder?.updateWorldMatrix(true, false);
        n.toss = { from, to: to.clone(), holder, arc, duration, age: 0, spin, tumble, land, done };
      });
    },
    /** Gone for good: swallowed, or burst. It rejoins the sea's pool. */
    retire(n: Note) {
      rest(n, rand(1, 4));
    },
    /** A note sung out of the funnel: up and away, and it bursts. */
    sing(from: Vector3) {
      const n = free();
      dress(n);
      n.size = NOTE_SIZE * 0.55;
      n.pos.copy(from);
      n.state = "flying";
      n.timer = 0;
      n.pop = 0;
      n.holder = null;
    },
    /** The notes in the water nearest the camera, for the sea to keep its crests under. */
    sights(out: Vector4[]) {
      let k = 0;
      const afloat = notes
        .filter((n) => (n.state === "afloat" || n.state === "rising") && n.pos.z > -14)
        .sort((a, b) => Number(b.claimed) - Number(a.claimed) || b.pos.z - a.pos.z);
      for (const n of afloat) {
        if (k >= out.length) break;
        out[k++].set(n.pos.x, n.pos.z, n.pos.y - top(n) * 0.7, 1);
      }
      for (; k < out.length; k++) out[k].w = 0;
    },
    update(t: number, dt: number) {
      for (const n of notes) step(n, dt);
      draw(t);
    },
    dispose() {
      meshes.forEach((mesh) => mesh.dispose());
      ink.dispose();
      halos.dispose();
    },
  };
}

const SPLASH_SMALL: BurstKind = { ...SPRAY, speed: 4, size: 4, count: 12 };
const CHIME: BurstKind = { ...SPARK, color: new Color("#8f96ff"), count: 16 };
