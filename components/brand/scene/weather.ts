import type { RingSpec } from "./ripples";

/*
 * The two weathers the page is told in: the storm it opens on and the home
 * water it closes on. Same sea, same ark, same code — what changes is how rough
 * the water is and what happens on it, which is the whole narrative in two
 * pictures, exactly as components/brand/sea/sea.ts tells it for the posters.
 *
 * `stage` is the poster each scene takes over from: how wide its ark is drawn
 * and where its waterline sits. The camera is solved from those two numbers
 * (framing.ts), which is what lets the 3D ark land on the drawn one.
 */

export type Stage = {
  /** Width of the poster's ark box, px. */
  arkPx: number;
  /** The poster's waterline, px above the host's bottom edge. */
  waterline: number;
};

export type Weather = {
  stage: (width: number) => Stage;
  /** Height of the swell, 1 being the storm. */
  swell: number;
  /** Pushes the whole surface towards its pale end. */
  pallor: number;
  /** Opacity multiplier on the water. */
  presence: number;
  rain: boolean;
  /** Pixels lifted out of the sea into the hold. */
  stream: boolean;
  /** Seconds between the ark's echoes, and how loud they are. */
  echoEvery: number;
  echo: RingSpec;
  /** Scrolling out of the host settles the water and closes the camera in. */
  settlesOnScroll: boolean;
  /** The first ping waits until the host is actually on screen. */
  revealsOnView: boolean;
  /** How the water meets the host's bottom edge: fade length px, and what is left at the edge. */
  shore: { fade: number; floor: number };
};

/** Tailwind's `sm`, where the hero's poster ark grows from 192px to 320px. */
const SM = 640;

export const STORM: Weather = {
  stage: (width) => ({ arkPx: width >= SM ? 320 : 192, waterline: 110 }),
  swell: 1,
  pallor: 0,
  presence: 1,
  rain: true,
  stream: true,
  echoEvery: 7.5,
  echo: { strength: 0.75, speed: 24, width: 2.6 },
  settlesOnScroll: true,
  revealsOnView: false,
  // The hero hands over to the next section on paper, not on a cut.
  shore: { fade: 70, floor: 0 },
};

/*
 * Home water: under half the swell, paler, no rain and nothing left to rescue.
 * The echoes come half as often and half as loud — the ark is still listening,
 * not searching. The page ends on the sea rather than fading back to paper, but
 * the colophon sits in it, so the water thins to a wash under that line: the
 * signature and the links are read against paper, the sea is seen above them.
 */
export const CALM: Weather = {
  stage: () => ({ arkPx: 230, waterline: 92 }),
  swell: 0.42,
  pallor: 0.22,
  presence: 0.82,
  rain: false,
  stream: false,
  echoEvery: 13,
  echo: { strength: 0.45, speed: 16, width: 2.4 },
  settlesOnScroll: false,
  revealsOnView: true,
  shore: { fade: 110, floor: 0.08 },
};

export const WEATHER = { storm: STORM, calm: CALM };

export type WeatherName = keyof typeof WEATHER;
