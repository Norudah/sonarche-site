import { Flow } from "@/components/sections/flow/Flow";
import { OldWay } from "@/components/sections/old-way/OldWay";
import { TrueNames } from "@/components/sections/true-names/TrueNames";
import { Hero } from "@/components/sections/hero/Hero";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";

export default function EnHome() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero locale="en" />
      <Manifesto locale="en" />
      <Flow locale="en" />
      <OldWay locale="en" />
      <TrueNames locale="en" />
    </main>
  );
}
