import type { SceneTags } from "./copy";

/* Labels laid over each diorama: what the drawing is about, in a word. Positions are fractions of
   the 4:3 stage, set against the drawings. Hidden below `sm`, where the scene is too small. */

const PILL =
  "border-separator bg-surface rounded-full border px-3.5 py-1.75 text-sm font-medium shadow-[0_10px_24px_-14px_oklch(0.505_0.185_277/0.45)]";

export function Marks({ step, marks, tags }: { step: number; marks: string[]; tags: SceneTags }) {
  if (step === 0) {
    return (
      <div className="absolute top-[64%] left-[1%] hidden flex-col gap-2 sm:flex">
        {marks.map((mark, i) => (
          <span
            key={mark}
            className={`${PILL} self-start ${i === marks.length - 1 ? "bg-accent text-accent-foreground border-transparent font-semibold" : "text-foreground"}`}
            style={{ marginLeft: `${i * 1.75}rem` }}
          >
            {mark}
          </span>
        ))}
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="bg-surface/85 absolute right-[1%] -bottom-[5%] hidden gap-2 rounded-full p-2 shadow-[0_18px_40px_-18px_oklch(0.505_0.185_277/0.4)] sm:flex">
        {marks.map((mark, i) => {
          const pending = i === marks.length - 1;
          return (
            <span
              key={mark}
              className={`${PILL} flex items-center gap-2 py-1.5 pl-1.5 shadow-none ${pending ? "text-muted" : "text-foreground"}`}
            >
              <span
                aria-hidden
                className={`flex size-5 items-center justify-center rounded-full ${pending ? "" : "text-success bg-[color-mix(in_oklch,var(--success)_15%,var(--surface))]"}`}
              >
                {pending ? (
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="var(--border)" strokeWidth="1.5" />
                    <path
                      d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2 5 8.5l4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {mark}
            </span>
          );
        })}
      </div>
    );
  }

  if (step === 2) {
    return (
      <>
        <span className="border-separator bg-surface text-foreground-strong absolute top-[84%] left-[30%] hidden rounded-lg border px-3 py-1.5 font-mono text-[0.8125rem] font-semibold shadow-[0_10px_24px_-14px_oklch(0.505_0.185_277/0.45)] sm:block">
          {marks[0]}
        </span>
        <span className="bg-accent-soft text-accent border-accent/20 absolute top-[46%] left-[55%] hidden rounded-full border px-3 py-1.5 text-[0.8125rem] font-semibold sm:block">
          {marks[1]}
        </span>
      </>
    );
  }

  return (
    <div className="border-separator bg-surface absolute -top-[6%] -left-[3%] hidden w-[46%] grid-cols-[4.5rem_minmax(0,1fr)] gap-3.5 rounded-2xl border p-3.5 shadow-[0_18px_40px_-18px_oklch(0.505_0.185_277/0.4)] sm:grid">
      <span
        aria-hidden
        className="size-18 rounded-lg bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))]"
      />
      <ul className="flex flex-col gap-1.5">
        {tags.map((tag, i) => (
          <li key={tag} className="flex items-center gap-2">
            <span className="text-muted w-12 font-mono text-[0.6875rem]">{tag}</span>
            <span
              aria-hidden
              className="h-2 rounded bg-[color-mix(in_oklch,var(--accent)_22%,var(--surface))]"
              style={{ width: [92, 64, 100, 56, 28, 40][i] }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
