import { describe, expect, it, vi } from "vitest";

import { createWatchdog, isStruggling } from "./watchdog";

const frames = (ms: number, jitter = 0) => Array.from({ length: 90 }, (_, i) => ms + ((i % 9) - 4) * jitter);

describe("isStruggling", () => {
  it("accepts a machine holding its frame rate", () => {
    expect(isStruggling(frames(16.7, 0.5))).toBe(false);
  });

  it("flags a slow, uneven frame rate", () => {
    expect(isStruggling(frames(40, 3))).toBe(true);
  });

  it("ignores a browser steadily capped at 30fps", () => {
    expect(isStruggling(frames(33.3, 0.2))).toBe(false);
  });
});

describe("createWatchdog", () => {
  it("waits out the warm-up and a full window before stepping down once", () => {
    const stepDown = vi.fn(() => true);
    const watch = createWatchdog(stepDown);
    for (let i = 0; i < 60; i++) watch(40);
    expect(stepDown).not.toHaveBeenCalled();
    for (let i = 0; i < 90; i++) watch(40 + (i % 5));
    expect(stepDown).toHaveBeenCalledTimes(1);
  });

  it("skips frames long enough to be a tab switch", () => {
    const stepDown = vi.fn(() => true);
    const watch = createWatchdog(stepDown);
    for (let i = 0; i < 400; i++) watch(250);
    expect(stepDown).not.toHaveBeenCalled();
  });
});
