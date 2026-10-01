"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/site";

import { readingCopy } from "./copy";

/*
 * Read off the DOM after mount: the headings live in hand-written JSX, and a second registry would
 * drift from the text. The anchors themselves are static (see Prose.tsx); this only lists them.
 */

type Heading = {
  id: string;
  text: string;
};

/* From under the sticky header down to the top third of the viewport, where the eye is. */
const OBSERVED_BAND = "-72px 0px -67% 0px";

function useHeadings() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // The headings only exist once the sibling article has rendered; this runs once, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      [...document.querySelectorAll<HTMLHeadingElement>("article h2[id]")].map((node) => ({
        id: node.id,
        text: node.textContent ?? "",
      })),
    );
  }, []);

  return headings;
}

function useCurrentHeading(headings: Heading[]) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arrive unsorted: the current heading is the lowest one in the band. With none
        // in the band, the last one stays current.
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

export function Toc({ locale }: { locale: Locale }) {
  const copy = readingCopy[locale];
  const headings = useHeadings();
  const [active, setActive] = useCurrentHeading(headings);

  if (headings.length < 2) return null;

  return (
    <nav aria-label={copy.tableOfContents} className="sticky top-24">
      <TocList headings={headings} active={active} onPick={setActive} label={copy.tableOfContents} />
    </nav>
  );
}

/** Narrow screens, under the title. Folded while reading, so nothing to observe. */
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
  /** Marks the pick at once instead of waiting for the smooth scroll and the observer. */
  onPick?: (id: string) => void;
  label?: string;
};

function TocList({ headings, active, onPick, label }: TocListProps) {
  return (
    <div className="lg:border-separator lg:bg-surface lg:max-w-[15rem] lg:rounded-2xl lg:border lg:p-5">
      {label && <p className="text-muted mb-3 font-mono text-[0.625rem] tracking-[0.14em] uppercase">{label}</p>}

      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id}>
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
