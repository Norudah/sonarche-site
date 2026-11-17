"use client";

import { useEffect, useState } from "react";

/*
 * The open guide's sections, under its title in the menu. Read off the DOM after mount: the
 * headings live in hand-written JSX, and a second registry would drift from the text. The anchors
 * themselves are static (see Prose.tsx); this only lists them.
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

export function GuideSections() {
  const headings = useHeadings();
  const [active, setActive] = useCurrentHeading(headings);

  if (headings.length === 0) return null;

  return (
    <ul className="mt-1 mb-2 ml-2.5">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            // Marks the pick at once instead of waiting for the smooth scroll and the observer.
            onClick={() => setActive(heading.id)}
            aria-current={active === heading.id ? "location" : undefined}
            className={`block border-l-2 py-1.5 pl-3.5 text-[0.8125rem] leading-snug transition-colors ${
              active === heading.id
                ? "border-accent text-accent-strong font-medium"
                : "border-separator text-body hover:text-foreground-strong"
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
