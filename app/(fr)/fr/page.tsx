import { Flow } from "@/components/sections/flow/Flow";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { Hold } from "@/components/sections/hold/Hold";
import { NoExpertise } from "@/components/sections/no-expertise/NoExpertise";
import { Hero } from "@/components/sections/hero/Hero";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";

export default function FrHome() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero locale="fr" />
      <Manifesto locale="fr" />
      <Flow locale="fr" />
      <OldWay locale="fr" />
      <TrueNames locale="fr" />
      <NoExpertise locale="fr" />
      <Hold locale="fr" />
    </main>
  );
}
