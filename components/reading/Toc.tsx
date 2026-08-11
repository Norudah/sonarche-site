"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/site";

import { readingCopy } from "./copy";

/*
 * The table of contents, read off the page it belongs to.
 *
 * A client component, and one of the few on this site, for a reason that is not
 * decoration: the headings live inside the prose, which is hand-written JSX, and
 * nothing on the server can see them without rendering it. Listing them a second
 * time in a registry would be a list that silently stops matching the text.
 * Reading the DOM once after mount is the only version of this that cannot go
 * stale.
 *
 * What it does NOT do is invent the anchors — those are in the static html,
 * written by the H2/H3 components in Prose.tsx, so a copied section link works
 * with or without javascript. This only reads them.
 *
 * Two forms, two places in the page, and that is why they are two components
 * rather than one that hides half of itself: on a wide screen the card lives in
 * the margin beside the text, and on a narrow one it belongs *after* the title,
 * folded — a summary of an article you have not been told the name of yet is a
 * strange first thing to meet.
 */

type Heading = {
  id: string;
  text: string;
  /** 2 or 3 — a level 3 is indented under the level 2 above it. */
  level: number;
};

/* The band the current heading is chosen in: from just under the sticky header
   down to a third of the viewport. A heading is current while it sits in the
   top third of what is being read, which is where the eye actually is. */
const OBSERVED_BAND = "-72px 0px -67% 0px";

/** The headings of the article on this page, in document order. */
function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    /*
     * The rule below guards against state that could have been derived during
     * render. These headings cannot be: they only exist once the article has
     * rendered, and this component sits beside it, not inside it. It runs once,
     * on mount, with nothing that can fire it again.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      [...document.querySelectorAll<HTMLHeadingElement>("article h2[id], article h3[id]")].map((node) => ({
        id: node.id,
        text: node.textContent ?? "",
        level: Number(node.tagName[1]),
      })),
    );
  }, []);

  return headings;
}

/**
 * Which heading the reader is in, tracked with an IntersectionObserver over a
 * band across the top of the viewport rather than a scroll handler: no listener
 * running on every frame, and the browser does the work.
 */
function useCurrentHeading(headings: Heading[]) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        /*
         * Two headings can share the band when they sit close together. The one
         * that counts is the lowest — the last one crossed on the way down —
         * and that has to be decided by position, not by the order the entries
         * arrive in: a callback's entries are not sorted by anything.
         *
         * When none are in the band, which is most of the time inside a long
         * section, the last known heading stays current. That is the point.
         */
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActive(visible[visible.length - 1].target.id);
      },
      { rootMargin: OBSERVED_BAND },
    );

    headings.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [headings]);

  return [active, setActive] as const;
}

/** The card in the margin. Wide screens only — its holder decides that. */
export function Toc({ locale }: { locale: Locale }) {
  const copy = readingCopy[locale];
  const headings = useHeadings();
  const [active, setActive] = useCurrentHeading(headings);

  // One heading summarises nothing. Render nothing rather than an empty box —
  // the column holds its width either way, so the article does not move.
  if (headings.length < 2) return null;

  return (
    <nav aria-label={copy.tableOfContents} className="sticky top-24">
      <TocList headings={headings} active={active} onPick={setActive} label={copy.tableOfContents} />
    </nav>
  );
}

/**
 * The same list, folded, for narrow screens — sitting under the title and above
 * the text. No observer: it is closed while the reader scrolls, so there is
 * nothing to highlight and no reason to watch anything.
 */
export function TocFolded({ locale }: { locale: Locale }) {
  const copy = readingCopy[locale];
  const headings = useHeadings();

  if (headings.length < 2) return null;

  return (
    <details className="border-separator bg-surface mt-8 rounded-2xl border px-5 py-4 lg:hidden">
      <summary className="text-foreground-strong font-display cursor-pointer text-[0.8125rem] font-medium tracking-[0.02em]">
        {copy.tableOfContents}
      </summary>
      <div className="mt-3">
        <TocList headings={headings} />
      </div>
    </details>
  );
}

type TocListProps = {
  headings: Heading[];
  active?: string;
  /** Marks the picked entry at once, rather than waiting for the smooth scroll
   *  to end and the observer to catch up. A click should answer immediately. */
  onPick?: (id: string) => void;
  label?: string;
};

function TocList({ headings, active, onPick, label }: TocListProps) {
  return (
    <div className="lg:border-separator lg:bg-surface lg:max-w-[15rem] lg:rounded-2xl lg:border lg:p-5">
      {label && <p className="text-muted mb-3 font-mono text-[0.625rem] tracking-[0.14em] uppercase">{label}</p>}

      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3" : undefined}>
            <a
              href={`#${heading.id}`}
              onClick={() => onPick?.(heading.id)}
              aria-current={active === heading.id ? "location" : undefined}
              className={`block text-[0.8125rem] leading-snug transition-colors ${
                active === heading.id ? "text-accent font-medium" : "text-body hover:text-foreground-strong"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
