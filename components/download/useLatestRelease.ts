"use client";

import { useEffect, useState } from "react";

import { LATEST_RELEASE_API } from "@/lib/site";

import { type Build, type BuildId, pickBuilds, readVersion } from "./platform";

export type Release = {
  version: string;
  builds: Partial<Record<BuildId, Build>>;
};

/*
 * The newest release, asked once per visit.
 *
 * An effect is right here for the one reason effects are ever right: this
 * synchronises with something outside React that a static build cannot know.
 * It resolves to null on any refusal — offline, rate-limited, GitHub down, a
 * shape we do not recognise — and every caller is written to treat null as
 * "keep the releases page you already have". There is no error state to show
 * because there is nothing for the visitor to do about it.
 */
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
        /* Including the AbortError from the cleanup below. Silence is the
           designed outcome: the buttons keep the fallback they rendered with. */
      });

    return () => controller.abort();
  }, []);

  return release;
}

/** The build's own URL once we know it, the releases page until then. Every
 *  href on this page goes through here — it is the single place that decides
 *  what an unanswered question links to. */
export function hrefFor(release: Release | null, id: BuildId, fallback: string): string {
  return release?.builds[id]?.url ?? fallback;
}
