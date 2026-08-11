import type { Metadata } from "next";

import { BlogIndex } from "@/components/blog/BlogIndex";
import { blogCopy } from "@/components/blog/copy";
import { BLOG_PATH } from "@/lib/blog";
import { OG_LOCALE, ogImage } from "@/lib/site";

const copy = blogCopy.fr;

const BLOG_ALTERNATES = {
  fr: BLOG_PATH.fr,
  en: BLOG_PATH.en,
  "x-default": BLOG_PATH.fr,
};

export const metadata: Metadata = {
  title: { absolute: copy.indexSearchTitle },
  description: copy.indexDek,
  alternates: {
    canonical: BLOG_PATH.fr,
    languages: BLOG_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.fr,
    url: BLOG_PATH.fr,
    siteName: "Sonarche",
    title: copy.indexTitle,
    description: copy.indexDek,
    images: [ogImage("fr")],
  },
};

export default function FrBlogIndex() {
  return <BlogIndex locale="fr" />;
}
