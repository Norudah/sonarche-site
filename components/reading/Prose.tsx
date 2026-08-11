import type { ReactNode } from "react";

import styles from "./prose.module.css";

/*
 * The body of a post, and the two things a post is allowed to do besides
 * paragraphs.
 *
 * Everything else is plain html typed into the JSX — h2, p, ul, code — and
 * styled by prose.module.css. That is deliberate: a post should read, in the
 * editor, like the text it is.
 */

export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/** The standfirst. One paragraph, directly under the title. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className={styles.lead}>{children}</p>;
}

/*
 * The aside in the second voice — the italic serif that carries the tagline and
 * the step notes on the landing. Used for the sentence a section turns on, not
 * for decoration: at most one or two in a piece, or the voice stops meaning
 * anything.
 */
export function Pull({ children }: { children: ReactNode }) {
  return <p className={styles.pull}>{children}</p>;
}
