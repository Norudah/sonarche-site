"use client";

import { Fragment, useSyncExternalStore } from "react";

import { LOCALES, LOCALE_PATH, type Locale } from "@/lib/site";

import { preferredLocale } from "./preferredLocale";

/* When the browser prefers the other language, that link is highlighted: a hint, never a redirect. */

/* The preferred languages do not change mid-visit. */
const subscribe = () => () => {};

type LocaleLinksProps = {
  locale: Locale;
  label: string;
  /** The other language's URL for this page; the landing's by default. */
  alternate?: string;
};

export function LocaleLinks({ locale, label, alternate }: LocaleLinksProps) {
  // `navigator` is client-only: the server snapshot keeps hydration in agreement with the HTML.
  const nudge = useSyncExternalStore(
    subscribe,
    () => preferredLocale(navigator.languages) !== locale,
    () => false,
  );

  return (
    <nav aria-label={label} className="flex items-center gap-2 font-mono text-[0.625rem] font-medium tracking-[0.14em]">
      {LOCALES.map((code, i) => (
        <Fragment key={code}>
          {i > 0 && (
            <span aria-hidden className="text-border">
              ·
            </span>
          )}
          {code === locale ? (
            <span aria-current="true" className="text-accent">
              {code.toUpperCase()}
            </span>
          ) : (
            <a
              href={alternate ?? LOCALE_PATH[code]}
              hrefLang={code}
              /* Not the accent: it already marks the current language. */
              className={`hover:text-foreground-strong transition-colors ${
                nudge
                  ? "text-foreground decoration-accent/50 underline decoration-dotted underline-offset-3"
                  : "text-muted"
              }`}
            >
              {code.toUpperCase()}
            </a>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
