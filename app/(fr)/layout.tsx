import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { SEARCH_TITLE, SITE_URL } from "@/lib/site";

/*
 * The French half of the site: the landing at `/` and the journal under it.
 *
 * Only what every French page shares lives here. The landing's own title,
 * description, canonical and JSON-LD sit in its page.tsx — a layout's metadata
 * is inherited, and a journal post that forgot to override the canonical would
 * quietly declare itself to be the home page.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Never rendered — every page sets its own. It is the safety net a missing
    // export would fall into, so it says what the site is rather than nothing.
    default: SEARCH_TITLE.fr,
    template: "%s — Sonarche",
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
  return <Document lang="fr">{children}</Document>;
}
