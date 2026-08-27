import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The hold is yours / La cale est à toi. */

export type Destination = {
  where: string;
  note: string;
};

export type HoldCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  /** Split around the folder path, which is set in mono. */
  bodyBefore: string;
  bodyPath: string;
  bodyAfter: string;
  /** The one row of the tree that is not the same word in both languages. */
  otherApp: string;
  note: string;
  destinations: Destination[];
  closer: string;
};

export const holdCopy: Record<Locale, HoldCopy> = {
  en: {
    kicker: "THE HOLD IS YOURS",
    headingBefore: "Nothing here is locked.",
    headingEmphasis: "It's only files.",
    bodyBefore: "Everything lands in",
    bodyPath: "Music/Sonarche/",
    bodyAfter:
      ", right beside the folder your current app already uses. The names live in the files themselves, in the same tag standards every player has read for twenty years. Sonarche organises your music and hands it straight back; it never holds it hostage.",
    otherApp: "YourOtherMusicApp",
    note: "Drag the folder anywhere and it still works.",
    destinations: [
      { where: "A phone", note: "plug it in, drop the folder, done" },
      { where: "A hard drive", note: "your backup is a copy-paste" },
      { where: "Another player", note: "the tags are standard, so it reads them" },
      { where: "Another machine", note: "no account, no re-import, no sync service" },
    ],
    closer: "If you decide you don't like Sonarche, your library leaves with you, fully tagged.",
  },
  fr: {
    kicker: "TON NAVIRE, TON ÉQUIPAGE",
    headingBefore: "Rien n'est verrouillé ici.",
    headingEmphasis: "Ce ne sont que des fichiers.",
    bodyBefore: "Tout atterrit dans",
    bodyPath: "Music/Sonarche/",
    bodyAfter:
      ", juste à côté du dossier que ton app actuelle utilise déjà. Les noms vivent dans les fichiers eux-mêmes, dans les standards de tags que tous les lecteurs lisent depuis vingt ans. Sonarche range ta musique et te la rend aussitôt ; il ne la prend jamais en otage.",
    otherApp: "TonAutreAppMusique",
    note: "Déplace le dossier où tu veux : tout marche encore.",
    destinations: [
      { where: "Un téléphone", note: "branche-le, dépose le dossier, terminé" },
      { where: "Un disque dur", note: "ta sauvegarde est un copier-coller" },
      { where: "Un autre lecteur", note: "les tags sont standard : il les lit" },
      { where: "Une autre machine", note: "aucun compte, aucun ré-import ni synchronisation" },
    ],
    closer: "Et si Sonarche ne te plaît plus, ta bibliothèque part avec toi, taguée jusqu'au dernier morceau.",
  },
};
