import { COMPLETE_ALBUMS } from "./album";
import { Card, Check } from "./Card";
import type { NoExpertiseCopy } from "./copy";
import styles from "./no-expertise.module.css";

/* Rendered settled: bars full, badges in. NoExpertiseMotion replays the fill once on screen. */

const COVER = "flex-none size-7.5 rounded-md bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))]";

export function AlbumsCard({ copy, className }: { copy: NoExpertiseCopy["albums"]; className?: string }) {
  return (
    <Card caption={copy.caption} className={className}>
      <div className="flex flex-col gap-2.5 sm:px-2">
        {COMPLETE_ALBUMS.map((name) => (
          <div
            key={name}
            className="border-separator bg-surface flex items-center gap-3 rounded-xl border px-3 py-2.25"
          >
            <span aria-hidden className={COVER} />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-foreground truncate text-sm font-medium">{name}</span>
              <span aria-hidden className="bg-default h-1 overflow-hidden rounded-sm">
                <span data-nx-fill className="bg-success block h-full w-full origin-left" />
              </span>
            </div>
            <span
              data-nx-badge
              className="text-success flex flex-none items-center gap-1.25 rounded-full bg-[color-mix(in_oklch,var(--success)_13%,var(--surface))] py-0.75 pr-2.25 pl-1.75 text-xs font-semibold whitespace-nowrap"
            >
              <Check className="size-2.75" />
              {copy.badge}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function UncertainCard({ copy, className }: { copy: NoExpertiseCopy["uncertain"]; className?: string }) {
  return (
    <Card caption={copy.caption} className={className}>
      <div className="border-separator bg-surface flex flex-col rounded-[0.875rem] border px-3.5 pt-1.5 pb-2.5">
        <p className="border-separator text-foreground-strong -mx-3.5 mb-1 border-b px-3.5 pb-2 text-[0.78125rem] font-semibold">
          <span className="border-accent border-b-2 pb-2">{copy.tab}</span>
        </p>
        {copy.fields.slice(0, 2).map((field, i) => (
          <div key={field} className="border-separator flex items-center gap-3 border-b py-1.75">
            <span className="text-muted w-13 text-xs">{field}</span>
            <span aria-hidden className="bg-default h-2 rounded" style={{ width: i ? 64 : 90 }} />
            <Check className="text-success ml-auto size-3" />
          </div>
        ))}
        <div className="-mx-2 mt-1 flex items-center gap-3 rounded-lg bg-[color-mix(in_oklch,var(--warning)_9%,var(--surface))] px-2 py-1.75">
          <span className="text-warning w-13 text-xs font-semibold">{copy.fields[2]}</span>
          <span
            aria-hidden
            className="h-3.5 w-11 rounded border-[1.5px] border-dashed border-[color-mix(in_oklch,var(--warning)_55%,var(--surface))]"
          />
          <span className="relative ml-auto flex">
            <span aria-hidden className={`${styles.ring} bg-warning absolute inset-0 rounded-full`} />
            <span
              role="img"
              aria-label={copy.flag}
              className="bg-warning relative flex size-5 items-center justify-center rounded-full"
            >
              <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2v3.4M5 7.6v.1" stroke="var(--snow)" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
