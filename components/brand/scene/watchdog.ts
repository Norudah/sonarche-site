/** Median frame time, ms, above which the watchdog steps in. ~38fps. */
const SLOW_FRAME = 26;
const WINDOW = 90;

/**
 * Whether one full window of frame times calls for a lower resolution. A steady ~33ms is the
 * browser capping at 30fps (battery saver, a throttled window), which a lower resolution won't fix.
 */
export function isStruggling(samples: readonly number[]): boolean {
  const sorted = [...samples].sort((a, b) => a - b);
  const median = sorted[45];
  const spread = sorted[80] - sorted[10];
  if (median <= SLOW_FRAME) return false;
  return !(median > 30 && median < 36 && spread < 4);
}

/** Calls `stepDown` when a window says the machine is struggling; it returns false at the floor. */
export function createWatchdog(stepDown: () => boolean) {
  const samples: number[] = [];
  let warmup = 1.5;

  return function watch(deltaMs: number) {
    if (warmup > 0) {
      warmup -= deltaMs / 1000;
      return;
    }
    // A frame this long is a tab switch or a GC, not the scene's cost.
    if (deltaMs > 200) return;
    samples.push(deltaMs);
    if (samples.length < WINDOW) return;
    const slow = isStruggling(samples);
    samples.length = 0;
    if (slow && stepDown()) warmup = 1;
  };
}
