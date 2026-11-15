import type { OldWayCopy } from "./copy";
import styles from "./old-way.module.css";

/* What each tool of the old chain leaves behind, one small drawing per column. Ambient CSS loops;
   reduced motion holds each on a readable frame. */

const FRAME = "border-rust-edge bg-rust-paper h-37.5 rounded-2xl border border-dashed";

const ROW_WIDTHS = [62, 48, 80, 55, 70, 40, 66, 52, 76, 44, 58, 72];

export function Leftover({ index, leftovers }: { index: number; leftovers: OldWayCopy["leftovers"] }) {
  switch (index) {
    case 0:
      return (
        <div className={`${FRAME} flex flex-col justify-center gap-2 p-3.5`}>
          <span aria-hidden className="bg-rust-soft h-2 overflow-hidden rounded">
            <span className={`${styles.crawl} bg-rust block h-full w-full origin-left`} />
          </span>
          <span className="text-rust-ink font-mono text-[0.65625rem] leading-snug break-all">{leftovers.fileName}</span>
        </div>
      );
    case 1:
      return (
        <dl className={`${FRAME} grid grid-cols-[3.5rem_1fr] content-center gap-x-2 gap-y-2 p-3.5 text-xs`}>
          {leftovers.guessedTags.map((tag) => (
            <div key={tag.label} className="contents">
              <dt className="text-muted">{tag.label}</dt>
              <dd className={tag.value ? `${styles.glitch} text-rust font-semibold` : ""}>
                {tag.value || <span className="border-rust-edge block h-4 rounded border-[1.5px] border-dashed" />}
              </dd>
            </div>
          ))}
        </dl>
      );
    case 2:
      return (
        <div className={`${FRAME} relative overflow-hidden p-3.5`}>
          <div aria-hidden className={`${styles.rows} flex flex-col gap-1.5`}>
            {[...ROW_WIDTHS, ...ROW_WIDTHS].map((width, i) => (
              <span
                key={i}
                className={`block h-3 flex-none rounded-[3px] ${i % 3 === 0 ? "bg-rust-edge" : "bg-rust-soft"}`}
                style={{ width: `${width}%` }}
              />
            ))}
          </div>
          <span className="bg-rust font-display text-accent-foreground absolute right-2.5 bottom-2 rounded-full px-2.5 py-1 text-[0.9375rem] font-bold">
            {leftovers.retypeCount}
          </span>
        </div>
      );
    case 3:
      return (
        <div aria-hidden className={`${FRAME} flex items-center justify-center`}>
          <span className="border-rust flex size-26 items-center justify-center rounded-md border-2 border-dashed">
            <span
              className={`${styles.wobble} flex h-21 w-37.5 flex-none flex-col shadow-[0_10px_20px_-10px_oklch(0.19_0.02_279/0.5)]`}
            >
              <span className="h-3 bg-[oklch(0.15_0_0)]" />
              <span className="flex-1 bg-[linear-gradient(140deg,oklch(0.62_0.17_277),oklch(0.38_0.13_290))]" />
              <span className="h-3 bg-[oklch(0.15_0_0)]" />
            </span>
          </span>
        </div>
      );
    default:
      return (
        <div className={`${FRAME} flex flex-col justify-center gap-1.25 p-3 text-[0.71875rem]`}>
          {leftovers.duplicates.map((name, i) => (
            <span
              key={name}
              className={`rounded-md px-2 py-1.25 ${i === 0 ? "bg-surface text-foreground" : `${styles.dup} bg-rust-soft text-rust-ink`}`}
              style={i ? { animationDelay: `${(i - 1) * 0.4}s` } : undefined}
            >
              {name}
            </span>
          ))}
        </div>
      );
  }
}
