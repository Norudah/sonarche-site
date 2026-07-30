import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The ship's sound / Le son du navire. */

export type ShipSoundCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  /** The player's labels. Track and artist are names, not copy — not translated. */
  track: string;
  artist: string;
  elapsed: string;
  duration: string;
};

export const shipSoundCopy: Record<Locale, ShipSoundCopy> = {
  en: {
    kicker: "THE SHIP'S SOUND",
    headingBefore: "Not just the harbor —",
    headingEmphasis: "the ship's own sound.",
    body: "The last step of the old way was moving files into some other player. Sonarche is the player too — a native Rust audio engine, so tracks start on the beat and gapless albums stay gapless.",
    track: "Oath",
    artist: "The Algorithm",
    elapsed: "1:12",
    duration: "2:54",
  },
  fr: {
    kicker: "LE SON DU NAVIRE",
    headingBefore: "Pas seulement le port —",
    headingEmphasis: "le son du navire lui-même.",
    body: "La dernière étape de l'ancienne méthode, c'était de déplacer les fichiers vers un autre lecteur. Sonarche est aussi le lecteur — un moteur audio natif en Rust : les morceaux partent dans le tempo, et les albums gapless le restent.",
    track: "Oath",
    artist: "The Algorithm",
    elapsed: "1:12",
    duration: "2:54",
  },
};
