"use client";

import { useSyncExternalStore } from "react";

import { detectPlatform, type Platform } from "./platform";

/*
 * Null on the server and until hydration, which still renders a working link. A server snapshot
 * keeps the first client render in agreement with the HTML.
 */

/* A machine does not change platform mid-visit. */
const subscribe = () => () => {};

/* Held so getSnapshot returns a stable value. */
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
