import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import { postById, postPath } from "@/lib/blog";
import type { Locale } from "@/lib/site";

import { trueNamesCopy, type TrueNamesCopy } from "./copy";

/* The same track in the app's inspector, before and after. Static on purpose: both have to be
   readable at the same instant, field against field. Side by side, each card spans the same four
   subgrid rows, so a title that wraps on one side keeps every band level on both. */

export function TrueNames({ locale }: { locale: Locale }) {
  const copy = trueNamesCopy[locale];

  return (
    <section className="relative isolate bg-[oklch(0.976_0.008_279/0.8)] py-24 sm:py-27">
      <SectionHeader
        kicker={copy.kicker}
        stacked
        heading={
          <>
            <span>{copy.headingBefore}</span> <Emphasis>{copy.headingEmphasis}</Emphasis>
          </>
        }
        headingWidth="max-w-[52.5rem]"
        body={copy.lead}
        bodyWidth="max-w-[41.25rem]"
      />
      <p className="mt-4 text-center">
        <a
          href={postPath(postById("wrong-tags"), locale)}
          className="text-accent hover:text-accent-strong text-[0.9375rem] font-semibold"
        >
          {copy.postLink}
        </a>
      </p>

      <div className="mx-auto mt-12 grid max-w-[78rem] gap-7 px-8 sm:px-15 lg:grid-cols-2 lg:gap-y-0">
        <Inspector copy={copy} side="scraped" />
        <Inspector copy={copy} side="identified" />
      </div>

      <p className="text-accent-muted mx-auto mt-8 max-w-[46rem] px-8 text-center font-serif text-xl leading-normal italic sm:px-15">
        {copy.coverLine}
      </p>
    </section>
  );
}

function Inspector({ copy, side }: { copy: TrueNamesCopy; side: "scraped" | "identified" }) {
  const old = side === "scraped";
  const meta = copy[side];
  const title = copy.fields[1][side];

  return (
    <div
      className={`bg-surface flex flex-col overflow-hidden rounded-[1.25rem] lg:row-span-4 lg:grid lg:grid-rows-subgrid ${
        old ? "ring-rust-edge ring-1" : "ring-accent shadow-[0_40px_80px_-40px_oklch(0.505_0.185_277/0.5)] ring-2"
      }`}
    >
      <div className={`flex items-center justify-between px-5 py-3.5 ${old ? "bg-rust-paper" : "bg-accent-soft"}`}>
        <p className={`font-mono text-xs font-semibold tracking-[0.08em] ${old ? "text-rust" : "text-accent-strong"}`}>
          {meta.label}
        </p>
        <p
          className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-medium ${
            old ? "text-rust bg-[oklch(0.96_0.03_45)]" : "text-success bg-[oklch(0.95_0.04_157)]"
          }`}
        >
          {meta.badge}
        </p>
      </div>

      <div className="flex items-center gap-3.5 px-5 pt-4.5">
        <Artwork letterboxed={old} />
        <div className="min-w-0">
          <p className="text-accent font-mono text-[0.625rem] font-semibold tracking-[0.1em]">{copy.trackLabel}</p>
          <p
            className={`font-display mt-0.5 text-[1.0625rem] leading-tight font-bold ${old ? "text-rust-ink" : "text-foreground-strong"}`}
          >
            {title}
          </p>
        </div>
      </div>

      <div className="px-5 pt-3.5">
        <p
          className={`flex items-center gap-2 rounded-[0.625rem] border px-3 py-2.25 text-[0.8125rem] font-semibold ${
            old ? "bg-rust-soft text-rust border-transparent" : "border-separator text-foreground"
          }`}
        >
          <span aria-hidden className={`size-1.75 rounded-full ${old ? "bg-rust" : "bg-success"}`} />
          {meta.count}
        </p>
      </div>

      <dl className="grid grid-cols-2 content-start gap-2.5 px-5 pt-3.5 pb-4.5">
        {copy.fields.map((field) => (
          <div key={field.key} className={`flex flex-col gap-1 ${field.wide ? "col-span-2" : ""}`}>
            <dt className="text-muted text-[0.6875rem]">{field.key}</dt>
            <dd
              className={`rounded-lg border px-2.75 py-2.25 text-[0.84375rem] leading-[1.35] ${
                old
                  ? "bg-rust-soft text-rust-ink border-transparent"
                  : "border-border text-foreground-strong font-medium"
              }`}
            >
              {field[side]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Artwork({ letterboxed }: { letterboxed: boolean }) {
  const art = "flex-1 bg-[linear-gradient(140deg,oklch(0.62_0.17_277),oklch(0.38_0.13_290))]";

  return letterboxed ? (
    <span aria-hidden className="flex h-13.5 w-24 flex-none flex-col">
      <span className="h-2 bg-[oklch(0.15_0_0)]" />
      <span className={art} />
      <span className="h-2 bg-[oklch(0.15_0_0)]" />
    </span>
  ) : (
    <span aria-hidden className="flex size-16 flex-none overflow-hidden rounded-lg">
      <span className={art} />
    </span>
  );
}
