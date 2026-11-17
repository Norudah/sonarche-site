import { AnimationGate } from "@/components/layout/AnimationGate";
import { SiteNav } from "@/components/layout/nav/SiteNav";
import { StructuredData } from "@/components/layout/StructuredData";
import { Flow } from "@/components/sections/flow/Flow";
import { Faq } from "@/components/sections/faq/Faq";
import { Footer } from "@/components/sections/footer/Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { Hold } from "@/components/sections/hold/Hold";
import { NoExpertise } from "@/components/sections/no-expertise/NoExpertise";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { RealThing } from "@/components/sections/real-thing/RealThing";
import { ShipSound } from "@/components/sections/ship-sound/ShipSound";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { UnderDeck } from "@/components/sections/under-deck/UnderDeck";
import { LANDING_DESCRIPTION, LANDING_SHARE_TITLE, LOCALE_PATH, SEARCH_TITLE, type Locale } from "@/lib/site";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";

export const landingMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: LOCALE_PATH,
    title: { absolute: SEARCH_TITLE[locale] },
    shareTitle: LANDING_SHARE_TITLE[locale],
    description: LANDING_DESCRIPTION[locale],
  });

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <>
      <StructuredData locale={locale} description={LANDING_DESCRIPTION[locale]} />
      <SiteNav afterHero locale={locale} guideHref={publishedGuides().length > 0 ? GUIDE_PATH[locale] : null} />

      <main className="flex flex-1 flex-col">
        <Hero locale={locale} />
        <Flow locale={locale} />
        <OldWay locale={locale} />
        <TrueNames locale={locale} />
        <NoExpertise locale={locale} />
        <RealThing locale={locale} />
        <ShipSound locale={locale} />
        <Hold locale={locale} />
        <UnderDeck locale={locale} />
        <Faq locale={locale} />
      </main>
      <Footer locale={locale} />
      <AnimationGate />
    </>
  );
}
