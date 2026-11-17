import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { faqCopy } from "./copy";

/* Native <details>: every answer is in the server HTML, opens without JavaScript, and needs no state. */
export function Faq({ locale }: { locale: Locale }) {
  const copy = faqCopy[locale];

  return (
    <section className="relative isolate py-24 sm:py-27">
      <SectionHeader
        kicker={copy.kicker}
        heading={
          <>
            {copy.headingBefore} <Emphasis>{copy.headingEmphasis}</Emphasis>
          </>
        }
        headingWidth="max-w-[40rem]"
      />

      <div className="border-border mx-auto mt-12 max-w-[46rem] border-t px-8 sm:px-0">
        {copy.entries.map((entry) => (
          <details key={entry.question} className="group border-border border-b">
            <summary className="text-foreground-strong font-display hover:text-accent flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] font-semibold transition-colors outline-none focus-visible:underline [&::-webkit-details-marker]:hidden">
              {entry.question}
              <span
                aria-hidden
                className="text-accent flex-none text-xl leading-none transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="text-body max-w-[40rem] pb-6 text-[1.0625rem] leading-relaxed">{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
