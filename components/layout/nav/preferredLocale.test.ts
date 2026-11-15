import { describe, expect, it } from "vitest";

import { preferredLocale } from "./preferredLocale";

describe("preferredLocale", () => {
  it("takes the first of our locales the visitor lists", () => {
    expect(preferredLocale(["de-DE", "fr-FR", "en"])).toBe("fr");
    expect(preferredLocale(["en-GB", "fr"])).toBe("en");
  });

  it("matches a bare language and a regional one, not a longer code", () => {
    expect(preferredLocale(["FR"])).toBe("fr");
    expect(preferredLocale(["frr", "fr-CA"])).toBe("fr");
  });

  it("falls back to English", () => {
    expect(preferredLocale(["de", "es"])).toBe("en");
    expect(preferredLocale([])).toBe("en");
  });
});
