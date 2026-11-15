import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The ship's sound / Hissez la grande voile. Player
   labels mirror the app's own; track names are names, not translated. */

export type ShipSoundCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  backdropAlt: string;
  queue: { title: string; count: string; now: string; next: string };
  lyrics: { title: string; synced: string };
  controls: {
    shuffle: string;
    previous: string;
    play: string;
    pause: string;
    next: string;
    repeat: string;
    lyrics: string;
    queue: string;
  };
  traditional: string;
};

export const shipSoundCopy: Record<Locale, ShipSoundCopy> = {
  en: {
    kicker: "THE SHIP'S SOUND",
    headingBefore: "Not just the harbor:",
    headingEmphasis: "the ship's own sound.",
    body: "Sonarche is the player too. A native Rust engine: tracks start on the beat, albums play without a gap, and the lyrics follow the music.",
    backdropAlt: "The app behind the player: the Album view.",
    queue: { title: "Queue", count: "11 tracks", now: "NOW PLAYING", next: "UP NEXT" },
    lyrics: { title: "Lyrics", synced: "SYNCED" },
    controls: {
      shuffle: "Shuffle",
      previous: "Previous",
      play: "Play",
      pause: "Pause",
      next: "Next",
      repeat: "Repeat",
      lyrics: "Lyrics",
      queue: "Queue",
    },
    traditional: "Traditional",
  },
  fr: {
    kicker: "HISSEZ LA GRANDE VOILE",
    headingBefore: "Pas seulement le port :",
    headingEmphasis: "le son du navire lui-même.",
    body: "Sonarche est aussi le lecteur. Un moteur natif en Rust : ça démarre au quart de tour, un album s'enchaîne sans un blanc, et les paroles suivent la musique.",
    backdropAlt: "L'app derrière le lecteur : la vue Album.",
    queue: { title: "File d'attente", count: "11 titres", now: "EN LECTURE", next: "À SUIVRE" },
    lyrics: { title: "Paroles", synced: "SYNCHRONISÉES" },
    controls: {
      shuffle: "Aléatoire",
      previous: "Précédent",
      play: "Lecture",
      pause: "Pause",
      next: "Suivant",
      repeat: "Répéter",
      lyrics: "Paroles",
      queue: "File d'attente",
    },
    traditional: "Traditionnel",
  },
};
