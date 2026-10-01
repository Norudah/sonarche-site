import type { DiagramNode } from "./copy";
import styles from "./under-deck.module.css";

/*
 * One DOM tree, two layouts: a stacked list below `lg`, the mockup's pinned 1180px stage above it,
 * scaled down whole by a container query so the diagram keeps its proportions.
 */

/* Tall enough for the longest locale: pinned nodes are not clipped and would overflow the page. */
const STAGE = { width: 1180, height: 610 };

type Box = { x: number; y: number; w: number };

/** Left, top and width on the stage, in the mockup's pixels. */
const PLACE: Partial<Record<DiagramNode["id"], Box>> = {
  stream: { x: 25, y: 60, w: 170 },
  folders: { x: 25, y: 240, w: 170 },
  ytdlp: { x: 295, y: 100, w: 180 },
  ffmpeg: { x: 295, y: 280, w: 180 },
  beets: { x: 560, y: 130, w: 230 },
  folder: { x: 560, y: 445, w: 230 },
};

/* The service groups stack as one column: pinned one by one, their gaps broke in English. */
const COLUMN: Box = { x: 860, y: 15, w: 260 };

/* Where each group's line lands: the midpoint of the two locales' card centres. */
const GROUP_ENTRY = { identify: 85, dress: 236, accompany: 391 };

export function Diagram({ nodes, sealed, note }: { nodes: DiagramNode[]; sealed: string; note: string }) {
  const groups = nodes.filter((node) => node.services);

  return (
    <div className="mx-auto mt-11 w-full max-w-[73.75rem] px-8 sm:px-15">
      {/* A transform does not change layout size: without the clip, the unscaled 1180px box gives
          the page a horizontal scrollbar. The aspect ratio must match STAGE. */}
      <div className="@container relative lg:aspect-[1180/610] lg:overflow-clip">
        <div
          className="flex flex-col gap-3 lg:absolute lg:top-0 lg:left-0 lg:block lg:origin-top-left"
          style={{ "--stage-w": `${STAGE.width}px`, "--stage-h": `${STAGE.height}px` } as never}
        >
          <div className={styles.stage}>
            {/* The tools that ship inside the app. The list below `lg` says it in text. */}
            <div className={styles.sealedBox} aria-hidden>
              <p className={styles.sealedLabel}>{sealed}</p>
            </div>

            <Connectors />

            {nodes.map((node) =>
              node.services ? (
                node.id === groups[0].id ? (
                  <ServiceColumn key="services" groups={groups} note={note} />
                ) : null
              ) : (
                <Node key={node.id} node={node} />
              ),
            )}
          </div>
        </div>
      </div>

      <p className="text-muted mt-6 text-center font-mono text-[0.6875rem] tracking-[0.08em] lg:hidden">{sealed}</p>
    </div>
  );
}

/* `display: contents` below `lg`, so its cards fall back into the list in copy order. */
function ServiceColumn({ groups, note }: { groups: DiagramNode[]; note: string }) {
  return (
    <div className={styles.serviceColumn} style={placement(COLUMN)}>
      {groups.map((group) => (
        <Node key={group.id} node={group} />
      ))}
      <p className={styles.servicesNote}>{note}</p>
    </div>
  );
}

function Node({ node }: { node: DiagramNode }) {
  const place = PLACE[node.id];
  const conductor = node.id === "beets";
  const group = node.services !== undefined;
  const mono = node.id === "ytdlp" || node.id === "ffmpeg" || node.id === "folder";

  return (
    <div
      className={`${styles.node} ${conductor ? styles.conductor : ""} ${group ? styles.service : ""}`}
      style={place && placement(place)}
    >
      <p
        className={`${
          conductor
            ? "text-accent-strong text-lg font-bold"
            : group
              ? "text-accent font-mono text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
              : "text-foreground-strong text-sm font-semibold"
        } ${mono || conductor ? "font-mono" : group ? "" : "font-display"}`}
      >
        {node.title}
      </p>

      {node.aside && conductor ? (
        <p className="text-accent-muted font-serif text-sm leading-tight italic">{node.aside}</p>
      ) : null}

      {node.text ? <p className="text-[0.78125rem] leading-[1.5] text-[oklch(0.5_0.02_279)]">{node.text}</p> : null}

      {node.services ? (
        <ul className="flex flex-col gap-2">
          {node.services.map((service) => (
            <li key={service.name} className="text-[0.78125rem] leading-[1.5] text-[oklch(0.5_0.02_279)]">
              <span className="text-foreground-strong font-mono font-semibold">{service.name}</span> — {service.text}
            </li>
          ))}
        </ul>
      ) : null}

      {node.aside && !conductor ? (
        <p className="text-accent inline-flex items-center gap-1.5 self-start rounded-full bg-[oklch(0.95_0.03_277)] px-2.5 py-1.25 text-[0.6875rem] font-medium">
          <span aria-hidden className="bg-accent size-1.5 rounded-full" />
          {node.aside}
        </p>
      ) : null}
    </div>
  );
}

function placement({ x, y, w }: Box) {
  return { "--x": `${x}px`, "--y": `${y}px`, "--w": `${w}px` } as never;
}

/*
 * From beets to a group along a shared spine at x=838, past the sealed frame's edge at 825 so it
 * doesn't read as a second frame. A near-level group gets a plain diagonal instead.
 */
function elbow(from: number, to: number) {
  const [start, spine, end] = [796, 838, 852];
  const drop = to - from;
  if (Math.abs(drop) < 40) return `M${start},${from} L${end},${to}`;

  const dir = Math.sign(drop);
  const r = 8;

  return [
    `M${start},${from}`,
    `H${spine - r}`,
    `Q${spine},${from} ${spine},${from + dir * r}`,
    `V${to - dir * r}`,
    `Q${spine},${to} ${spine + r},${to}`,
    `H${end}`,
  ].join(" ");
}

/* Indigo where audio travels (dashed while moving), grey for a question and its answer. The viewBox
   must match STAGE or preserveAspectRatio shifts every arrow. */
function Connectors() {
  return (
    <svg
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
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
        <marker id="deck-arrow-soft-back" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" stroke="oklch(0.7 0.04 279)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </marker>
      </defs>

      <path
        d="M205,140 L285,155"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 7"
        markerEnd="url(#deck-arrow)"
        className={styles.flow}
      />
      <path
        d="M205,320 L285,335"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 7"
        markerEnd="url(#deck-arrow)"
        className={styles.flow}
      />

      <path d="M485,165 L552,195" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#deck-arrow)" />
      <path d="M485,330 L552,255" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#deck-arrow)" />

      {/* Elbows: the column is 470px tall against beets' 170, so straight lines would go near-vertical. */}
      {[
        [170, GROUP_ENTRY.identify],
        [214, GROUP_ENTRY.dress],
        [258, GROUP_ENTRY.accompany],
      ].map(([from, to]) => (
        <path
          key={to}
          d={elbow(from, to)}
          stroke="oklch(0.7 0.04 279)"
          strokeWidth="2"
          strokeDasharray="4 5"
          markerEnd="url(#deck-arrow-soft)"
          markerStart="url(#deck-arrow-soft-back)"
        />
      ))}

      {/* Starts under beets' shortest locale; the card paints over the extra length. */}
      <path
        d="M675,284 L675,437"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeDasharray="6 7"
        markerEnd="url(#deck-arrow)"
        className={styles.flow}
      />
    </svg>
  );
}
