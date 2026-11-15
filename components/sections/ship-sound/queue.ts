/* The demo queue. Drunken Sailor leads because it has lyrics and is in the public domain; the rest
   is the album in the backdrop. Durations in seconds. */

export type Track = {
  title: string;
  artist: string | null;
  seconds: number;
  cover: string;
  lyrics?: readonly string[];
};

const ALGORITHM =
  "radial-gradient(circle at 30% 30%, oklch(0.7 0.18 330), oklch(0.42 0.17 300) 55%, oklch(0.22 0.08 290))";

/** One line every LINE_SECONDS, looping over the verse and chorus. */
export const LINE_SECONDS = 3.2;

export const QUEUE: readonly Track[] = [
  {
    title: "Drunken Sailor",
    artist: null,
    seconds: 160,
    cover: "radial-gradient(circle at 30% 25%, oklch(0.75 0.12 220), oklch(0.45 0.14 250) 55%, oklch(0.24 0.08 265))",
    lyrics: [
      "What will we do with a drunken sailor,",
      "What will we do with a drunken sailor,",
      "What will we do with a drunken sailor,",
      "Early in the morning?",
      "Way hay and up she rises,",
      "Way hay and up she rises,",
      "Way hay and up she rises,",
      "Early in the morning!",
    ],
  },
  { title: "Oath", artist: "The Algorithm", seconds: 174, cover: ALGORITHM },
  { title: "Distant Memories", artist: "The Algorithm", seconds: 268, cover: ALGORITHM },
  { title: "Erebus", artist: "The Algorithm", seconds: 225, cover: ALGORITHM },
  { title: "Sanctus Overdrive", artist: "The Algorithm", seconds: 216, cover: ALGORITHM },
  { title: "All Hope Gone", artist: "The Algorithm", seconds: 147, cover: ALGORITHM },
];

export function clock(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
