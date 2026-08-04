import { TraceSegment } from "@/components/trace/TraceSegment";
import type { Locale } from "@/lib/site";

import { firstLaunchCopy } from "./copy";

/*
 * First launch — the section that costs nothing to leave out and everything to
 * leave out.
 *
 * An unsigned app makes both operating systems put up a wall, and a visitor who
 * meets that wall unwarned concludes the download was a mistake. Saying it here,
 * plainly, with the exact clicks, is what turns a scare into a formality.
 */

export function FirstLaunch({ locale }: { locale: Locale }) {
  const copy = firstLaunchCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-26">
      <TraceSegment />
      <div className="mx-auto flex max-w-[57.5rem] flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-3.5 max-w-[43.75rem] text-[clamp(1.625rem,2.8vw,2.375rem)] leading-[1.2] font-bold tracking-[-0.015em]">
          {copy.headingBefore}{" "}
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-3.25 max-w-[41.25rem] text-base leading-[1.65]">{copy.body}</p>

        <div className="mt-7.5 flex w-full flex-col items-stretch gap-4.5 sm:flex-row">
          {copy.platforms.map((platform) => (
            <div
              key={platform.label}
              className="flex flex-1 flex-col gap-2.75 rounded-2xl border border-[oklch(0.89_0.014_279)] bg-white px-5.5 py-5 text-left"
            >
              <div className="flex items-center gap-2.5">
                <p className="text-accent text-[0.6875rem] font-semibold tracking-[0.16em]">{platform.label}</p>
                <span aria-hidden className="h-px flex-1 bg-[oklch(0.93_0.01_279)]" />
              </div>

              <p className="text-[0.84375rem] leading-[1.55] text-[oklch(0.5_0.02_279)]">{platform.says}</p>

              <p className="rounded-[0.625rem] bg-[oklch(0.968_0.008_279)] px-3.25 py-2.75 font-mono text-[0.8125rem] leading-[1.45] font-medium text-[oklch(0.28_0.02_279)]">
                {platform.fix}
              </p>

              <p className="mt-auto text-[0.78125rem] leading-[1.5] text-[oklch(0.58_0.02_279)]">{platform.fallback}</p>
            </div>
          ))}
        </div>

        <p className="text-accent-muted mt-6.5 font-serif text-[1.1875rem] leading-normal italic">{copy.closer}</p>
      </div>
    </section>
  );
}
