import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Under the deck / Sous le pont. */

export type TechCard = {
  tag: string;
  title: string;
  text: string;
};

/** A node of the architecture diagram. Geometry lives in the component. */
export type DiagramNode = {
  id: "stream" | "ytdlp" | "ffmpeg" | "beets" | "musicbrainz" | "acoustid" | "folder";
  title: string;
  text: string;
  /** The italic aside under `beets`, and the badge under `the stream`. */
  aside?: string;
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
};

export const underDeckCopy: Record<Locale, UnderDeckCopy> = {
  en: {
    kicker: "UNDER THE DECK",
    headingBefore: "No magic.",
    headingEmphasis: "Proven tools",
    headingAfter: ", conducted well.",
    body: "You don't have to care about any of this — but here it is, in plain words, because you deserve to know what's running on your machine.",
    cards: [
      {
        tag: "THE SHELL",
        title: "Tauri, not a browser tab",
        text: "The interface is built with modern web tooling, so it can be genuinely nice to look at and to use — but it ships as a real desktop app, a few megabytes, not a bundled browser eating your RAM.",
      },
      {
        tag: "THE ENGINE",
        title: "Rust underneath",
        text: "Everything heavy — fetching, file writes, audio playback — runs in Rust. That's the difference between a player that stutters and one that just starts.",
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
        text: "A URL out there — a track, an album, a playlist.",
        aside: "the open web",
      },
      { id: "ytdlp", title: "yt-dlp", text: "Hauls the native audio in — no re-encode, ever." },
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
        id: "musicbrainz",
        title: "MusicBrainz",
        text: "The open encyclopedia of recorded music — titles, albums, years.",
      },
      {
        id: "acoustid",
        title: "AcoustID",
        text: "Matches the fingerprint to the exact recording.",
      },
      {
        id: "folder",
        title: "📁 /sonarche",
        text: "After all that — it's just a folder of music. Yours. Open it, move it, back it up.",
      },
    ],
  },
  fr: {
    kicker: "SOUS LE PONT",
    headingBefore: "Pas de magie.",
    headingEmphasis: "Des outils éprouvés",
    headingAfter: ", bien orchestrés.",
    body: "Tu n'es pas obligé de t'y intéresser — mais tout est là, en mots simples, parce que tu mérites de savoir ce qui tourne sur ta machine.",
    cards: [
      {
        tag: "LA COQUE",
        title: "Tauri, pas un onglet de navigateur",
        text: "L'interface est construite avec des outils web modernes, pour être vraiment agréable à regarder et à utiliser — mais elle est livrée comme une vraie app de bureau, quelques mégaoctets, pas un navigateur embarqué qui dévore ta RAM.",
      },
      {
        tag: "LE MOTEUR",
        title: "Du Rust en dessous",
        text: "Tout ce qui est lourd — la récupération, l'écriture des fichiers, la lecture audio — tourne en Rust. C'est la différence entre un lecteur qui hoquette et un lecteur qui démarre.",
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
        title: "Le flux",
        text: "Une URL quelque part — un titre, un album, une playlist.",
        aside: "le web ouvert",
      },
      { id: "ytdlp", title: "yt-dlp", text: "Hisse l'audio natif à bord — jamais de ré-encodage." },
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
        id: "musicbrainz",
        title: "MusicBrainz",
        text: "L'encyclopédie ouverte de la musique enregistrée — titres, albums, années.",
      },
      {
        id: "acoustid",
        title: "AcoustID",
        text: "Relie l'empreinte à l'enregistrement exact.",
      },
      {
        id: "folder",
        title: "📁 /sonarche",
        text: "Après tout ça, ce n'est qu'un dossier de musique. Le tien. Ouvre-le, déplace-le, sauvegarde-le.",
      },
    ],
  },
};
