import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";

import { createBoat } from "./boat/boat";
import { createBursts } from "./bursts";
import { FOV, frame, PITCH, type Framing } from "./framing";
import { createLighting } from "./lighting";
import { createRain } from "./rain";
import { CLICK, createRipples, PING, WAKE, type RingSpec } from "./ripples";
import { createSea } from "./sea";
import { createStream } from "./stream";
import { WEATHER, type WeatherName } from "./weather";

gsap.registerPlugin(ScrollTrigger);

/*
 * The sea, live — the hero's storm and the footer's home water, told by one
 * scene in two weathers (weather.ts).
 *
 * Loaded after the page is idle and only on a device that passed the gate in
 * LiveSea.tsx; everything the visitor reads is already on screen by then.
 * This owns the renderer, the camera, the clock and the three moments the storm
 * is built around (the harbour keeps only the first, on arrival):
 *
 *   1. The ping. Sonarche is sonar + arche, and this is the name said out
 *      loud: on arrival the ark sends a sonar pulse, and the sea exists only
 *      where it has reached. The ring sweeps out from the hull, wiping the
 *      CSS poster away and finding the 3D water behind it, the bars flashing
 *      and leaping at its front. It echoes, smaller, every few seconds.
 *   2. The rescue. The vessel patrols and fishes: a note forms out of the
 *      sea's pixels, the crane hooks it and stows it in a crate (boat/).
 *   3. The calm. Scrolling out of the hero settles the storm — the rain thins,
 *      the swell drops, the camera lifts — the footer's home water, previewed.
 *
 * And the visitor's own: a mouse dragged over the sea leaves a wake in it, a
 * click on the water sends a ping from there, and the camera leans a degree or
 * two after the cursor.
 *
 * Frame budget, in the order it is defended: no lighting, no shadows, no
 * post-processing; one draw call each for the sea, the rain and the pixels,
 * however many thousand cards they hold; a pixel-ratio ceiling set by the gate;
 * the clock stops whenever the host is off-screen; and a watchdog that drops
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
  /** The element the canvas covers: sized from, observed, listened to for the pointer. */
  host: HTMLElement;
  weather: WeatherName;
  tier: Tier;
  /** The first frame is on the canvas: the reveal is starting over the poster. */
  onLive: () => void;
  /** The reveal has covered the frame: the poster can sleep. */
  onSettled: () => void;
  /** The scene gave up (no WebGL, context lost, too slow): the poster stays. */
  onFail: () => void;
};

const DEG = Math.PI / 180;
/** Median frame time, ms, above which the watchdog steps in. ~38fps. */
const SLOW_FRAME = 26;
/** Half-width of the rain's clearing round the vessel, world units. */
const BOAT_CLEAR = 10;
/** The first ping starts just clear of the hull… */
const REVEAL_FROM = 6.5;
/** …and once it has swept the frame, the sea is simply there. */
const REVEALED = Number.POSITIVE_INFINITY;

export function createScene({ canvas, host, weather: name, tier, onLive, onSettled, onFail }: SceneOptions) {
  const weather = WEATHER[name];
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
  // A shader that does not compile renders nothing and says so only in the
  // console; the poster is a better page than an empty sea.
  renderer.debug.onShaderError = (gl, program) => {
    if (process.env.NODE_ENV !== "production") console.error(gl.getProgramInfoLog(program));
    fail();
  };

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
  const rain = weather.rain ? createRain(tier.rain) : undefined;
  const stream = weather.stream ? createStream(tier.pixels) : undefined;
  const bursts = createBursts();
  const boat = createBoat({ ripples, bursts, now: () => clock, patrol: weather.patrol, laden: !weather.fishing });
  // The storm's vessel arrives by falling into the sea (see intro).
  if (weather.fishing) boat.hide();
  const lighting = createLighting(renderer, scene);
  scene.add(sea.mesh, boat.group, boat.world, bursts.mesh);
  if (rain) scene.add(rain.mesh);
  if (stream) scene.add(stream.mesh);
  sea.uniforms.uPallor.value = weather.pallor;
  sea.uniforms.uPresence.value = weather.presence;

  let framing: Framing | undefined;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, tier.pixelRatio);
  let clock = 0;
  let running = false;
  let disposed = false;

  // Tweened by the intro and the scroll; read every frame.
  // `reveal` is the first ping's radius, world units from the hull.
  const state = { calm: 0, reveal: REVEAL_FROM };
  // Where the pointer is (-1..1 across the host), and where the camera has got to.
  const lean = { x: 0, y: 0, toX: 0, toY: 0 };

  function place() {
    if (!framing) return;
    const pitch = (PITCH + state.calm * 7 + lean.y * 1.1) * DEG;
    const yaw = lean.x * 2.4 * DEG;
    // Scrolling away closes in on the ark as the hero leaves the screen: the
    // page moves up, the camera moves in, and the two together are parallax
    // no flat drawing can give.
    const d = framing.distance * (1 - 0.2 * state.calm);
    camera.position.set(Math.sin(yaw) * d * Math.cos(pitch), d * Math.sin(pitch), Math.cos(yaw) * d * Math.cos(pitch));
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    framing = frame(width, height, weather.stage(width));

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.far = framing.distance * 5;
    // The lens shift: the ark lands on the poster's waterline, not mid-frame.
    camera.setViewOffset(width, height, 0, -framing.shift, width, height);
    camera.updateProjectionMatrix();

    sea.relayout(framing);
    sea.uniforms.uShore.value.set(weather.shore.fade * pixelRatio, weather.shore.floor);
    rain?.relayout(framing);
    stream?.relayout(framing);
    bursts.uniforms.uFocal.value = framing.focal;
    clearCopy();
    place();
  }

  function render(dt: number) {
    clock += dt;
    const follow = Math.min(1, dt * 2.2);
    lean.x += (lean.toX - lean.x) * follow;
    lean.y += (lean.toY - lean.y) * follow;
    place();

    boat.update(clock, dt, lean);
    lighting.follow(boat.group);
    const storm = weather.swell * (1 - 0.6 * state.calm);

    const s = sea.uniforms;
    s.uTime.value = clock;
    s.uStorm.value = storm;
    s.uArk.value.set(boat.x(), 0);
    s.uEye.value.copy(camera.position);

    const revealing = state.reveal < REVEALED;
    const soft = revealing ? 3 + state.reveal * 0.06 : 1;
    s.uReveal.value.set(revealing ? state.reveal : 1e5, soft, revealing ? 1 : 0);
    rain?.uniforms.uReveal.value.set(revealing ? state.reveal : 1e5, soft, 0);
    bursts.uniforms.uTime.value = clock;
    bursts.uniforms.uEye.value.copy(camera.position);

    if (rain && framing) {
      rain.uniforms.uTime.value = clock;
      rain.uniforms.uRain.value = 1 - state.calm;
      // The vessel's clearing follows it: its centre, projected, in device px.
      projected.set(boat.x(), 2.2, 0).project(camera);
      const px = framing.width * pixelRatio;
      const py = framing.height * pixelRatio;
      rain.uniforms.uClearBoat.value.set(
        ((projected.x + 1) / 2) * px,
        ((projected.y + 1) / 2) * py,
        (BOAT_CLEAR * framing.focal * pixelRatio) / framing.distance,
        (BOAT_CLEAR * 0.55 * framing.focal * pixelRatio) / framing.distance,
      );
    }

    if (stream) {
      const p = stream.uniforms;
      p.uTime.value = clock;
      p.uStream.value = boat.surfacing();
      p.uHold.value.copy(boat.target());
      p.uEye.value.copy(camera.position);
    }

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
  const projected = new Vector3();
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

  // A click on open water — not on the copy or a button — pings from there.
  function onClick(e: MouseEvent) {
    if (!framing || (e.target as Element).closest("a, button, p, h1, h2, span")) return;
    const rect = host.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    ray.set(nx, -ny, 0.5).unproject(camera).sub(camera.position).normalize();
    if (ray.y > -0.01) return;
    ray.multiplyScalar(-camera.position.y / ray.y).add(camera.position);
    ripples.spawn(ray.x, ray.z, clock, CLICK);
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

  /*
   * The eye of the storm: the rain parts around whatever the host marks
   * `data-scene-clear` (the hero's copy), measured here rather than guessed so
   * a longer French subline or a wrapped button row moves it too.
   */
  function clearCopy() {
    const copy = host.querySelector("[data-scene-clear]");
    if (!rain || !copy || !framing) return;
    const box = copy.getBoundingClientRect();
    const frameBox = host.getBoundingClientRect();
    const cx = box.left - frameBox.left + box.width / 2;
    const cy = framing.height - (box.top - frameBox.top + box.height / 2);
    rain.uniforms.uClear.value.set(cx, cy, box.width * 0.62, box.height * 0.68).multiplyScalar(pixelRatio);
  }

  function ping(ring: RingSpec = PING) {
    ripples.spawn(boat.x(), 0, clock, ring);
    boat.ping();
  }

  /*
   * Arrival. The sea deploys out of the loader's sonar rings (LiveSea.tsx):
   * the first ping sweeps out from the centre to the horizon and the bars
   * rise out of flat water behind its front. The storm's vessel drops into it
   * as it goes, and starts work once the sea is all there.
   */
  function intro() {
    const reach = (framing?.distance ?? 60) * 3.2;
    ctx.add(() => {
      const tl = gsap.timeline();
      tl.to(state, { reveal: reach, duration: 2.4, ease: "power2.in" }, 0.05).call(
        () => {
          state.reveal = REVEALED;
          onSettled();
        },
        [],
        ">",
      );
      if (weather.fishing) {
        tl.call(() => boat.drop(), [], 0.45).call(() => boat.work(), [], 3.4);
      } else {
        tl.call(() => boat.ping(), [], 0.1);
      }

      gsap
        .timeline({ repeat: -1, delay: weather.echoEvery + 3 })
        .call(() => ping(weather.echo))
        .to({}, { duration: weather.echoEvery });

      if (weather.settlesOnScroll) {
        gsap.to(state, {
          calm: 1,
          ease: "none",
          scrollTrigger: { trigger: host, start: "top top", end: "bottom top", scrub: 0.8 },
        });
      }
    });
  }

  // The harbour's first ping waits for the visitor to get there: it is the
  // page's last moment, and it should not be spent below the fold.
  const arrival = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      arrival.disconnect();
      intro();
    },
    { threshold: 0.6 },
  );

  if (process.env.NODE_ENV !== "production") {
    // Dev only: a handle for tuning the scene from the console.
    (window as unknown as Record<string, object>)[`__scene_${name}`] = { ping, state, ripples };
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
    // The sheen, in a slice of its own (see lighting.ts).
    await nextTask();
    if (disposed) return;
    lighting.environment();
    if (weather.revealsOnView) arrival.observe(host);
    else intro();
    visibility.observe(host);
    host.addEventListener("pointermove", onPointer, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    host.addEventListener("click", onClick);
  }

  start().catch(fail);

  function dispose() {
    if (disposed) return;
    disposed = true;
    run(false);
    ctx.revert();
    visibility.disconnect();
    arrival.disconnect();
    sizes.disconnect();
    cancelAnimationFrame(resizeFrame);
    host.removeEventListener("pointermove", onPointer);
    host.removeEventListener("pointerleave", onLeave);
    host.removeEventListener("click", onClick);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    sea.dispose();
    rain?.dispose();
    stream?.dispose();
    bursts.dispose();
    boat.dispose();
    lighting.dispose();
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
