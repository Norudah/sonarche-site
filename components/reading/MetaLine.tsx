import { Fragment, type ReactNode } from "react";

type MetaLineProps = {
  items: ReactNode[];
  /** Trailing content with no separator, e.g. a badge. */
  children?: ReactNode;
  className?: string;
};

export function MetaLine({ items, children, className = "" }: MetaLineProps) {
  return (
    <p
      className={`text-muted flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase ${className}`}
    >
      {items.filter(Boolean).map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span aria-hidden className="text-border">
              ·
            </span>
          )}
          {item}
        </Fragment>
      ))}
      {children}
    </p>
  );
}
