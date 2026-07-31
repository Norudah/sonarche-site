"use client";

import { useSyncExternalStore } from "react";

import { detectPlatform, type Platform } from "./platform";

/**
 * The visitor's system, or null until the page is interactive.
 *
 * Null is not a loading state to be styled around — it is what the static
 * export renders and what a visitor whose bundle never arrives keeps forever.
 * The button it produces is a working download link, not a spinner.
 *
 * `useSyncExternalStore` rather than an effect: the platform is a value read
 * from outside React that differs between server and client, which is the exact
 * case its server-snapshot argument exists for. An effect would say the same
 * thing in an extra render, and reading `navigator` during render would make
 * the first client pass disagree with the HTML.
 */

/* Nothing to subscribe to: a machine does not change chips mid-visit. The
   store never notifies, so this is a stable no-op. */
const subscribe = () => () => {};

/* Computed once and held: `getSnapshot` runs on every render and must return a
   value that compares equal to the last, or React re-renders forever. */
let detected: Platform | undefined;

function clientSnapshot(): Platform {
  detected ??= detectPlatform({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
  });

  return detected;
}

const serverSnapshot = () => null;

export function usePlatform(): Platform | null {
  return useSyncExternalStore<Platform | null>(subscribe, clientSnapshot, serverSnapshot);
}
