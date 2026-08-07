import type { DiagramNode } from "./copy";
import styles from "./under-deck.module.css";

/*
 * The architecture, drawn once and laid out twice.
 *
 * The mockup pins the cards onto a 1180-wide stage. That stage cannot simply
 * shrink — scaled to a phone its 12px labels land at 4px — so the same nodes are
 * a plain stacked list below `lg`, and take their pinned positions above it. One
 * DOM tree, two layouts: nothing is duplicated for a screen reader to read twice.
 *
 * Between `lg` and 1180px the stage is scaled down by a container query rather
 * than reflowed — a diagram's proportions carry its meaning, so it shrinks whole.
 *
 * Two entries on the left, one conductor in the middle, three service groups on
 * the right. The six services the app actually calls are grouped by the question
 * they answer rather than pinned one card each: six cards would have crushed the
 * stage and turned the arrows into a web.
 */

/*
 * The stage's own coordinate space, and the box the page reserves for it.
 *
 * The height has to clear whichever locale's copy runs longest — the nodes are
 * pinned by top-left and nothing here clips them, so a stage that is too short
 * lets its content hang out and gives the whole page a horizontal scrollbar.
 * The lowest thing on the stage is the note under the service column.
 */
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

/*
 * The three groups and their note are not pinned one by one: they are a column,
 * stacked with an even gap. Pinned individually they held their gaps in French
 * and lost them in English, where "the covers" and "the genres" make the middle
 * card two lines shorter and open a hole under it.
 */
const COLUMN: Box = { x: 860, y: 15, w: 260 };

/*
 * Where each group's line lands on its card. A flex column means the cards move
 * with the copy, so these are the midpoint between the two locales' centres —
 * a few pixels off-centre in each, and inside the card in both.
 */
const GROUP_ENTRY = { identify: 85, dress: 236, accompany: 391 };

export function Diagram({ nodes, sealed, note }: { nodes: DiagramNode[]; sealed: string; note: string }) {
  const groups = nodes.filter((node) => node.services);

  return (
    <div className="mx-auto mt-11 w-full max-w-[73.75rem] px-8 sm:px-15">
      {/* `lg:overflow-clip` is the second half of the stage's scaling. A
          transform never changes an element's layout size, so the box holding
          the scaled 1180px stage still measures 1180px and pushes past this
          column — invisibly, but far enough to give the whole page a horizontal
          scrollbar at 1280. Clipping here drops that phantom box. Nothing real
          is cut as long as this ratio matches STAGE: the drawing scales to
          exactly this width, and its height to exactly this height. */}
      <div className="@container relative lg:aspect-[1180/610] lg:overflow-clip">
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

/*
 * The service column. Below `lg` it is `display: contents` — the wrapper leaves
 * no trace and its cards fall back into the stacked list, in copy order, with
 * the note where it belongs: after the last group, before `/sonarche`.
 */
function ServiceColumn({ groups, note }: { groups: DiagramNode[]; note: string }) {
  return (
    <div className={styles.serviceColumn} style={placement(COLUMN)}>
      {groups.map((group) => (
        <Node key={group.id} node={group} />
      ))}
      {/* What the three groups cost the visitor, which is nothing. Unboxed on
          purpose: a footnote to the column, not a fourth service. */}
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
 * beets' right edge to a group's left edge: out, along a shared spine, and in,
 * with the corners rounded so the turn doesn't read as a break in the line.
 *
 * The spine sits at 838 — past the sealed frame's right edge at 825. Inside it,
 * a vertical would run parallel to the dashed border a dozen pixels away and
 * read as a second frame. Crossing that border horizontally, as the old single
 * arrow did, reads as what it is: a call leaving the sealed runtime.
 *
 * A group close enough to level with beets gets a plain diagonal instead — an
 * elbow over 26px of drop is a kink, not a turn.
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

/* The mockup's own paths. Indigo where the audio travels and dashed where it is
   travelling now; grey where a question goes out and an answer comes back.
   Coordinates are the stage's own — the viewBox has to keep matching STAGE, or
   preserveAspectRatio silently centres the drawing and shifts every arrow. */
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
        {/* The same head, pointing back down its own path, for the question that
            comes home answered. */}
        <marker id="deck-arrow-soft-back" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
          <path d="M7,1 L1,4 L7,7" stroke="oklch(0.7 0.04 279)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </marker>
      </defs>

      {/* The two entries, each coming in by its own door of the sealed box. */}
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

      {/* One line per group, arrowed at both ends: the question leaves, the
          answer comes back. Six services, three lines.

          Elbows rather than the straight diagonals used elsewhere: the column is
          470px tall against beets' 170, so a fan of straight lines would leave
          the top and bottom ones nearly vertical. Bending them off a shared
          spine keeps three legible channels out of the same 60px of gap. */}
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

      {/* Starting under beets' shortest locale rather than beside it: the cards
          paint over the connectors, so the extra length hides where the card is
          taller instead of leaving a gap where it is not. */}
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
