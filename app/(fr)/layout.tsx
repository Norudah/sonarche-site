import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Document } from "@/components/layout/Document";
import { LANGUAGE_ALTERNATES, LOCALE_PATH, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // The tagline stays English in every language — it is the brand.
  title: "Sonarche — From the stream into the Ark.",
  description:
    "Une bibliothèque musicale qui t'appartient vraiment — chaque morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un moteur natif. Gratuit et open source.",
  alternates: {
    canonical: LOCALE_PATH.fr,
    languages: LANGUAGE_ALTERNATES,
  },
  openGraph: {
    type: "website",
    locale: "fr",
    url: LOCALE_PATH.fr,
    siteName: "Sonarche",
    title: "Sonarche — From the stream into the Ark.",
    description:
      "Une bibliothèque musicale qui t'appartient vraiment — chaque morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un moteur natif.",
  },
  twitter: { card: "summary_large_image" },
};

export default function FrLayout({ children }: { children: ReactNode }) {
  return <Document lang="fr">{children}</Document>;
}
