"use client";

import { useState } from "react";

import type { Locale } from "@/lib/site";

import { realThingCopy } from "./copy";

/*
 * The real thing — five screenshots of the actual build, and the only section
 * that is a picture rather than a drawing.
 *
 * Interactive, so a client component; but the images and every caption are in
 * the server-rendered HTML from the start — only which slide is showing is
 * state. Without JavaScript the tabs do nothing and the first shot stays up,
 * which is a poorer section, not a broken one.
 *
 * The captures are the app's French UI on both pages for now (Romain's call,
 * 2026-07-30). The path is already per-locale so that dropping English captures
 * into public/shots/en/ and changing one line here is the whole switch.
 */

const SHOT_LOCALE: Record<Locale, string> = { en: "fr", fr: "fr" };

/* The intrinsic size of the exported webp — declared so the frame reserves its
   space and the section does not jump when the first image lands. */
const SHOT = { width: 1600, height: 1040 };

export function RealThing({ locale }: { locale: Locale }) {
  const copy = realThingCopy[locale];
  const [index, setIndex] = useState(0);
  const shot = copy.shots[index];
  const dir = SHOT_LOCALE[locale];

  const step = (by: number) => setIndex((i) => (i + by + copy.shots.length) % copy.shots.length);

  return (
    <section className="relative py-24 sm:py-27">
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 max-w-[45rem] text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          {copy.heading}
        </h2>
      </header>

      <div className="mx-auto mt-9 flex max-w-[76.25rem] flex-col items-center px-8 sm:px-15">
        <div role="tablist" aria-label={copy.heading} className="flex flex-wrap justify-center gap-2">
          {copy.shots.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`shot-tab-${tab.id}`}
              aria-selected={i === index}
              aria-controls={`shot-panel-${tab.id}`}
              onClick={() => setIndex(i)}
              className={`focus-visible:ring-accent/40 rounded-full border px-4 py-2.25 text-[0.8125rem] font-medium transition-colors outline-none focus-visible:ring-2 ${
                i === index
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-body hover:border-accent/40 bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* One rail, five slides. The inactive ones stay in the DOM — clipped, so
            `loading="lazy"` still holds them back until they are asked for. */}
        <div className="border-separator mt-7 w-full overflow-hidden rounded-2xl border bg-white shadow-[0_30px_70px_oklch(0.35_0.06_277/0.14)]">
          <div
            className="flex w-[500%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 20}%)` }}
          >
            {/* `hidden` would take a slide out of the rail. `inert` takes it out
                of the accessibility tree and out of tab order while leaving it
                in the layout, which is what a rail needs. */}
            {copy.shots.map((slide, i) => (
              <div
                key={slide.id}
                role="tabpanel"
                id={`shot-panel-${slide.id}`}
                aria-labelledby={`shot-tab-${slide.id}`}
                inert={i !== index}
                aria-hidden={i !== index}
                className="w-1/5 shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element --
                    `next/image` buys nothing here: `output: 'export'` runs with
                    `images.unoptimized`, so it would emit this same tag plus a
                    wrapper and some JavaScript. These webp are already sized and
                    compressed at commit time, which is what docs/CONTEXT.md asks
                    for, and the intrinsic dimensions below reserve the space. */}
                <img
                  src={`/shots/${dir}/${slide.id}.webp`}
                  alt={slide.title}
                  width={SHOT.width}
                  height={SHOT.height}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex w-full max-w-[46rem] flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={copy.previous}
              className="border-border text-body hover:border-accent/40 hover:text-accent focus-visible:ring-accent/40 flex size-9 items-center justify-center rounded-full border bg-white transition-colors outline-none focus-visible:ring-2"
            >
              ‹
            </button>

            <p className="text-muted font-mono text-xs tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(copy.shots.length).padStart(2, "0")}
            </p>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label={copy.next}
              className="border-border text-body hover:border-accent/40 hover:text-accent focus-visible:ring-accent/40 flex size-9 items-center justify-center rounded-full border bg-white transition-colors outline-none focus-visible:ring-2"
            >
              ›
            </button>
          </div>

          {/* Announced politely: the caption is the only thing that tells a
              screen-reader user the picture changed. */}
          <div aria-live="polite" className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-foreground-strong font-display text-xl font-semibold">{shot.title}</p>
            <p className="text-body max-w-[38rem] text-[0.9375rem] leading-[1.6]">{shot.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
