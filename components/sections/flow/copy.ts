import type { Locale } from "@/lib/site";

/*
 * Verbatim from docs/copy/en.md and fr.md § The flow / La traversée.
 *
 * The per-step chips the decks list ("single track", "yt-dlp", …) are not here:
 * they belong to the mockup's `stage` variant of this section, and the build
 * follows `cascade` (see docs/designs/README.md). Adding them would be inventing
 * a layout the design does not have.
 */

export type FlowStep = {
  /** "01"–"04". The label around it is built from `stepLabel`. */
  number: string;
  title: string;
  text: string;
  /** The italic aside — the reassurance, always one line. */
  note: string;
};

export type FlowCopy = {
  kicker: string;
  /** The heading is split so the middle fragment can take the italic serif. */
  headingBefore: string;
  headingEmphasis: string;
  headingAfter: string;
  sub: string;
  /** "STEP" / "ÉTAPE" — prefixed to each step's number. */
  stepLabel: string;
  steps: FlowStep[];
};

export const flowCopy: Record<Locale, FlowCopy> = {
  en: {
    kicker: "THE FLOW",
    headingBefore: "A link goes in.",
    headingEmphasis: "A library",
    headingAfter: "comes out.",
    sub: "Four moves, one uninterrupted pipeline — and nothing to click after the first paste.",
    stepLabel: "STEP",
    steps: [
      {
        number: "01",
        title: "Paste a link",
        text: "A track, an album, a whole playlist. Drop it in the composer and the voyage lines up — one row per track, before anything is brought in.",
        note: "Already in the hold? It's skipped, silently.",
      },
      {
        number: "02",
        title: "Watch it come aboard",
        text: "Circles turn green one by one as the native audio is hauled in — untouched, never re-encoded — and lands in the hold.",
        note: "Close the window mid-haul — the queue picks up where it stopped.",
      },
      {
        number: "03",
        title: "Fingerprint & identify",
        text: "ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint. AcoustID answers with exactly which recording this is — no title-guessing involved.",
        note: "No confident match? It says so and asks — instead of inventing an artist.",
      },
      {
        number: "04",
        title: "It gets its name",
        text: "Title, artist, album, genre, track, year — and the real cover. All of it written into the file's own tags, and into the folder it now lives in.",
        note: "Into the files themselves — not into a database only Sonarche can read.",
      },
    ],
  },
  fr: {
    kicker: "LA TRAVERSÉE",
    headingBefore: "Un lien entre.",
    headingEmphasis: "Une bibliothèque",
    headingAfter: "en sort.",
    sub: "Quatre gestes, une chaîne d'un seul tenant — et plus un clic après le premier.",
    stepLabel: "ÉTAPE",
    steps: [
      {
        number: "01",
        title: "Colle un lien",
        text: "Un titre, un album, une playlist entière. Dépose-le dans le composeur et le voyage s'organise — une ligne par morceau, avant que rien ne soit embarqué.",
        note: "Déjà dans la cale ? Il passe son tour, sans un mot.",
      },
      {
        number: "02",
        title: "Regarde la cargaison monter à bord",
        text: "Les pastilles passent au vert une à une pendant que l'audio natif est hissé à bord — intact, jamais ré-encodé — et rejoint la cale.",
        note: "Ferme la fenêtre en pleine manœuvre : la file reprendra exactement où elle s'est arrêtée.",
      },
      {
        number: "03",
        title: "Empreinte et identification",
        text: "ffmpeg et Chromaprint distillent l'audio lui-même en une empreinte acoustique. AcoustID répond : c'est cet enregistrement-là, exactement — sans jamais deviner d'après le titre.",
        note: "Pas de correspondance sûre ? L'app le dit et te demande — plutôt que d'inventer un artiste.",
      },
      {
        number: "04",
        title: "Il reçoit son nom",
        text: "Titre, artiste, album, genre, piste, année — et la vraie pochette. Tout est écrit dans les tags du fichier lui-même, et jusque dans le dossier qui l'abrite désormais.",
        note: "Dans les fichiers eux-mêmes — pas dans une base que seul Sonarche saurait lire.",
      },
    ],
  },
};
