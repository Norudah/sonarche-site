import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { SEARCH_TITLE, SITE_URL } from "@/lib/site";

/* The English half of the site. See the FR layout for why nothing page-specific
   is declared here. */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEARCH_TITLE.en,
    template: "%s | Sonarche",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f9fd",
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
