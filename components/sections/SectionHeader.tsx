import type { ReactNode } from "react";

type Tone = "accent" | "rust";

const TONE: Record<Tone, string> = { accent: "text-accent", rust: "text-rust" };

/* A span, so it can sit inside the section's h2: the kicker is the plain-words half of the heading. */
function Kicker({ children, tone = "accent" }: { children: string; tone?: Tone }) {
  return <span className={`${TONE[tone]} block font-sans text-xs font-semibold tracking-[0.3em]`}>{children}</span>;
}

/** The h2 shared by every section: the kicker, then the display line. */
export function SectionHeading({
  kicker,
  tone,
  className,
  children,
}: {
  kicker: string;
  tone?: Tone;
  /** The display line's layout and width utilities. */
  className: string;
  children: ReactNode;
}) {
  return (
    <h2 className="items-[inherit] flex flex-col">
      <Kicker tone={tone}>{kicker}</Kicker>{" "}
      <span
        className={`text-foreground-strong font-display mt-4 text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.02em] ${className}`}
      >
        {children}
      </span>
    </h2>
  );
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
      <SectionHeading kicker={kicker} tone={tone} className={`${stacked ? "flex flex-col" : "block"} ${headingWidth}`}>
        {heading}
      </SectionHeading>

      {body && <p className={`text-body mt-3.5 text-[1.09rem] leading-relaxed ${bodyWidth}`}>{body}</p>}
    </header>
  );
}
