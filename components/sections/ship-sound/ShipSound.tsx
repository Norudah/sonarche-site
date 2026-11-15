import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { shipSoundCopy } from "./copy";
import { Player } from "./Player";

export function ShipSound({ locale }: { locale: Locale }) {
  const copy = shipSoundCopy[locale];

  return (
    <section
      data-anim-gate
      className="from-background relative isolate bg-linear-to-b to-[oklch(0.95_0.028_279)] py-24 sm:py-27"
    >
      <SectionHeader
        kicker={copy.kicker}
        stacked
        heading={
          <>
            <span>{copy.headingBefore}</span>
            <Emphasis>{copy.headingEmphasis}</Emphasis>
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
