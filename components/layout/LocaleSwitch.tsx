"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useState } from "react";

import { LOCALES, LOCALE_PATH, type Locale } from "@/lib/site";

import { preferredLocale } from "./preferredLocale";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * FR · EN, top right — but not on arrival.
 *
 * The hero is the one thing on this page that gets a clean screen, so nothing
 * is allowed to sit over it at first paint. The switch fades in when the flow
 * has climbed near the top of the viewport — by then the visitor is
 * reading rather than looking — and once in, it stays: scrolling back up to the
 * hero does not take it away, because a control that comes and goes with the
 * scroll is a control nobody trusts. A reload puts it back to hidden, which is
 * the whole of its memory. Nothing is stored.
 *
 * It is rendered from the start rather than mounted on the way in: a freshly
 * mounted element has no previous state to transition from, and the fade would
 * be a pop. Hidden it is `inert`, so it is out of the tab order and out of the
 * accessibility tree until it is really there.
 *
 * The static-export constraint is why this exists at all — no server, so no
 * redirect on Accept-Language, so the choice has to be visible. The footer keeps
 * its own link: this one needs JavaScript to ever appear, that one does not.
 *
 * One more thing it does: when the visitor's browser says they do not read this
 * page's language, the other one is inked in and given a dotted rule, so that a
 * reader who landed on the wrong side can see there is a right side. It is a
 * hint and never an action — nobody gets moved anywhere. Sending someone to a
 * page they did not ask for breaks the back button, overrides a choice they may
 * have made on purpose, and guesses on evidence that is often wrong.
 */

/* The only string on the site that is not in docs/copy — it is never rendered,
   only announced, and the deck has no entry for it. */
const NAV_LABEL: Record<Locale, string> = { en: "Language", fr: "Langue" };

/* Where the first section under the hero has to reach, as a share of the
   viewport height, for the switch to be earned. */
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

    // `once` only fires on a crossing, and a reload restores the scroll
    // position — someone refreshing halfway down the page would never cross it.
    if (trigger.progress > 0) setShown(true);

    // Read here rather than during render: `navigator` does not exist on the
    // server, and a lazy initial state would resolve differently on the two
    // sides of hydration. This hook already runs once, after mount, on the
    // client only, which is exactly when the answer becomes knowable.
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
                /* Ink and a dotted rule, not colour: the accent is spoken for
                   by the current language a few pixels to the left, and two
                   coloured items in a 75px pill is a pill with no hierarchy. */
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
