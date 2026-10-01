import type { ShipSoundCopy } from "./copy";
import {
  MusicIcon,
  PlayIcon,
  QueueIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "./icons";
import styles from "./ship-sound.module.css";

/* The app's own player bar layout (src/shared/player/PlayerBar.tsx), with its equalizer timings. */

/* 1:12 of 2:54, held: the app's seek bar reports a position, it does not sweep. */
const PROGRESS = "41%";

const EQ_DELAYS = ["-0.6s", "-0.3s", "0s", "-0.45s"];

export function PlayerBar({ copy }: { copy: ShipSoundCopy }) {
  return (
    <div className="border-separator bg-surface flex w-full items-center gap-4 rounded-2xl border px-4 py-4 shadow-[0_20px_50px_oklch(0.35_0.06_277/0.1)] sm:gap-6 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:w-56 lg:flex-none">
        <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[linear-gradient(140deg,oklch(0.62_0.17_277),oklch(0.38_0.13_290))]">
          <MusicIcon className="size-5 text-white/45" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <div className="text-accent-foreground flex h-3.5 items-end gap-0.5">
              {EQ_DELAYS.map((delay) => (
                <span
                  key={delay}
                  className={`${styles.eqBar} h-full w-0.5 origin-bottom rounded-full bg-current`}
                  style={{ animationDelay: delay }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{copy.track}</p>
          <p className="text-muted truncate text-xs">{copy.artist}</p>
        </div>
      </div>

      <div className="hidden max-w-[35rem] flex-1 flex-col items-center gap-0.5 sm:flex">
        <div aria-hidden className="flex items-center gap-2">
          <ShuffleIcon className="text-muted size-4" />
          <SkipBackIcon className="text-foreground size-4" />
          <span className="bg-accent text-accent-foreground mx-1 flex size-10 items-center justify-center rounded-full">
            <PlayIcon className="size-5 fill-current" />
          </span>
          <SkipForwardIcon className="text-foreground size-4" />
          <RepeatIcon className="text-muted size-4" />
        </div>

        <div aria-hidden className="flex w-full items-center gap-3 py-1">
          <span className="text-muted w-10 text-right text-xs tabular-nums">{copy.elapsed}</span>
          <span className="bg-default relative h-1 flex-1 rounded-full">
            <span className="bg-accent absolute inset-y-0 left-0 rounded-full" style={{ width: PROGRESS }} />
            <span
              className="bg-accent absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
              style={{ left: PROGRESS }}
            />
          </span>
          <span className="text-muted w-10 text-xs tabular-nums">{copy.duration}</span>
        </div>
      </div>

      <div aria-hidden className="hidden flex-1 items-center justify-end gap-3 lg:flex">
        <QueueIcon className="text-muted size-4" />
        <div className="flex w-28 items-center gap-2">
          <VolumeIcon className="text-muted size-4" />
          <span className="bg-default relative h-1 flex-1 rounded-full">
            <span className="bg-accent absolute inset-y-0 left-0 w-[70%] rounded-full" />
          </span>
        </div>
      </div>
    </div>
  );
}
