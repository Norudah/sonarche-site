import { DownloadCta } from "@/components/download/DownloadCta";
import { type Locale } from "@/lib/site";

import { Colophon } from "./Colophon";
import { footerCopy } from "./copy";
import { Harbour } from "./Harbour";

/* The page opens on the ark in a storm and closes on the same ark in calm water. */
export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];

  return (
    <footer
      data-anim-gate
      className="relative isolate overflow-hidden pt-24 sm:pt-26"
      style={{
        background: "linear-gradient(180deg, oklch(0.982 0.006 279 / 0), oklch(0.972 0.012 277 / 0.82) 60%)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center px-8 text-center sm:px-15">
        <h2 className="text-foreground-strong font-display flex max-w-[46rem] flex-col text-[clamp(2rem,4.1vw,3.625rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-4 max-w-[32.5rem] text-[1.09rem] leading-relaxed">{copy.body}</p>

        <div className="mt-8 w-full">
          <DownloadCta locale={locale} stackedNote />
        </div>

        <p className="mt-8 text-[0.75rem] text-[oklch(0.58_0.02_279)]">{copy.license}</p>

        <p className="mt-1 max-w-[32.5rem] text-[0.71875rem] leading-[1.6] text-[oklch(0.58_0.02_279)]">
          {copy.personalUse}
        </p>
      </div>

      <Harbour>
        <Colophon locale={locale} />
      </Harbour>
    </footer>
  );
}
