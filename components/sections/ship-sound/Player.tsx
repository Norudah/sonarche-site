"use client";

import { useEffect, useRef, useState } from "react";

import type { ShipSoundCopy } from "./copy";
import { Equalizer } from "./Equalizer";
import {
  HeartIcon,
  MicVocalIcon,
  PauseIcon,
  PlayIcon,
  QueueIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeIcon,
} from "./icons";
import { LyricsPanel, QueuePanel } from "./Panels";
import { clock, LINE_SECONDS, QUEUE } from "./queue";

/*
 * The app's player bar, queue popover and a lyrics panel over a capture of the real Album view.
 * From `xl` the frame is always 1080px wide, 0.58 of the capture, so the overlays are drawn at the
 * app's own size and land on the bar and popover they replace. Below that the panels stack with no
 * backdrop. Every control works, but nothing makes sound: the clock is a timer. It starts itself
 * once on screen unless the visitor prefers reduced motion, and stops for good the moment they
 * touch a control.
 */

const TICK_MS = 250;

export function Player({ copy }: { copy: ShipSoundCopy }) {
  const root = useRef<HTMLDivElement>(null);
  const [{ index, seconds }, setPosition] = useState({ index: 0, seconds: 0 });
  const [playing, setPlaying] = useState(false);
  const [touched, setTouched] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(true);
  const [queueOpen, setQueueOpen] = useState(true);

  const track = QUEUE[index];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPosition((p) =>
        p.seconds + TICK_MS / 1000 < QUEUE[p.index].seconds
          ? { index: p.index, seconds: p.seconds + TICK_MS / 1000 }
          : { index: repeat ? p.index : (p.index + 1) % QUEUE.length, seconds: 0 },
      );
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, repeat]);

  useEffect(() => {
    const el = root.current;
    if (!el || touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [touched]);

  const act = (fn: () => void) => () => {
    setTouched(true);
    fn();
  };
  const go = (to: number) => setPosition({ index: (to + QUEUE.length) % QUEUE.length, seconds: 0 });

  const line = track.lyrics ? Math.floor(seconds / LINE_SECONDS) % track.lyrics.length : 0;
  const progress = seconds / track.seconds;

  return (
    <div ref={root} className="mx-auto mt-12 max-w-[75rem] px-8 sm:px-15">
      <div className="bg-surface relative overflow-hidden rounded-[14px] shadow-[0_80px_140px_-60px_oklch(0.505_0.185_277/0.55),0_0_0_1px_var(--separator)]">
        <div className="relative flex flex-col gap-3 p-3 xl:block xl:aspect-[1862/1162] xl:p-0">
          {/* eslint-disable-next-line @next/next/no-img-element --
            static export runs `images.unoptimized`; the webp is sized at commit time. */}
          <img
            /* The app only has French captures for now, as in the real-thing section. */
            src="/shots/fr/light/player.webp"
            alt={copy.backdropAlt}
            width={1862}
            height={1162}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 hidden size-full xl:block"
          />

          {lyricsOpen && <LyricsPanel copy={copy} track={track} line={line} playing={playing} />}
          {queueOpen && (
            <QueuePanel
              copy={copy}
              index={index}
              playing={playing}
              onPick={(k) => {
                setTouched(true);
                go(k);
              }}
            />
          )}
        </div>

        <div className="border-separator bg-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 border-t px-4 py-3 lg:h-19 lg:grid-cols-[18.75rem_minmax(0,1fr)_18.75rem] lg:px-5 lg:py-0 xl:absolute xl:inset-x-0 xl:bottom-0 xl:h-[9.3%] xl:grid-cols-[minmax(0,1fr)_24rem_minmax(0,1fr)] xl:gap-x-0 xl:px-[17px]">
          <div className="flex min-w-0 items-center gap-3 xl:gap-[9px]">
            <span className="relative flex size-13 flex-none items-center justify-center overflow-hidden rounded-md xl:size-10 xl:rounded-[4px]">
              <span aria-hidden className="absolute inset-0" style={{ background: track.cover }} />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Equalizer playing={playing} tone="bg-accent-foreground" />
              </span>
            </span>
            <div className="min-w-0">
              <p className="text-foreground-strong truncate text-sm font-semibold xl:text-[10.5px] xl:font-medium">
                {track.title}
              </p>
              <p className="text-muted truncate text-[0.78125rem] xl:text-[8.5px]">
                {track.artist ?? copy.traditional}
              </p>
            </div>
          </div>

          <div className="col-span-2 row-start-2 flex flex-col items-center gap-0.5 lg:col-span-1 lg:col-start-2 lg:row-start-1 xl:gap-[5px]">
            <div className="flex items-center gap-2.5 xl:gap-[6px]">
              <ToggleButton label={copy.controls.shuffle} on={shuffle} onClick={act(() => setShuffle((v) => !v))}>
                <ShuffleIcon className={ICON} />
              </ToggleButton>
              <IconButton label={copy.controls.previous} onClick={act(() => go(seconds > 3 ? index : index - 1))}>
                <SkipBackIcon className={ICON} />
              </IconButton>
              <button
                type="button"
                aria-label={playing ? copy.controls.pause : copy.controls.play}
                onClick={act(() => setPlaying((p) => !p))}
                className="bg-accent text-accent-foreground flex size-9.5 items-center justify-center rounded-full xl:size-[26px]"
              >
                {playing ? (
                  <PauseIcon className="size-4 fill-current xl:size-[11px]" />
                ) : (
                  <PlayIcon className="size-4 fill-current xl:size-[11px]" />
                )}
              </button>
              <IconButton label={copy.controls.next} onClick={act(() => go(index + 1))}>
                <SkipForwardIcon className={ICON} />
              </IconButton>
              <ToggleButton label={copy.controls.repeat} on={repeat} onClick={act(() => setRepeat((v) => !v))}>
                <RepeatIcon className={ICON} />
              </ToggleButton>
            </div>
            <div className="flex w-full max-w-[32rem] items-center gap-3 xl:max-w-none xl:gap-[9px]">
              <span className="text-body w-9 text-right text-xs tabular-nums xl:w-[20px] xl:text-[8.5px]">
                {clock(seconds)}
              </span>
              <span aria-hidden className="bg-default relative h-1.25 flex-1 overflow-hidden rounded-full xl:h-[3.5px]">
                <span
                  className="bg-accent block h-full w-full origin-left rounded-full"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </span>
              <span className="text-body w-9 text-xs tabular-nums xl:w-[20px] xl:text-[8.5px]">
                {clock(track.seconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 xl:gap-[10px]">
            <span
              aria-hidden
              className="text-foreground hidden size-8.5 items-center justify-center lg:flex xl:size-[21px]"
            >
              <HeartIcon className={ICON} />
            </span>
            <PanelButton label={copy.controls.lyrics} on={lyricsOpen} onClick={act(() => setLyricsOpen((v) => !v))}>
              <MicVocalIcon className={ICON} />
            </PanelButton>
            <PanelButton label={copy.controls.queue} on={queueOpen} onClick={act(() => setQueueOpen((v) => !v))}>
              <QueueIcon className={ICON} />
            </PanelButton>
            <span aria-hidden className="ml-2 hidden items-center gap-2 lg:flex xl:ml-[5px] xl:gap-[11px]">
              <VolumeIcon className="text-foreground size-4.25 xl:size-[12px]" />
              <span className="bg-default relative h-1 w-18.5 rounded-full xl:h-[3px] xl:w-[52px]">
                <span className="bg-foreground absolute inset-y-0 left-0 w-[94%] rounded-full" />
                <span className="bg-surface ring-border absolute top-1/2 left-[94%] size-2.5 -translate-1/2 rounded-full shadow-sm ring-1 xl:size-[7px]" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ICON = "size-4 xl:size-[12px]";

type ButtonProps = { label: string; onClick: () => void; children: React.ReactNode };

function IconButton({ label, onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-foreground hover:bg-tray flex size-8.5 items-center justify-center rounded-full xl:size-[22px]"
    >
      {children}
    </button>
  );
}

function ToggleButton({ label, on, onClick, children }: ButtonProps & { on: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={`hover:bg-tray flex size-8.5 items-center justify-center rounded-full xl:size-[22px] ${on ? "text-accent" : "text-foreground"}`}
    >
      {children}
    </button>
  );
}

function PanelButton({ label, on, onClick, children }: ButtonProps & { on: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      onClick={onClick}
      className={`text-foreground flex size-8.5 items-center justify-center rounded-lg xl:size-[21px] xl:rounded-[5px] ${on ? "bg-tray" : "hover:bg-tray"}`}
    >
      {children}
    </button>
  );
}
