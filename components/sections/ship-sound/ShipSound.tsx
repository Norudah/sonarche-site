import { Emphasis, SectionHeader } from "@/components/sections/SectionHeader";
import type { Locale } from "@/lib/site";

import { shipSoundCopy } from "./copy";
import { PlayerBar } from "./PlayerBar";

export function ShipSound({ locale }: { locale: Locale }) {
  const copy = shipSoundCopy[locale];

  return (
    <section data-anim-gate className="relative isolate py-24 sm:py-27">
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
        bodyWidth="max-w-[41.25rem]"
      />

      <div className="mx-auto mt-11 flex max-w-[64rem] px-8 sm:px-15">
        <PlayerBar copy={copy} />
      </div>
    </section>
  );
}
