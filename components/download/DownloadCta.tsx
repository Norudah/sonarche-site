"use client";

import { type ReactNode, useState } from "react";

import { RELEASES_URL, type Locale } from "@/lib/site";

import { downloadCopy } from "./copy";
import { BuildsPanel } from "./BuildsPanel";
import { PlatformMark } from "./icons";
import { BUILDS_FOR } from "./platform";
import { hrefFor, useLatestRelease } from "./useLatestRelease";
import { usePlatform } from "./usePlatform";

/*
 * Every stage is a working link: server-rendered it points at the releases page, once the platform
 * is known it shows the right buttons, and once the release answers they point at the file itself.
 * macOS gets both chips: every macOS browser reports "Intel", and guessing fails silently.
 */

const PILL =
  "bg-accent text-accent-foreground font-display text-center hover:bg-accent-strong focus-visible:ring-accent/40 focus-visible:ring-offset-background rounded-full text-base font-semibold shadow-[0_8px_24px_oklch(0.505_0.185_277/0.28)] transition-[translate,scale,box-shadow,background-color] duration-[260ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-1 hover:scale-[1.05] hover:shadow-[0_18px_38px_oklch(0.505_0.185_277/0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.96] active:shadow-[0_4px_12px_oklch(0.505_0.185_277/0.3)] active:duration-75 motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors";

const PILL_WIDE = `${PILL} flex-1 px-7.5 py-4`;

const PILL_PAIRED = `${PILL} flex-1 px-6 py-4 text-[0.9375rem] whitespace-nowrap`;

type DownloadCtaProps = {
  locale: Locale;
  /** Rendered on the buttons' line (the hero's "See how it works"). */
  children?: ReactNode;
  /** Stack the note and the toggle; the hero keeps them on one line to save height. */
  stackedNote?: boolean;
};

export function DownloadCta({ locale, children, stackedNote }: DownloadCtaProps) {
  const copy = downloadCopy[locale];
  const platform = usePlatform();
  const release = useLatestRelease();
  const [showAll, setShowAll] = useState(false);

  const builds = platform ? BUILDS_FOR[platform] : [];
  const isMac = platform === "macos";

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="flex w-full max-w-xs flex-col items-stretch gap-3.5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
        {/* The pair stays a row on a phone: stacking would cost the hero a button's height. */}
        <div className="flex items-stretch gap-3 sm:gap-3.5">
          {builds.length === 0 && (
            <a href={RELEASES_URL} className={PILL_WIDE}>
              {copy.neutral}
            </a>
          )}

          {builds.map((id) => (
            <a
              key={id}
              href={hrefFor(release, id, RELEASES_URL)}
              className={`${isMac ? PILL_PAIRED : PILL_WIDE} inline-flex items-center justify-center gap-2.5`}
            >
              <PlatformMark id={id} className={isMac ? "h-[1.15em] w-[1.15em] -translate-y-px" : "h-[1em] w-[1em]"} />
              {isMac ? copy.chip[id === "macos-arm64" ? "arm64" : "x64"] : copy.windowsCta}
            </a>
          ))}
        </div>

        {children}
      </div>

      <div
        className={`mt-3.5 text-[0.78125rem] ${
          stackedNote
            ? "flex flex-col items-center gap-1.5"
            : "flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1"
        }`}
      >
        {isMac && (
          <>
            <span className="text-muted">{copy.whichMac}</span>
            {/* Only where they share a line; a wrapped separator reads as a bullet. */}
            {!stackedNote && (
              <span className="text-muted/45 hidden sm:inline" aria-hidden>
                ·
              </span>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setShowAll((open) => !open)}
          aria-expanded={showAll}
          aria-controls="download-all"
          className="text-muted hover:text-accent cursor-pointer underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
        >
          {showAll ? copy.hideAll : copy.showAll}
        </button>
      </div>

      {showAll && <BuildsPanel locale={locale} release={release} />}
    </div>
  );
}
