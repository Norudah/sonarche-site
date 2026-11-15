import { describe, expect, it } from "vitest";

import { clock } from "./queue";

describe("clock", () => {
  it("pads the seconds", () => {
    expect(clock(0)).toBe("0:00");
    expect(clock(72)).toBe("1:12");
    expect(clock(174.9)).toBe("2:54");
  });
});
