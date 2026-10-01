import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { trueNamesCopy } from "./copy";
import { fingerprintBars } from "./fingerprint";
import styles from "./true-names.module.css";

/* A comparison, so no reveal: both panels must be readable at the same instant. */

export function TrueNames({ locale }: { locale: Locale }) {
  const copy = trueNamesCopy[locale];
  const bars = fingerprintBars();

  return (
    <section data-anim-gate className="relative isolate bg-[oklch(0.976_0.008_279/0.8)] py-24 sm:py-27">
      <SectionHeader
        kicker={copy.kicker}
        stacked
        heading={
          <>
            <span>{copy.headingBefore}</span>
            <Emphasis>{copy.headingEmphasis}</Emphasis>
          </>
        }
        headingWidth="max-w-[52.5rem]"
        body={copy.body}
        bodyWidth="max-w-[41.25rem]"
      />

      <div className="mx-auto mt-12 flex max-w-[76.25rem] flex-col items-stretch gap-7 px-8 sm:px-15 lg:flex-row lg:items-center">
        <Panel
          label={copy.scrapedLabel}
          badge={copy.scrapedBadge}
          tone="scraped"
          rows={copy.rows.map((row) => ({ key: row.key, value: row.scraped }))}
        />

        <div aria-hidden className="flex flex-none flex-col items-center gap-3.5 lg:w-48">
          <div className="flex h-14 items-end gap-0.5">
            {bars.map((bar, i) => (
              <span
                key={i}
                className={styles.fpBar}
                style={{
                  height: bar.height,
                  opacity: bar.opacity,
                  animationDuration: bar.duration,
                  animationDelay: bar.delay,
                }}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[0.6875rem] leading-normal font-semibold tracking-[0.06em] text-[oklch(0.45_0.15_277)]">
            {copy.pipeline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <svg width="120" height="2" viewBox="0 0 120 2" className="hidden overflow-visible lg:block">
            <path
              d="M0 1 L120 1"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="6 8"
              className={styles.pipe}
            />
          </svg>
        </div>

        <Panel
          label={copy.identifiedLabel}
          badge={copy.identifiedBadge}
          tone="identified"
          rows={copy.rows.map((row) => ({ key: row.key, value: row.identified }))}
        />
      </div>

      <p className="text-accent-muted mx-auto mt-8 max-w-[46rem] px-8 text-center font-serif text-xl leading-normal italic sm:px-15">
        {copy.coverLine}
      </p>
    </section>
  );
}

type PanelProps = {
  label: string;
  badge: string;
  tone: "scraped" | "identified";
  rows: { key: string; value: string }[];
};

function Panel({ label, badge, tone, rows }: PanelProps) {
  const scraped = tone === "scraped";

  return (
    <div
      className={`flex flex-1 flex-col gap-3.5 rounded-[1.125rem] bg-white p-6.5 ${
        scraped ? "border-rust-edge border" : "border-accent border-2 shadow-[0_24px_56px_oklch(0.505_0.185_277/0.13)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`font-mono text-xs font-semibold tracking-[0.08em] ${
            scraped ? "text-rust" : "text-[oklch(0.45_0.15_277)]"
          }`}
        >
          {label}
        </p>

        {scraped ? (
          <p className="text-rust rounded-full bg-[oklch(0.96_0.03_45)] px-2.5 py-1.25 text-[0.6875rem] font-medium">
            {badge}
          </p>
        ) : (
          <p className="text-success flex items-center gap-1.5 rounded-full bg-[oklch(0.95_0.04_157)] px-2.5 py-1.25 text-[0.6875rem] font-medium">
            <span aria-hidden className="bg-success size-1.5 rounded-full" />
            {badge}
          </p>
        )}
      </div>

      <dl className="flex flex-col gap-1.25">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1.25">
            <dt className="text-muted text-[0.6875rem] font-medium">{row.key}</dt>
            <dd
              className={`rounded-[0.625rem] px-3.5 py-2.75 text-[0.84375rem] leading-[1.35] ${
                scraped ? "bg-rust-soft text-rust-ink" : "bg-[oklch(0.968_0.008_279)] text-[oklch(0.24_0.02_279)]"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
