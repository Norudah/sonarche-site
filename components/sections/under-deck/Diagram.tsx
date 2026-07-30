import type { DiagramNode } from "./copy";
import styles from "./under-deck.module.css";

/*
 * The architecture, drawn once and laid out twice.
 *
 * The mockup pins seven cards onto a 1180×520 stage. That stage cannot simply
 * shrink — scaled to a phone its 12px labels land at 4px — so the same nodes are
 * a plain stacked list below `lg`, and take their pinned positions above it. One
 * DOM tree, two layouts: nothing is duplicated for a screen reader to read twice.
 *
 * Between `lg` and 1180px the stage is scaled down by a container query rather
 * than reflowed — a diagram's proportions carry its meaning, so it shrinks whole.
 */

const STAGE = { width: 1180, height: 520 };

/** Left, top and width on the stage, in the mockup's pixels. */
const PLACE: Record<DiagramNode["id"], { x: number; y: number; w: number }> = {
  stream: { x: 25, y: 95, w: 170 },
  ytdlp: { x: 295, y: 100, w: 180 },
  ffmpeg: { x: 295, y: 280, w: 180 },
  beets: { x: 560, y: 130, w: 230 },
  musicbrainz: { x: 880, y: 105, w: 210 },
  acoustid: { x: 880, y: 255, w: 210 },
  folder: { x: 560, y: 445, w: 230 },
};

export function Diagram({ nodes, sealed }: { nodes: DiagramNode[]; sealed: string }) {
  return (
    <div className="mx-auto mt-11 w-full max-w-[73.75rem] px-8 sm:px-15">
      <div className="@container relative lg:aspect-[1180/520]">
        <div
          className="flex flex-col gap-3 lg:absolute lg:top-0 lg:left-0 lg:block lg:origin-top-left"
          style={{ "--stage-w": `${STAGE.width}px`, "--stage-h": `${STAGE.height}px` } as never}
        >
          <div className={styles.stage}>
            {/* The sealed runtime: a dashed enclosure around the three tools that
                ship inside the app. Decorative below lg, where the list says it. */}
            <div className={styles.sealedBox} aria-hidden>
              <p className={styles.sealedLabel}>{sealed}</p>
            </div>

            <Connectors />

            {nodes.map((node) => (
              <Node key={node.id} node={node} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-muted mt-6 text-center font-mono text-[0.6875rem] tracking-[0.08em] lg:hidden">{sealed}</p>
    </div>
  );
}

function Node({ node }: { node: DiagramNode }) {
  const place = PLACE[node.id];
  const conductor = node.id === "beets";
  const service = node.id === "musicbrainz" || node.id === "acoustid";
  const mono = node.id === "ytdlp" || node.id === "ffmpeg" || node.id === "folder";

  return (
    <div
      className={`${styles.node} ${conductor ? styles.conductor : ""} ${service ? styles.service : ""}`}
      style={
        {
          "--x": `${place.x}px`,
          "--y": `${place.y}px`,
          "--w": `${place.w}px`,
        } as never
      }
    >
      <p
        className={`${conductor ? "text-accent-strong text-lg font-bold" : "text-foreground-strong text-sm font-semibold"} ${
          mono || conductor ? "font-mono" : "font-display"
        }`}
      >
        {node.title}
      </p>

      {node.aside && conductor ? (
        <p className="text-accent-muted font-serif text-sm leading-tight italic">{node.aside}</p>
      ) : null}

      <p className="text-[0.78125rem] leading-[1.5] text-[oklch(0.5_0.02_279)]">{node.text}</p>

      {node.aside && !conductor ? (
        <p className="text-accent inline-flex items-center gap-1.5 self-start rounded-full bg-[oklch(0.95_0.03_277)] px-2.5 py-1.25 text-[0.6875rem] font-medium">
          <span aria-hidden className="bg-accent size-1.5 rounded-full" />
          {node.aside}
        </p>
      ) : null}
    </div>
  );
}

/* The mockup's own paths. Indigo where the audio travels and dashed where it is
   travelling now; grey where a question goes out and an answer comes back. */
function Connectors() {
  return (
    <svg
      viewBox="0 0 1180 520"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
    >
      <defs>
        <marker id="deck-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </marker>
        <marker id="deck-arrow-soft" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M1,1 L7,4 L1,7" stroke="oklch(0.7 0.04 279)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </marker>
      </defs>

      <path
        d="M195,150 L285,150"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 7"
        markerEnd="url(#deck-arrow)"
        className={styles.flow}
      />
      <path d="M500,150 L560,180" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#deck-arrow)" />
      <path d="M500,330 L560,280" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#deck-arrow)" />
      <path
        d="M790,200 L880,160"
        stroke="oklch(0.7 0.04 279)"
        strokeWidth="2"
        strokeDasharray="3 6"
        markerEnd="url(#deck-arrow-soft)"
      />
      <path
        d="M880,300 L790,260"
        stroke="oklch(0.7 0.04 279)"
        strokeWidth="2"
        strokeDasharray="3 6"
        markerEnd="url(#deck-arrow-soft)"
      />
      <path
        d="M675,350 L675,440"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeDasharray="6 7"
        markerEnd="url(#deck-arrow)"
        className={styles.flow}
      />
    </svg>
  );
}
