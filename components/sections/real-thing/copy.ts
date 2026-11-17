import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The real thing / En vrai. */

type Shot = {
  /** Matches the file name in public/shots/<locale>/<theme>/. */
  id: "album" | "genres" | "metadata" | "inspector" | "upkeep";
  label: string;
  title: string;
  caption: string;
  /** What the capture shows; the title is a caption, not a description. */
  alt: string;
};

export type RealThingCopy = {
  kicker: string;
  heading: string;
  previous: string;
  next: string;
  theme: { group: string; light: string; dark: string };
  shots: Shot[];
};

export const realThingCopy: Record<Locale, RealThingCopy> = {
  en: {
    kicker: "THE APP",
    heading: "Here's Sonarche, screen by screen.",
    previous: "Previous screenshot",
    next: "Next screenshot",
    theme: { group: "Screenshot theme", light: "Light", dark: "Dark" },
    shots: [
      {
        id: "album",
        label: "Album",
        title: "An album, whole",
        caption:
          "Fourteen tracks, fourteen complete tag sets, the right cover, and it plays from the very same window.",
        alt: "Sonarche's Album view: the tracklist, the cover and the player.",
      },
      {
        id: "genres",
        label: "Genres",
        title: "Genres as a tree",
        caption:
          "Metal holds Metalcore, Heavy Metal, Progressive Metal, Power Metal, and knows it accounts for 32% of the shelf.",
        alt: "The Genres view: a tree of genres and subgenres, with each one's share of the library.",
      },
      {
        id: "metadata",
        label: "Metadata",
        title: "Nothing written behind your back",
        caption:
          "Rename one artist and Sonarche asks which of the other thirteen tracks should follow. You decide before anything touches a file.",
        alt: "The metadata editor asking which tracks should follow an artist rename.",
      },
      {
        id: "inspector",
        label: "Inspector",
        title: "Seven fields out of seven",
        caption: "The inspector slides in over the list, so you can fix one track without ever losing your place.",
        alt: "The track inspector open over the list, all seven tag fields filled in.",
      },
      {
        id: "upkeep",
        label: "Upkeep",
        title: "It keeps its own to-do list",
        caption:
          "Missing years, genres off the tree, tracklists with holes: twenty things to correct, gathered in one screen.",
        alt: "The Upkeep screen listing missing years, off-tree genres and incomplete tracklists.",
      },
    ],
  },
  fr: {
    kicker: "L'APPLICATION",
    heading: "Voici Sonarche, écran par écran.",
    previous: "Capture précédente",
    next: "Capture suivante",
    theme: { group: "Thème des captures", light: "Clair", dark: "Sombre" },
    shots: [
      {
        id: "album",
        label: "Album",
        title: "Un album, entier",
        caption:
          "Quatorze morceaux, quatorze jeux de tags complets, la bonne pochette, et ça joue depuis la même fenêtre.",
        alt: "Vue Album de Sonarche : la liste des morceaux, la pochette et le lecteur.",
      },
      {
        id: "genres",
        label: "Genres",
        title: "Les genres en arbre",
        caption:
          "Metal contient Metalcore, Heavy Metal, Progressive Metal, Power Metal, et sait qu'il représente 32 % de l'étagère.",
        alt: "Vue Genres : l'arbre des genres et sous-genres, avec la part de chacun dans la bibliothèque.",
      },
      {
        id: "metadata",
        label: "Métadonnées",
        title: "Rien n'est écrit dans ton dos",
        caption:
          "Renomme un artiste et Sonarche demande lequel des treize autres morceaux doit suivre. Tu tranches avant que quoi que ce soit ne touche un fichier.",
        alt: "L'éditeur de métadonnées qui demande quels morceaux doivent suivre le changement d'artiste.",
      },
      {
        id: "inspector",
        label: "Inspecteur",
        title: "Sept champs sur sept",
        caption: "L'inspecteur se glisse par-dessus la liste, pour corriger un morceau sans jamais perdre ta place.",
        alt: "L'inspecteur de piste ouvert par-dessus la liste, ses sept champs de tags remplis.",
      },
      {
        id: "upkeep",
        label: "Entretien",
        title: "Il tient sa propre liste de corrections",
        caption:
          "Années manquantes, genres hors arbre, tracklists à trous : vingt choses à corriger, réunies sur un écran.",
        alt: "L'écran Entretien qui liste les années manquantes, les genres hors arbre et les albums incomplets.",
      },
    ],
  },
};
