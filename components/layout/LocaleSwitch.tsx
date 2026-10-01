"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useState } from "react";

import { LOCALES, LOCALE_PATH, type Locale } from "@/lib/site";

import { preferredLocale } from "./preferredLocale";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Hidden over the hero, revealed once the flow nears the top, then kept. Rendered from the start
 * (inert while hidden) so the reveal fades instead of popping. When the browser prefers the other
 * language, that link is highlighted: a hint, never a redirect.
 */

/* Announced, never rendered, so it has no entry in docs/copy. */
const NAV_LABEL: Record<Locale, string> = { en: "Language", fr: "Langue" };

const REVEAL_AT = "top 32%";

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const [shown, setShown] = useState(false);
  const [nudge, setNudge] = useState(false);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#flow",
      start: REVEAL_AT,
      once: true,
      onEnter: () => setShown(true),
    });

    // `once` fires on a crossing only; a reload restored past it never crosses.
    if (trigger.progress > 0) setShown(true);

    // `navigator` is client-only: reading it during render would mismatch hydration.
    setNudge(preferredLocale(navigator.languages) !== locale);

    return () => trigger.kill();
  });

  return (
    <nav
      aria-label={NAV_LABEL[locale]}
      inert={!shown}
      className={`fixed top-4 right-4 z-50 transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none sm:top-5 sm:right-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="border-border/60 bg-surface/70 flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] font-medium tracking-[0.14em] backdrop-blur-md">
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
                href={LOCALE_PATH[code]}
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
      </div>
    </nav>
  );
}
