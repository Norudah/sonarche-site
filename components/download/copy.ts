import type { Locale } from "@/lib/site";

import type { BuildId } from "./platform";

/* Verbatim from docs/copy/en.md § Download and docs/copy/fr.md § Téléchargement. */

export type DownloadCopy = {
  /** Before the platform is known, and forever without JavaScript. */
  neutral: string;
  cta: Record<BuildId, string>;
  buildLabel: Record<BuildId, string>;
  showAll: string;
  hideAll: string;
  megabytes: string;
  version: string;
  allReleases: string;
};

export const downloadCopy: Record<Locale, DownloadCopy> = {
  en: {
    neutral: "Download Sonarche ↓",
    cta: {
      "macos-universal": "Download for macOS ↓",
      "windows-x64": "Download for Windows ↓",
    },
    buildLabel: {
      "macos-universal": "macOS · Apple Silicon & Intel",
      "windows-x64": "Windows",
    },
    showAll: "All versions",
    hideAll: "Hide versions",
    megabytes: "MB",
    version: "Version",
    allReleases: "See all releases on GitHub ↗",
  },
  fr: {
    neutral: "Télécharger Sonarche ↓",
    cta: {
      "macos-universal": "Télécharger pour macOS ↓",
      "windows-x64": "Télécharger pour Windows ↓",
    },
    buildLabel: {
      "macos-universal": "macOS · Apple Silicon et Intel",
      "windows-x64": "Windows",
    },
    showAll: "Toutes les versions",
    hideAll: "Masquer les versions",
    megabytes: "Mo",
    version: "Version",
    allReleases: "Toutes les versions sur GitHub ↗",
  },
};
