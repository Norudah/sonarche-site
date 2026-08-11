import type { ReactNode } from "react";

import { headingId } from "./headingId";
import styles from "./prose.module.css";

/*
 * The body of a post, and the few things a post is allowed to do besides
 * paragraphs.
 *
 * Everything else is plain html typed into the JSX — p, ul, code — and styled
 * by prose.module.css. That is deliberate: a post should read, in the editor,
 * like the text it is.
 */

export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/*
 * Headings are components rather than plain tags for one reason: they carry an
 * anchor, derived from their own text (see headingId).
 *
 * That anchor is what the table of contents links to and what someone gets when
 * they copy a link to a section — so it has to be in the static html, not
 * dropped in by script on load. `children: string` is the guard: a heading with
 * markup inside it has no text to derive an id from, and this makes that a
 * compile error rather than an id of `undefined`.
 */

export function H2({ children }: { children: string }) {
  return <h2 id={headingId(children)}>{children}</h2>;
}

export function H3({ children }: { children: string }) {
  return <h3 id={headingId(children)}>{children}</h3>;
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
