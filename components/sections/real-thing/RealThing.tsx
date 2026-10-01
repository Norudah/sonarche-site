"use client";

import { useState } from "react";

import { SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { realThingCopy } from "./copy";
import type { Theme } from "./shots";
import { ShotRail } from "./ShotRail";
import { ShotTabs } from "./ShotTabs";
import { ThemeSwitch } from "./ThemeSwitch";

const ARROW =
  "border-border text-body hover:border-accent/40 hover:text-accent focus-visible:ring-accent/40 flex size-9 items-center justify-center rounded-full border bg-white text-lg leading-none transition-[scale,color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:scale-115 hover:shadow-[0_6px_16px_oklch(0.32_0.11_277/0.16)] focus-visible:ring-2 active:scale-90 motion-reduce:scale-100 motion-reduce:transition-colors";

/* Every image and caption is in the server HTML; only the visible slide is state. */
export function RealThing({ locale }: { locale: Locale }) {
  const copy = realThingCopy[locale];
  const [index, setIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>("light");
  const shot = copy.shots[index];

  const step = (by: number) => setIndex((i) => (i + by + copy.shots.length) % copy.shots.length);

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
      <SectionHeader kicker={copy.kicker} heading={copy.heading} headingWidth="max-w-[45rem]" />

      <div className="mx-auto mt-9 flex max-w-[76.25rem] flex-col items-center px-8 sm:px-15">
        <ShotTabs copy={copy} index={index} onSelect={setIndex} />
        <ThemeSwitch labels={copy.theme} theme={theme} onChange={setTheme} />
      </div>

      <ShotRail copy={copy} locale={locale} index={index} theme={theme} onStep={step} />

      <div className="mx-auto mt-7 flex max-w-[46rem] flex-col items-center gap-3 px-8">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => step(-1)} aria-label={copy.previous} className={ARROW}>
            ‹
          </button>

          <p className="text-muted font-mono text-xs tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(copy.shots.length).padStart(2, "0")}
          </p>

          <button type="button" onClick={() => step(1)} aria-label={copy.next} className={ARROW}>
            ›
          </button>
        </div>

        {/* The caption is what tells a screen-reader user the picture changed. */}
        <div aria-live="polite" className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-foreground-strong font-display text-xl font-semibold">{shot.title}</p>
          <p className="text-body max-w-[38rem] text-[0.9375rem] leading-[1.6]">{shot.caption}</p>
        </div>
      </div>
    </section>
  );
}
