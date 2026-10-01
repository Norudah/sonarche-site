import { describe, expect, it } from "vitest";

import { detectPlatform, pickBuilds, readVersion, type ReleaseAsset } from "./platform";

const asset = (name: string, size = 50 * 1024 * 1024): ReleaseAsset => ({
  name,
  size,
  browser_download_url: `https://example.test/${name}`,
});

describe("detectPlatform", () => {
  it("recognises Windows and macOS", () => {
    expect(detectPlatform({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" })).toBe("windows");
    expect(detectPlatform({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" })).toBe("macos");
  });

  it("does not offer a dmg to an iPhone or to an iPad posing as a Mac", () => {
    expect(detectPlatform({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" })).toBe("unknown");
    expect(detectPlatform({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", maxTouchPoints: 5 })).toBe(
      "unknown",
    );
  });

  it("leaves everything else unknown", () => {
    expect(detectPlatform({ userAgent: "Mozilla/5.0 (X11; Linux x86_64)" })).toBe("unknown");
  });
});

describe("pickBuilds", () => {
  it("maps installers by extension and architecture, whatever the version", () => {
    const builds = pickBuilds([
      asset("Sonarche_2.1.0_aarch64.dmg"),
      asset("Sonarche_2.1.0_x64.dmg"),
      asset("Sonarche_2.1.0_x64-setup.exe"),
    ]);
    expect(builds["macos-arm64"]?.url).toContain("aarch64.dmg");
    expect(builds["macos-x64"]?.url).toContain("x64.dmg");
    expect(builds["windows-x64"]?.url).toContain("setup.exe");
  });

  it("ignores updater artifacts and keeps the first Windows installer", () => {
    const builds = pickBuilds([
      asset("Sonarche.app.tar.gz"),
      asset("Sonarche.app.tar.gz.sig"),
      asset("latest.json"),
      asset("Sonarche_2.1.0_x64-setup.exe"),
      asset("Sonarche_2.1.0_x64_en-US.msi"),
    ]);
    expect(Object.keys(builds)).toEqual(["windows-x64"]);
    expect(builds["windows-x64"]?.url).toContain(".exe");
  });

  it("rounds the size to whole megabytes", () => {
    expect(pickBuilds([asset("a_aarch64.dmg", 41.6 * 1024 * 1024)])["macos-arm64"]?.sizeMb).toBe(42);
  });
});

describe("readVersion", () => {
  it("strips the tag prefix", () => {
    expect(readVersion("sonarche-v2.1.0")).toBe("2.1.0");
    expect(readVersion("v1.0.0")).toBe("1.0.0");
  });
});
