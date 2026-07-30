import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { LANGUAGE_ALTERNATES, LOCALE_PATH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sonarche — From the stream into the Ark.",
  description:
    "A music library that's truly yours — every track identified by its own audio, named in plain files, played on a native engine. Free and open source.",
  alternates: {
    canonical: LOCALE_PATH.en,
    languages: LANGUAGE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: "en",
    url: LOCALE_PATH.en,
    siteName: "Sonarche",
    title: "Sonarche — From the stream into the Ark.",
    description:
      "A music library that's truly yours — every track identified by its own audio, named in plain files, played on a native engine.",
  },
  twitter: { card: "summary_large_image" },
};

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
