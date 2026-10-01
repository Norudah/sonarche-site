import { describe, expect, it } from "vitest";

import { headingId } from "./headingId";

describe("headingId", () => {
  it("slugs accented French without dropping letters", () => {
    expect(headingId("Pourquoi les tags sont-ils faux ?")).toBe("pourquoi-les-tags-sont-ils-faux");
    expect(headingId("Écoute & Inspection")).toBe("ecoute-inspection");
  });

  it("trims leading and trailing separators", () => {
    expect(headingId("  — L'album, entier —  ")).toBe("l-album-entier");
  });
});
