import type { Locale } from "@/lib/site";

import { holdCopy } from "./copy";
import { FileTree } from "./FileTree";

/*
 * The hold is yours — the section that has to be believed rather than admired.
 *
 * So it shows a folder. Not a diagram of a folder, not an abstraction: the
 * actual path, the actual file names, sitting next to the folder your other app
 * already uses. Everything else in this section is a caption to that drawing.
 */

export function Hold({ locale }: { locale: Locale }) {
  const copy = holdCopy[locale];

  return (
    <section className="relative bg-[oklch(0.976_0.008_279/0.8)] py-24 sm:py-27">
      <header className="flex flex-col items-center px-8 text-center sm:px-15">
        <p className="text-accent font-sans text-xs font-semibold tracking-[0.3em]">{copy.kicker}</p>

        <h2 className="text-foreground-strong font-display mt-4 flex max-w-[50rem] flex-col text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-3.5 max-w-[42.5rem] text-[1.09rem] leading-relaxed">
          {copy.bodyBefore}{" "}
          <code className="font-mono text-base font-medium text-[oklch(0.35_0.06_277)]">{copy.bodyPath}</code>{" "}
          {copy.bodyAfter}
        </p>
      </header>

      <div className="mx-auto mt-12 flex max-w-[72.5rem] flex-col items-center gap-10 px-8 sm:px-15 lg:flex-row lg:gap-14">
        <FileTree otherApp={copy.otherApp} />

        <div className="flex flex-1 flex-col gap-4">
          <p className="font-display max-w-[27.5rem] text-[1.375rem] leading-[1.35] font-semibold text-[oklch(0.24_0.02_279)]">
            {copy.note}
          </p>

          <ul className="flex flex-col gap-2.75">
            {copy.destinations.map((destination) => (
              <li
                key={destination.where}
                className="flex flex-col gap-1 rounded-xl border border-[oklch(0.9_0.01_279)] bg-white px-4.25 py-3.5 sm:flex-row sm:items-center sm:gap-3.25"
              >
                <span aria-hidden className="text-accent flex-none font-mono text-[0.8125rem]">
                  →
                </span>
                <span className="flex-none text-sm font-medium text-[oklch(0.28_0.02_279)] sm:w-[9.375rem]">
                  {destination.where}
                </span>
                <span className="text-[0.8125rem] leading-[1.45] text-[oklch(0.5_0.02_279)]">{destination.note}</span>
              </li>
            ))}
          </ul>

          <p className="text-accent-muted mt-0.5 font-serif text-[1.1875rem] leading-normal italic">{copy.closer}</p>
        </div>
      </div>
    </section>
  );
}
