import { describe, expect, it } from "vitest";

import { type Guide, neighbours } from "./guide";

const guide = (id: string) => ({ id }) as Guide;
const guides = ["a", "b", "c"].map(guide);

describe("neighbours", () => {
  it("returns both sides in the middle", () => {
    expect(neighbours(guides, "b")).toEqual({ previous: guides[0], next: guides[2] });
  });

  it("has no previous for the first and no next for the last", () => {
    expect(neighbours(guides, "a").previous).toBeNull();
    expect(neighbours(guides, "c").next).toBeNull();
  });

  it("returns nothing for an unknown id", () => {
    expect(neighbours(guides, "z")).toEqual({ previous: null, next: null });
  });
});
