import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { StructuredData } from "@/components/layout/StructuredData";
import { BRAND_TITLE, LANGUAGE_ALTERNATES, LOCALE_PATH, OG_IMAGE, OG_LOCALE, SEARCH_TITLE, SITE_URL } from "@/lib/site";

/*
 * The description is the hero's subline, verbatim from docs/copy/fr.md, and
 * nothing appended: at 147 characters it fits inside the ~155 a result snippet
 * shows, and the "Gratuit et open source" that used to close it pushed the whole
 * thing to 181 — the part Google cut off.
 */
const DESCRIPTION =
  "Une bibliothèque musicale qui t'appartient vraiment — chaque morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un moteur natif.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // See lib/site.ts: the search title says what this is, the brand title carries
  // the tagline. They are different jobs and this is the only page that has both.
  title: SEARCH_TITLE.fr,
  description: DESCRIPTION,
  alternates: {
    canonical: LOCALE_PATH.fr,
    languages: LANGUAGE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.fr,
    url: LOCALE_PATH.fr,
    siteName: "Sonarche",
    title: BRAND_TITLE,
    description: DESCRIPTION,
    images: [
      {
        ...OG_IMAGE,
        alt: "Sonarche : l'arche flottant sur une mer dessinée en barres d'égaliseur, sous le mot SONARCHE et la devise « From the stream into the Ark. »",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

/**
 * The paper the page is printed on, so mobile browser chrome tints to match
 * rather than leaving a white band above the hero.
 *
 * Hex and not the `oklch(0.982 0.006 279)` it is elsewhere: `theme-color` is
 * read by the OS shell, not by the css engine, and the ones that do not know
 * oklch drop the tag rather than approximate it. Same colour, 8 bits down.
 */
export const viewport: Viewport = {
  themeColor: "#f8f9fd",
};

export default function FrLayout({ children }: { children: ReactNode }) {
  return (
    <Document lang="fr">
      <StructuredData locale="fr" description={DESCRIPTION} />
      {children}
    </Document>
  );
}
