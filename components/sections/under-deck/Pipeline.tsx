import type { DiagramNode } from "./copy";
import styles from "./under-deck.module.css";

/*
 * One line, left to right: where the audio comes from, the sealed Python tools, the folder. The
 * services hang under beets. From `lg` it is a pinned 1240×560 stage scaled down whole by a
 * container query; below, the same nodes stack. A packet walks the line and stops at beets while
 * one dot per group runs to the services and back: what beets actually does. Both travel under the
 * cards, which hide them on the way.
 */

const STAGE = { width: 1240, height: 476 };

type Box = { x: number; y: number; w: number };

const PLACE: Partial<Record<DiagramNode["id"], Box>> = {
  ytdlp: { x: 290, y: 70, w: 170 },
  ffmpeg: { x: 496, y: 70, w: 200 },
  beets: { x: 730, y: 56, w: 190 },
  folder: { x: 1050, y: 64, w: 190 },
};

/* One dot per group, in the group's order. */
const DOT_PATHS = ["toLeft", "toMiddle", "toRight"] as const;

export function Pipeline({ nodes, sealed, note }: { nodes: DiagramNode[]; sealed: string; note: string }) {
  const byId = (id: DiagramNode["id"]) => nodes.find((node) => node.id === id);
  const entries = [byId("stream"), byId("folders")].filter((node) => node !== undefined);
  const groups = nodes.filter((node) => node.services);

  return (
    <div className="mx-auto mt-14 w-full max-w-[80rem] px-8 sm:px-15">
      <div className="@container relative lg:aspect-[1240/476] lg:overflow-clip">
        <div
          className={styles.stage}
          style={{ "--stage-w": `${STAGE.width}px`, "--stage-h": `${STAGE.height}px` } as never}
        >
          <div className={styles.sealedBox} aria-hidden>
            <p className={styles.sealedLabel}>{sealed}</p>
          </div>

          <svg
            viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
            fill="none"
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          >
            <path
              d="M190 90 C220 90 230 130 262 130 M190 200 C220 200 230 130 262 130 M1000 130 H1050"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="6 7"
              className={styles.flow}
            />
            <path d="M262 130 H1000" stroke="oklch(0.505 0.185 277 / 0.25)" strokeWidth="6" strokeLinecap="round" />
            <path
              d="M825 214 V290 M253 290 H987 M253 290 V330 M620 290 V330 M987 290 V330"
              stroke="oklch(0.7 0.04 279)"
              strokeWidth="2"
              strokeDasharray="4 5"
            />
          </svg>

          <div aria-hidden className={styles.exchange}>
            {DOT_PATHS.map((path, i) => (
              <span key={path} className={`${styles.dot} ${styles[path]}`} style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
          <span aria-hidden className={styles.packet} />

          <div className={styles.entries}>
            {entries.map((node) => (
              <div key={node.id} className={styles.node}>
                <p className="text-foreground-strong font-display text-[0.84375rem] font-semibold">{node.title}</p>
                <p className="text-accent text-[0.6875rem]">{node.aside}</p>
              </div>
            ))}
          </div>

          {(["ytdlp", "ffmpeg", "beets", "folder"] as const).map((id) => {
            const node = byId(id);
            const place = PLACE[id];
            if (!node || !place) return null;
            const conductor = id === "beets";

            return (
              <div
                key={id}
                className={`${styles.node} ${conductor ? styles.conductor : ""} ${id === "folder" ? styles.end : ""}`}
                style={{ "--x": `${place.x}px`, "--y": `${place.y}px`, "--w": `${place.w}px` } as never}
              >
                <p
                  className={`font-mono font-semibold ${conductor ? "text-accent-strong text-[1.0625rem] font-bold" : "text-foreground-strong text-sm"}`}
                >
                  {node.title}
                </p>
                {conductor && node.aside ? (
                  <p className="text-accent-muted font-serif text-sm leading-tight italic">{node.aside}</p>
                ) : null}
                {node.text ? <p className="text-body text-xs leading-normal">{node.text}</p> : null}
              </div>
            );
          })}

          <div className={styles.services}>
            {groups.map((group) => (
              <div key={group.id} className={styles.service}>
                <p className="text-accent font-mono text-[0.65625rem] font-semibold tracking-[0.08em] uppercase">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.services?.map((service) => (
                    <li key={service.name} className="text-body text-xs leading-normal">
                      <span className="text-foreground-strong font-mono font-semibold">{service.name}</span> —{" "}
                      {service.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className={styles.note}>{note}</p>
          </div>
        </div>
      </div>

      <p className="text-muted mt-6 text-center font-mono text-[0.6875rem] tracking-[0.08em] lg:hidden">{sealed}</p>
    </div>
  );
}
