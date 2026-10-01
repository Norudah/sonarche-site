import type { Locale } from "@/lib/site";

import type { RealThingCopy } from "./copy";
import { SHOT_DIR, SHOT_SIZE, THEMES, type Theme } from "./shots";

type ShotRailProps = {
  copy: RealThingCopy;
  locale: Locale;
  index: number;
  theme: Theme;
  onStep: (by: number) => void;
};

/*
 * Full-bleed, with the neighbours dimmed in view. No frame or shadow: each webp bakes in its own
 * window chrome and shadow. `--slide` drives both the slide width and the rail's travel. The fade
 * mask sits on the outer box, since a mask on the rail would move with its transform.
 */
export function ShotRail({ copy, locale, index, theme, onStep }: ShotRailProps) {
  /* A clone at each end so the first and last shots still have a neighbour on both sides. */
  const rail = [copy.shots[copy.shots.length - 1], ...copy.shots, copy.shots[0]];

  return (
    <div className="relative mt-8 w-full overflow-x-clip [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [--slide:86%] sm:[--slide:64%] xl:[--slide:58%]">
      <div
        className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(calc(50% - var(--slide) * ${index + 1} - var(--slide) / 2))` }}
      >
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
              {/* `scale`, not `transform`: Tailwind v4 writes the `scale` property. */}
              <div
                className={`transition-[scale,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  active ? "" : "scale-[0.92] opacity-55"
                }`}
              >
                {/* Both themes stacked and crossfaded: swapping a src would blank the frame while decoding. */}
                <div className="grid [&>img]:[grid-area:1/1]">
                  {THEMES.map((t) => (
                    /* eslint-disable-next-line @next/next/no-img-element --
                      static export runs `images.unoptimized`; the webp are sized at commit time. */
                    <img
                      key={t}
                      src={`/shots/${SHOT_DIR[locale]}/${t}/${slide.id}.webp`}
                      alt={clone || t !== theme ? "" : slide.title}
                      aria-hidden={t !== theme}
                      width={SHOT_SIZE.width}
                      height={SHOT_SIZE.height}
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

      {/* Clicking a neighbour goes to it. Hidden from assistive tech: the tablist and arrows are the controls. */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => onStep(-1)}
        className="absolute inset-y-0 left-0 z-10 w-[calc((100%-var(--slide))/2)]"
      />
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={() => onStep(1)}
        className="absolute inset-y-0 right-0 z-10 w-[calc((100%-var(--slide))/2)]"
      />
    </div>
  );
}
