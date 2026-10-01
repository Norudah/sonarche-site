import { RELEASES_URL, type Locale } from "@/lib/site";

import { downloadCopy } from "./copy";
import styles from "./download.module.css";
import { PlatformMark } from "./icons";
import { ALL_BUILDS } from "./platform";
import { hrefFor, type Release } from "./useLatestRelease";

type BuildsPanelProps = {
  locale: Locale;
  release: Release | null;
};

/* A dropdown hanging below the buttons, so opening it never pushes the page. */
export function BuildsPanel({ locale, release }: BuildsPanelProps) {
  const copy = downloadCopy[locale];

  return (
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
                  <PlatformMark
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

      <div className="border-border/70 mt-1.5 flex flex-col gap-1 border-t px-3.5 pt-2.5 pb-1 text-[0.75rem] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        {/* Empty until the release answers: there is no honest placeholder for a version. */}
        <span className="text-muted">{release ? `${copy.version} ${release.version}` : ""}</span>
        <a href={RELEASES_URL} className="text-muted hover:text-accent shrink-0 transition-colors hover:underline">
          {copy.allReleases}
        </a>
      </div>
    </div>
  );
}
