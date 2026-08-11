import { SonarcheMark } from "@/components/brand/SonarcheMark";
import { LOCALE_PATH, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";

/*
 * How a post ends, and the only place the journal sells anything.
 *
 * It links to the landing rather than downloading: someone who arrived on an
 * article searched for a problem, not for this app, and the page that makes the
 * case is the one that should make it. The download button also asks GitHub for
 * the latest release on mount — a cost a reading page has no business paying to
 * show a link.
 *
 * The still mark, not the living ark: the vessel's five CSS loops are the
 * landing's, where AnimationGate pauses them off-screen. A card sitting below
 * the fold of every article would run them the whole time someone reads.
 */

export function PostCta({ locale }: { locale: Locale }) {
  const copy = blogCopy[locale];

  return (
    <aside className="border-separator bg-surface mt-16 flex flex-col items-start gap-5 rounded-2xl border p-7 sm:flex-row sm:items-center sm:gap-7">
      <SonarcheMark className="h-16 w-16 shrink-0" />

      <div>
        <p className="text-foreground-strong font-display text-[1.15rem] font-bold tracking-[-0.01em]">
          {copy.ctaTitle}
        </p>
        <p className="text-body mt-2 text-[0.95rem] leading-relaxed">{copy.ctaBody}</p>
        <a
          href={LOCALE_PATH[locale]}
          className="text-accent hover:text-accent-strong mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-medium transition-colors hover:underline hover:underline-offset-4"
        >
          {copy.ctaLink}
          <span aria-hidden>→</span>
        </a>
      </div>
    </aside>
  );
}
