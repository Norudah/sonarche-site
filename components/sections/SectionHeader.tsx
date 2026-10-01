import type { ReactNode } from "react";

type Tone = "accent" | "rust";

const TONE: Record<Tone, string> = { accent: "text-accent", rust: "text-rust" };

export function Kicker({ children, tone = "accent" }: { children: string; tone?: Tone }) {
  return <p className={`${TONE[tone]} font-sans text-xs font-semibold tracking-[0.3em]`}>{children}</p>;
}

/** The italic serif half of a section heading. */
export function Emphasis({ children, tone = "accent" }: { children: string; tone?: Tone }) {
  return <em className={`${TONE[tone]} font-serif text-[1.08em] leading-none italic`}>{children}</em>;
}

type SectionHeaderProps = {
  kicker: string;
  tone?: Tone;
  heading: ReactNode;
  /** One line per child of `heading`. */
  stacked?: boolean;
  /** A max-width utility. */
  headingWidth: string;
  body?: ReactNode;
  bodyWidth?: string;
};

export function SectionHeader({ kicker, tone, heading, stacked, headingWidth, body, bodyWidth }: SectionHeaderProps) {
  return (
    <header className="flex flex-col items-center px-8 text-center sm:px-15">
      <Kicker tone={tone}>{kicker}</Kicker>

      <h2
        className={`text-foreground-strong font-display mt-4 text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em] ${stacked ? "flex flex-col" : ""} ${headingWidth}`}
      >
        {heading}
      </h2>

      {body && <p className={`text-body mt-3.5 text-[1.09rem] leading-relaxed ${bodyWidth}`}>{body}</p>}
    </header>
  );
}
