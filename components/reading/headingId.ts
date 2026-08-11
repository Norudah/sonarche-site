/**
 * The anchor a heading answers to, derived from the heading itself.
 *
 * Derived rather than typed by hand: an id written beside a title is an id that
 * stops matching it the day the title is rewritten, and nothing complains — the
 * link just stops landing anywhere. The cost of deriving is that renaming a
 * heading breaks any link someone had bookmarked to it, which is the right
 * trade for pages nobody deep-links yet.
 *
 * NFD then strip the combining marks: `é` becomes `e`, not `-`, so a French
 * heading gives a readable slug rather than a row of dashes.
 */
export function headingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
