import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { underDeckCopy } from "./copy";
import { Diagram } from "./Diagram";

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

      <ul className="mx-auto mt-11 grid max-w-[72.5rem] gap-4.5 px-8 sm:px-15 md:grid-cols-3">
        {copy.cards.map((card) => (
          <li
            key={card.tag}
            className="flex flex-col gap-2.5 rounded-2xl border border-[oklch(0.9_0.014_279)] bg-white p-6"
          >
            <p className="text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.08em]">{card.tag}</p>
            <p className="text-foreground-strong font-display text-[1.1875rem] leading-[1.3] font-semibold">
              {card.title}
            </p>
            <p className="text-body text-sm leading-[1.65]">{card.text}</p>
          </li>
        ))}
      </ul>

      <Diagram nodes={copy.nodes} sealed={copy.sealed} note={copy.servicesNote} />
    </section>
  );
}
