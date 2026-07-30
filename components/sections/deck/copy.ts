import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The deck / Le pont. */

export type DeckCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  bullets: string[];
  widget: {
    title: string;
    /** Field label / value. `Genre` is the one picked out in indigo. */
    fields: { label: string; value: string; highlighted?: boolean }[];
    rematch: string;
    edit: string;
  };
};

export const deckCopy: Record<Locale, DeckCopy> = {
  en: {
    kicker: "THE DECK",
    headingBefore: "Your library,",
    headingEmphasis: "your rules.",
    body: "Albums, artists, genre families — organized by verified metadata, browsable like a real collection. Every single field stays editable, and one click re-runs the fingerprint if a match was wrong.",
    bullets: [
      "Change once — written to every file.",
      "Completeness at a glance: 7/7 fields, 100% badges.",
      "Genres form families — Metal, Electronic, Jazz — each with its own tone.",
    ],
    widget: {
      // The v7 mockup left this widget's labels in French; these are the EN
      // equivalents, recorded in docs/copy/en.md § The deck for review.
      title: "Metadata — Oath",
      fields: [
        { label: "Title", value: "Oath" },
        { label: "Artist", value: "The Algorithm" },
        { label: "Year", value: "2021" },
        { label: "Genre", value: "Progressive Metal", highlighted: true },
        { label: "Genre family", value: "Metal · derived" },
      ],
      rematch: "✦ Re-match",
      edit: "Edit",
    },
  },
  fr: {
    kicker: "LE PONT",
    headingBefore: "Ta bibliothèque,",
    headingEmphasis: "tes règles.",
    body: "Albums, artistes, familles de genres — organisés par des métadonnées vérifiées, et qui se parcourent comme une vraie collection. Chaque champ reste modifiable, et un clic relance l'empreinte si une correspondance est fausse.",
    bullets: [
      "Modifie une fois — écrit dans tous les fichiers.",
      "La complétude d'un coup d'œil : 7 champs sur 7, badges 100 %.",
      "Les genres forment des familles — Metal, Électro, Jazz — chacune avec sa teinte.",
    ],
    widget: {
      title: "Métadonnées — Oath",
      fields: [
        { label: "Titre", value: "Oath" },
        { label: "Artiste", value: "The Algorithm" },
        { label: "Année", value: "2021" },
        { label: "Genre", value: "Progressive Metal", highlighted: true },
        { label: "Genre parent", value: "Metal · dérivé" },
      ],
      rematch: "✦ Re-matcher",
      edit: "Modifier",
    },
  },
};
