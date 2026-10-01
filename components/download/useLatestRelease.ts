"use client";

import { useEffect, useState } from "react";

import { LATEST_RELEASE_API } from "@/lib/site";

import { type Build, type BuildId, pickBuilds, readVersion } from "./platform";

export type Release = {
  version: string;
  builds: Partial<Record<BuildId, Build>>;
};

/* Resolves to null on any failure; every caller treats null as "keep the releases page". */
export function useLatestRelease(): Release | null {
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(LATEST_RELEASE_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { tag_name?: string; assets?: unknown }) => {
        if (typeof data.tag_name !== "string" || !Array.isArray(data.assets)) return;
        setRelease({ version: readVersion(data.tag_name), builds: pickBuilds(data.assets) });
      })
      .catch(() => {
        // Including the cleanup's AbortError: the buttons keep their fallback.
      });

    return () => controller.abort();
  }, []);

  return release;
}

export function hrefFor(release: Release | null, id: BuildId, fallback: string): string {
  return release?.builds[id]?.url ?? fallback;
}
