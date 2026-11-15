import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § No expertise needed / Zéro expertise requise. The
   mini-interfaces mirror the app's own labels; album, artist and track names are not translated. */

export type NoExpertiseCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  headingAfter: string;
  lead: string;
  albums: { caption: string; badge: string };
  uncertain: { caption: string; tab: string; fields: [string, string, string]; flag: string };
  editor: {
    kicker: string;
    heading: string;
    eyebrow: string;
    meta: string;
    changes: string;
    complete: string;
    scope: string;
    labels: { album: string; albumArtist: string; year: string; genre: string; category: string };
    family: string;
    menuFamily: string;
    menu: [string, string, string, string];
    categories: [string, string, string, string];
    columns: { number: string; title: string; artist: string; genre: string; tags: string };
    popover: { eyebrow: string; question: string; apply: string; keep: string };
    actions: { rematch: string; cancel: string; save: string };
  };
  help: {
    caption: string;
    albumArtist: string;
    filedUnder: string;
    family: string;
    familyValue: string;
    category: string;
    categories: [string, string, string, string];
    tips: [string, string, string];
  };
  rematch: {
    caption: string;
    before: { title: string; artist: string };
    after: { title: string; artist: string };
    error: string;
    verified: string;
    button: string;
  };
};

export const noExpertiseCopy: Record<Locale, NoExpertiseCopy> = {
  en: {
    kicker: "NO EXPERTISE NEEDED",
    headingBefore: "You don't need to know what",
    headingEmphasis: "a tag",
    // Carries its own leading space; French closes straight onto the emphasis.
    headingAfter: " is.",
    lead: "Everything that can be automated already is. The rest is your call.",
    albums: { caption: "Sensible defaults on import: most albums need nothing from you at all.", badge: "100%" },
    uncertain: {
      caption: "Anything uncertain is flagged in plain language, with the choice spelled out.",
      tab: "Metadata",
      fields: ["Title", "Artist", "Year"],
      flag: "Uncertain",
    },
    editor: {
      kicker: "MAKE IT YOUR OWN",
      heading: "And when it disagrees with you, you win.",
      eyebrow: "ALBUM · METADATA",
      meta: "13 tracks · 2013",
      changes: "14 changes across 13 tracks",
      complete: "All 13 tracks are complete",
      scope: "WHAT APPLIES TO THE WHOLE ALBUM",
      labels: { album: "Album", albumArtist: "Album artist", year: "Year", genre: "Genre", category: "Category" },
      family: "Genre family · Electronic",
      menuFamily: "ELECTRONIC",
      menu: ["House", "French House", "Nu-Disco", "Synthpop"],
      categories: ["Music", "Video games", "Films", "Series"],
      columns: { number: "NO.", title: "TITLE", artist: "ARTIST", genre: "GENRE", tags: "TAGS" },
      popover: {
        eyebrow: "ARTIST · GET LUCKY",
        question:
          "You changed « Daft Punk » to « Daft Punk feat. Pharrell Williams ». Which of the other tracks should follow?",
        apply: "Apply to 12 tracks",
        keep: "Change nothing",
      },
      actions: { rematch: "Re-match", cancel: "Cancel", save: "Save" },
    },
    help: {
      caption: "Little helpers all over the app explain the tricky words.",
      albumArtist: "Album artist",
      filedUnder: "album filed under Daft Punk",
      family: "Genre family · computed, not counted",
      familyValue: "Electronic",
      category: "Category · not counted in completion",
      categories: ["Music", "Video games", "Films", "Anime"],
      tips: [
        "The one who signs the album. A guest on one track doesn't move it.",
        "The broad genre yours belongs to: French House files the album under Electronic.",
        "Music, video games, films… for sorting, without touching completion.",
      ],
    },
    rematch: {
      caption: "One click re-runs the fingerprint if a match was wrong.",
      before: { title: "Track 07", artist: "Unknown artist" },
      after: { title: "Creeping Death", artist: "Metallica · Ride the Lightning" },
      error: "Error",
      verified: "verified",
      button: "Re-match",
    },
  },
  fr: {
    kicker: "ZÉRO EXPERTISE REQUISE",
    headingBefore: "Tu n'as pas besoin de savoir ce qu'est",
    headingEmphasis: "un tag",
    headingAfter: ".",
    lead: "Tout ce qui peut être automatisé l'est déjà. Le reste, c'est toi qui décides.",
    albums: {
      caption: "Des réglages intelligents à l'importation : la plupart des albums n'attendent rien de toi.",
      badge: "100 %",
    },
    uncertain: {
      caption:
        "Tout ce qui est incertain est signalé clairement dans l'onglet Métadonnées : tu as le choix de t'en occuper ou non.",
      tab: "Métadonnées",
      fields: ["Titre", "Artiste", "Année"],
      flag: "Incertain",
    },
    editor: {
      kicker: "CUSTOMISE À TA SAUCE",
      heading: "Quand elle n'est pas d'accord avec toi, c'est toi qui gagnes.",
      eyebrow: "ALBUM · MÉTADONNÉES",
      meta: "13 titres · 2013",
      changes: "14 modifications sur 13 morceaux",
      complete: "Les 13 morceaux sont complets",
      scope: "CE QUI VAUT POUR TOUT L'ALBUM",
      labels: {
        album: "Album",
        albumArtist: "Artiste de l'album",
        year: "Année",
        genre: "Genre",
        category: "Catégorie",
      },
      family: "Famille de genre · Électro",
      menuFamily: "ÉLECTRO",
      menu: ["House", "French House", "Nu-Disco", "Synthpop"],
      categories: ["Musique", "Jeux vidéo", "Films", "Séries"],
      columns: { number: "N°", title: "TITRE", artist: "ARTISTE", genre: "GENRE", tags: "TAGS" },
      popover: {
        eyebrow: "ARTISTE · GET LUCKY",
        question:
          "Tu as changé « Daft Punk » en « Daft Punk feat. Pharrell Williams ». Lesquels des autres morceaux doivent suivre ?",
        apply: "Appliquer à 12 morceaux",
        keep: "Ne rien changer",
      },
      actions: { rematch: "Re-matcher", cancel: "Annuler", save: "Enregistrer" },
    },
    help: {
      caption: "Des aides disséminées un peu partout t'expliquent les termes compliqués.",
      albumArtist: "Artiste de l'album",
      filedUnder: "album rangé sous Daft Punk",
      family: "Famille de genre · calculée, ne compte pas",
      familyValue: "Électro",
      category: "Catégorie · ne compte pas dans la complétion",
      categories: ["Musique", "Jeux vidéo", "Films", "Anime"],
      tips: [
        "Celui qui signe l'album. Un invité sur un morceau ne le déplace pas.",
        "Le grand genre du tien : French House range l'album sous Électro.",
        "Musique, jeux vidéo, films… pour trier, sans toucher à la complétion.",
      ],
    },
    rematch: {
      caption: "Un clic relance l'empreinte si une correspondance est fausse.",
      before: { title: "Track 07", artist: "Artiste inconnu" },
      after: { title: "Creeping Death", artist: "Metallica · Ride the Lightning" },
      error: "Erreur",
      verified: "vérifié",
      button: "Re-matcher",
    },
  },
};
