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
import { BRAND_TITLE, LANDING_DESCRIPTION, LOCALE_PATH, SEARCH_TITLE, type Locale } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const landingMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: LOCALE_PATH,
    title: { absolute: SEARCH_TITLE[locale] },
    shareTitle: BRAND_TITLE,
    description: LANDING_DESCRIPTION[locale],
  });

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <>
      <StructuredData locale={locale} description={LANDING_DESCRIPTION[locale]} />
      <LocaleSwitch locale={locale} />

      <main className="flex flex-1 flex-col">
        <Hero locale={locale} />
        <Flow locale={locale} />
        <OldWay locale={locale} />
        <TrueNames locale={locale} />
        <NoExpertise locale={locale} />
        <Hold locale={locale} />
        <UnderDeck locale={locale} />
        <Deck locale={locale} />
        <ShipSound locale={locale} />
        <RealThing locale={locale} />
        <FirstLaunch locale={locale} />
      </main>
      <Footer locale={locale} />
      <AnimationGate />
    </>
  );
}
