import { TraceSegment } from "@/components/trace/TraceSegment";
import type { Locale } from "@/lib/site";

import { flowCopy, type FlowStep } from "./copy";
import { FlowCascade } from "./FlowCascade";
import { IsoScene } from "./IsoScene";

/*
 * The flow — four steps, alternating sides, each stepping a little further right
 * than the last. The indents are the mockup's and they are not decoration: they
 * pull the eye down and to the right, so the section reads as a descent rather
 * than as a list.
 */

const INDENT = ["", "sm:pl-[4.375rem]", "sm:pl-9", "sm:pl-[6.625rem]"];

export function Flow({ locale }: { locale: Locale }) {
  const copy = flowCopy[locale];

  return (
    <section id="flow" className="relative isolate scroll-mt-8 py-24 sm:pt-28 sm:pb-30">
      {/* The trace is born here, at the top of the first section after the
          manifesto — it fades up out of nothing over its first 280px rather than
          starting on a cut. See components/trace. */}
      <TraceSegment start={0} />
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        {/* Broken between the two sentences rather than wherever the column
            runs out — left to wrap, it stranded "out." on a line of its own. */}
        <h2 className="text-foreground-strong font-display mt-4 flex max-w-[47.5rem] flex-col text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <span>
            <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>{" "}
            {copy.headingAfter}
          </span>
        </h2>

        <p className="text-body mt-3.5 max-w-[36.25rem] text-[1.09rem] leading-relaxed">{copy.sub}</p>
      </header>

      <FlowCascade>
        {copy.steps.map((step, i) => (
          <Row key={step.number} step={step} stepLabel={copy.stepLabel} index={i} />
        ))}
      </FlowCascade>
    </section>
  );
}

type RowProps = {
  step: FlowStep;
  stepLabel: string;
  index: number;
};

function Row({ step, stepLabel, index }: RowProps) {
  // Odd steps put the scene on the right and set their text flush right, so the
  // two columns mirror each other down the page.
  const mirrored = index % 2 === 1;

  return (
    <div
      data-flow-row
      className={`flex flex-col items-center gap-8 px-8 sm:gap-12 sm:px-15 ${
        mirrored ? "sm:flex-row-reverse" : "sm:flex-row"
      } ${INDENT[index]}`}
    >
      <IsoScene step={index} className="w-full max-w-[28rem] shrink-0 sm:w-112" />

      <div className={`flex max-w-[28.75rem] flex-1 flex-col gap-3.5 ${mirrored ? "sm:items-end sm:text-right" : ""}`}>
        <div className={`flex w-full items-center gap-3 ${mirrored ? "flex-row-reverse" : ""}`}>
          <p className="text-accent font-mono text-xs font-semibold tracking-[0.1em]">
            {stepLabel} {step.number}
          </p>
          <span aria-hidden className="bg-separator h-px flex-1" />
        </div>

        <h3 className="text-foreground-strong font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
          {step.title}
        </h3>

        <p className="text-body text-base leading-[1.65]">{step.text}</p>

        <p className="text-accent-muted mt-1 font-serif text-base leading-normal italic">{step.note}</p>
      </div>
    </div>
  );
}
