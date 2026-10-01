import type { ReactNode } from "react";

type EntryRowProps = {
  href: string;
  meta: ReactNode;
  title: string;
  titleAs: "h2" | "h3";
  description: string;
  cta: string;
};

/* The whole row is the link. Each part hovers on its own: a row-wide `group-hover` lit the title
   and the button together, which read as hovering two things. */
export function EntryRow({ href, meta, title, titleAs: Title, description, cta }: EntryRowProps) {
  return (
    <a href={href} className="block py-7">
      {meta}

      <Title className="text-foreground-strong hover:text-accent font-display mt-2 text-[1.4rem] leading-[1.25] font-bold tracking-[-0.02em] transition-colors">
        {title}
      </Title>

      <p className="text-body mt-2 text-[0.95rem] leading-relaxed">{description}</p>

      {/* A span: a link nested in the row's anchor is invalid html. */}
      <span className="group/read border-border text-accent hover:border-accent hover:bg-accent hover:text-accent-foreground mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors">
        {cta}
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover/read:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
