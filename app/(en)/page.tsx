import { Hero } from "@/components/sections/hero/Hero";
import { Manifesto } from "@/components/sections/manifesto/Manifesto";

export default function EnHome() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero locale="en" />
      <Manifesto locale="en" />
    </main>
  );
}
