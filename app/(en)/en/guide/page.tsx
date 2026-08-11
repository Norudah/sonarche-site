import type { Metadata } from "next";

import { GuideIndex } from "@/components/guide/GuideIndex";
import { guideCopy } from "@/components/guide/copy";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { OG_LOCALE, ogImage } from "@/lib/site";

const copy = guideCopy.en;

const GUIDE_ALTERNATES = {
  fr: GUIDE_PATH.fr,
  en: GUIDE_PATH.en,
  "x-default": GUIDE_PATH.fr,
};

export const metadata: Metadata = {
  title: { absolute: copy.indexSearchTitle },
  description: copy.indexDek,
  // See the FR index: an empty section opts out of being indexed until it has
  // its first published guide.
  robots: publishedGuides().length === 0 ? { index: false, follow: true } : undefined,
  alternates: {
    canonical: GUIDE_PATH.en,
    languages: GUIDE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.en,
    url: GUIDE_PATH.en,
    siteName: "Sonarche",
    title: copy.indexTitle,
    description: copy.indexDek,
    images: [ogImage("en")],
  },
};

export default function EnGuideIndex() {
  return <GuideIndex locale="en" />;
}
