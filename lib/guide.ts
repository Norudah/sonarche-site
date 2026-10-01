import { pageMetadata } from "@/lib/metadata";
import { byLocale, type Locale } from "@/lib/site";

/*
 * Kept apart from lib/blog.ts on purpose: a guide is undated and filed by topic, and it carries
 * the app version it was checked against instead of a publication date.
 */

export const GUIDE_PATH: Record<Locale, string> = {
  fr: "/guide/",
  en: "/en/guide/",
};

/** The index groups by topic, in this order. */
export const TOPICS = ["start", "library", "listen", "settings"] as const;

export type Topic = (typeof TOPICS)[number];

export type Guide = {
  /** The folder its component lives in, never a URL. */
  id: string;
  slug: Record<Locale, string>;
  topic: Topic;
  /** The app version this guide was last checked against. */
  appVersion: string;
  /** Last real revision; drives the sitemap. */
  updated: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  /** Counted by hand at ~200 words a minute. */
  minutes: number;
  /** Built and reachable at its URL, but noindex and off the index outside `next dev`. */
  draft?: boolean;
};

/** Ordered inside each topic by what someone would read first. */
const GUIDES: Guide[] = [
  {
    id: "getting-started",
    slug: {
      fr: "premiere-mise-en-route",
      en: "getting-started",
    },
    topic: "start",
    appVersion: "2.0.0",
    updated: "2026-08-12",
    title: {
      fr: "Première mise en route",
      en: "Getting started",
    },
    description: {
      fr: "De l'installation à la première bibliothèque : l'avertissement du système, le walkthrough de premier lancement, la clé AcoustID et ce qu'elle change.",
      en: "From install to a first library: the system warning, the first-run walkthrough, the AcoustID key and what it changes.",
    },
    minutes: 5,
  },
  {
    id: "interface-tour",
    slug: {
      fr: "visite-de-l-interface",
      en: "interface-tour",
    },
    topic: "start",
    appVersion: "2.0.0",
    updated: "2026-08-12",
    title: {
      fr: "Visite de l'interface",
      en: "A tour of the interface",
    },
    description: {
      fr: "Les quatre zones de la fenêtre, la bascule Écoute / Inspection, le code couleur, et ce que chaque étagère de l'Arche range exactement.",
      en: "The window's four fixed zones, the Listening / Inspecting switch, the color code, and what each shelf of the Arche actually holds.",
    },
    minutes: 10,
  },
  {
    id: "edit-track",
    slug: {
      fr: "modifier-un-morceau",
      en: "editing-a-track",
    },
    topic: "library",
    appVersion: "2.0.0",
    updated: "2026-08-12",
    title: {
      fr: "Modifier les métadonnées d'un morceau",
      en: "Editing a track's metadata",
    },
    description: {
      fr: "Le tiroir Piste de haut en bas : les sept champs comptés, Artiste contre Artiste de l'album, l'autocomplétion, le re-match, et ce que l'enregistrement écrit vraiment dans le fichier.",
      en: "The Track drawer top to bottom: the seven counted fields, Artist versus Album artist, autocompletion, re-match, and what saving actually writes into the file.",
    },
    minutes: 9,
  },
  {
    id: "edit-album",
    slug: {
      fr: "modifier-un-album",
      en: "editing-an-album",
    },
    topic: "library",
    appVersion: "2.0.0",
    updated: "2026-08-12",
    title: {
      fr: "Modifier un album entier",
      en: "Editing a whole album",
    },
    description: {
      fr: "La modale Album · métadonnées : l'anneau de complétion, Album ou Collection, les champs mixtes qui n'écrasent rien, les propositions à trancher et le remplacement de pochette.",
      en: "The Album · metadata modal: the completion ring, Album versus Collection, mixed fields that never flatten anything, the suggestions to answer, and replacing the cover.",
    },
    minutes: 11,
  },
];

export const publishedGuides = () => GUIDES.filter((guide) => !guide.draft || process.env.NODE_ENV !== "production");

export const guidePath = (guide: Guide, locale: Locale) => `${GUIDE_PATH[locale]}${guide.slug[locale]}/`;

export const guidePaths = (guide: Guide) => byLocale((locale) => guidePath(guide, locale));

/** Throws so a route pointing at a missing id fails the build. */
export function guideById(id: string): Guide {
  const guide = GUIDES.find((entry) => entry.id === id);
  if (!guide) throw new Error(`Unknown guide id: ${id}. Add it to GUIDES in lib/guide.ts.`);
  return guide;
}

export const guideMetadata = (guide: Guide, locale: Locale) =>
  pageMetadata({
    locale,
    paths: guidePaths(guide),
    title: guide.title[locale],
    shareTitle: guide.title[locale],
    description: guide.description[locale],
    robots: guide.draft ? { index: false, follow: false } : undefined,
    article: { modifiedTime: guide.updated },
  });
