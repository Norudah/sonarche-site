import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/site";

/* Shared by the two root layouts, which exist so each locale declares its own `lang`. */

type DocumentProps = {
  lang: Locale;
  children: ReactNode;
};

export function Document({ lang, children }: DocumentProps) {
  return (
    <html lang={lang} className="h-full">
      {/* The Metadata API cannot express a font preload; both latin subsets are the hero's LCP. */}
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
