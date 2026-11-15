import { Card, Pointer } from "./Card";
import type { NoExpertiseCopy } from "./copy";

/* Three of the app's "?" with the explanation each opens. Rendered with the first open;
   NoExpertiseMotion moves a pointer from one to the next. `data-help-*` are its handles. */

const BOX = "border-border bg-surface rounded-lg border px-2.5 py-2 text-[0.78125rem]";

export function HelpCard({ copy, className }: { copy: NoExpertiseCopy["help"]; className?: string }) {
  return (
    <Card caption={copy.caption} className={className}>
      <div data-help className="relative grid gap-x-4.5 gap-y-3.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.25">
          <Label text={copy.albumArtist} />
          <span className={BOX}>Daft Punk</span>
          <span className="text-muted text-[0.6875rem]">{copy.filedUnder}</span>
        </div>
        <div className="flex flex-col gap-1.25">
          <Label text={copy.family} />
          <span className="bg-tray text-body rounded-lg px-2.5 py-2 text-[0.78125rem]">{copy.familyValue}</span>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label text={copy.category} />
          <div className="flex flex-wrap gap-1.25">
            {copy.categories.map((category, i) => (
              <span
                key={category}
                className={`rounded-full px-2.25 py-1 text-[0.6875rem] ${i === 0 ? "bg-accent text-accent-foreground font-semibold" : "bg-tray text-body"}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {copy.tips.map((tip, i) => (
          <p
            key={tip}
            data-help-tip
            role="tooltip"
            className={`bg-foreground-strong text-accent-foreground absolute top-7 left-2 z-10 max-w-62.5 rounded-[10px] px-3 py-2.5 text-[0.78125rem] leading-[1.45] shadow-[0_14px_28px_-14px_oklch(0.19_0.02_279/0.5)] ${i ? "opacity-0" : ""}`}
          >
            {tip}
          </p>
        ))}
        <span data-help-cursor className="absolute top-0 left-0 z-20 opacity-0">
          <Pointer />
        </span>
      </div>
    </Card>
  );
}

function Label({ text }: { text: string }) {
  return (
    <span className="text-muted inline-flex items-center gap-1.5 text-[0.71875rem]">
      {text}
      <span
        aria-hidden
        data-help-q
        className="border-accent text-accent inline-flex size-3.75 flex-none items-center justify-center rounded-full border-[1.5px] text-[0.59375rem] font-bold"
      >
        ?
      </span>
    </span>
  );
}
