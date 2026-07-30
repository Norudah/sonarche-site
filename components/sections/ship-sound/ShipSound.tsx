import type { Locale } from "@/lib/site";

import { shipSoundCopy } from "./copy";
import styles from "./ship-sound.module.css";

/*
 * The ship's sound — the shortest section, and the one that closes the argument
 * of "The old way": the last step used to be moving files into another player,
 * and there is no last step any more.
 *
 * So the proof is a player. Not a screenshot of one — a real bar of one, sitting
 * in the page, with the cover breathing and the level moving.
 */

/* Deterministic heights, so the bar is the same on every build. Twenty-eight
   steps of a sine beaten against a slower one — a level meter, not noise. */
const LEVELS = Array.from({ length: 28 }, (_, i) => ({
  height: 6 + Math.round(16 * Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.23 + 1.1))),
  delay: `-${((i * 0.11) % 1.2).toFixed(2)}s`,
}));

export function ShipSound({ locale }: { locale: Locale }) {
  const copy = shipSoundCopy[locale];

  return (
    <section className="relative py-24 sm:py-27">
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 flex max-w-[48.75rem] flex-col text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-3.5 max-w-[41.25rem] text-[1.09rem] leading-relaxed">{copy.body}</p>
      </header>

      <div className="mx-auto mt-11 flex max-w-[46.25rem] px-8 sm:px-15">
        <div className="flex w-full items-center gap-4 rounded-2xl border border-[oklch(0.9_0.01_279)] bg-white p-4 shadow-[0_20px_50px_oklch(0.35_0.06_277/0.1)] sm:gap-5 sm:p-5">
          <div
            aria-hidden
            className={`${styles.cover} bg-accent-soft border-accent/25 flex size-14 flex-none items-center justify-center rounded-xl border sm:size-16`}
          >
            <span className="text-accent text-xl">♫</span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <p className="text-foreground-strong truncate text-sm font-semibold">{copy.track}</p>
              <p className="text-muted truncate text-[0.8125rem]">{copy.artist}</p>
            </div>

            <div aria-hidden className="flex h-6 items-end gap-[3px]">
              {LEVELS.map((level, i) => (
                <span
                  key={i}
                  className={styles.level}
                  style={{ height: `${level.height}px`, animationDelay: level.delay }}
                />
              ))}
            </div>

            <div className="text-muted flex justify-between font-mono text-[0.6875rem]">
              <span>{copy.elapsed}</span>
              <span>{copy.duration}</span>
            </div>
          </div>

          <div aria-hidden className="text-accent flex flex-none items-center gap-3 text-lg">
            <span>⏮</span>
            <span className="bg-accent text-accent-foreground flex size-9 items-center justify-center rounded-full text-sm">
              ▶
            </span>
            <span>⏭</span>
          </div>
        </div>
      </div>
    </section>
  );
}
