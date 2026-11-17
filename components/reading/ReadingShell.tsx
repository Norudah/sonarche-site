import type { ReactNode } from "react";

import { SiteNav } from "@/components/layout/nav/SiteNav";
import { Colophon } from "@/components/sections/footer/Colophon";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { type Locale } from "@/lib/site";

/* The frame for the journal and the guide: no storm, no sea. The bar and the colophon are the
   landing's. */

type ReadingSection = "journal" | "guide";

type ReadingShellProps = {
  locale: Locale;
  section: ReadingSection;
  /** The other language's URL for the page being framed. */
  alternate: string;
  children: ReactNode;
};

export function ReadingShell({ locale, section, alternate, children }: ReadingShellProps) {
  return (
    <>
      <SiteNav
        locale={locale}
        current={section}
        alternate={alternate}
        guideHref={publishedGuides().length > 0 ? GUIDE_PATH[locale] : null}
      />

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-separator/70 mt-24 border-t pt-4">
        <Colophon locale={locale} alternate={alternate} />
      </footer>
    </>
  );
}
