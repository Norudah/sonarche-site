import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerspectiveCamera, Scene, Vector3, type WebGLRenderer } from "three";

import { createBoat } from "./boat/boat";
import { createBursts } from "./bursts";
import { FOV, frame, PITCH, type Framing } from "./framing";
import { createLighting } from "./lighting";
import { createRain } from "./rain";
import { createRenderer } from "./renderer";
import { CLICK, createRipples, PING, WAKE, type RingSpec } from "./ripples";
import { createSea } from "./sea";
import { createStream } from "./stream";
import { createWatchdog } from "./watchdog";
import { WEATHER, type WeatherName } from "./weather";

gsap.registerPlugin(ScrollTrigger);

/*
 * The live sea: the hero's storm and the footer's calm water, one scene in two weathers. Loaded
 * once the page is idle, on devices that passed LiveSea's gate. Three moments: the arrival ping
 * that reveals the sea, the rescue of a note (boat/voyage), and the calm as the hero scrolls
 * away. A mouse leaves a wake, a click pings, and the camera leans after the cursor.
 *
 * Frame budget: no lights, shadows or post-processing; one draw call per instanced field; a
 * pixel-ratio ceiling from the gate; the clock stops off-screen; and a watchdog that trades
 * resolution for frame rate rather than falling back to the poster.
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
  /** The element the canvas covers: sized, observed and listened to. */
  host: HTMLElement;
  weather: WeatherName;
  tier: Tier;
  /** The first frame is drawn; the reveal starts over the poster. */
  onLive: () => void;
  onSettled: () => void;
  /** No WebGL or a shader failed: the poster stays. */
  onFail: () => void;
  /** The GPU took the context back: rebuild. */
  onLost: () => void;
};

const DEG = Math.PI / 180;
/** Device pixels per CSS pixel the watchdog stops at. */
const FLOOR_RATIO = 0.75;
/** Half-width of the rain's clearing round the vessel, world units. */
const BOAT_CLEAR = 10;
/** The first ping starts just clear of the hull and, once past the frame, the sea is simply there. */
const REVEAL_FROM = 6.5;
const REVEALED = Number.POSITIVE_INFINITY;

export function createScene({ canvas, host, weather: name, tier, onLive, onSettled, onFail, onLost }: SceneOptions) {
  const weather = WEATHER[name];
  const created = createRenderer(canvas, tier.antialias, () => fail());
  if (!created) {
    onFail();
    return { dispose() {} };
  }
  const renderer: WebGLRenderer = created;

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 1000);
  const ripples = createRipples();
  const sea = createSea(ripples, tier.density);
  const rain = weather.rain ? createRain(tier.rain) : undefined;
  const stream = weather.stream ? createStream(tier.pixels) : undefined;
  const bursts = createBursts();
  const boat = createBoat({
    ripples,
    bursts,
    now: () => clock,
    patrol: weather.patrol,
    laden: !weather.fishing,
    shoal: weather.shoal,
  });
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

  // `reveal` is the first ping's radius, in world units from the hull.
  const state = { calm: 0, reveal: REVEAL_FROM };
  // The pointer (-1..1 across the host) and where the camera has caught up to.
  const lean = { x: 0, y: 0, toX: 0, toY: 0 };

  function place() {
    if (!framing) return;
    const pitch = (PITCH + state.calm * 7 + lean.y * 1.1) * DEG;
    const yaw = lean.x * 2.4 * DEG;
    // Scrolling away moves the camera in as the page moves up: parallax a flat drawing cannot give.
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
    boat.roam((width / 2) * (framing.distance / framing.focal));
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

    const storm = weather.swell * (1 - 0.6 * state.calm);
    boat.update(clock, dt, lean, { time: clock, storm });
    lighting.follow(boat.group);

    const s = sea.uniforms;
    s.uTime.value = clock;
    s.uStorm.value = storm;
    s.uArk.value.set(boat.x(), 0);
    s.uArkLift.value = boat.level();
    boat.sight(s.uCatch.value);
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

  const watch = createWatchdog(() => {
    if (pixelRatio <= FLOOR_RATIO) return false;
    pixelRatio = Math.max(FLOOR_RATIO, pixelRatio * 0.75);
    resize();
    return true;
  });

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

  function pointerAt(e: MouseEvent): [number, number] {
    const rect = host.getBoundingClientRect();
    return [((e.clientX - rect.left) / rect.width) * 2 - 1, ((e.clientY - rect.top) / rect.height) * 2 - 1];
  }

  /** Where a screen point meets the water, written into `ray`; false when it looks at the sky. */
  function hitWater(nx: number, ny: number) {
    ray.set(nx, -ny, 0.5).unproject(camera).sub(camera.position).normalize();
    if (ray.y > -0.01) return false;
    ray.multiplyScalar(-camera.position.y / ray.y).add(camera.position);
    return true;
  }

  function onPointer(e: PointerEvent) {
    if (e.pointerType !== "mouse" || !framing) return;
    const [nx, ny] = pointerAt(e);
    lean.toX = nx;
    lean.toY = -ny;
    if (!hitWater(nx, ny)) return;
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
    if (!hitWater(...pointerAt(e))) return;
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
    if (disposed) return;
    dispose();
    onLost();
  }

  const ctx = gsap.context(() => {});

  /* The rain parts around `[data-scene-clear]` (the hero's copy), measured so a longer subline moves it too. */
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

  /* The first ping sweeps from the centre to the horizon; the storm's vessel drops in as it goes. */
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

  // The harbour's first ping waits until the visitor gets there.
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
    (window as unknown as Record<string, object>)[`__scene_${name}`] = {
      ping,
      state,
      ripples,
      info: () => renderer.info.render,
    };
  }

  // Startup in separate tasks so none of it is one long main-thread block.
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
    // Release the context now rather than at GC, or HMR and locale switches pile them up.
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
