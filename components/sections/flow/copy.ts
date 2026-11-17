import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The flow. The decks' per-step chips belong to the
   mockup's `stage` variant; the build follows `cascade`. */

export type FlowStep = {
  number: string;
  title: string;
  text: string[];
  note: string;
};

/** The six tags step 04 files into the track, in drawing order. */
export type SceneTags = readonly [string, string, string, string, string, string];

export type FlowCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  headingAfter: string;
  sub: string;
  stepLabel: string;
  steps: FlowStep[];
  sceneTags: SceneTags;
};

export const flowCopy: Record<Locale, FlowCopy> = {
  en: {
    kicker: "HOW IT WORKS",
    headingBefore: "A link goes in.",
    headingEmphasis: "A perfectly tagged track",
    headingAfter: "comes out.",
    sub: "Sonarche downloads, identifies, tags and files every track: you have almost nothing to do but watch it work.",
    stepLabel: "STEP",
    sceneTags: ["Title", "Artist", "Album", "Genre", "Track", "Year"],
    steps: [
      {
        number: "01",
        title: "Paste a link",
        text: [
          "A track, an album, a whole playlist. Drop the link in the composer: Sonarche downloads it all, one row per track.",
        ],
        note: "Already in the hold? It's skipped, silently.",
      },
      {
        number: "02",
        title: "Watch it download",
        text: ["Circles turn green one by one as each track arrives in its original audio quality, never re-encoded."],
        note: "Close the window mid-haul: the queue picks up where it stopped.",
      },
      {
        number: "03",
        title: "Fingerprint & identify",
        text: [
          "ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint. AcoustID answers with exactly which recording this is, with no title-guessing involved.",
        ],
        note: "No confident match? It says so and asks, instead of inventing an artist.",
      },
      {
        number: "04",
        title: "Tags, cover and a tidy folder",
        text: [
          "Title, artist, album, genre, track, year, and the real cover: all of it is written into the file's own tags, and the file is renamed and filed in its album's folder.",
        ],
        note: "Into the files themselves, not into a database only Sonarche can read.",
      },
    ],
  },
  fr: {
    kicker: "COMMENT ÇA MARCHE",
    headingBefore: "Un lien entre.",
    headingEmphasis: "Un morceau parfaitement tagué",
    headingAfter: "en sort.",
    sub: "Sonarche télécharge, identifie, tague et range chaque morceau : tu n'as presque rien à faire à part le regarder travailler.",
    stepLabel: "ÉTAPE",
    sceneTags: ["Titre", "Artiste", "Album", "Genre", "Piste", "Année"],
    steps: [
      {
        number: "01",
        title: "Colle un lien",
        text: [
          "Un titre, un album, une playlist entière. Colle le lien dans l'application : Sonarche télécharge tout, morceau par morceau.",
        ],
        note: "Déjà dans la cale ? Il passe son tour. Pas de duplication.",
      },
      {
        number: "02",
        title: "Regarde-le télécharger",
        text: [
          "Les pastilles passent au vert une à une : chaque morceau arrive dans sa qualité audio d'origine, sans réencodage.",
        ],
        note: "Si tu fermes la fenêtre pendant l'opération, la suite sera reprise automatiquement au prochain lancement : tu ne perds pas ta progression.",
      },
      {
        number: "03",
        title: "Empreinte et identification",
        text: [
          "ffmpeg et Chromaprint analysent l'audio directement et en extraient une empreinte acoustique. AcoustID et MusicBrainz y reconnaissent l'enregistrement exact, sans jamais deviner à partir du titre.",
        ],
        note: "Pas de correspondance sûre ? Sonarche t'informe et te laisse trancher plutôt que d'inventer.",
      },
      {
        number: "04",
        title: "Tags, pochette et dossier rangé",
        text: [
          "Titre, artiste, album, genre, piste, année, et la vraie pochette : tout est écrit dans les tags du fichier, qui est renommé et rangé dans le dossier de son album.",
        ],
        note: "Dans les fichiers eux-mêmes, pas dans une base que seul Sonarche saurait lire.",
      },
    ],
  },
};
