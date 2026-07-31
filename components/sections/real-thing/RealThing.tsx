"use client";

import { useRef, useState } from "react";

import { TraceSegment } from "@/components/trace/TraceSegment";
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

/* The app's two themes, captured separately in public/shots/<locale>/<theme>/.
   Light first: it is what the rest of the page looks like. */
const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

export function RealThing({ locale }: { locale: Locale }) {
  const copy = realThingCopy[locale];
  const [index, setIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>("light");
  const shot = copy.shots[index];
  const dir = SHOT_LOCALE[locale];

  const step = (by: number) => setIndex((i) => (i + by + copy.shots.length) % copy.shots.length);

  /*
   * Keyboard, per the ARIA tabs pattern: the tablist is one stop in the page's
   * tab order (roving tabindex), and the arrows move between shots and carry the
   * focus with them. Without this the only way through the carousel is five
   * separate tab stops and a mouse, which is what it was.
   */
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (event: React.KeyboardEvent) => {
    const by = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    event.preventDefault();
    const next = (index + by + copy.shots.length) % copy.shots.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  /*
   * The rail carries one clone at each end — the last shot before the first, the
   * first after the last. Without them the first and last slides sit against an
   * empty half of the frame and the composition tips over; with them there is
   * always a neighbour on both sides. They are decoration: no panel role, no id
   * (ids have to stay unique), nothing for a screen reader, and the browser
   * serves both from the same cached file as their originals.
   */
  const rail = [copy.shots[copy.shots.length - 1], ...copy.shots, copy.shots[0]];

  return (
    <section className="relative isolate py-24 sm:py-27">
      <TraceSegment />
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 max-w-[45rem] text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          {copy.heading}
        </h2>
      </header>

      <div className="mx-auto mt-9 flex max-w-[76.25rem] flex-col items-center px-8 sm:px-15">
        <div
          role="tablist"
          aria-label={copy.heading}
          onKeyDown={onTabKey}
          className="flex flex-wrap justify-center gap-2"
        >
          {copy.shots.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`shot-tab-${tab.id}`}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              aria-selected={i === index}
              aria-controls={`shot-panel-${tab.id}`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={`focus-visible:ring-accent/40 rounded-full border px-4 py-2.25 text-[0.8125rem] font-medium transition-[translate,scale,color,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-0.5 focus-visible:ring-2 active:translate-y-0 active:scale-[0.94] motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors ${
                i === index
                  ? "border-accent bg-accent text-accent-foreground shadow-[0_6px_16px_oklch(0.505_0.185_277/0.3)]"
                  : "border-border text-body hover:border-accent/40 hover:text-accent bg-white shadow-[0_0_0_oklch(0.32_0.11_277/0)] hover:shadow-[0_4px_12px_oklch(0.32_0.11_277/0.12)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* One switch for the whole rail, not per slide: the app has two
            themes and the visitor is choosing which app they are looking at,
            not restyling one picture. Ink on the active side rather than the
            accent, so it reads as a different axis from the tabs above. */}
        <div
          role="group"
          aria-label={copy.theme.group}
          className="border-border mt-4.5 flex rounded-full border bg-white p-1"
        >
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
              className={`focus-visible:ring-accent/40 rounded-full px-3.5 py-1.5 text-xs font-medium transition-[color,background-color,box-shadow] duration-200 outline-none focus-visible:ring-2 ${
                theme === t
                  ? "bg-foreground-strong text-background shadow-[0_4px_10px_oklch(0.32_0.11_277/0.25)]"
                  : "text-body hover:text-accent"
              }`}
            >
              {copy.theme[t]}
            </button>
          ))}
        </div>
      </div>

      {/*
       * One rail, five slides, the neighbours left in view.
       *
       * A single shot in a bordered white card was the wrong object: the
       * captures are already windows, with their own chrome and their own pale
       * background, so framing them again put a second, bigger empty rectangle
       * around each one. Nothing is drawn around them here — the neighbours sit
       * back and dim, the rail fades out at the edges, and that is the whole
       * treatment. What you see is a stack of screens, which is what the section
       * is about.
       *
       * Nothing is drawn under them either, and that is deliberate: each webp
       * already carries its own rounded corners and its own soft shadow, baked
       * in with a band of transparent margin around it. A css shadow on this
       * box lands on the *bounds* of that margin, not on the window — a second,
       * bigger, detached rectangle behind the first. Only one shadow can win and
       * it is the one in the picture, so nothing here paints a box.
       *
       * The rail is the only thing on the page that runs the full width of the
       * viewport rather than the text column: the neighbours need somewhere to
       * be, and giving them the margins buys the active shot back most of the
       * width it lost by no longer being alone.
       *
       * `--slide` is the step, in percent of the rail: it drives both how wide a
       * slide is and how far the rail travels, so the two can never drift.
       * `overflow-x: clip` rather than `hidden` — only the horizontal overflow
       * is a scrollbar risk.
       *
       * The fade sits on this box and not on the rail inside it: a mask is
       * resolved in the masked element's own coordinates and then moved by its
       * transform, so putting it on the rail would drag the fade along with the
       * slides and blank the whole thing out as soon as it travelled.
       */}
      <div className="relative mt-8 w-full overflow-x-clip [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [--slide:86%] sm:[--slide:64%] xl:[--slide:58%]">
        <div
          className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(calc(50% - var(--slide) * ${index + 1} - var(--slide) / 2))` }}
        >
          {/* `hidden` would take a slide out of the rail. `inert` takes it out
              of the accessibility tree and out of tab order while leaving it
              in the layout, which is what a rail needs. */}
          {rail.map((slide, k) => {
            const at = k - 1;
            const clone = at < 0 || at >= copy.shots.length;
            const active = at === index;

            return (
              <div
                key={clone ? `clone-${k}` : slide.id}
                {...(clone
                  ? {}
                  : {
                      role: "tabpanel",
                      id: `shot-panel-${slide.id}`,
                      "aria-labelledby": `shot-tab-${slide.id}`,
                    })}
                inert={!active}
                aria-hidden={!active}
                className="shrink-0 px-[1.6%]"
                style={{ flexBasis: "var(--slide)" }}
              >
                {/* `scale`, not `transform`: that is the property Tailwind v4
                    writes, and a transition that names the other one animates
                    nothing. */}
                <div
                  className={`transition-[scale,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    active ? "" : "scale-[0.92] opacity-55"
                  }`}
                >
                  {/* Both themes are in the DOM, stacked, and the switch is a
                      crossfade of opacities: swapping one img's src would blank
                      the frame until the other file decodes. The hidden theme
                      still lazy-loads like any offscreen slide — only the
                      slides near the viewport fetch their second capture. */}
                  <div className="grid [&>img]:[grid-area:1/1]">
                    {THEMES.map((t) => (
                      /* eslint-disable-next-line @next/next/no-img-element --
                        `next/image` buys nothing here: `output: 'export'` runs
                        with `images.unoptimized`, so it would emit this same tag
                        plus a wrapper and some JavaScript. These webp are
                        already sized and compressed at commit time, which is
                        what docs/CONTEXT.md asks for, and the intrinsic
                        dimensions below reserve the space. */
                      <img
                        key={t}
                        src={`/shots/${dir}/${t}/${slide.id}.webp`}
                        alt={clone || t !== theme ? "" : slide.title}
                        aria-hidden={t !== theme}
                        width={SHOT.width}
                        height={SHOT.height}
                        loading={at === 0 && t === "light" ? "eager" : "lazy"}
                        decoding="async"
                        className={`block h-auto w-full transition-opacity duration-300 motion-reduce:transition-none ${
                          t === theme ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The margins either side of the active shot are exactly where the
            neighbours are, so clicking there goes to them — which is what
            anyone tries first. Hidden from assistive tech and from the tab
            order: the real controls are the tablist and the two arrows. */}
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => step(-1)}
          className="absolute inset-y-0 left-0 z-10 w-[calc((100%-var(--slide))/2)]"
        />
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => step(1)}
          className="absolute inset-y-0 right-0 z-10 w-[calc((100%-var(--slide))/2)]"
        />
      </div>

      <div className="mx-auto mt-7 flex max-w-[46rem] flex-col items-center gap-3 px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={copy.previous}
            className="border-border text-body hover:border-accent/40 hover:text-accent focus-visible:ring-accent/40 flex size-9 items-center justify-center rounded-full border bg-white text-lg leading-none transition-[scale,color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:scale-115 hover:shadow-[0_6px_16px_oklch(0.32_0.11_277/0.16)] focus-visible:ring-2 active:scale-90 motion-reduce:scale-100 motion-reduce:transition-colors"
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
            className="border-border text-body hover:border-accent/40 hover:text-accent focus-visible:ring-accent/40 flex size-9 items-center justify-center rounded-full border bg-white text-lg leading-none transition-[scale,color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:scale-115 hover:shadow-[0_6px_16px_oklch(0.32_0.11_277/0.16)] focus-visible:ring-2 active:scale-90 motion-reduce:scale-100 motion-reduce:transition-colors"
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
    </section>
  );
}
