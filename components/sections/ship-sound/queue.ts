/* The demo queue. Drunken Sailor leads because it has lyrics and is in the public domain; the rest
   is the album in the backdrop, in the order its own queue shows. Durations in seconds. */

export type Track = {
  title: string;
  artist: string | null;
  seconds: number;
  cover: string;
  lyrics?: readonly string[];
};

const ALBUM_ARTIST = "Slash featuring Myles Kennedy and the Conspirators";
const ALBUM_COVER = "center / cover url(/shots/fr/light/player-cover.webp)";

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
  { title: "Carolina", artist: ALBUM_ARTIST, seconds: 203, cover: ALBUM_COVER },
  { title: "Far and Away", artist: ALBUM_ARTIST, seconds: 315, cover: ALBUM_COVER },
  { title: "Crazy Life", artist: ALBUM_ARTIST, seconds: 224, cover: ALBUM_COVER },
  { title: "Apocalyptic Love", artist: ALBUM_ARTIST, seconds: 210, cover: ALBUM_COVER },
  { title: "We Will Roam", artist: ALBUM_ARTIST, seconds: 294, cover: ALBUM_COVER },
  { title: "Shots Fired", artist: ALBUM_ARTIST, seconds: 231, cover: ALBUM_COVER },
];

export function clock(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
