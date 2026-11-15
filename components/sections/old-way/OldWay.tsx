import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { oldWayCopy } from "./copy";
import { Leftover } from "./Leftovers";

/* Five columns on one grid, so step, tool, drawing and cost line up across the row; a tick under
   each, then the same track done right. No scroll reveal: the five read as one row. */

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

      <div className="mx-auto mt-14 max-w-[80rem] px-8 sm:px-15">
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:grid-rows-[auto_auto_auto_auto] lg:gap-x-5 lg:gap-y-3">
          <span
            aria-hidden
            className="absolute inset-x-10 top-[10.0625rem] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--rust-edge)_0_8px,transparent_8px_16px)] lg:block"
          />
          {copy.chain.map((link, i) => (
            <li key={link.step} className="relative grid gap-3 lg:row-span-4 lg:grid-rows-subgrid">
              <p className="text-rust font-mono text-[0.65625rem] font-semibold tracking-[0.1em]">{link.step}</p>
              {/* Struck through, not greyed: these tools work, they are being replaced. */}
              <p className="font-display min-h-11.5 text-[1.0625rem] leading-tight font-semibold text-[oklch(0.3_0.03_279)] line-through decoration-[oklch(0.72_0.16_30/0.6)] decoration-2">
                {link.tool}
              </p>
              <Leftover index={i} leftovers={copy.leftovers} />
              <p className="text-rust text-[0.8125rem] leading-snug font-medium">{link.cost}</p>
            </li>
          ))}
        </ol>

        <ul aria-hidden className="mt-6 hidden grid-cols-5 gap-x-5 lg:grid">
          {copy.chain.map((link) => (
            <li key={link.step} className="flex justify-center">
              <span className="bg-accent flex size-8.5 items-center justify-center rounded-full shadow-[0_0_0_6px_var(--accent-soft)]">
                <Tick />
              </span>
            </li>
          ))}
        </ul>

        <div className="border-accent/30 bg-accent-soft mt-6 grid items-center gap-6 rounded-[1.25rem] border-[1.5px] p-6 sm:p-7.5 lg:grid-cols-[minmax(0,1fr)_26.25rem] lg:gap-8">
          <p className="font-display text-foreground-strong text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.12] font-bold tracking-[-0.02em]">
            {copy.punchBefore} <em className="text-accent font-serif font-normal">{copy.punchEmphasis}</em>
          </p>
          <div className="bg-surface grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3.5 rounded-[0.875rem] p-3 shadow-[0_20px_40px_-24px_oklch(0.505_0.185_277/0.6)]">
            <span
              aria-hidden
              className="size-19 rounded-lg bg-[linear-gradient(140deg,oklch(0.62_0.17_277),oklch(0.38_0.13_290))]"
            />
            <span className="flex flex-col gap-0.75">
              <span className="text-foreground-strong text-sm font-bold">{copy.result.title}</span>
              <span className="text-body text-xs">{copy.result.artist}</span>
              <span className="text-body text-xs">{copy.result.release}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
      <path
        d="M2.5 6.2 5 8.5l4.5-5"
        stroke="var(--snow)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
