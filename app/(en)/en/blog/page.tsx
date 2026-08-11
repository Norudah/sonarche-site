import type { Metadata } from "next";

import { BlogIndex } from "@/components/blog/BlogIndex";
import { blogCopy } from "@/components/blog/copy";
import { BLOG_PATH } from "@/lib/blog";
import { OG_IMAGE, OG_LOCALE } from "@/lib/site";

const copy = blogCopy.en;

const BLOG_ALTERNATES = {
  fr: BLOG_PATH.fr,
  en: BLOG_PATH.en,
  "x-default": BLOG_PATH.fr,
};

export const metadata: Metadata = {
  title: { absolute: copy.indexSearchTitle },
  description: copy.indexDek,
  alternates: {
    canonical: BLOG_PATH.en,
    languages: BLOG_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALE.en,
    url: BLOG_PATH.en,
    siteName: "Sonarche",
    title: copy.indexTitle,
    description: copy.indexDek,
    images: [OG_IMAGE],
  },
};

export default function EnBlogIndex() {
  return <BlogIndex locale="en" />;
}
