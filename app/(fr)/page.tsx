import type { Metadata } from "next";

import { AnimationGate } from "@/components/layout/AnimationGate";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { StructuredData } from "@/components/layout/StructuredData";
import { Deck } from "@/components/sections/deck/Deck";
import { FirstLaunch } from "@/components/sections/first-launch/FirstLaunch";
import { Flow } from "@/components/sections/flow/Flow";
import { Footer } from "@/components/sections/footer/Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { Hold } from "@/components/sections/hold/Hold";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";
import { NoExpertise } from "@/components/sections/no-expertise/NoExpertise";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { RealThing } from "@/components/sections/real-thing/RealThing";
import { ShipSound } from "@/components/sections/ship-sound/ShipSound";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { UnderDeck } from "@/components/sections/under-deck/UnderDeck";
import { Trace } from "@/components/trace/Trace";
import { BRAND_TITLE, LANGUAGE_ALTERNATES, LOCALE_PATH, OG_IMAGE, OG_LOCALE, SEARCH_TITLE } from "@/lib/site";

/*
 * The description is the hero's subline, verbatim from docs/copy/fr.md, and
 * nothing appended: at 147 characters it fits inside the ~155 a result snippet
 * shows, and the "Gratuit et open source" that used to close it pushed the whole
 * thing to 181 — the part Google cut off.
 */
const DESCRIPTION =
  "Une bibliothèque musicale qui t'appartient vraiment — chaque morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un moteur natif.";

export const metadata: Metadata = {
  // See lib/site.ts: the search title says what this is, the brand title carries
  // the tagline. They are different jobs and this is the only page that has both.
  // `absolute` because the layout's template would append the brand a second time.
  title: { absolute: SEARCH_TITLE.fr },
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

export default function FrHome() {
  return (
    <>
      <StructuredData locale="fr" description={DESCRIPTION} />
      <LocaleSwitch locale="fr" />

      <main className="flex flex-1 flex-col">
        <Hero locale="fr" />
        <Manifesto locale="fr" />
        <Flow locale="fr" />
        <OldWay locale="fr" />
        <TrueNames locale="fr" />
        <NoExpertise locale="fr" />
        <Hold locale="fr" />
        <UnderDeck locale="fr" />
        <Deck locale="fr" />
        <ShipSound locale="fr" />
        <RealThing locale="fr" />
        <FirstLaunch locale="fr" />
      </main>
      <Footer locale="fr" />

      {/* Renders nothing: it lights the line every section above has planted. */}
      <Trace />
      {/* Renders nothing either: it pauses every section's idle loops off-screen. */}
      <AnimationGate />
    </>
  );
}
