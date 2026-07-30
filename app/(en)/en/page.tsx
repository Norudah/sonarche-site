import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
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

export default function EnHome() {
  return (
    <>
      <LocaleSwitch locale="en" />

      <main className="flex flex-1 flex-col">
        <Hero locale="en" />
        <Manifesto locale="en" />
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
    </>
  );
}
