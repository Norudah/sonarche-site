import type { ReactNode } from "react";

/* One cell of the grid: the mini-interface on a panel, its caption under it. */

type CardProps = {
  caption: string;
  className?: string;
  children: ReactNode;
};

export function Card({ caption, className = "", children }: CardProps) {
  return (
    <article
      className={`border-separator bg-surface flex flex-col overflow-hidden rounded-[1.25rem] border ${className}`}
    >
      <div className="border-separator bg-panel relative flex min-h-48 flex-1 flex-col justify-center border-b p-5 sm:p-6">
        {children}
      </div>
      <p className="text-foreground px-6 pt-4.5 pb-5 text-base leading-[1.55]">{caption}</p>
    </article>
  );
}

export function Check({ className = "size-3" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" fill="none" className={className}>
      <path
        d="M2.5 6.2 5 8.5l4.5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pointer({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="18"
      height="22"
      viewBox="0 0 18 22"
      fill="none"
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M2 1.5v16l4.2-3.8 2.9 6.6 2.7-1.2-2.8-6.4 5.8-.4L2 1.5Z"
        fill="var(--surface)"
        stroke="var(--foreground-strong)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
