import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { underDeckCopy } from "./copy";
import { Pipeline } from "./Pipeline";

/* The one place the page names its own tools; it never names a platform (docs/CONTEXT.md). */

export function UnderDeck({ locale }: { locale: Locale }) {
  const copy = underDeckCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
      <SectionHeader
        kicker={copy.kicker}
        heading={
          <>
            {copy.headingBefore} <Emphasis>{copy.headingEmphasis}</Emphasis>
            {copy.headingAfter}
          </>
        }
        headingWidth="max-w-[48.75rem]"
        body={copy.body}
        bodyWidth="max-w-[41.25rem]"
      />

      <Pipeline nodes={copy.nodes} sealed={copy.sealed} note={copy.servicesNote} />

      <ul className="border-border mx-auto mt-6 grid max-w-[70rem] px-8 sm:px-15 md:grid-cols-3 md:border-t lg:mt-10">
        {copy.cards.map((card) => (
          <li
            key={card.tag}
            className="border-separator flex flex-col gap-2 border-b py-6 md:border-b-0 md:px-7 md:pt-7 md:pb-0 md:first:pl-0 md:last:pr-0 md:[&+&]:border-l"
          >
            <p className="text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.08em]">{card.tag}</p>
            <p className="text-foreground-strong font-display text-[1.1875rem] leading-[1.3] font-semibold">
              {card.title}
            </p>
            <p className="text-body text-sm leading-[1.65]">{card.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
