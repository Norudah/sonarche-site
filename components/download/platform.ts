export type Platform = "macos" | "windows" | "unknown";

/** The installers. The release also carries updater artifacts that must never surface here. */
export type BuildId = "macos-arm64" | "macos-x64" | "windows-x64";

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type Build = {
  id: BuildId;
  url: string;
  sizeMb: number;
};

export const BUILDS_FOR: Record<Platform, BuildId[]> = {
  macos: ["macos-arm64", "macos-x64"],
  windows: ["windows-x64"],
  unknown: [],
};

export const ALL_BUILDS: BuildId[] = ["macos-arm64", "macos-x64", "windows-x64"];

type DetectInput = {
  userAgent: string;
  /** Separates iPadOS, which reports "Macintosh" in desktop mode, from a Mac. */
  maxTouchPoints?: number;
};

export function detectPlatform({ userAgent, maxTouchPoints = 0 }: DetectInput): Platform {
  if (/windows/i.test(userAgent)) return "windows";

  if (/iphone|ipad|ipod/i.test(userAgent)) return "unknown";
  if (/mac os x|macintosh/i.test(userAgent)) return maxTouchPoints > 2 ? "unknown" : "macos";

  return "unknown";
}

/** By extension and architecture, never by full name: the version sits in the middle of it. */
function identify(name: string): BuildId | null {
  const lower = name.toLowerCase();

  if (lower.endsWith(".dmg")) {
    if (lower.includes("aarch64") || lower.includes("arm64")) return "macos-arm64";
    if (lower.includes("x64") || lower.includes("x86_64")) return "macos-x64";
    return null;
  }

  if (lower.endsWith(".exe") || lower.endsWith(".msi")) return "windows-x64";

  return null;
}

/** Unrecognised assets are dropped, and the first match wins (.exe over .msi). */
export function pickBuilds(assets: ReleaseAsset[]): Partial<Record<BuildId, Build>> {
  const builds: Partial<Record<BuildId, Build>> = {};

  for (const asset of assets) {
    const id = identify(asset.name);
    if (!id || builds[id]) continue;

    builds[id] = {
      id,
      url: asset.browser_download_url,
      sizeMb: Math.round(asset.size / 1024 / 1024),
    };
  }

  return builds;
}

/** `sonarche-v1.0.0` → `1.0.0`. */
export function readVersion(tagName: string): string {
  return tagName.replace(/^sonarche-/i, "").replace(/^v/i, "");
}
