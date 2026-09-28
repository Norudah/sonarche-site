import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

import { createArk } from "./ark";
import { FOV, frame, PITCH, type Framing } from "./framing";
import { createRain } from "./rain";
import { createRipples, ECHO, PING, WAKE } from "./ripples";
import { createSea } from "./sea";
import { createStream } from "./stream";

gsap.registerPlugin(ScrollTrigger);

/*
 * The hero's storm, live.
 *
 * Loaded after the page is idle and only on a device that passed the gate in
 * HeroScene.tsx; everything the visitor reads is already on screen by then.
 * This owns the renderer, the camera, the clock and the three moments the scene
 * is built around:
 *
 *   1. The ping. Once the first frame is up, the ark sends a sonar pulse
 *      across the sea — Sonarche is sonar + arche, and this is the name said
 *      out loud. The bars flash and leap as the ring passes under them.
 *   2. The rescue. In the ping's wake pixels start lifting off the water and
 *      streaming into the hold: a trickle, then a current.
 *   3. The calm. Scrolling out of the hero settles the storm — the rain thins,
 *      the swell drops, the camera lifts — the footer's home water, previewed.
 *
 * And one that belongs to the visitor: a mouse dragged over the sea leaves a
 * wake in it, and the camera leans a degree or two after the cursor.
 *
 * Frame budget, in the order it is defended: no lighting, no shadows, no
 * post-processing; one draw call each for the sea, the rain and the pixels,
 * however many thousand cards they hold; a pixel-ratio ceiling set by the gate;
 * the clock stops whenever the hero is off-screen; and a watchdog that drops
 * the resolution once, and hands back to the poster if that is not enough.
 */

export type Tier = {
  /** Ceiling on devicePixelRatio. */
  pixelRatio: number;
  antialias: boolean;
  /** Bar density of the sea, 1 being the full field. */
  density: number;
  rain: number;
  pixels: number;
};

type SceneOptions = {
  canvas: HTMLCanvasElement;
  /** The hero section: sized from, observed, and listened to for the pointer. */
  host: HTMLElement;
  tier: Tier;
  /** The first frame is on the canvas: the poster can go. */
  onLive: () => void;
  /** The scene gave up (no WebGL, context lost, too slow): the poster stays. */
  onFail: () => void;
};

const DEG = Math.PI / 180;
/** Seconds between the ark's echoes once the intro is over. */
const ECHO_EVERY = 7.5;
/** Median frame time, ms, above which the watchdog steps in. ~38fps. */
const SLOW_FRAME = 26;

export function createScene({ canvas, host, tier, onLive, onFail }: SceneOptions) {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: tier.antialias,
      powerPreference: "high-performance",
    });
  } catch {
    onFail();
    return { dispose() {} };
  }
  renderer.setClearColor(0x000000, 0);

  // A machine rendering WebGL on the CPU gets the poster: at this fill rate a
  // software rasteriser spends seconds on a frame, and blocks the page doing it.
  if (isSoftware(renderer)) {
    renderer.dispose();
    renderer.forceContextLoss();
    onFail();
    return { dispose() {} };
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 1000);
  const ripples = createRipples();
  const sea = createSea(ripples, tier.density);
  const rain = createRain(tier.rain);
  const stream = createStream(tier.pixels);
  const ark = createArk();
  scene.add(sea.mesh, ark.group, rain.mesh, stream.mesh);

  let framing: Framing | undefined;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, tier.pixelRatio);
  let clock = 0;
  let running = false;
  let disposed = false;

  // Tweened by the intro and the scroll; read every frame.
  const state = { stream: 0, calm: 0 };
  // Where the pointer is (-1..1 across the hero), and where the camera has got to.
  const lean = { x: 0, y: 0, toX: 0, toY: 0 };

  function place() {
    if (!framing) return;
    const pitch = (PITCH + state.calm * 7 + lean.y * 1.1) * DEG;
    const yaw = lean.x * 2.4 * DEG;
    const d = framing.distance;
    camera.position.set(Math.sin(yaw) * d * Math.cos(pitch), d * Math.sin(pitch), Math.cos(yaw) * d * Math.cos(pitch));
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    framing = frame(width, height);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.far = framing.distance * 5;
    // The lens shift: the ark lands on the poster's waterline, not mid-frame.
    camera.setViewOffset(width, height, 0, -framing.shift, width, height);
    camera.updateProjectionMatrix();

    sea.relayout(framing, pixelRatio);
    rain.relayout(framing);
    stream.relayout(framing);
    place();
  }

  function render(dt: number) {
    clock += dt;
    const follow = Math.min(1, dt * 2.2);
    lean.x += (lean.toX - lean.x) * follow;
    lean.y += (lean.toY - lean.y) * follow;
    place();

    ark.update(clock, dt);
    const [hx, hy, hz] = ark.hold();
    const storm = 1 - 0.6 * state.calm;

    const s = sea.uniforms;
    s.uTime.value = clock;
    s.uStorm.value = storm;
    s.uArk.value.set(ark.group.position.x, 0);
    s.uEye.value.copy(camera.position);

    rain.uniforms.uTime.value = clock;
    rain.uniforms.uRain.value = 1 - state.calm;

    const p = stream.uniforms;
    p.uTime.value = clock;
    p.uStream.value = state.stream;
    p.uHold.value.set(hx, hy, hz);
    p.uEye.value.copy(camera.position);

    renderer.render(scene, camera);
  }

  // --- The watchdog ---------------------------------------------------------

  const samples: number[] = [];
  let warmup = 1.5;
  let stepped = false;

  function watch(deltaMs: number) {
    if (warmup > 0) {
      warmup -= deltaMs / 1000;
      return;
    }
    // A frame this long is a tab switch or a GC, not the scene's cost.
    if (deltaMs > 200) return;
    samples.push(deltaMs);
    if (samples.length < 90) return;
    const median = samples.sort((a, b) => a - b)[45];
    samples.length = 0;
    if (median <= SLOW_FRAME) return;
    if (!stepped && pixelRatio > 1) {
      stepped = true;
      pixelRatio = Math.max(1, pixelRatio * 0.66);
      warmup = 1;
      resize();
      return;
    }
    fail();
  }

  function tick(_time: number, deltaMs: number) {
    render(Math.min(deltaMs, 50) / 1000);
    watch(deltaMs);
  }

  function run(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  }

  // --- The visitor ----------------------------------------------------------

  const ray = new Vector3();
  let lastWake = -1;
  const lastHit = new Vector3(1e6, 0, 0);

  function onPointer(e: PointerEvent) {
    if (e.pointerType !== "mouse" || !framing) return;
    const rect = host.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    lean.toX = nx;
    lean.toY = -ny;

    // Where the cursor meets the water, if it does.
    ray.set(nx, -ny, 0.5).unproject(camera).sub(camera.position).normalize();
    if (ray.y > -0.01) return;
    const t = -camera.position.y / ray.y;
    ray.multiplyScalar(t).add(camera.position);
    if (clock - lastWake < 0.07 || ray.distanceTo(lastHit) < 1.6) return;
    lastWake = clock;
    lastHit.copy(ray);
    ripples.spawn(ray.x, ray.z, clock, WAKE);
  }

  function onLeave() {
    lean.toX = 0;
    lean.toY = 0;
  }

  // --- Lifecycle ------------------------------------------------------------

  const visibility = new IntersectionObserver(([entry]) => run(entry.isIntersecting && !disposed));

  let resizeFrame = 0;
  const sizes = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resize);
  });

  function onContextLost(e: Event) {
    e.preventDefault();
    fail();
  }

  const ctx = gsap.context(() => {});

  function ping(ring = PING) {
    ripples.spawn(ark.group.position.x, 0, clock, ring);
    ark.ping();
  }

  function intro() {
    ctx.add(() => {
      gsap
        .timeline()
        .call(() => ping(PING), [], 0.35)
        .to(state, { stream: 1, duration: 3.4, ease: "power1.in" }, 0.7);

      gsap
        .timeline({ repeat: -1, delay: ECHO_EVERY })
        .call(() => ping(ECHO))
        .to({}, { duration: ECHO_EVERY });

      gsap.to(state, {
        calm: 1,
        ease: "none",
        scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: 0.8 },
      });
    });
  }

  if (process.env.NODE_ENV !== "production") {
    // Dev only: a handle for tuning the scene from the console.
    (window as unknown as { __heroScene: object }).__heroScene = { ping, state, ripples };
  }

  // Startup in slices, each its own task, so none of it is one long block on
  // the main thread: lay out and size, compile (in parallel where the driver
  // can), upload and draw the first frame.
  async function start() {
    await nextTask();
    if (disposed) return;
    resize();
    sizes.observe(host);
    canvas.addEventListener("webglcontextlost", onContextLost);

    await renderer.compileAsync(scene, camera);
    await nextTask();
    if (disposed) return;
    render(0);

    await nextTask();
    if (disposed) return;
    onLive();
    intro();
    visibility.observe(host);
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
  }

  start().catch(fail);

  function dispose() {
    if (disposed) return;
    disposed = true;
    run(false);
    ctx.revert();
    visibility.disconnect();
    sizes.disconnect();
    cancelAnimationFrame(resizeFrame);
    host.removeEventListener("pointermove", onPointer);
    host.removeEventListener("pointerleave", onLeave);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    sea.dispose();
    rain.dispose();
    stream.dispose();
    ark.dispose();
    renderer.dispose();
    // Hand the context back now rather than at GC: a dev session with HMR, or
    // a visitor bouncing between the two locales, would otherwise pile them up.
    renderer.forceContextLoss();
  }

  function fail() {
    if (disposed) return;
    onFail();
    dispose();
  }

  return { dispose };
}

const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

function isSoftware(renderer: WebGLRenderer): boolean {
  const gl = renderer.getContext();
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  return typeof name === "string" && SOFTWARE.test(name);
}
