import type { RealThingCopy } from "./copy";
import { THEMES, type Theme } from "./shots";

type ThemeSwitchProps = {
  labels: RealThingCopy["theme"];
  theme: Theme;
  onChange: (theme: Theme) => void;
};

/* Ink, not the accent, on the active side: a different axis from the tabs above. */
export function ThemeSwitch({ labels, theme, onChange }: ThemeSwitchProps) {
  return (
    <div role="group" aria-label={labels.group} className="border-border mt-4.5 flex rounded-full border bg-white p-1">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={theme === t}
          onClick={() => onChange(t)}
          className={`focus-visible:ring-accent/40 rounded-full px-3.5 py-1.5 text-xs font-medium transition-[color,background-color,box-shadow] duration-200 outline-none focus-visible:ring-2 ${
            theme === t
              ? "bg-foreground-strong text-background shadow-[0_4px_10px_oklch(0.32_0.11_277/0.25)]"
              : "text-body hover:text-accent"
          }`}
        >
          {labels[t]}
        </button>
      ))}
    </div>
  );
}
