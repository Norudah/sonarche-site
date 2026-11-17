import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The hold is yours / La cale est à toi. */

type Destination = {
  where: string;
  note: string;
};

/** The file manager's own labels, per OS, in the visitor's language. File names are what is on disk. */
type SystemUi = {
  windows: {
    path: string[];
    nav: string[];
    music: string;
    thisPc: string;
    usb: string;
    columns: [string, string, string, string];
    details: string[];
    status: [string, string];
    toolbar: [string, string, string, string];
    search: string;
  };
  macos: {
    favourites: string;
    places: string;
    nav: string[];
    music: string;
    usb: string;
    details: string[];
    search: string;
  };
};

export type HoldCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  /** Split around the folder path, set in mono. */
  bodyBefore: string;
  bodyPath: string;
  bodyAfter: string;
  otherApp: string;
  note: string;
  ui: SystemUi;
  destinations: Destination[];
  closer: string;
};

export const holdCopy: Record<Locale, HoldCopy> = {
  en: {
    kicker: "YOUR FILES",
    headingBefore: "Nothing here is locked.",
    headingEmphasis: "It's only files.",
    bodyBefore: "Everything lands in",
    bodyPath: "Music/Sonarche/",
    bodyAfter:
      ", filed by artist and album, next to your current app. The tags live inside the files: any player can read them.",
    otherApp: "YourOtherMusicApp",
    note: "Drag the folder anywhere and it still works.",
    ui: {
      windows: {
        path: ["This PC", "Music"],
        nav: ["Home", "Desktop", "Downloads"],
        music: "Music",
        thisPc: "This PC",
        usb: "USB Drive (E:)",
        columns: ["Name", "#", "Title", "Contributing artists"],
        details: ["Title", "Contributing artists", "Album", "Year", "Genre"],
        status: ["11 items", "1 item selected"],
        toolbar: ["New", "Sort", "View", "Details"],
        search: "Search Prequelle",
      },
      macos: {
        favourites: "Favourites",
        places: "Locations",
        nav: ["Recents", "Applications", "Desktop", "Downloads"],
        music: "Music",
        usb: "USB Drive",
        details: ["Title", "Artist", "Album", "Year", "Genre"],
        search: "Search",
      },
    },
    destinations: [
      { where: "A phone", note: "plug it in, drop the folder, done" },
      { where: "A hard drive", note: "your backup is a copy-paste" },
      { where: "Another player", note: "the tags are standard, so it reads them" },
      { where: "Another machine", note: "no account, no re-import, no sync service" },
    ],
    closer: "If you decide you don't like Sonarche, your library leaves with you, fully tagged.",
  },
  fr: {
    kicker: "TES FICHIERS",
    headingBefore: "Rien n'est verrouillé ici.",
    headingEmphasis: "Ce ne sont que des fichiers.",
    bodyBefore: "Tout atterrit dans",
    bodyPath: "Music/Sonarche/",
    bodyAfter:
      ", rangé par artiste et par album, à côté de ton app actuelle. Les tags vivent dans les fichiers eux-mêmes : n'importe quel lecteur les lit.",
    otherApp: "TonAutreAppMusique",
    note: "Déplace le dossier où tu veux : tout marche encore.",
    ui: {
      windows: {
        path: ["Ce PC", "Musique"],
        nav: ["Accueil", "Bureau", "Téléchargements"],
        music: "Musique",
        thisPc: "Ce PC",
        usb: "Clé USB (E:)",
        columns: ["Nom", "#", "Titre", "Artistes ayant participé"],
        details: ["Titre", "Artistes ayant participé", "Album", "Année", "Genre"],
        status: ["11 éléments", "1 élément sélectionné"],
        toolbar: ["Nouveau", "Trier", "Afficher", "Détails"],
        search: "Rechercher dans : Prequelle",
      },
      macos: {
        favourites: "Favoris",
        places: "Emplacements",
        nav: ["Récents", "Applications", "Bureau", "Téléchargements"],
        music: "Musique",
        usb: "Clé USB",
        details: ["Titre", "Artiste", "Album", "Année", "Genre"],
        search: "Rechercher",
      },
    },
    destinations: [
      { where: "Un téléphone", note: "branche-le, dépose le dossier, terminé" },
      { where: "Un disque dur", note: "ta sauvegarde est un copier-coller" },
      { where: "Un autre lecteur", note: "les tags sont standard : il les lit" },
      { where: "Une autre machine", note: "aucun compte, aucun ré-import ni synchronisation" },
    ],
    closer: "Et si Sonarche ne te plaît plus, ta bibliothèque part avec toi, taguée jusqu'au dernier morceau.",
  },
};
