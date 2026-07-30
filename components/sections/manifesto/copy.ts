import type { Locale } from "@/lib/site";

/*
 * Verbatim from docs/copy/en.md and fr.md § Why it exists / Pourquoi elle existe.
 *
 * The statement is stored line by line because its shape is the point: four
 * short lines, three of which hand a fragment over to the italic serif. Both
 * decks annotate the emphasis a little more generously than the mockup draws it
 * — the words are identical, the italic runs are the mockup's.
 */

export type StatementLine = {
  before?: string;
  emphasis?: string;
  after?: string;
};

export type ManifestoCopy = {
  kicker: string;
  heading: string;
  statement: StatementLine[];
  chips: string[];
};

export const manifestoCopy: Record<Locale, ManifestoCopy> = {
  en: {
    kicker: "WHY IT EXISTS",
    heading: "Your music should outlive every app.",
    statement: [
      { before: "Give it", emphasis: "true names", after: "," },
      { before: "a home in", emphasis: "plain files", after: "," },
      { before: "and a player worthy of it —" },
      { emphasis: "forever, offline, yours", after: "." },
    ],
    chips: ["plain files", "no cloud", "no account", "no re-encode"],
  },
  fr: {
    kicker: "POURQUOI ELLE EXISTE",
    heading: "Ta musique doit survivre à toutes les apps.",
    statement: [
      { before: "Donne-lui", emphasis: "ses vrais noms", after: "," },
      { before: "un port d'attache en", emphasis: "simples fichiers", after: "," },
      { before: "et un lecteur à sa hauteur —" },
      { emphasis: "pour toujours, hors ligne, à toi", after: "." },
    ],
    chips: ["fichiers simples", "pas de cloud", "aucun compte", "aucun ré-encodage"],
  },
};
