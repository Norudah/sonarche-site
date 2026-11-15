/* The album the file manager shows. Demo content: what is on disk, never translated. */

export const ARTIST = "Ghost";
export const ALBUM = { folder: "Prequelle (2018)", title: "Prequelle", year: "2018", genre: "Hard Rock" };
export const OTHER_ALBUM = "Seven Inches of Satanic Panic (2019)";

const TITLES = [
  "Ashes",
  "Rats",
  "Faith",
  "See the Light",
  "Miasma",
  "Dance Macabre",
  "Pro Memoria",
  "Witch Image",
  "Helvetesfönster",
  "Life Eternal",
];

/** The track the details pane describes. */
export const SELECTED = 5;

export const TRACKS = TITLES.map((title, i) => ({
  number: String(i + 1),
  title,
  file: `${String(i + 1).padStart(2, "0")} ${title}.opus`,
}));

export const COVER_FILE = "cover.jpg";

/** The details pane's values, in the order of the labels in copy.ts. */
export const DETAILS = [TRACKS[SELECTED].title, ARTIST, ALBUM.title, ALBUM.year, ALBUM.genre];
