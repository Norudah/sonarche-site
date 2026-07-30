import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The real thing / En vrai. */

export type Shot = {
  /** Matches the file name in public/shots/<locale>/. */
  id: "album" | "genres" | "metadata" | "inspector" | "upkeep";
  label: string;
  title: string;
  caption: string;
};

export type RealThingCopy = {
  kicker: string;
  heading: string;
  previous: string;
  next: string;
  shots: Shot[];
};

export const realThingCopy: Record<Locale, RealThingCopy> = {
  en: {
    kicker: "THE REAL THING",
    heading: "This is what the deck looks like.",
    previous: "Previous screenshot",
    next: "Next screenshot",
    shots: [
      {
        id: "album",
        label: "Album",
        title: "An album, whole",
        caption: "Twelve tracks, twelve complete tag sets, the right cover — and it plays from the very same window.",
      },
      {
        id: "genres",
        label: "Genres",
        title: "Genres as a tree",
        caption:
          "Electronic holds Electro House, Dark Wave, Video Game Music — and knows it accounts for 39% of the shelf.",
      },
      {
        id: "metadata",
        label: "Metadata",
        title: "Nothing written behind your back",
        caption:
          "Rename one artist and Sonarche asks which of the other eleven tracks should follow. You decide before anything touches a file.",
      },
      {
        id: "inspector",
        label: "Inspector",
        title: "Seven fields out of seven",
        caption: "The inspector slides in over the list, so you can fix one track without ever losing your place.",
      },
      {
        id: "upkeep",
        label: "Upkeep",
        title: "It keeps its own to-do list",
        caption:
          "Missing years, genres off the tree, tracklists with holes — twenty things to correct, gathered in one screen.",
      },
    ],
  },
  fr: {
    kicker: "EN VRAI",
    heading: "Voici à quoi ressemble le pont.",
    previous: "Capture précédente",
    next: "Capture suivante",
    shots: [
      {
        id: "album",
        label: "Album",
        title: "Un album, entier",
        caption: "Douze morceaux, douze jeux de tags complets, la bonne pochette — et ça joue depuis la même fenêtre.",
      },
      {
        id: "genres",
        label: "Genres",
        title: "Les genres en arbre",
        caption:
          "Electronic contient Electro House, Dark Wave, Video Game Music — et sait qu'il représente 39 % de l'étagère.",
      },
      {
        id: "metadata",
        label: "Métadonnées",
        title: "Rien n'est écrit dans ton dos",
        caption:
          "Renomme un artiste et Sonarche demande lequel des onze autres morceaux doit suivre. Tu tranches avant que quoi que ce soit ne touche un fichier.",
      },
      {
        id: "inspector",
        label: "Inspecteur",
        title: "Sept champs sur sept",
        caption: "L'inspecteur se glisse par-dessus la liste, pour corriger un morceau sans jamais perdre ta place.",
      },
      {
        id: "upkeep",
        label: "Entretien",
        title: "Il tient sa propre liste de corrections",
        caption:
          "Années manquantes, genres hors arbre, tracklists à trous — vingt choses à corriger, réunies sur un écran.",
      },
    ],
  },
};
