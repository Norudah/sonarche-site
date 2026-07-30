import { TraceSegment } from "@/components/trace/TraceSegment";
import type { Locale } from "@/lib/site";

import { deckCopy, type DeckCopy } from "./copy";

/*
 * The deck — the library, and the promise that every field in it is yours.
 *
 * The widget on the right is the app's metadata panel with all seven dots green:
 * the claim of the bullet list ("7/7 fields") shown rather than stated.
 */

export function Deck({ locale }: { locale: Locale }) {
  const copy = deckCopy[locale];

  return (
    <section className="relative isolate bg-[oklch(0.976_0.008_279/0.8)] py-24 sm:py-27">
      <TraceSegment />
      <div className="mx-auto flex max-w-[77.5rem] flex-col items-center gap-12 px-8 sm:px-15 lg:flex-row lg:gap-20">
        <div className="flex flex-1 flex-col gap-4.5">
          <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

          <h2 className="text-foreground-strong font-display flex flex-col text-[clamp(1.75rem,3.4vw,3.125rem)] leading-[1.15] font-bold tracking-[-0.02em]">
            <span>{copy.headingBefore}</span>
            <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
          </h2>

          <p className="text-body max-w-[27.5rem] text-[1.0625rem] leading-[1.65]">{copy.body}</p>

          <ul className="mt-1 flex flex-col gap-2.75">
            {copy.bullets.map((bullet) => (
              <li key={bullet} className="flex items-baseline gap-3">
                <span aria-hidden className="bg-accent size-1.75 flex-none rounded-[2px]" />
                <span className="text-[0.9375rem] leading-[1.5] text-[oklch(0.32_0.02_279)]">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 justify-center lg:flex-[1.1]">
          <MetadataPanel widget={copy.widget} />
        </div>
      </div>
    </section>
  );
}

function MetadataPanel({ widget }: { widget: DeckCopy["widget"] }) {
  return (
    <div className="w-full max-w-[28.125rem] rounded-[1.125rem] border border-[oklch(0.92_0.008_279)] bg-white p-6.5 shadow-[0_30px_70px_oklch(0.35_0.06_277/0.14)]">
      <div className="mb-4.5 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[oklch(0.2_0.01_279)]">{widget.title}</p>
        {/* Seven dots, seven filled fields — the "7/7" of the bullet list. */}
        <div aria-hidden className="flex gap-1.25">
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} className="bg-success size-1.75 rounded-full" />
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {widget.fields.map((field, i) => (
          <div key={field.label} className={`flex flex-col gap-1.25 ${i === 0 ? "col-span-2" : ""}`}>
            <dt className="text-[0.6875rem] font-medium text-[oklch(0.5_0.02_279)]">{field.label}</dt>
            <dd
              className={`rounded-[0.625rem] px-3.5 py-2.75 text-sm ${
                field.highlighted
                  ? "border-accent border-2 bg-[oklch(0.96_0.03_277)] font-medium"
                  : "bg-[oklch(0.965_0.005_279)]"
              }`}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4.5 flex gap-2">
        <p className="text-accent border-accent/40 rounded-full border px-3.5 py-2 text-[0.78125rem] font-medium">
          {widget.rematch}
        </p>
        <p className="rounded-full border border-[oklch(0.9_0.01_279)] px-3.5 py-2 text-[0.78125rem] font-medium text-[oklch(0.42_0.02_279)]">
          {widget.edit}
        </p>
      </div>
    </div>
  );
}
