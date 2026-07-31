"use client";

import { type ReactNode, useState } from "react";

import { RELEASES_URL, type Locale } from "@/lib/site";

import { downloadCopy } from "./copy";
import styles from "./download.module.css";
import { AppleMark, WindowsMark } from "./icons";
import { ALL_BUILDS, BUILDS_FOR, type BuildId } from "./platform";
import { hrefFor, useLatestRelease } from "./useLatestRelease";
import { usePlatform } from "./usePlatform";

/*
 * The page's one call to action: get the app, for the machine you are on.
 *
 * It resolves in three stages, and every one of them is a working link.
 *   1. Server-rendered, and whatever a visitor without JavaScript keeps: one
 *      neutral button pointing at the releases page.
 *   2. Mounted, system known: the right buttons, still on the releases page.
 *   3. Release answered: the same buttons, now on the file itself, with weights.
 * Nothing here can degrade past stage 1, which is the link the site shipped
 * with — so a failure costs a click, never a dead end.
 *
 * macOS renders both chips rather than picking one. Every browser on macOS
 * reports `Intel Mac OS X` whatever the silicon underneath, and the API that
 * knows better exists only on Chromium: guessing would hand a silent failure
 * to whoever we get wrong. See docs/copy/en.md § Download.
 */

const PILL =
  "bg-accent text-accent-foreground font-display text-center hover:bg-accent-strong focus-visible:ring-accent/40 focus-visible:ring-offset-background rounded-full text-base font-semibold shadow-[0_8px_24px_oklch(0.505_0.185_277/0.28)] transition-[translate,scale,box-shadow,background-color] duration-[260ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-1 hover:scale-[1.05] hover:shadow-[0_18px_38px_oklch(0.505_0.185_277/0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.96] active:shadow-[0_4px_12px_oklch(0.505_0.185_277/0.3)] active:duration-75 motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors";

/** The lone button: hero geometry, unchanged from the CTA it replaces. */
const PILL_WIDE = `${PILL} flex-1 px-7.5 py-4`;

/** One of a pair. Narrower, because two of these plus the secondary CTA share
 *  the hero's line — and the platform is already named above them. `flex-1`
 *  so the two come out the same width rather than sized by their labels. */
const PILL_PAIRED = `${PILL} flex-1 px-6 py-4 text-[0.9375rem] whitespace-nowrap`;

/** The platform's mark, chosen by build. Every button and every panel row gets
 *  one — it is what names the platform now that no heading does. */
function Mark({ id, className }: { id: BuildId; className?: string }) {
  return id === "windows-x64" ? <WindowsMark className={className} /> : <AppleMark className={className} />;
}

type DownloadCtaProps = {
  locale: Locale;
  /** Rendered on the same line as the download buttons — the hero puts its
   *  "See how it works ↓" here. The footer passes nothing. */
  children?: ReactNode;
  /** Stack the macOS note and the all-versions toggle, each centred, instead
   *  of sharing a line. The footer can afford the row; the hero cannot — see
   *  the comment on the line itself. */
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
        {/* The pair stays a row on a phone, where everything else stacks: two
            words each, and stacking them would cost the hero a whole button of
            height for no gain in legibility. */}
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
              <Mark id={id} className={isMac ? "h-[1.15em] w-[1.15em] -translate-y-px" : "h-[1em] w-[1em]"} />
              {isMac ? copy.chip[id === "macos-arm64" ? "arm64" : "x64"] : copy.windowsCta}
            </a>
          ))}
        </div>

        {children}
      </div>

      {/* Note and toggle on one line rather than two rows. The hero is a fixed
          stage and every row here pushes the waterline down: two of them cost
          the scroll hint its place under the fold. `stackedNote` opts out where
          vertical space is free. */}
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
            {/* Only where the two actually share a line. Narrower than that the
                note wraps, and a separator left behind reads as a bullet
                hanging off the front of the toggle. */}
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

      {/* A dropdown, not a row: the panel hangs below the cluster without
          taking a line of the page, so opening it never pushes what follows —
          the hero's fixed stage was already absorbing this, the footer was
          not. The blur earns its keep here: the panel now sits on whatever is
          under it. */}
      {showAll && (
        <div
          id="download-all"
          className={`${styles.panel} border-border bg-surface/70 absolute top-full left-1/2 z-20 mt-4 w-full max-w-sm -translate-x-1/2 rounded-2xl border p-2 text-left backdrop-blur-sm`}
        >
          <ul>
            {ALL_BUILDS.map((id) => {
              const build = release?.builds[id];

              return (
                <li key={id}>
                  <a
                    href={hrefFor(release, id, RELEASES_URL)}
                    className="hover:bg-accent/8 focus-visible:ring-accent/40 flex items-center justify-between gap-4 rounded-xl px-3.5 py-2.5 transition-colors outline-none focus-visible:ring-2"
                  >
                    <span className="text-foreground flex items-center gap-2.5 text-[0.875rem] font-medium">
                      <Mark
                        id={id}
                        className={`text-accent-muted shrink-0 ${id === "windows-x64" ? "h-3.5 w-3.5" : "h-4 w-4"}`}
                      />
                      {copy.buildLabel[id]}
                    </span>
                    {build && (
                      <span className="text-muted shrink-0 text-[0.75rem] tabular-nums">
                        {build.sizeMb} {copy.megabytes}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Stacked on a phone: the version and the link do not share a line
              inside a 311px panel, and letting them try wraps the version onto
              two lines under the link. */}
          <div className="border-border/70 mt-1.5 flex flex-col gap-1 border-t px-3.5 pt-2.5 pb-1 text-[0.75rem] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            {/* Absent until the release answers: a version number is a fact
                about the app, and there is no honest placeholder for it. */}
            <span className="text-muted">{release ? `${copy.version} ${release.version}` : ""}</span>
            <a href={RELEASES_URL} className="text-muted hover:text-accent shrink-0 transition-colors hover:underline">
              {copy.allReleases}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
