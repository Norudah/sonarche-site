import type { Locale } from "@/lib/site";

import { manifestoCopy, type StatementLine } from "./copy";

/*
 * Why it exists — the page surfacing out of the water.
 *
 * Its gradient picks up exactly where the hero's leaves off and climbs back to
 * paper, so the two sections read as one dissolve rather than as a seam.
 *
 * Typographically this is the section that states the rule for the whole page:
 * display sans for the claim, italic serif for the three fragments that carry
 * the promise. Nothing else is allowed to use that serif decoratively.
 */

export function Manifesto({ locale }: { locale: Locale }) {
  const copy = manifestoCopy[locale];

  return (
    <section
      /* The language switch upstairs waits for this section to come up. */
      id="manifesto"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.931 0.036 279), oklch(0.963 0.018 279) 52%, oklch(0.982 0.006 279))",
      }}
    >
      {/* Wider than the mockup's 1000px: at 54px the claim is ~970px long, and
          the mockup's column broke it across two lines with "app." alone on the
          second. It is a single sentence and it reads as one line. */}
      <div className="mx-auto flex max-w-[72rem] flex-col items-center gap-6 px-6 pt-20 pb-20 sm:px-15 sm:pt-26 sm:pb-25">
        <div className="flex items-center gap-3.5">
          <span aria-hidden className="h-px w-11 bg-[oklch(0.74_0.07_279)]" />
          <span className="text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.22em]">{copy.kicker}</span>
          <span aria-hidden className="h-px w-11 bg-[oklch(0.74_0.07_279)]" />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-foreground font-display text-[clamp(1.5rem,3.75vw,3.375rem)] leading-[1.22] font-bold tracking-[-0.02em]">
            {copy.heading}
          </h2>

          {/* One <p>, one line per element: the line breaks are the composition,
              not a consequence of the column's width. */}
          <p className="text-foreground font-display flex flex-col items-center text-[clamp(1.5rem,3.75vw,3.375rem)] leading-[1.22] font-bold tracking-[-0.02em]">
            {copy.statement.map((line, i) => (
              <StatementRow key={i} line={line} />
            ))}
          </p>
        </div>

        <ul className="mt-2 flex flex-wrap justify-center gap-2.5">
          {copy.chips.map((chip) => (
            <li
              key={chip}
              className="border-border rounded-full border bg-white/70 px-3.5 py-2.5 font-mono text-xs font-medium text-[oklch(0.42_0.05_279)]"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StatementRow({ line }: { line: StatementLine }) {
  return (
    <span>
      {line.before}
      {line.emphasis ? (
        <>
          {line.before ? " " : null}
          {/* Slightly larger than the sans it sits in — the serif's x-height is
              smaller, so matching the point size would make it look shrunken. */}
          <em className="text-accent font-serif text-[1.075em] leading-none italic">{line.emphasis}</em>
        </>
      ) : null}
      {line.after}
    </span>
  );
}
