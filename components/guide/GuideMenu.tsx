import { GUIDE_PATH, TOPICS, guidePath, publishedGuides } from "@/lib/guide";
import type { Locale } from "@/lib/site";

import { guideCopy } from "./copy";
import { GuideSections } from "./GuideSections";

type GuideMenuProps = {
  locale: Locale;
  /** The open guide's id; null on the index. */
  current: string | null;
  /** Unfolds the open guide's sections. Off where the menu is folded, on mobile. */
  sections?: boolean;
};

const ROW = "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[0.875rem] leading-snug transition-colors";
const ROW_IDLE = "text-body hover:bg-panel hover:text-foreground-strong font-medium";
const ROW_HERE = "bg-accent-soft text-accent-strong font-semibold";

function Chevron({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-3.5 shrink-0 fill-none stroke-current stroke-[2.2] transition-transform motion-reduce:transition-none ${className}`}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Another guide's title is a link: following it opens that guide, whose own menu then unfolds its
   sections. The open guide's title folds them instead. Topics with nothing published don't render. */
export function GuideMenu({ locale, current, sections = false }: GuideMenuProps) {
  const copy = guideCopy[locale];
  const guides = publishedGuides();

  return (
    <nav aria-label={copy.allGuides}>
      <a
        href={GUIDE_PATH[locale]}
        aria-current={current === null ? "page" : undefined}
        className={`${ROW} ${current === null ? ROW_HERE : ROW_IDLE}`}
      >
        {copy.home}
      </a>

      {TOPICS.map((topic) => {
        const inTopic = guides.filter((guide) => guide.topic === topic);
        if (inTopic.length === 0) return null;

        return (
          <div key={topic} className="mt-6">
            <p className="text-muted mb-1.5 px-2.5 font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase">
              {copy.topics[topic]}
            </p>
            <ul>
              {inTopic.map((guide) => {
                const here = guide.id === current;
                return (
                  <li key={guide.id}>
                    {here && sections ? (
                      // The open guide folds and unfolds its own sections; following its link again would only reload the page.
                      <details open className="group">
                        <summary
                          aria-current="page"
                          className={`${ROW} ${ROW_HERE} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
                        >
                          <span className="flex-1">{guide.title[locale]}</span>
                          <Chevron className="group-open:rotate-90" />
                        </summary>
                        <GuideSections />
                      </details>
                    ) : (
                      <a
                        href={guidePath(guide, locale)}
                        aria-current={here ? "page" : undefined}
                        className={`${ROW} ${here ? ROW_HERE : ROW_IDLE}`}
                      >
                        <span className="flex-1">{guide.title[locale]}</span>
                        <Chevron className={here ? "rotate-90" : ""} />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
