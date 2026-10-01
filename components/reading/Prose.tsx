import type { ReactNode } from "react";

import { headingId } from "./headingId";
import styles from "./prose.module.css";

/*
 * Posts and guides are JSX typed as prose. Around an inline tag, write `&#32;` after it and
 * `{" "}` before it: JSX trims the other forms at line ends, and the word silently glues to the tag.
 */
export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/* The anchor is derived from the text and rendered statically, so section links work without
   JavaScript. `children: string` makes markup inside a heading a compile error. */

export function H2({ children }: { children: string }) {
  return <h2 id={headingId(children)}>{children}</h2>;
}

/** The standfirst. One paragraph, directly under the title. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className={styles.lead}>{children}</p>;
}

/** The italic serif aside. One or two per piece at most. */
export function Pull({ children }: { children: ReactNode }) {
  return <p className={styles.pull}>{children}</p>;
}
