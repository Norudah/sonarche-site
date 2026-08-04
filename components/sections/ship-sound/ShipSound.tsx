import { TraceSegment } from "@/components/trace/TraceSegment";
import type { Locale } from "@/lib/site";

import { shipSoundCopy } from "./copy";
import { PlayerBar } from "./PlayerBar";

/*
 * The ship's sound — the shortest section, and the one that closes the argument
 * of "The old way": the last step used to be moving files into another player,
 * and there is no last step any more.
 *
 * So the proof is a player — and specifically *the* player: the app's own bar,
 * rebuilt rather than illustrated. See PlayerBar.tsx.
 */

export function ShipSound({ locale }: { locale: Locale }) {
  const copy = shipSoundCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
      <TraceSegment />
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 flex max-w-[48.75rem] flex-col text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-3.5 max-w-[41.25rem] text-[1.09rem] leading-relaxed">{copy.body}</p>
      </header>

      <div className="mx-auto mt-11 flex max-w-[64rem] px-8 sm:px-15">
        <PlayerBar copy={copy} />
      </div>
    </section>
  );
}
