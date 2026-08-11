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
import { NoExpertise } from "@/components/sections/no-expertise/NoExpertise";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { RealThing } from "@/components/sections/real-thing/RealThing";
import { ShipSound } from "@/components/sections/ship-sound/ShipSound";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { UnderDeck } from "@/components/sections/under-deck/UnderDeck";
import { Trace } from "@/components/trace/Trace";
import { BRAND_TITLE, LANGUAGE_ALTERNATES, LOCALE_PATH, OG_IMAGE, OG_LOCALE, SEARCH_TITLE } from "@/lib/site";

/* The hero's subline, verbatim from docs/copy/en.md, plus the four words that
   still fit inside a snippet. See the FR page for why the length matters. */
const DESCRIPTION =
  "A music library that's truly yours: every track identified by its own audio, named in plain files, played on a native engine. Free and open source.";

export const metadata: Metadata = {
  title: { absolute: SEARCH_TITLE.en },
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
    images: [
      {
        ...OG_IMAGE,
        alt: 'Sonarche: the ark afloat on a sea drawn as equalizer bars, under the word SONARCHE and the tagline "From the stream into the Ark."',
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

export default function EnHome() {
  return (
    <>
      <StructuredData locale="en" description={DESCRIPTION} />
      <LocaleSwitch locale="en" />

      <main className="flex flex-1 flex-col">
        <Hero locale="en" />
        <Flow locale="en" />
        <OldWay locale="en" />
        <TrueNames locale="en" />
        <NoExpertise locale="en" />
        <Hold locale="en" />
        <UnderDeck locale="en" />
        <Deck locale="en" />
        <ShipSound locale="en" />
        <RealThing locale="en" />
        <FirstLaunch locale="en" />
      </main>
      <Footer locale="en" />

      {/* Renders nothing: it lights the line every section above has planted. */}
      <Trace />
      {/* Renders nothing either: it pauses every section's idle loops off-screen. */}
      <AnimationGate />
    </>
  );
}
