import { TraceSegment } from "@/components/trace/TraceSegment";
import type { Locale } from "@/lib/site";

import { noExpertiseCopy, type NoExpertiseCopy } from "./copy";
import styles from "./no-expertise.module.css";

/*
 * No expertise needed — the first two-column section on the page.
 *
 * The argument is on the left and the proof is on the right, and the proof is a
 * small piece of the app playing one gesture on a loop: you disagree with it
 * about a genre, you win, and it tells you in plain words what it just wrote.
 */

export function NoExpertise({ locale }: { locale: Locale }) {
  const copy = noExpertiseCopy[locale];

  return (
    <section className="relative isolate py-24 sm:py-27">
      <TraceSegment />
      <div className="mx-auto flex max-w-[77.5rem] flex-col items-center gap-12 px-8 sm:px-15 lg:flex-row lg:gap-20">
        <div className="flex flex-1 flex-col gap-4.5">
          <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

          <h2 className="text-foreground-strong font-display text-[clamp(1.75rem,3.4vw,3.125rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            {copy.headingBefore}{" "}
            <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
            {copy.headingAfter}
          </h2>

          {copy.bodies.map((body) => (
            <p key={body} className="text-body max-w-[29.375rem] text-[1.0625rem] leading-[1.7]">
              {body}
            </p>
          ))}

          <ul className="mt-1 flex flex-col gap-2.75">
            {copy.guides.map((guide) => (
              <li key={guide} className="flex items-baseline gap-3">
                <span aria-hidden className="bg-accent size-1.75 flex-none rounded-[2px]" />
                <span className="text-[0.9375rem] leading-[1.55] text-[oklch(0.32_0.02_279)]">{guide}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 justify-center">
          <GenreWidget widget={copy.widget} />
        </div>
      </div>
    </section>
  );
}

function GenreWidget({ widget }: { widget: NoExpertiseCopy["widget"] }) {
  return (
    <div className="flex w-full max-w-[26.875rem] flex-col gap-4 rounded-[1.125rem] border border-[oklch(0.92_0.008_279)] bg-white p-6.5 shadow-[0_30px_70px_oklch(0.35_0.06_277/0.14)]">
      <p className="text-sm font-semibold text-[oklch(0.2_0.01_279)]">{widget.title}</p>

      {/* The two pills share one spot — the swap has to happen in place or it
          reads as two options rather than as a change. */}
      <div aria-hidden className="relative h-11.5">
        <span
          className={`${styles.chipOut} absolute top-0 left-0 inline-flex items-center gap-2.25 rounded-xl border border-[oklch(0.9_0.01_279)] bg-[oklch(0.968_0.006_279)] px-3.5 py-2.5 text-sm`}
        >
          <span className="size-2 rounded-[2px] bg-[oklch(0.62_0.13_30)]" />
          {widget.from}
        </span>

        <span
          className={`${styles.chipIn} border-accent absolute top-0 left-0 inline-flex items-center gap-2.25 rounded-xl border-2 bg-[oklch(0.96_0.03_277)] px-3.5 py-2.5 text-sm font-medium`}
        >
          <span className="bg-accent size-2 rounded-[2px]" />
          {widget.to}
        </span>

        <span className={`${styles.cursor} absolute top-5.5 left-42`}>
          <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
            <path
              d="M1 1 L1 16 L5 12.5 L7.5 18.5 L10 17.5 L7.5 11.5 L12.5 11.5 Z"
              fill="white"
              stroke="oklch(0.3 0.02 279)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="flex flex-col gap-1.75 rounded-xl border border-[oklch(0.91_0.02_279)] bg-[oklch(0.975_0.012_277)] px-4 py-3.75">
        <p className="text-xs font-semibold text-[oklch(0.42_0.14_277)]">{widget.explainerLabel}</p>
        <p className="text-body text-[0.8125rem] leading-[1.6]">
          {widget.explainerBefore} <b className="font-semibold text-[oklch(0.3_0.02_279)]">{widget.explainerFamily}</b>{" "}
          {widget.explainerAfter}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <p className="text-[0.78125rem] font-medium text-[oklch(0.5_0.02_279)]">{widget.familyLabel}</p>
        <div className="flex gap-1.5">
          <span className="rounded-full bg-[oklch(0.965_0.006_279)] px-2.5 py-1.5 font-mono text-[0.71875rem] font-medium text-[oklch(0.4_0.03_279)]">
            {widget.familyValue}
          </span>
          <span className="rounded-full bg-[oklch(0.975_0.004_279)] px-2.5 py-1.5 font-mono text-[0.71875rem] font-medium text-[oklch(0.62_0.02_279)]">
            {widget.derived}
          </span>
        </div>
      </div>
    </div>
  );
}
