import type { ShipSoundCopy } from "./copy";
import { Equalizer } from "./Equalizer";
import { clock, QUEUE, type Track } from "./queue";
import styles from "./ship-sound.module.css";

/* The two popovers. From `xl` they sit on the capture at its own scale: the queue exactly over the
   app's queue popover, the lyrics beside it at the same height. Percentages are of the capture. */

const PANEL =
  "bg-surface relative overflow-hidden rounded-[18px] shadow-[0_30px_70px_-20px_oklch(0.19_0.02_279/0.35),0_0_0_1px_var(--separator)] xl:absolute xl:top-[40.1%] xl:bottom-[7.14%] xl:z-10 xl:w-[25.46%] xl:rounded-[12px] xl:shadow-[0_18px_40px_-16px_oklch(0.19_0.02_279/0.3),0_0_0_1px_var(--separator)]";

const HEADER =
  "text-foreground-strong border-separator flex items-baseline justify-between border-b px-4.5 pt-4 pb-3 text-[0.9375rem] font-semibold xl:px-[14px] xl:pt-[11px] xl:pb-[9px] xl:text-[11px]";

const LABEL = "text-muted mx-4.5 text-[0.6875rem] font-semibold tracking-[0.08em] xl:mx-[15px] xl:text-[7.5px]";

type LyricsPanelProps = { copy: ShipSoundCopy; track: Track; line: number; playing: boolean };

export function LyricsPanel({ copy, track, line, playing }: LyricsPanelProps) {
  return (
    <section
      aria-label={copy.lyrics.title}
      className={`${PANEL} flex h-60 flex-col [--line:2.75rem] xl:right-[36.3%] xl:h-auto xl:[--line:22px]`}
    >
      <p className={HEADER}>
        {copy.lyrics.title}
        <span className="text-muted self-center font-mono text-[0.625rem] tracking-[0.08em] xl:text-[7px]">
          {copy.lyrics.synced}
        </span>
      </p>
      <div className="relative flex-1 overflow-hidden">
        {track.lyrics ? (
          <>
            <div className="absolute inset-x-5 top-[calc(50%-var(--line)/2)] xl:inset-x-[14px]">
              <div
                className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(calc(${-line} * var(--line)))` }}
              >
                {track.lyrics.map((text, k) => (
                  <p
                    key={k}
                    className={`font-display flex h-(--line) origin-left items-center text-base font-bold whitespace-nowrap transition-[transform,opacity] duration-500 motion-reduce:transition-none lg:text-[1.1875rem] xl:text-[12.5px] ${
                      k === line ? "text-foreground-strong" : "scale-[0.86] opacity-40"
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
            <div
              aria-hidden
              className="from-surface absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent xl:h-10"
            />
            <div
              aria-hidden
              className="from-surface absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent xl:h-12"
            />
          </>
        ) : (
          <div aria-hidden className="flex h-full items-center justify-center gap-1 xl:gap-[3px]">
            {[0, 1, 2, 3, 4, 5, 6].map((k) => (
              <span
                key={k}
                className={`${styles.eqBar} ${playing ? "" : styles.paused} bg-accent-soft h-22 w-1.5 rounded-full xl:h-12 xl:w-[3px]`}
                style={{ animationDelay: `${-k * 0.17}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type QueuePanelProps = {
  copy: ShipSoundCopy;
  index: number;
  playing: boolean;
  onPick: (index: number) => void;
};

export function QueuePanel({ copy, index, playing, onPick }: QueuePanelProps) {
  const track = QUEUE[index];
  const upNext = QUEUE.map((_, k) => (index + k) % QUEUE.length).slice(1);

  return (
    <section aria-label={copy.queue.title} className={`${PANEL} pb-2 xl:right-[9.77%] xl:pb-[4px]`}>
      <p className={HEADER}>
        {copy.queue.title}
        <span className="text-muted text-[0.78125rem] font-normal xl:text-[8.5px]">{copy.queue.count}</span>
      </p>
      <p className={`${LABEL} mt-3 mb-1.5 xl:mt-[9px] xl:mb-[5px]`}>{copy.queue.now}</p>
      <div className="bg-accent-soft mx-2 flex items-center gap-3 rounded-[10px] px-2.5 py-2 xl:mx-[7px] xl:gap-[9px] xl:rounded-[7px] xl:px-[8px] xl:py-[4px]">
        <Cover background={track.cover} />
        <div className="min-w-0 flex-1">
          <p className="text-accent truncate text-sm font-medium xl:text-[10px]">{track.title}</p>
          <p className="text-muted truncate text-xs xl:text-[8.5px]">{track.artist ?? copy.traditional}</p>
        </div>
        <Equalizer playing={playing} tone="bg-accent" />
      </div>
      <p className={`${LABEL} mt-3.5 mb-1 xl:mt-[8px] xl:mb-[3px]`}>{copy.queue.next}</p>
      <ul>
        {upNext.map((k, i) => (
          <li key={k} className={i >= 4 ? "hidden xl:block" : undefined}>
            <button
              type="button"
              onClick={() => onPick(k)}
              className="hover:bg-tray mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-[10px] px-2.5 py-1.5 text-left xl:mx-[7px] xl:w-[calc(100%-14px)] xl:gap-[9px] xl:rounded-[7px] xl:px-[8px] xl:py-[5.5px]"
            >
              <Cover background={QUEUE[k].cover} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-foreground truncate text-sm xl:text-[10px]">{QUEUE[k].title}</span>
                <span className="text-muted truncate text-xs xl:text-[8.5px]">
                  {QUEUE[k].artist ?? copy.traditional}
                </span>
              </span>
              <span className="text-muted text-[0.78125rem] xl:text-[8.5px]">{clock(QUEUE[k].seconds)}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cover({ background }: { background: string }) {
  return (
    <span
      aria-hidden
      className="size-9 flex-none rounded-md xl:size-[25.5px] xl:rounded-[3px]"
      style={{ background }}
    />
  );
}
