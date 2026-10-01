import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { oldWayCopy } from "./copy";
import styles from "./old-way.module.css";

/* Dashed cards and struck-through names make the argument before the copy does. No scroll reveal:
   the five have to read as one row. */

export function OldWay({ locale }: { locale: Locale }) {
  const copy = oldWayCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
      <SectionHeader
        kicker={copy.kicker}
        tone="rust"
        heading={
          <>
            {copy.headingBefore} <Emphasis tone="rust">{copy.headingEmphasis}</Emphasis>
          </>
        }
        headingWidth="max-w-[51.25rem]"
        body={copy.sub}
        bodyWidth="max-w-[40rem]"
      />

      <ol className="mx-auto mt-12 grid max-w-[80rem] gap-3.5 px-8 sm:px-15 md:grid-cols-2 xl:grid-cols-5">
        {copy.chain.map((link) => (
          <li
            key={link.step}
            className="border-rust-edge bg-rust-paper flex flex-col gap-2.5 rounded-2xl border border-dashed px-4.5 pt-5 pb-5.5"
          >
            <p className="text-rust font-mono text-[0.625rem] font-semibold tracking-[0.1em] opacity-80">{link.step}</p>
            {/* Struck through, not greyed: these tools work, they are being replaced. */}
            <p className="font-display text-[0.9375rem] leading-tight font-semibold text-[oklch(0.3_0.03_279)] line-through decoration-[oklch(0.72_0.16_30/0.6)] decoration-2">
              {link.tool}
            </p>
            <p className="text-[0.8125rem] leading-[1.55] text-[oklch(0.48_0.02_279)]">{link.gripe}</p>
            <p className="text-danger mt-auto pt-3 text-[0.71875rem] leading-snug font-medium">{link.cost}</p>
          </li>
        ))}
      </ol>

      <div aria-hidden className="flex justify-center pt-5.5">
        <svg width="2" height="46" viewBox="0 0 2 46" className="overflow-visible">
          <path
            d="M1 0 L1 46"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="6 8"
            className={styles.connector}
          />
        </svg>
      </div>

      <div className="flex justify-center px-8 sm:px-15">
        <div className="border-accent flex max-w-[47.5rem] flex-col items-center gap-4 rounded-[1.375rem] border-2 bg-[linear-gradient(160deg,oklch(0.97_0.022_277),white)] px-6 py-8 text-center sm:px-10">
          <h3 className="font-display text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.2] font-bold tracking-[-0.01em] text-[oklch(0.24_0.06_279)]">
            {copy.punchHeading}
          </h3>

          <p className="max-w-[37.5rem] text-[1.03rem] leading-[1.7] text-[oklch(0.42_0.03_279)]">{copy.punchBody}</p>
        </div>
      </div>
    </section>
  );
}
