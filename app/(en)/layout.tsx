import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { StructuredData } from "@/components/layout/StructuredData";
import { BRAND_TITLE, LANGUAGE_ALTERNATES, LOCALE_PATH, OG_LOCALE, SEARCH_TITLE, SITE_URL } from "@/lib/site";

/* The hero's subline, verbatim from docs/copy/en.md, plus the four words that
   still fit inside a snippet. See the FR layout for why the length matters. */
const DESCRIPTION =
  "A music library that's truly yours — every track identified by its own audio, named in plain files, played on a native engine. Free and open source.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEARCH_TITLE.en,
  description: DESCRIPTION,
  alternates: {
    canonical: LOCALE_PATH.en,
    languages: LANGUAGE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.en,
    url: LOCALE_PATH.en,
    siteName: "Sonarche",
    title: BRAND_TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: BRAND_TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#f8f9fd",
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <Document lang="en">
      <StructuredData locale="en" description={DESCRIPTION} />
      {children}
    </Document>
  );
}
