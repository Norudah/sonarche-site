import type { HoldCopy } from "./copy";
import { ALBUM, ARTIST, COVER_FILE, DETAILS, OTHER_ALBUM, SELECTED, TRACKS } from "./library";

/* A Windows 11 Explorer, drawn generically: no logo, no system font assumed beyond Segoe UI. */

const GRID = "grid grid-cols-[minmax(0,1.5fr)_1.5rem_minmax(0,1fr)_minmax(0,0.7fr)] gap-2.5";
const LINE = "oklch(0.92 0.004 250)";

export function Explorer({ ui, otherApp }: { ui: HoldCopy["ui"]["windows"]; otherApp: string }) {
  return (
    <div
      className="flex h-[35rem] flex-col overflow-hidden rounded-[10px] bg-[oklch(0.985_0.003_250)] text-[oklch(0.2_0_0)] shadow-[0_50px_100px_-50px_oklch(0.19_0.02_279/0.45),0_0_0_1px_oklch(0.86_0.005_250)]"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div aria-hidden className="flex h-10 items-end gap-1 bg-[oklch(0.93_0.006_250)] pl-2.5">
        <span className="flex h-8 items-center gap-2 rounded-t-lg bg-[oklch(0.985_0.003_250)] px-3 text-xs">
          <Folder />
          {ALBUM.folder}
        </span>
        <span className="ml-auto flex h-full">
          {["—", "▢", "✕"].map((glyph) => (
            <span key={glyph} className="flex w-11.5 items-center justify-center text-xs">
              {glyph}
            </span>
          ))}
        </span>
      </div>

      <div aria-hidden className="flex h-10 items-center gap-3.5 border-b px-3.5 text-xs" style={{ borderColor: LINE }}>
        <span>+ {ui.toolbar[0]}</span>
        <span>{ui.toolbar[1]}</span>
        <span>{ui.toolbar[2]}</span>
        <span className="ml-auto">{ui.toolbar[3]}</span>
      </div>

      <div className="flex h-11 items-center gap-2.5 px-3 text-xs">
        <span aria-hidden className="tracking-[0.6em]">
          ←→↑
        </span>
        <span
          className="flex h-7.5 flex-1 items-center gap-1.5 rounded border px-2.5 whitespace-nowrap"
          style={{ borderColor: LINE }}
        >
          › {ui.path.join(" › ")} ›{" "}
          <span data-hold-source className="rounded-sm bg-[oklch(0.9_0.04_250)] px-1.5 py-0.5">
            Sonarche
          </span>{" "}
          › {ARTIST} › {ALBUM.folder}
        </span>
        <span
          className="hidden h-7.5 w-52 items-center rounded border px-2.5 text-[oklch(0.5_0_0)] xl:flex"
          style={{ borderColor: LINE }}
        >
          {ui.search}
        </span>
      </div>

      <div
        className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] border-t md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_14rem]"
        style={{ borderColor: LINE }}
      >
        <nav aria-label="Explorer" className="hidden flex-col gap-px p-2 text-xs md:flex">
          {ui.nav.map((item) => (
            <span key={item} className="px-2.5 py-1">
              {item}
            </span>
          ))}
          <TreeRow depth={0} open label={ui.music} />
          <TreeRow depth={1} open label="Sonarche" />
          <TreeRow depth={2} open label={ARTIST} />
          <TreeRow depth={3} open selected label={ALBUM.folder} />
          <TreeRow depth={3} label={OTHER_ALBUM} />
          <TreeRow depth={1} label={otherApp} />
          <span className="mx-2.5 my-1.5 h-px" style={{ background: LINE }} />
          <span className="px-2.5 py-1">{ui.thisPc}</span>
          <span className="px-2.5 py-1">{ui.usb}</span>
        </nav>

        <div className="flex min-w-0 flex-col border-l text-xs" style={{ borderColor: LINE }}>
          <div className={`${GRID} border-b px-3 py-1.5 text-[oklch(0.4_0_0)]`} style={{ borderColor: LINE }}>
            {ui.columns.map((column) => (
              <span key={column} className="truncate">
                {column}
              </span>
            ))}
          </div>
          {TRACKS.map((track, i) => (
            <div
              key={track.file}
              className={`${GRID} px-3 py-1.25 whitespace-nowrap ${i === SELECTED ? "bg-[oklch(0.9_0.04_250)]" : ""}`}
            >
              <span className="truncate">♫ {track.file}</span>
              <span>{track.number}</span>
              <span className="truncate">{track.title}</span>
              <span className="truncate">{ARTIST}</span>
            </div>
          ))}
          <div className={`${GRID} px-3 py-1.25`}>
            <span>▣ {COVER_FILE}</span>
          </div>
        </div>

        <div className="hidden flex-col gap-3 border-l p-4 text-xs xl:flex" style={{ borderColor: LINE }}>
          <span
            aria-hidden
            className="size-27.5 rounded bg-[linear-gradient(140deg,oklch(0.55_0.12_30),oklch(0.25_0.06_20))]"
          />
          <span className="text-[0.8125rem] font-semibold">{TRACKS[SELECTED].file}</span>
          <dl className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-y-1.5">
            {ui.details.map((label, i) => (
              <div key={label} className="contents">
                <dt className="text-[oklch(0.45_0_0)]">{label}</dt>
                <dd>{DETAILS[i]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div
        className="flex h-6.5 items-center gap-4 border-t px-3 text-[0.71875rem] text-[oklch(0.4_0_0)]"
        style={{ borderColor: LINE }}
      >
        <span>{ui.status[0]}</span>
        <span>{ui.status[1]}</span>
      </div>
    </div>
  );
}

function TreeRow({
  depth,
  label,
  open,
  selected,
}: {
  depth: number;
  label: string;
  open?: boolean;
  selected?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded py-1 pr-2 whitespace-nowrap ${selected ? "bg-[oklch(0.9_0.04_250)] font-semibold" : ""}`}
      style={{ paddingLeft: `${10 + depth * 14}px` }}
    >
      <span aria-hidden className="w-2 text-[0.5rem]">
        {open ? "▾" : "›"}
      </span>
      <Folder />
      <span className="truncate">{label}</span>
    </span>
  );
}

function Folder() {
  return (
    <svg aria-hidden width="15" height="13" viewBox="0 0 16 14" className="flex-none">
      <path
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3.2l1.5 1.6h6.3A1.5 1.5 0 0 1 15 4.1v7.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11.5Z"
        fill="oklch(0.83 0.13 85)"
      />
    </svg>
  );
}
