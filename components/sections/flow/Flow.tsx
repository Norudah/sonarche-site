import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { flowCopy, type FlowStep, type SceneTags } from "./copy";
import { FlowCascade } from "./FlowCascade";
import { IsoScene } from "./IsoScene";

/* The growing indents pull the eye down and right, so the steps read as a descent. The top band
   starts on the hero's last colour, so the two sections dissolve rather than cut. */

const INDENT = ["", "lg:pl-[4.375rem]", "lg:pl-9", "lg:pl-[6.625rem]"];

export function Flow({ locale }: { locale: Locale }) {
  const copy = flowCopy[locale];

  return (
    <section data-anim-gate id="flow" className="relative isolate scroll-mt-8 py-24 sm:pt-28 sm:pb-30">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[26rem]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.931 0.036 279), oklch(0.963 0.018 279) 52%, oklch(0.982 0.006 279))",
        }}
      />
      {/* Broken between the two sentences: left to wrap, it stranded "out." on its own line. */}
      <SectionHeader
        kicker={copy.kicker}
        stacked
        heading={
          <>
            <span>{copy.headingBefore}</span>{" "}
            <span>
              <Emphasis>{copy.headingEmphasis}</Emphasis> {copy.headingAfter}
            </span>
          </>
        }
        headingWidth="max-w-[47.5rem]"
        body={copy.sub}
        bodyWidth="max-w-[36.25rem]"
      />

      <FlowCascade>
        {copy.steps.map((step, i) => (
          <Row key={step.number} step={step} stepLabel={copy.stepLabel} tags={copy.sceneTags} index={i} />
        ))}
      </FlowCascade>
    </section>
  );
}

type RowProps = {
  step: FlowStep;
  stepLabel: string;
  tags: SceneTags;
  index: number;
};

function Row({ step, stepLabel, tags, index }: RowProps) {
  const mirrored = index % 2 === 1;

  return (
    <div
      data-flow-row
      className={`flex flex-col items-center gap-8 px-8 sm:gap-12 sm:px-15 ${
        mirrored ? "lg:flex-row-reverse" : "lg:flex-row"
      } ${INDENT[index]}`}
    >
      <IsoScene step={index} tags={tags} className="w-full max-w-[36rem] shrink-0 lg:w-[30rem] xl:w-[40rem]" />

      <div className="flex max-w-[28.75rem] flex-1 flex-col gap-4">
        <div className="flex w-full items-baseline gap-3.5">
          <span className="text-accent font-display text-5xl leading-none font-light tracking-[-0.04em] sm:text-6xl">
            {step.number}
          </span>
          <span className="text-accent font-mono text-xs font-semibold tracking-[0.1em]">{stepLabel}</span>
          <span aria-hidden className="bg-separator h-px flex-1 self-center" />
        </div>

        <h3 className="text-foreground-strong font-display text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.015em]">
          {step.title}
        </h3>

        {step.text.map((paragraph, i) => (
          <p key={i} className="text-foreground text-lg leading-[1.55] sm:text-xl">
            {paragraph}
          </p>
        ))}

        <p className="text-accent-muted mt-1 font-serif text-lg leading-[1.45] italic sm:text-[1.1875rem]">
          {step.note}
        </p>
      </div>
    </div>
  );
}
