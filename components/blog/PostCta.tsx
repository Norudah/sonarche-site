import { SonarcheMark } from "@/components/brand/SonarcheMark";
import { LOCALE_PATH, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";

/* Links to the landing rather than downloading: a reader who arrived on an article came for a
   problem, not the app. The still mark, not the animated ark, whose CSS loops would run the whole
   time someone reads. */

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
