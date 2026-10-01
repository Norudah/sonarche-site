import type { ReactNode } from "react";

import type { Locale } from "@/lib/site";

import { ReadingShell, type ReadingSection } from "./ReadingShell";

type ReadingIndexProps = {
  locale: Locale;
  section: ReadingSection;
  alternate: string;
  title: string;
  dek: string;
  children: ReactNode;
};

export function ReadingIndex({ locale, section, alternate, title, dek, children }: ReadingIndexProps) {
  return (
    <ReadingShell locale={locale} section={section} alternate={alternate}>
      <div className="mx-auto w-full max-w-[38rem] px-6 pt-16 sm:px-0 sm:pt-24">
        <h1 className="text-foreground-strong font-display text-[clamp(2.25rem,5.5vw,3rem)] leading-[1.1] font-bold tracking-[-0.025em]">
          {title}
        </h1>
        <p className="text-body mt-4 text-[1.09rem] leading-relaxed">{dek}</p>

        {children}
      </div>
    </ReadingShell>
  );
}
