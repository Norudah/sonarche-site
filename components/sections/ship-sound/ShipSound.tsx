import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { shipSoundCopy } from "./copy";
import { Player } from "./Player";

export function ShipSound({ locale }: { locale: Locale }) {
  const copy = shipSoundCopy[locale];

  return (
    /* Lavender behind the player, back to the next section's own tint at the bottom edge. The
       deep bottom padding keeps the player's glow inside the section, so the next one never
       paints over it with a hard line. */
    <section
      data-anim-gate
      className="relative isolate bg-[linear-gradient(180deg,var(--background),oklch(0.95_0.028_279)_55%,oklch(0.976_0.008_279/0.8))] pt-24 pb-36 sm:pt-27 sm:pb-44"
    >
      <SectionHeader
        kicker={copy.kicker}
        stacked
        heading={
          <>
            <span>{copy.headingBefore}</span> <Emphasis>{copy.headingEmphasis}</Emphasis>
          </>
        }
        headingWidth="max-w-[48.75rem]"
        body={copy.body}
        bodyWidth="max-w-[37.5rem]"
      />

      <Player copy={copy} />
    </section>
  );
}
