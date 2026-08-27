import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Under the deck / Sous le pont. */

export type TechCard = {
  tag: string;
  title: string;
  text: string;
};

/** One outside service, named inside its group card. */
export type DiagramService = {
  name: string;
  text: string;
};

/** A node of the architecture diagram. Geometry lives in the component. */
export type DiagramNode = {
  id: "stream" | "folders" | "ytdlp" | "ffmpeg" | "beets" | "identify" | "dress" | "accompany" | "folder";
  title: string;
  /** Absent on the three service groups, which say it through `services`. */
  text?: string;
  /** The italic aside under `beets`, and the badge under the two entry cards. */
  aside?: string;
  /** The services a group card holds. Six of them, in three cards. */
  services?: DiagramService[];
};

export type UnderDeckCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  headingAfter: string;
  body: string;
  cards: TechCard[];
  sealed: string;
  nodes: DiagramNode[];
  /** The quiet line under the service column. */
  servicesNote: string;
};

export const underDeckCopy: Record<Locale, UnderDeckCopy> = {
  en: {
    kicker: "UNDER THE DECK",
    headingBefore: "No magic.",
    headingEmphasis: "Proven tools",
    headingAfter: ", conducted well.",
    body: "You don't have to care about any of this, but here it is, in plain words, because you deserve to know what's running on your machine.",
    cards: [
      {
        tag: "THE SHELL",
        title: "Tauri, not a browser tab",
        text: "The interface is built with modern web tooling, so it can be genuinely nice to look at and to use, but it ships as a real desktop app, a few megabytes, not a bundled browser eating your RAM.",
      },
      {
        tag: "THE ENGINE",
        title: "Rust underneath",
        text: "Everything heavy runs in Rust: fetching, file writes, audio playback. That's the difference between a player that stutters and one that just starts.",
      },
      {
        tag: "THE TOOLBOX",
        title: "A sealed sidecar",
        text: "beets and its Python tools live inside the app, in their own bundled runtime. Nothing to install, nothing to update, and nothing that can clash with whatever is already on your machine.",
      },
    ],
    sealed: "EMBEDDED PYTHON · SEALED, SHIPPED WITH THE APP",
    nodes: [
      {
        id: "stream",
        title: "The stream",
        text: "A URL out there: a track, an album, a playlist.",
        aside: "the open web",
      },
      {
        id: "folders",
        title: "Your folders",
        text: "What you already have: a home port, not just a loading dock. Copied in, never moved.",
        aside: "no network",
      },
      { id: "ytdlp", title: "yt-dlp", text: "Hauls the native audio in. No re-encode, ever." },
      {
        id: "ffmpeg",
        title: "ffmpeg + Chromaprint",
        text: "Distills each track into an acoustic fingerprint.",
      },
      {
        id: "beets",
        title: "beets",
        aside: "the conductor",
        text: "Directs every call, checks every tag, and files each track into its right place in the library.",
      },
      {
        id: "identify",
        title: "Identify",
        services: [
          { name: "AcoustID", text: "matches the acoustic fingerprint to the exact recording." },
          { name: "MusicBrainz", text: "the open encyclopedia: titles, albums, years." },
        ],
      },
      {
        id: "dress",
        title: "Dress",
        services: [
          { name: "Cover Art Archive", text: "the covers." },
          { name: "Last.fm", text: "the genres." },
        ],
      },
      {
        id: "accompany",
        title: "Accompany",
        services: [
          { name: "LRCLIB", text: "synced lyrics, the ones that follow the music." },
          { name: "lyrics.ovh", text: "backup lyrics, plain text, when LRCLIB has nothing." },
        ],
      },
      {
        id: "folder",
        title: "📁 /sonarche",
        text: "After all that, it's just a folder of music. Yours. Open it, move it, back it up.",
      },
    ],
    servicesNote:
      "These services are queried on demand, never required. You have no account to create and no key to paste: the app introduces itself politely and spaces out its calls.",
  },
  fr: {
    kicker: "SOUS LE PONT",
    headingBefore: "Pas de magie.",
    headingEmphasis: "Des outils éprouvés",
    headingAfter: ", bien orchestrés.",
    body: "Rien ne t'oblige à t'y intéresser, mais tout est là si tu t'y intéresses, parce que tu mérites de savoir ce qui tourne sur ta machine.",
    cards: [
      {
        tag: "LA COQUE",
        title: "Tauri, pas un onglet de navigateur",
        text: "L'interface est construite avec des outils web modernes, pour être vraiment agréable à regarder et à utiliser, mais elle est livrée comme une vraie app de bureau, quelques mégaoctets, pas un navigateur embarqué qui dévore ta RAM.",
      },
      {
        tag: "LE MOTEUR",
        title: "Du Rust en dessous",
        text: "Tout ce qui est lourd tourne en Rust : la récupération, l'écriture des fichiers, la lecture audio. C'est la différence entre un lecteur bugué, lent et un lecteur efficace, rapide, qui ne bronche pas.",
      },
      {
        tag: "LA CAISSE À OUTILS",
        title: "Un sidecar scellé",
        text: "beets et ses outils Python vivent à l'intérieur de l'app, dans leur propre runtime embarqué. Rien à installer, rien à mettre à jour, et rien qui puisse entrer en conflit avec ce qui est déjà sur ta machine.",
      },
    ],
    sealed: "PYTHON EMBARQUÉ · SCELLÉ, LIVRÉ AVEC L'APP",
    nodes: [
      {
        id: "stream",
        title: "Téléchargement",
        text: "Un URL quelque part : un titre, un album, une playlist.",
        aside: "le web ouvert",
      },
      {
        id: "folders",
        title: "Importation",
        text: "Ta bibliothèque actuelle, ce que tu as déjà : copié, jamais déplacé.",
        aside: "hors ligne",
      },
      { id: "ytdlp", title: "yt-dlp", text: "Récupère l'audio original du lien, tel quel : jamais reconverti." },
      {
        id: "ffmpeg",
        title: "ffmpeg + Chromaprint",
        text: "Distille chaque morceau en empreinte acoustique.",
      },
      {
        id: "beets",
        title: "beets",
        aside: "le chef d'orchestre",
        text: "Dirige chaque appel, vérifie chaque tag, et range chaque morceau à sa place dans la bibliothèque.",
      },
      {
        id: "identify",
        title: "Identifier",
        services: [
          { name: "AcoustID", text: "relie l'empreinte acoustique à l'enregistrement exact." },
          { name: "MusicBrainz", text: "l'encyclopédie ouverte : titres, albums, années." },
        ],
      },
      {
        id: "dress",
        title: "Habiller",
        services: [
          { name: "Cover Art Archive", text: "les pochettes." },
          { name: "Last.fm", text: "les genres." },
        ],
      },
      {
        id: "accompany",
        title: "Accompagner",
        services: [
          { name: "LRCLIB", text: "les paroles synchronisées, celles qui suivent la musique." },
          { name: "lyrics.ovh", text: "les paroles en secours, texte brut, quand LRCLIB n'a rien." },
        ],
      },
      {
        id: "folder",
        title: "📁 /sonarche",
        text: "Ton dossier de musique. Le tien. Ouvre-le, déplace-le, sauvegarde-le.",
      },
    ],
    servicesNote:
      "Ces services sont interrogés à la demande, jamais obligatoires. Tu n'as aucun compte à créer, aucune clé à coller : l'app s'annonce poliment et espace ses appels.",
  },
};
