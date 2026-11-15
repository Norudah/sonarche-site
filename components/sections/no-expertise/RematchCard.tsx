import { Card, Pointer } from "./Card";
import type { NoExpertiseCopy } from "./copy";

/* A track filed wrong, one click, the fingerprint runs, the track is right. Rendered corrected;
   NoExpertiseMotion replays it once on screen. `data-rm-*` are its handles. */

const BARS = [14, 22, 9, 26, 17, 12, 24, 19, 8, 21, 15, 27, 11, 18, 23, 10, 25, 13, 20, 16, 28, 12];
const SWAP = "absolute top-0 left-0 whitespace-nowrap";

export function RematchCard({ copy, className }: { copy: NoExpertiseCopy["rematch"]; className?: string }) {
  return (
    <Card caption={copy.caption} className={className}>
      <div data-rematch className="relative flex flex-col gap-3">
        <div className="border-separator bg-surface flex items-center gap-2.5 rounded-[10px] border px-3 py-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="relative block h-4.5 text-[0.8125rem] font-medium">
              <span data-rm-old className={`${SWAP} text-foreground opacity-0`}>
                {copy.before.title}
              </span>
              <span data-rm-new className={`${SWAP} text-foreground`}>
                {copy.after.title}
              </span>
            </span>
            <span className="relative block h-4 text-[0.71875rem]">
              <span data-rm-old className={`${SWAP} text-warning opacity-0`}>
                {copy.before.artist}
              </span>
              <span data-rm-new className={`${SWAP} text-muted`}>
                {copy.after.artist}
              </span>
            </span>
          </div>
          <span className="relative h-6 w-18 flex-none">
            <span
              data-rm-old
              role="img"
              aria-label={copy.error}
              className="text-warning absolute inset-0 flex items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--warning)_13%,var(--surface))] text-xs font-bold opacity-0"
            >
              !
            </span>
            <span
              data-rm-new
              className="text-success absolute inset-0 flex items-center justify-center gap-1.25 rounded-full bg-[oklch(0.95_0.04_157)] text-[0.6875rem] font-medium"
            >
              <span aria-hidden className="bg-success size-1.5 rounded-full" />
              {copy.verified}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            data-rm-button
            className="border-border bg-surface text-foreground flex items-center gap-1.5 rounded-[9px] border px-3 py-2 text-xs font-medium"
          >
            <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v3M6 8v3M1 6h3M8 6h3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copy.button}
          </span>
          <span aria-hidden className="flex h-7 flex-1 items-end gap-0.5">
            {BARS.map((height, i) => (
              <span
                key={i}
                data-rm-bar
                className="bg-accent flex-1 origin-bottom rounded-[1.5px] opacity-30"
                style={{ height, transform: "scaleY(0.18)" }}
              />
            ))}
          </span>
        </div>
        <span data-rm-cursor className="absolute top-0 left-0 z-10 opacity-0">
          <Pointer />
        </span>
      </div>
    </Card>
  );
}
