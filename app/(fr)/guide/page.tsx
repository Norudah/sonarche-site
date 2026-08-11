import type { Metadata } from "next";

import { GuideIndex } from "@/components/guide/GuideIndex";
import { guideCopy } from "@/components/guide/copy";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { OG_LOCALE, ogImage } from "@/lib/site";

const copy = guideCopy.fr;

const GUIDE_ALTERNATES = {
  fr: GUIDE_PATH.fr,
  en: GUIDE_PATH.en,
  "x-default": GUIDE_PATH.fr,
};

export const metadata: Metadata = {
  title: { absolute: copy.indexSearchTitle },
  description: copy.indexDek,
  // An index of nothing has nothing to offer a search engine, and being indexed
  // empty is how a section gets remembered as empty. It opts in with its first
  // published guide.
  robots: publishedGuides().length === 0 ? { index: false, follow: true } : undefined,
  alternates: {
    canonical: GUIDE_PATH.fr,
    languages: GUIDE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.fr,
    url: GUIDE_PATH.fr,
    siteName: "Sonarche",
    title: copy.indexTitle,
    description: copy.indexDek,
    images: [ogImage("fr")],
  },
};

export default function FrGuideIndex() {
  return <GuideIndex locale="fr" />;
}
