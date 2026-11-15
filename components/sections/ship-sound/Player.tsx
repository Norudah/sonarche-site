"use client";

import { useEffect, useRef, useState } from "react";

import type { ShipSoundCopy } from "./copy";
import {
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
import { clock, LINE_SECONDS, QUEUE } from "./queue";
import styles from "./ship-sound.module.css";

/*
 * The app's player bar, queue popover and a lyrics panel over the real Album view. Every control
 * works, but nothing makes sound: the clock is a timer. It starts itself once on screen unless the
 * visitor prefers reduced motion, and stops for good the moment they touch a control.
 */

const TICK_MS = 250;
const LYRIC_LINE = 44;

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
  const upNext = QUEUE.map((_, k) => (index + k) % QUEUE.length).slice(1);

  return (
    <div ref={root} className="mx-auto mt-12 max-w-[75rem] px-8 sm:px-15">
      <div className="bg-surface overflow-hidden rounded-[14px] shadow-[0_80px_140px_-60px_oklch(0.505_0.185_277/0.55),0_0_0_1px_var(--separator)]">
        <div className="relative flex flex-col gap-3 p-3 lg:block lg:aspect-[1200/612] lg:p-0">
          {/* eslint-disable-next-line @next/next/no-img-element --
            static export runs `images.unoptimized`; the webp are sized at commit time. */}
          <img
            /* The app only has French captures for now, as in the real-thing section. */
            src="/shots/fr/light/album.webp"
            alt={copy.backdropAlt}
            width={1600}
            height={1040}
            loading="lazy"
            decoding="async"
            className="absolute top-0 left-0 hidden w-[107.5%] max-w-none -translate-x-[3.5%] -translate-y-[3%] lg:block"
          />
          <div aria-hidden className="bg-surface/25 absolute inset-0 hidden lg:block" />

          {lyricsOpen && (
            <section
              aria-label={copy.lyrics.title}
              className="bg-surface relative flex h-60 flex-col overflow-hidden rounded-[18px] shadow-[0_30px_70px_-20px_oklch(0.19_0.02_279/0.35),0_0_0_1px_var(--separator)] lg:absolute lg:right-93 lg:bottom-3 lg:h-82.5 lg:w-105"
            >
              <p className="text-foreground-strong border-separator flex justify-between border-b px-4.5 pt-4 pb-3 text-[0.9375rem] font-semibold">
                {copy.lyrics.title}
                <span className="text-muted self-center font-mono text-[0.625rem] tracking-[0.08em]">
                  {copy.lyrics.synced}
                </span>
              </p>
              <div className="relative flex-1 overflow-hidden">
                {track.lyrics ? (
                  <>
                    <div className="absolute inset-x-5 top-[calc(50%-1.375rem)]">
                      <div
                        className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                        style={{ transform: `translateY(${-line * LYRIC_LINE}px)` }}
                      >
                        {track.lyrics.map((text, k) => (
                          <p
                            key={k}
                            className={`font-display flex h-11 origin-left items-center text-base font-bold whitespace-nowrap transition-[transform,opacity] duration-500 motion-reduce:transition-none lg:text-[1.1875rem] ${
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
                      className="from-surface absolute inset-x-0 top-0 h-16 bg-linear-to-b to-transparent"
                    />
                    <div
                      aria-hidden
                      className="from-surface absolute inset-x-0 bottom-0 h-20 bg-linear-to-t to-transparent"
                    />
                  </>
                ) : (
                  <div aria-hidden className="flex h-full items-center justify-center gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                      <span
                        key={k}
                        className={`${styles.eqBar} ${playing ? "" : styles.paused} bg-accent-soft h-22 w-1.5 rounded-full`}
                        style={{ animationDelay: `${-k * 0.17}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {queueOpen && (
            <section
              aria-label={copy.queue.title}
              className="bg-surface relative rounded-[18px] pb-2 shadow-[0_30px_70px_-20px_oklch(0.19_0.02_279/0.35),0_0_0_1px_var(--separator)] lg:absolute lg:right-4 lg:bottom-3 lg:w-85"
            >
              <p className="text-foreground-strong border-separator flex items-baseline justify-between border-b px-4.5 pt-4 pb-3 text-[0.9375rem] font-semibold">
                {copy.queue.title}
                <span className="text-muted text-[0.78125rem] font-normal">{copy.queue.count}</span>
              </p>
              <p className="text-muted mx-4.5 mt-3 mb-1.5 text-[0.6875rem] font-semibold tracking-[0.08em]">
                {copy.queue.now}
              </p>
              <div className="bg-accent-soft mx-2 flex items-center gap-3 rounded-[10px] px-2.5 py-2">
                <Cover background={track.cover} size="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-accent truncate text-sm font-medium">{track.title}</p>
                  <p className="text-muted text-xs">{track.artist ?? copy.traditional}</p>
                </div>
                <Equalizer playing={playing} tone="bg-accent" />
              </div>
              <p className="text-muted mx-4.5 mt-3.5 mb-1 text-[0.6875rem] font-semibold tracking-[0.08em]">
                {copy.queue.next}
              </p>
              <ul>
                {upNext.slice(0, 4).map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={act(() => go(k))}
                      className="hover:bg-tray mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-[10px] px-2.5 py-1.5 text-left"
                    >
                      <Cover background={QUEUE[k].cover} size="size-9" />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-foreground truncate text-sm">{QUEUE[k].title}</span>
                        <span className="text-muted text-xs">{QUEUE[k].artist ?? copy.traditional}</span>
                      </span>
                      <span className="text-muted text-[0.78125rem]">{clock(QUEUE[k].seconds)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="border-separator bg-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 gap-y-3 border-t px-4 py-3 lg:h-19 lg:grid-cols-[18.75rem_minmax(0,1fr)_18.75rem] lg:px-5 lg:py-0">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex size-13 flex-none items-center justify-center overflow-hidden rounded-md">
              <span aria-hidden className="absolute inset-0" style={{ background: track.cover }} />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Equalizer playing={playing} tone="bg-accent-foreground" />
              </span>
            </span>
            <div className="min-w-0">
              <p className="text-foreground-strong truncate text-sm font-semibold">{track.title}</p>
              <p className="text-muted text-[0.78125rem]">{track.artist ?? copy.traditional}</p>
            </div>
          </div>

          <div className="col-span-2 row-start-2 flex flex-col items-center gap-0.5 lg:col-span-1 lg:row-start-1">
            <div className="flex items-center gap-2.5">
              <ToggleButton label={copy.controls.shuffle} on={shuffle} onClick={act(() => setShuffle((v) => !v))}>
                <ShuffleIcon className="size-4" />
              </ToggleButton>
              <IconButton label={copy.controls.previous} onClick={act(() => go(seconds > 3 ? index : index - 1))}>
                <SkipBackIcon className="size-4.25" />
              </IconButton>
              <button
                type="button"
                aria-label={playing ? copy.controls.pause : copy.controls.play}
                onClick={act(() => setPlaying((p) => !p))}
                className="bg-accent text-accent-foreground flex size-9.5 items-center justify-center rounded-full"
              >
                {playing ? <PauseIcon className="size-4 fill-current" /> : <PlayIcon className="size-4 fill-current" />}
              </button>
              <IconButton label={copy.controls.next} onClick={act(() => go(index + 1))}>
                <SkipForwardIcon className="size-4.25" />
              </IconButton>
              <ToggleButton label={copy.controls.repeat} on={repeat} onClick={act(() => setRepeat((v) => !v))}>
                <RepeatIcon className="size-4" />
              </ToggleButton>
            </div>
            <div className="flex w-full max-w-[32rem] items-center gap-3">
              <span className="text-body w-9 text-right text-xs tabular-nums">{clock(seconds)}</span>
              <span aria-hidden className="bg-default relative h-1.25 flex-1 overflow-hidden rounded-full">
                <span
                  className="bg-accent block h-full w-full origin-left rounded-full"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </span>
              <span className="text-body w-9 text-xs tabular-nums">{clock(track.seconds)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <PanelButton label={copy.controls.lyrics} on={lyricsOpen} onClick={act(() => setLyricsOpen((v) => !v))}>
              <MicVocalIcon className="size-4" />
            </PanelButton>
            <PanelButton label={copy.controls.queue} on={queueOpen} onClick={act(() => setQueueOpen((v) => !v))}>
              <QueueIcon className="size-4" />
            </PanelButton>
            <span aria-hidden className="ml-2 hidden items-center gap-2 lg:flex">
              <VolumeIcon className="text-foreground size-4.25" />
              <span className="bg-default relative h-1 w-18.5 rounded-full">
                <span className="bg-foreground absolute inset-y-0 left-0 w-[94%] rounded-full" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cover({ background, size }: { background: string; size: string }) {
  return <span aria-hidden className={`${size} flex-none rounded-md`} style={{ background }} />;
}

function Equalizer({ playing, tone }: { playing: boolean; tone: string }) {
  return (
    <span aria-hidden className="flex h-3.5 items-end gap-0.5">
      {["-0.6s", "-0.3s", "0s", "-0.45s"].map((delay) => (
        <span
          key={delay}
          className={`${styles.eqBar} ${playing ? "" : styles.paused} ${tone} h-full w-0.75 origin-bottom rounded-[1px]`}
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}

type ButtonProps = { label: string; onClick: () => void; children: React.ReactNode };

function IconButton({ label, onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="text-foreground hover:bg-tray flex size-8.5 items-center justify-center rounded-full"
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
      className={`hover:bg-tray flex size-8.5 items-center justify-center rounded-full ${on ? "text-accent" : "text-foreground"}`}
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
      className={`text-foreground flex size-8.5 items-center justify-center rounded-lg ${on ? "bg-tray" : "hover:bg-tray"}`}
    >
      {children}
    </button>
  );
}
