import { Flow } from "@/components/sections/flow/Flow";
import { Hero } from "@/components/sections/hero/Hero";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";

export default function FrHome() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero locale="fr" />
      <Manifesto locale="fr" />
      <Flow locale="fr" />
    </main>
  );
}
