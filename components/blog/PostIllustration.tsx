import type { PostIllustration as Kind } from "@/lib/blog";

/* Drawn in CSS from the app's own vocabulary, so a card needs no image to make. */

type PostIllustrationProps = {
  kind: Kind;
  /** The wide card's larger drawing. */
  large?: boolean;
};

export function PostIllustration({ kind, large = false }: PostIllustrationProps) {
  return (
    <span
      aria-hidden
      className={`border-separator bg-tray block overflow-hidden rounded-xl border p-3.5 ${large ? "h-64 sm:h-[18.75rem]" : "h-32"}`}
    >
      {kind === "tags" && <TagBlock large={large} />}
    </span>
  );
}

/* A file's tag block, one line of it wrong. */
const TAG_ROWS = [
  { key: "TITLE", width: "70%" },
  { key: "ARTIST", width: "55%", wrong: true },
  { key: "ALBUM", width: "80%" },
  { key: "DATE", width: "30%" },
  { key: "TRACK", width: "20%" },
];

function TagBlock({ large }: { large: boolean }) {
  return (
    <span className={`flex h-full flex-col justify-center ${large ? "gap-2" : "gap-1"}`}>
      {TAG_ROWS.map(({ key, width, wrong }) => (
        <span
          key={key}
          className={`flex items-center gap-2.5 rounded-md ${large ? "h-[1.875rem] px-3" : "h-4 px-2"} ${wrong ? "bg-accent" : "bg-surface"}`}
        >
          <span
            className={`font-mono font-semibold tracking-[0.06em] ${large ? "w-13 text-[0.6875rem]" : "w-8 text-[0.5rem]"} ${wrong ? "text-accent-foreground" : "text-muted"}`}
          >
            {key}
          </span>
          <span
            className={`rounded ${large ? "h-[0.4375rem]" : "h-1"} ${wrong ? "bg-accent-foreground/60" : "bg-border"}`}
            style={{ width }}
          />
        </span>
      ))}
    </span>
  );
}
