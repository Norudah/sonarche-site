import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § No expertise needed / Zéro expertise requise. */

export type NoExpertiseCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  headingAfter: string;
  bodies: [string, string];
  guides: string[];
  widget: {
    title: string;
    /** The genre it had, and the one you insist on. */
    from: string;
    to: string;
    explainerLabel: string;
    /** Split so the family name can be set in bold inside the sentence. */
    explainerBefore: string;
    explainerFamily: string;
    explainerAfter: string;
    familyLabel: string;
    familyValue: string;
    derived: string;
  };
};

export const noExpertiseCopy: Record<Locale, NoExpertiseCopy> = {
  en: {
    kicker: "NO EXPERTISE NEEDED",
    headingBefore: "You don't need to know what",
    headingEmphasis: "a tag",
    // Carries its own leading space: French closes straight onto the emphasis
    // with a full stop, English needs a word after it.
    headingAfter: " is.",
    bodies: [
      "Everything that can be automated already is — you get a tidy library without ever opening a metadata editor. What's left, the app explains in plain words instead of empty fields.",
      "And when it disagrees with you, you win. Convinced your favourite record is Thrash, not Heavy Metal? Change it. One click, no friction — and Sonarche tells you exactly what it wrote, into which files, in words you don't need a wiki for.",
    ],
    guides: [
      "Sensible defaults on import — most albums need nothing from you at all.",
      "Anything uncertain is flagged in plain language, with the choice spelled out.",
      "Every edit tells you which files it touched, before and after.",
    ],
    widget: {
      title: "Genre — Ride the Lightning",
      from: "Heavy Metal",
      to: "Thrash Metal",
      explainerLabel: "What just happened",
      explainerBefore: "Thrash Metal sits under the",
      explainerFamily: "Metal",
      explainerAfter:
        "family, so the album stays where it is in your library. The new genre is written into all 8 files' tags — nothing else changes.",
      familyLabel: "Genre family",
      familyValue: "Metal",
      derived: "↳ derived",
    },
  },
  fr: {
    kicker: "ZÉRO EXPERTISE REQUISE",
    headingBefore: "Tu n'as pas besoin de savoir ce qu'est",
    headingEmphasis: "un tag",
    headingAfter: ".",
    bodies: [
      "Tout ce qui peut être automatisé l'est déjà : une bibliothèque impeccable sans jamais ouvrir un éditeur de métadonnées. Et ce qui reste, l'app l'explique en mots simples plutôt qu'en champs vides.",
      "Et quand elle n'est pas d'accord avec toi, c'est toi qui gagnes. Convaincu que ton disque préféré est du thrash, pas du heavy metal ? Change-le. Un clic, zéro friction — et Sonarche te dit exactement ce qu'il a écrit, dans quels fichiers, avec des mots qui se passent de wiki.",
    ],
    guides: [
      "Des réglages sensés à l'import — la plupart des albums n'attendent rien de toi.",
      "Tout ce qui est incertain est signalé en langage clair, avec le choix énoncé.",
      "Chaque modification te dit quels fichiers elle a touchés, avant et après.",
    ],
    widget: {
      title: "Genre — Ride the Lightning",
      from: "Heavy Metal",
      to: "Thrash Metal",
      explainerLabel: "Ce qui vient de se passer",
      explainerBefore: "Thrash Metal appartient à la famille",
      explainerFamily: "Metal",
      explainerAfter:
        ": l'album ne bouge pas de ta bibliothèque. Le nouveau genre est écrit dans les tags des 8 fichiers — rien d'autre ne change.",
      familyLabel: "Famille de genre",
      familyValue: "Metal",
      derived: "↳ dérivé",
    },
  },
};
