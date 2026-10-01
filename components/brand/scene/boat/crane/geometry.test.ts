import { describe, expect, it } from "vitest";

import { DROP, JIB, MAIN, PIN, solve } from "./geometry";

/** Where the joint angles put the jib's drop point. */
function forward({ shoulder, elbow }: { shoulder: number; elbow: number }) {
  const kx = PIN.x + MAIN * Math.cos(shoulder);
  const ky = PIN.y + MAIN * Math.sin(shoulder);
  return { x: kx + (JIB + DROP) * Math.cos(shoulder + elbow), y: ky + (JIB + DROP) * Math.sin(shoulder + elbow) };
}

describe("solve", () => {
  it.each([
    [2.5, 1.4],
    [4, 3],
    [3.5, 0.5],
  ])("puts the drop point on a reachable target (%f, %f)", (h, y) => {
    const tip = forward(solve(h, y));
    expect(tip.x).toBeCloseTo(h, 5);
    expect(tip.y).toBeCloseTo(y, 5);
  });

  it("keeps the elbow up", () => {
    expect(solve(3, 1).elbow).toBeLessThan(0);
  });

  it("stretches towards a target out of reach instead of failing", () => {
    const { shoulder, elbow } = solve(20, 1.2);
    expect(Number.isFinite(shoulder) && Number.isFinite(elbow)).toBe(true);
    expect(forward({ shoulder, elbow }).x).toBeGreaterThan(MAIN + JIB);
  });
});
