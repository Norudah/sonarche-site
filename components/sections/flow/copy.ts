import type { Locale } from "@/lib/site";

/*
 * Verbatim from docs/copy/en.md and fr.md § The flow / La traversée.
 *
 * The per-step chips the decks list ("single track", "yt-dlp", …) are not here:
 * they belong to the mockup's `stage` variant of this section, and the build
 * follows `cascade`. Adding them would be inventing a layout the design does
 * not have.
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
    sub: "Four moves, one uninterrupted pipeline, and nothing to click after the first paste.",
    stepLabel: "STEP",
    steps: [
      {
        number: "01",
        title: "Paste a link",
        text: "A track, an album, a whole playlist. Drop it in the composer and the voyage lines up: one row per track, before anything is brought in.",
        note: "Already in the hold? It's skipped, silently.",
      },
      {
        number: "02",
        title: "Watch it come aboard",
        text: "Circles turn green one by one as the native audio is hauled in and lands in the hold, untouched, never re-encoded.",
        note: "Close the window mid-haul: the queue picks up where it stopped.",
      },
      {
        number: "03",
        title: "Fingerprint & identify",
        text: "ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint. AcoustID answers with exactly which recording this is, with no title-guessing involved.",
        note: "No confident match? It says so and asks, instead of inventing an artist.",
      },
      {
        number: "04",
        title: "It gets its name",
        text: "Title, artist, album, genre, track, year. And the real cover. All of it written into the file's own tags, and into the folder it now lives in.",
        note: "Into the files themselves, not into a database only Sonarche can read.",
      },
    ],
  },
  fr: {
    kicker: "LA TRAVERSÉE",
    headingBefore: "Un lien entre,",
    headingEmphasis: "et une bibliothèque",
    headingAfter: "naît.",
    sub: "Un processus en 4 étapes simples : tu n'as presque rien à faire à part regarder Sonarche travailler pour toi.",
    stepLabel: "ÉTAPE",
    steps: [
      {
        number: "01",
        title: "Colle un lien",
        text: "Un titre, un album, une playlist entière sur internet. Colle le lien dans l'application et le voyage commence.",
        note: "Déjà dans la cale ? Il passe son tour. Pas de duplication.",
      },
      {
        number: "02",
        title: "Regarde la cargaison monter à bord",
        text: "L'interface te montre exactement ce qu'il se passe : la source a-t-elle été récupérée ? Check. Le fichier est-il présent physiquement sur ton ordinateur ? Check. A-t-on pu identifier le morceau correctement ? Check. Les pastilles passent au vert une à une, tu sais exactement où regarder si un problème est détecté.",
        note: "Si tu fermes la fenêtre pendant l'opération, la suite sera reprise automatiquement au prochain lancement : tu ne perds pas ta progression.",
      },
      {
        number: "03",
        title: "Empreinte et identification",
        text: "ffmpeg et Chromaprint analysent l'audio directement, et extraient une empreinte acoustique. Cette empreinte, si elle est identifiée, sert de carte d'identité au morceau associé. Elle peut alors être utilisée auprès d'AcoustID, qui va permettre de certifier avec certitude que le morceau est bien celui-ci, et non deviné par divers tags ou autre.",
        note: "Pas de correspondance sûre ? Sonarche t'informe et te laisse trancher plutôt que d'inventer.",
      },
      {
        number: "04",
        title: "Informations et métadonnées",
        text: "Titre, artiste, album, genre, piste, année. Et la vraie pochette. Tout est écrit dans les tags et les métadonnées du fichier. Pas de nom bizarre ou de convention : la source de vérité est dans les tags, et Sonarche s'en occupe correctement. Et si tu n'es pas satisfait, ou que tu souhaites customiser à ta sauce, Sonarche met à disposition un système accessible pour modifier en quelques clics le genre d'une musique ou d'un artiste, pour que ta bibliothèque corresponde vraiment à tes goûts et à ta propre façon de t'organiser.",
        note: "Dans les fichiers eux-mêmes, pas dans une base que seul Sonarche saurait lire. Sonarche reste libre et open source. Tes fichiers, ta décision. Sonarche complète les fichiers au maximum : libre à toi de rester ou non dans l'écosystème Sonarche.",
      },
    ],
  },
};
