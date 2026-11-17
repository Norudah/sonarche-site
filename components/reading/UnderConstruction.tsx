import type { Locale } from "@/lib/site";

import { readingCopy } from "./copy";

/* Said plainly on both indexes: the sections ship before they are full, on purpose. */
export function UnderConstruction({ locale, children }: { locale: Locale; children: string }) {
  return (
    <p className="border-separator bg-surface text-body mt-5 inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-2xl border px-3.5 py-2 text-[0.8125rem] leading-snug">
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] font-semibold tracking-[0.14em] text-[oklch(0.45_0.11_70)] uppercase">
        <span aria-hidden className="bg-warning size-1.5 rounded-full" />
        {readingCopy[locale].underConstruction}
      </span>
      <span>{children}</span>
    </p>
  );
}
