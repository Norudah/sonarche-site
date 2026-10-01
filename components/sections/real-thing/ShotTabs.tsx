import { useRef } from "react";

import type { RealThingCopy } from "./copy";

type ShotTabsProps = {
  copy: RealThingCopy;
  index: number;
  onSelect: (index: number) => void;
};

/* ARIA tabs pattern: one tab stop (roving tabindex), arrows move between shots and carry focus. */
export function ShotTabs({ copy, index, onSelect }: ShotTabsProps) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const by = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    event.preventDefault();
    const next = (index + by + copy.shots.length) % copy.shots.length;
    onSelect(next);
    tabs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={copy.heading} onKeyDown={onKeyDown} className="flex flex-wrap justify-center gap-2">
      {copy.shots.map((tab, i) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`shot-tab-${tab.id}`}
          ref={(node) => {
            tabs.current[i] = node;
          }}
          aria-selected={i === index}
          aria-controls={`shot-panel-${tab.id}`}
          tabIndex={i === index ? 0 : -1}
          onClick={() => onSelect(i)}
          className={`focus-visible:ring-accent/40 rounded-full border px-4 py-2.25 text-[0.8125rem] font-medium transition-[translate,scale,color,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-0.5 focus-visible:ring-2 active:translate-y-0 active:scale-[0.94] motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors ${
            i === index
              ? "border-accent bg-accent text-accent-foreground shadow-[0_6px_16px_oklch(0.505_0.185_277/0.3)]"
              : "border-border text-body hover:border-accent/40 hover:text-accent bg-white shadow-[0_0_0_oklch(0.32_0.11_277/0)] hover:shadow-[0_4px_12px_oklch(0.32_0.11_277/0.12)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
