/*
 * Which build the visitor needs, and which file in a release is that build.
 *
 * Pure on purpose: everything here is a string in, a verdict out, so the parts
 * that can be wrong can be read in one sitting and tested without a browser.
 * The component next door owns all the uncertainty — when to ask, what to do
 * with a refusal.
 */

export type Platform = "macos" | "windows" | "unknown";

/** The three files a person is meant to download. The release also carries the
 *  updater's own artifacts (.app.tar.gz, .sig, latest.json), which are Tauri
 *  talking to itself and must never surface on the page. */
export type BuildId = "macos-arm64" | "macos-x64" | "windows-x64";

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type Build = {
  id: BuildId;
  url: string;
  /** Whole megabytes. The panel shows a weight, not a measurement. */
  sizeMb: number;
};

/** Which builds each platform is offered, in the order they are shown. macOS
 *  gets both: see docs/copy/en.md § Download for why we refuse to guess. */
export const BUILDS_FOR: Record<Platform, BuildId[]> = {
  macos: ["macos-arm64", "macos-x64"],
  windows: ["windows-x64"],
  unknown: [],
};

/** Every build, for the "all versions" panel — the order a reader scans. */
export const ALL_BUILDS: BuildId[] = ["macos-arm64", "macos-x64", "windows-x64"];

type DetectInput = {
  userAgent: string;
  /** iPadOS in desktop mode is indistinguishable from macOS by user agent
   *  alone; a touch count is what separates them. */
  maxTouchPoints?: number;
};

export function detectPlatform({ userAgent, maxTouchPoints = 0 }: DetectInput): Platform {
  if (/windows/i.test(userAgent)) return "windows";

  /* An iPhone or iPad has nothing to do with a .dmg. iPadOS asks for desktop
     sites by default and says "Macintosh" when it does, so the touch count is
     the only tell left. A trackpad Mac reports 0. */
  if (/iphone|ipad|ipod/i.test(userAgent)) return "unknown";
  if (/mac os x|macintosh/i.test(userAgent)) return maxTouchPoints > 2 ? "unknown" : "macos";

  return "unknown";
}

/**
 * Which build an asset is, by extension and architecture rather than by name.
 *
 * The version sits in the middle of every filename, so matching the whole name
 * would need updating at each release — exactly the coupling this feature
 * exists to avoid. Extension and arch are the parts that do not move.
 */
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

/**
 * The installers in a release, keyed by build.
 *
 * Anything unrecognised is dropped rather than guessed at: a release that ships
 * a fourth artifact should show three buttons, not a mystery one. First match
 * wins, so a release carrying both an .exe and an .msi offers the .exe.
 */
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

/** `sonarche-v1.0.0` → `1.0.0`. The tag is the app's, prefix and all; the page
 *  shows a version number, not a git ref. */
export function readVersion(tagName: string): string {
  return tagName.replace(/^sonarche-/i, "").replace(/^v/i, "");
}
