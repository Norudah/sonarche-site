import { Emphasis, Kicker } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { noExpertiseCopy } from "./copy";
import { EditorCard } from "./EditorCard";
import { HelpCard } from "./HelpCard";
import { NoExpertiseMotion } from "./NoExpertiseMotion";
import { RematchCard } from "./RematchCard";
import { AlbumsCard, UncertainCard } from "./SmallCards";

/* A square grid of small, working interfaces instead of paragraphs; the album editor takes a full
   row because it is the screen Sonarche was built around. */

export function NoExpertise({ locale }: { locale: Locale }) {
  const copy = noExpertiseCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
      <div className="mx-auto flex max-w-[75rem] flex-col px-8 sm:px-15">
        <header className="flex flex-col items-start">
          <Kicker>{copy.kicker}</Kicker>
          <h2 className="text-foreground-strong font-display mt-4 max-w-[47.5rem] text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            {copy.headingBefore} <Emphasis>{copy.headingEmphasis}</Emphasis>
            {copy.headingAfter}
          </h2>
          <p className="text-foreground mt-6 max-w-[35rem] text-[clamp(1.125rem,1.7vw,1.5rem)] leading-normal">
            {copy.lead}
          </p>
        </header>

        <NoExpertiseMotion>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <AlbumsCard copy={copy.albums} className="lg:col-span-2" />
            <UncertainCard copy={copy.uncertain} />
            <EditorCard copy={copy.editor} />
            <HelpCard copy={copy.help} className="lg:col-span-2" />
            <RematchCard copy={copy.rematch} />
          </div>
        </NoExpertiseMotion>
      </div>
    </section>
  );
}
