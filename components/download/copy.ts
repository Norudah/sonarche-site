import type { Locale } from "@/lib/site";

import type { BuildId } from "./platform";

/*
 * Verbatim from docs/copy/en.md § Download and docs/copy/fr.md § Téléchargement.
 * Never edited here — the decks are the source of truth (see CLAUDE.md).
 */

export type DownloadCopy = {
  /** Before the system is known, and forever if the bundle never lands. */
  neutral: string;
  windowsCta: string;
  buildLabel: Record<BuildId, string>;
  /** Short forms for the two macOS buttons, where the Apple mark beside them
   *  has already named the platform. */
  chip: { arm64: string; x64: string };
  whichMac: string;
  showAll: string;
  hideAll: string;
  megabytes: string;
  version: string;
  allReleases: string;
};

export const downloadCopy: Record<Locale, DownloadCopy> = {
  en: {
    neutral: "Download Sonarche ↓",
    windowsCta: "Download for Windows ↓",
    buildLabel: {
      "macos-arm64": "macOS · Apple Silicon",
      "macos-x64": "macOS · Intel",
      "windows-x64": "Windows",
    },
    chip: { arm64: "Apple Silicon", x64: "Intel" },
    whichMac: "Not sure? Apple menu → About This Mac: Chip means Apple silicon.",
    showAll: "All versions",
    hideAll: "Hide versions",
    megabytes: "MB",
    version: "Version",
    allReleases: "See all releases on GitHub ↗",
  },
  fr: {
    neutral: "Télécharger Sonarche ↓",
    windowsCta: "Télécharger pour Windows ↓",
    buildLabel: {
      "macos-arm64": "macOS · Apple Silicon",
      "macos-x64": "macOS · Intel",
      "windows-x64": "Windows",
    },
    chip: { arm64: "Apple Silicon", x64: "Intel" },
    whichMac: "Tu ne sais pas ? Menu Pomme → À propos de ce Mac : Puce veut dire Apple Silicon.",
    showAll: "Toutes les versions",
    hideAll: "Masquer les versions",
    megabytes: "Mo",
    version: "Version",
    allReleases: "Toutes les versions sur GitHub ↗",
  },
};
