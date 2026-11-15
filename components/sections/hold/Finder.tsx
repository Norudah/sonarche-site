import type { HoldCopy } from "./copy";
import { ALBUM, ARTIST, COVER_FILE, DETAILS, OTHER_ALBUM, SELECTED, TRACKS } from "./library";

/* A Finder in column view, so the hierarchy reads left to right. Traffic lights in grey: an
   inactive window, and no off-brand colour. */

const LINE = "oklch(0.93 0.004 260)";

export function Finder({ ui, otherApp }: { ui: HoldCopy["ui"]["macos"]; otherApp: string }) {
  return (
    <div
      className="grid h-[35rem] grid-cols-[minmax(0,1fr)] overflow-hidden rounded-xl bg-[oklch(0.99_0.002_260)] text-[oklch(0.2_0_0)] shadow-[0_50px_100px_-50px_oklch(0.19_0.02_279/0.45),0_0_0_1px_oklch(0.86_0.005_260)] md:grid-cols-[10rem_minmax(0,1fr)]"
      style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}
    >
      <nav
        aria-label="Finder"
        className="hidden flex-col gap-px bg-[oklch(0.955_0.004_260)] px-2.5 py-3.5 text-[0.78125rem] md:flex"
      >
        <span aria-hidden className="flex gap-2 px-1.5 pb-4">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-3 rounded-full bg-[oklch(0.82_0.005_260)]" />
          ))}
        </span>
        <span className="px-2 py-1 text-[0.6875rem] font-semibold text-[oklch(0.55_0_0)]">{ui.favourites}</span>
        {ui.nav.map((item) => (
          <span key={item} className="px-2 py-1.25">
            {item}
          </span>
        ))}
        <span className="rounded-md bg-[oklch(0.89_0.006_260)] px-2 py-1.25 font-semibold">{ui.music}</span>
        <span className="px-2 pt-3 pb-1 text-[0.6875rem] font-semibold text-[oklch(0.55_0_0)]">{ui.places}</span>
        <span className="px-2 py-1.25">{ui.usb}</span>
      </nav>

      <div className="flex min-w-0 flex-col">
        <div className="flex h-12.5 items-center gap-3.5 border-b px-4 text-[0.8125rem]" style={{ borderColor: LINE }}>
          <span aria-hidden className="tracking-[0.5em] text-[oklch(0.55_0_0)]">
            ‹›
          </span>
          <span className="font-semibold">{ALBUM.folder}</span>
          <span className="ml-auto hidden h-6.5 w-40 items-center rounded-[7px] bg-[oklch(0.95_0.004_260)] px-2.5 text-xs text-[oklch(0.55_0_0)] sm:flex">
            {ui.search}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 text-xs">
          <Column items={["Sonarche", otherApp]} selected={0} className="hidden w-36 lg:flex" />
          <Column items={[ARTIST]} selected={0} className="hidden w-28 lg:flex" />
          <Column items={[ALBUM.folder, OTHER_ALBUM]} selected={0} className="hidden w-42 xl:flex" />
          <div className="flex min-w-0 flex-1 flex-col gap-px border-r p-1.5" style={{ borderColor: LINE }}>
            {TRACKS.map((track, i) => (
              <span
                key={track.file}
                className={`truncate rounded-[5px] px-2 py-1 ${i === SELECTED ? "bg-[oklch(0.6_0.15_255)] text-[oklch(0.99_0_0)]" : ""}`}
              >
                ♫ {track.file}
              </span>
            ))}
            <span className="px-2 py-1">▣ {COVER_FILE}</span>
          </div>
          <div className="hidden w-48 flex-none flex-col items-center gap-2.5 p-4 sm:flex">
            <span
              aria-hidden
              className="size-30 rounded-md bg-[linear-gradient(140deg,oklch(0.55_0.12_30),oklch(0.25_0.06_20))] shadow-[0_10px_20px_-10px_oklch(0.19_0.02_279/0.5)]"
            />
            <span className="text-[0.78125rem] font-semibold">{TRACKS[SELECTED].file}</span>
            <dl className="grid w-full grid-cols-[3.5rem_minmax(0,1fr)] gap-y-1.25">
              {ui.details.map((label, i) => (
                <div key={label} className="contents">
                  <dt className="pr-2 text-right text-[oklch(0.5_0_0)]">{label}</dt>
                  <dd className="truncate">{DETAILS[i]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div
          className="flex h-6.5 items-center gap-1.5 border-t px-4 text-[0.71875rem] text-[oklch(0.45_0_0)]"
          style={{ borderColor: LINE }}
        >
          {ui.music} ›{" "}
          <span data-hold-source className="rounded bg-[oklch(0.9_0.03_255)] px-1.5">
            Sonarche
          </span>{" "}
          › {ARTIST} › {ALBUM.folder}
        </div>
      </div>
    </div>
  );
}

function Column({ items, selected, className }: { items: string[]; selected: number; className: string }) {
  return (
    <div className={`${className} flex-none flex-col gap-px border-r p-1.5`} style={{ borderColor: LINE }}>
      {items.map((item, i) => (
        <span
          key={item}
          className={`flex items-center gap-1.5 truncate rounded-[5px] px-2 py-1 ${i === selected ? "bg-[oklch(0.89_0.006_260)] font-semibold" : ""}`}
        >
          <span className="truncate">{item}</span>
          <span aria-hidden className="ml-auto text-[oklch(0.6_0_0)]">
            ›
          </span>
        </span>
      ))}
    </div>
  );
}
