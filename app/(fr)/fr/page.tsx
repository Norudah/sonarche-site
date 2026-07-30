import { Deck } from "@/components/sections/deck/Deck";
import { FirstLaunch } from "@/components/sections/first-launch/FirstLaunch";
import { Flow } from "@/components/sections/flow/Flow";
import { Footer } from "@/components/sections/footer/Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { Hold } from "@/components/sections/hold/Hold";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";
import { NoExpertise } from "@/components/sections/no-expertise/NoExpertise";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { ShipSound } from "@/components/sections/ship-sound/ShipSound";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { UnderDeck } from "@/components/sections/under-deck/UnderDeck";

export default function FrHome() {
  return (
    <>
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
        <FirstLaunch locale="fr" />
      </main>
      <Footer locale="fr" />
    </>
  );
}
