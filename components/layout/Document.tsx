import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/site";

/*
 * The html/body shell, shared by the two root layouts.
 *
 * Two root layouts (app/(en) and app/(fr)) exist so each page can declare its
 * own `lang` — a single root layout would force one language onto both. They
 * both render this, so the shell itself is written once.
 */

type DocumentProps = {
  lang: Locale;
  children: ReactNode;
};

export function Document({ lang, children }: DocumentProps) {
  return (
    <html lang={lang} className="h-full">
      {/* React hoists these into <head>. The Metadata API cannot express a
          font preload, and the hero's wordmark and tagline are the LCP — both
          latin subsets are needed on first paint in either language. */}
      <link
        rel="preload"
        href="/fonts/space-grotesk-latin-wght-normal.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/instrument-serif-latin-400-italic.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
