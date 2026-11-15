import { EDITED } from "./album";
import { Check, Pointer } from "./Card";
import type { NoExpertiseCopy } from "./copy";
import styles from "./no-expertise.module.css";

/*
 * The album editor, the screen Sonarche was built around. Server-rendered after the edit: genre
 * changed on every track, one artist fixed by hand, saved. NoExpertiseMotion plays the session
 * from the start once the card is on screen. `data-ed-*` are its handles.
 */

const FIELD = "border-border bg-surface rounded-lg border px-2.5 py-1.75 text-[0.78125rem]";
const SWAP = "absolute inset-0 flex items-center gap-1.5 whitespace-nowrap";

export function EditorCard({ copy }: { copy: NoExpertiseCopy["editor"] }) {
  return (
    <article className="border-accent/20 relative flex flex-col gap-7 overflow-hidden rounded-3xl border bg-[linear-gradient(170deg,var(--accent-soft),var(--surface)_46%)] p-4 sm:p-10 lg:col-span-3">
      <header className="flex max-w-[51.25rem] flex-col gap-3 px-1 pt-2 sm:p-0">
        <p className="text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.12em]">{copy.kicker}</p>
        <h3 className="font-display text-foreground-strong text-[clamp(1.625rem,3vw,2.5rem)] leading-[1.12] font-bold tracking-[-0.02em]">
          {copy.heading}
        </h3>
      </header>

      <div
        data-ed-window
        className="bg-surface border-separator relative flex flex-col overflow-hidden rounded-2xl border shadow-[0_50px_90px_-50px_oklch(0.505_0.185_277/0.55),0_16px_32px_-24px_oklch(0.19_0.02_279/0.25)]"
      >
        <div className="border-separator flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <span
            aria-hidden
            className="size-9.5 flex-none rounded-[7px] bg-[linear-gradient(140deg,oklch(0.78_0.08_80),oklch(0.32_0.03_60))]"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-accent font-mono text-[0.59375rem] font-semibold tracking-[0.08em]">
              {copy.eyebrow}
            </span>
            <span className="text-foreground-strong text-sm font-semibold">
              {EDITED.title} <span className="text-muted font-normal">{copy.meta}</span>
            </span>
          </div>
          <span
            data-ed-pill
            className="bg-accent-soft text-accent ml-auto flex items-center gap-1.5 rounded-full px-2.75 py-1.25 text-[0.71875rem] font-semibold whitespace-nowrap"
          >
            <span aria-hidden className="bg-accent size-1.5 rounded-full" />
            {copy.changes}
          </span>
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="border-separator bg-background relative flex flex-col gap-2.75 border-b p-4 md:border-r md:border-b-0">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="border-success text-success flex size-8 flex-none items-center justify-center rounded-full border-[3px] text-[0.5rem] font-bold"
              >
                13/13
              </span>
              <span className="text-foreground text-[0.78125rem] font-medium">{copy.complete}</span>
            </div>
            <span className="text-muted font-mono text-[0.625rem] font-semibold tracking-[0.08em]">{copy.scope}</span>
            <Field label={copy.labels.album} value={EDITED.title} />
            <Field label={copy.labels.albumArtist} value={EDITED.artist} />
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2">
              <Field label={copy.labels.year} value={EDITED.year} />
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[0.6875rem]">{copy.labels.genre}</span>
                <span
                  data-ed-genre
                  className="border-accent bg-surface relative block h-8 rounded-lg border-[1.5px] px-2.5 text-[0.78125rem]"
                >
                  <span data-ed-genre-old className={`${SWAP} left-2.5 opacity-0`}>
                    {EDITED.genreBefore}
                  </span>
                  <span data-ed-genre-new className={`${SWAP} text-foreground-strong left-2.5 font-semibold`}>
                    {EDITED.genreAfter}
                  </span>
                </span>
              </div>
            </div>
            <span className="text-muted text-[0.6875rem]">{copy.family}</span>
            <div className="flex flex-col gap-1.5">
              <span className="text-muted text-[0.6875rem]">{copy.labels.category}</span>
              <div className="flex flex-wrap gap-1.25">
                {copy.categories.map((category, i) => (
                  <span
                    key={category}
                    className={`rounded-full px-2.25 py-1 text-[0.6875rem] ${i === 0 ? "bg-accent text-accent-foreground font-semibold" : "bg-tray text-body"}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div
              data-ed-menu
              aria-hidden
              className="bg-surface border-separator absolute top-[15.5rem] left-[6.5rem] z-10 flex w-49 flex-col gap-px rounded-xl border p-1.5 opacity-0 shadow-[0_20px_40px_-18px_oklch(0.19_0.02_279/0.4)]"
            >
              <span className="text-muted px-2 pt-1.25 pb-0.75 font-mono text-[0.59375rem] font-semibold tracking-[0.08em]">
                {copy.menuFamily}
              </span>
              {copy.menu.map((item) => {
                const picked = item === EDITED.genreAfter;
                return (
                  <span
                    key={item}
                    data-ed-option={picked ? "" : undefined}
                    className={`rounded-md py-1.5 pr-2 pl-4.5 text-xs ${picked ? "bg-accent-soft text-accent-strong font-semibold" : "text-body"}`}
                  >
                    {item}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="border-separator text-muted grid grid-cols-[1.25rem_minmax(0,1fr)_6.5rem] gap-3 border-b px-4 py-2.5 text-[0.65625rem] font-semibold tracking-[0.06em] md:grid-cols-[1.75rem_minmax(0,1fr)_13.75rem_7rem_3.5rem]">
              <span>{copy.columns.number}</span>
              <span>{copy.columns.title}</span>
              <span className="hidden md:block">{copy.columns.artist}</span>
              <span>{copy.columns.genre}</span>
              <span className="hidden md:block">{copy.columns.tags}</span>
            </div>
            {EDITED.tracks.map((title, i) => {
              const guest = i === EDITED.guest;
              return (
                <div
                  key={title}
                  data-ed-row
                  className="border-separator relative grid grid-cols-[1.25rem_minmax(0,1fr)_6.5rem] items-center gap-3 border-b px-4 py-2.5 md:grid-cols-[1.75rem_minmax(0,1fr)_13.75rem_7rem_3.5rem] md:py-3"
                >
                  <span aria-hidden data-ed-flash className="bg-accent-soft absolute inset-0 opacity-0" />
                  <span className="text-muted relative text-xs">{i + 1}</span>
                  <span className="relative flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-[0.78125rem]">{title}</span>
                    <Artist guest={guest} className="h-4 text-[0.6875rem] md:hidden" />
                  </span>
                  <Artist guest={guest} className="hidden h-5 text-xs md:block" />
                  <span className="relative block h-5 text-xs">
                    <span data-ed-old className={`${SWAP} text-muted opacity-0`}>
                      {EDITED.genreBefore}
                    </span>
                    <span data-ed-new className={`${SWAP} text-foreground-strong font-semibold`}>
                      <span aria-hidden className="bg-accent size-1.5 flex-none rounded-[2px]" />
                      {EDITED.genreAfter}
                    </span>
                  </span>
                  <span
                    data-ed-tick
                    className="text-success relative hidden items-center gap-1.25 text-[0.71875rem] md:flex"
                  >
                    <Check className="size-2.75" />
                    7/7
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-separator bg-background flex items-center gap-2.5 border-t px-4 py-2.5 text-xs">
          <span className="border-border bg-surface text-foreground flex items-center gap-1.5 rounded-lg border px-2.75 py-1.75">
            <svg aria-hidden width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v3M6 8v3M1 6h3M8 6h3" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copy.actions.rematch}
          </span>
          <span className="text-body ml-auto">{copy.actions.cancel}</span>
          <span data-ed-save className="bg-accent text-accent-foreground rounded-lg px-3.5 py-2 font-semibold">
            {copy.actions.save}
          </span>
        </div>

        <div
          data-ed-pop
          aria-hidden
          className="bg-surface border-separator absolute top-[45%] right-3 left-3 z-20 flex flex-col gap-2.5 rounded-[0.875rem] border p-3.5 opacity-0 shadow-[0_24px_48px_-20px_oklch(0.19_0.02_279/0.45)] md:right-auto md:left-[52%] md:w-85"
        >
          <p className="text-accent font-mono text-[0.59375rem] font-semibold tracking-[0.08em]">
            {copy.popover.eyebrow}
          </p>
          <p className="text-foreground text-[0.78125rem] leading-[1.45]">{copy.popover.question}</p>
          <div className="flex items-center gap-2">
            <span className="bg-accent text-accent-foreground rounded-full px-2.75 py-1.75 text-[0.71875rem] font-semibold">
              {copy.popover.apply}
            </span>
            <span data-ed-keep className="text-accent rounded-full px-2.75 py-1.75 text-[0.71875rem] font-semibold">
              {copy.popover.keep}
            </span>
          </div>
        </div>

        <span data-ed-cursor className="absolute top-0 left-0 z-30 opacity-0">
          <Pointer />
        </span>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted text-[0.6875rem]">{label}</span>
      <span className={FIELD}>{value}</span>
    </div>
  );
}

/* The artist cell: plain on every track but one, which the session corrects by hand. */
function Artist({ guest, className }: { guest: boolean; className: string }) {
  if (!guest) return <span className={`text-foreground ${className}`}>{EDITED.artist}</span>;

  return (
    <span data-ed-artist className={`relative ${className}`}>
      <span data-ed-artist-old className={`${SWAP} text-foreground opacity-0`}>
        {EDITED.artist}
      </span>
      <span data-ed-artist-new className={`${SWAP} text-foreground-strong truncate font-semibold`}>
        {EDITED.guestArtist}
        <span aria-hidden data-ed-caret className="opacity-0">
          <span className={`${styles.caret} bg-accent inline-block h-3 w-px`} />
        </span>
      </span>
    </span>
  );
}
