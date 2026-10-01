import type { RingSpec } from "./ripples";

/* The storm the page opens on and the calm it closes on. `stage` is the poster each scene takes over
   from; the camera is solved from it (framing.ts). */

export type Stage = {
  /** Width of the poster's ark box, px. */
  arkPx: number;
  /** The poster's waterline, px above the host's bottom edge. */
  waterline: number;
};

type Weather = {
  stage: (width: number) => Stage;
  /** Height of the swell, 1 being the storm. */
  swell: number;
  /** Pushes the whole surface towards its pale end. */
  pallor: number;
  /** Opacity multiplier on the water. */
  presence: number;
  rain: boolean;
  /** Pixels lifted out of the sea, converging on each note as it forms. */
  stream: boolean;
  /** The vessel patrols and fishes notes into its crates. */
  fishing: boolean;
  /** How far either side of the middle the vessel steams, world units, at most. */
  patrol: number;
  /** How many notes the sea keeps afloat. */
  shoal: number;
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

const STORM: Weather = {
  stage: (width) => ({ arkPx: width >= SM ? 320 : 192, waterline: 110 }),
  swell: 1,
  pallor: 0,
  presence: 1,
  rain: true,
  stream: true,
  fishing: true,
  patrol: 5,
  shoal: 18,
  echoEvery: 7.5,
  echo: { strength: 0.75, speed: 24, width: 2.6 },
  settlesOnScroll: true,
  revealsOnView: false,
  // The hero hands over to the next section on paper, not on a cut.
  shore: { fade: 70, floor: 0 },
};

/* Home water. The sea thins to a wash under the colophon so its text reads against paper. */
const CALM: Weather = {
  stage: () => ({ arkPx: 230, waterline: 92 }),
  swell: 0.42,
  pallor: 0.22,
  presence: 0.82,
  rain: false,
  stream: false,
  fishing: false,
  patrol: 0,
  shoal: 7,
  echoEvery: 13,
  echo: { strength: 0.45, speed: 16, width: 2.4 },
  settlesOnScroll: false,
  revealsOnView: true,
  shore: { fade: 110, floor: 0.08 },
};

export const WEATHER = { storm: STORM, calm: CALM };

export type WeatherName = keyof typeof WEATHER;
