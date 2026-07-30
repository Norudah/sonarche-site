import type { Locale } from "@/lib/site";

import { underDeckCopy } from "./copy";
import { Diagram } from "./Diagram";

/*
 * Under the deck — the section that names names.
 *
 * It is the one place where yt-dlp, ffmpeg and beets are said out loud, and that
 * is deliberate (see docs/CONTEXT.md § Legal positioning): the page never names a
 * platform, and it always names its own tools.
 */

export function UnderDeck({ locale }: { locale: Locale }) {
  const copy = underDeckCopy[locale];

  return (
    <section className="relative py-24 sm:py-27">
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 max-w-[48.75rem] text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          {copy.headingBefore}{" "}
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
          {copy.headingAfter}
        </h2>

        <p className="text-body mt-3.5 max-w-[41.25rem] text-[1.09rem] leading-relaxed">{copy.body}</p>
      </header>

      <ul className="mx-auto mt-11 grid max-w-[72.5rem] gap-4.5 px-8 sm:px-15 md:grid-cols-3">
        {copy.cards.map((card) => (
          <li
            key={card.tag}
            className="flex flex-col gap-2.5 rounded-2xl border border-[oklch(0.9_0.014_279)] bg-white p-6"
          >
            <p className="text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.08em]">{card.tag}</p>
            <p className="text-foreground-strong font-display text-[1.1875rem] leading-[1.3] font-semibold">
              {card.title}
            </p>
            <p className="text-body text-sm leading-[1.65]">{card.text}</p>
          </li>
        ))}
      </ul>

      <Diagram nodes={copy.nodes} sealed={copy.sealed} />
    </section>
  );
}
