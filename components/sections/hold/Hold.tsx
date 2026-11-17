import { Emphasis, SectionHeading } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { holdCopy } from "./copy";
import { HoldStage } from "./HoldStage";

/* The actual folder, in the visitor's own file manager, beside the folder their other app uses. */

export function Hold({ locale }: { locale: Locale }) {
  const copy = holdCopy[locale];

  return (
    <section className="relative isolate bg-[oklch(0.976_0.008_279/0.8)] py-24 sm:py-27">
      <header className="mx-auto flex max-w-[70rem] flex-col items-start px-8 sm:px-15">
        <SectionHeading kicker={copy.kicker} className="flex flex-col">
          <span>{copy.headingBefore}</span> <Emphasis>{copy.headingEmphasis}</Emphasis>
        </SectionHeading>
        <p className="text-body mt-6 max-w-[37.5rem] text-[1.09rem] leading-relaxed">
          {copy.bodyBefore}{" "}
          <code className="bg-tray text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.95em]">
            {copy.bodyPath}
          </code>
          {copy.bodyAfter}
        </p>
      </header>

      <HoldStage copy={copy} />

      <p className="text-accent-muted mx-auto mt-16 max-w-[51.25rem] px-8 text-center font-serif text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.35] italic">
        {copy.closer}
      </p>
    </section>
  );
}
