/*
 * The hold, as a folder.
 *
 * The rows carry a depth and a kind rather than a font and a colour: the styling
 * is the component's business, and keeping it out of the data is what lets the
 * one localised row (the other app's folder) stay a plain string.
 *
 * File and album names are not translated — they are what is actually on disk.
 */

type Row = {
  depth: number;
  kind: "open" | "closed" | "track" | "art";
  name: string;
};

const GLYPH: Record<Row["kind"], string> = {
  open: "▾",
  closed: "▸",
  track: "♫",
  art: "▣",
};

export function FileTree({ otherApp }: { otherApp: string }) {
  const rows: Row[] = [
    { depth: 0, kind: "open", name: "Music" },
    { depth: 1, kind: "open", name: "Sonarche" },
    { depth: 2, kind: "open", name: "Ghost" },
    { depth: 3, kind: "open", name: "Seven Inches of Satanic Panic (2019)" },
    { depth: 4, kind: "track", name: "01 Kiss the Go-Goat.opus" },
    { depth: 4, kind: "track", name: "02 Mary on a Cross.opus" },
    { depth: 4, kind: "art", name: "cover.jpg" },
    { depth: 1, kind: "closed", name: otherApp },
  ];

  return (
    <div className="w-full flex-none rounded-2xl border border-[oklch(0.9_0.01_279)] bg-white px-6.5 py-6 shadow-[0_20px_50px_oklch(0.35_0.06_277/0.1)] lg:w-[26.25rem]">
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-center gap-2 font-mono text-[0.8125rem] leading-snug"
            style={{ paddingLeft: `${row.depth * 18}px` }}
          >
            <span aria-hidden className="text-[oklch(0.68_0.02_279)]">
              {GLYPH[row.kind]}
            </span>
            <span className={rowTone(row)}>{row.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Sonarche's own folder is the only one picked out in indigo — it is the point
   of the drawing: one folder among the others, not a container around them. */
function rowTone(row: Row): string {
  if (row.name === "Sonarche") return "font-semibold text-accent";
  if (row.kind === "closed") return "text-[oklch(0.62_0.02_279)]";
  if (row.kind === "art") return "text-[oklch(0.55_0.02_279)]";
  if (row.kind === "track") return "text-[oklch(0.5_0.02_279)]";
  return "font-medium text-[oklch(0.3_0.02_279)]";
}
