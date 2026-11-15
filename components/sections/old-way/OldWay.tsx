import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { oldWayCopy } from "./copy";
import { Leftover } from "./Leftovers";

/* Five columns on one grid, so step, tool, drawing and cost line up across the row; a brace gathers
   them into the same track done right. No scroll reveal: the five read as one row. */

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

        {/* One brace gathers the five columns into the card: the curves keep their radius at any
            width because only the straight runs stretch. */}
        <div aria-hidden className="relative mt-10 hidden h-17 lg:block">
          <div className="flex h-8">
            <span className="border-accent flex-1 rounded-bl-[2rem] border-b-[1.5px] border-l-[1.5px]" />
            <span className="w-20 flex-none" />
            <span className="border-accent flex-1 rounded-br-[2rem] border-r-[1.5px] border-b-[1.5px]" />
          </div>
          <svg
            width="80"
            height="38"
            viewBox="0 0 80 38"
            fill="none"
            className="absolute top-[calc(2rem-0.75px)] left-1/2 -translate-x-1/2 overflow-visible"
          >
            <path
              d="M0 .75C26 .75 40 4 40 37.25M80 .75C54 .75 40 4 40 37.25"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="border-accent bg-surface mx-auto mt-6 grid max-w-[48rem] items-center gap-6 rounded-[1.25rem] border-2 p-6 shadow-[0_40px_80px_-40px_oklch(0.505_0.185_277/0.5)] sm:p-7.5 lg:mt-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <p className="font-display text-foreground-strong text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.12] font-bold tracking-[-0.02em]">
            {copy.punchBefore}{" "}
            <em className="text-accent mt-1 block font-serif text-[0.8em] font-normal">{copy.punchEmphasis}</em>
          </p>
          <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-4">
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
