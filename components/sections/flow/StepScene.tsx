/*
 * PLACEHOLDER — the isometric scene that belongs in each flow row is not built.
 *
 * The mockup carries four animated illustrations here (`IsoScene.dc.html` in
 * docs/designs/): a crane with a travelling trolley and a hoist, a stretching
 * cable, fingerprint bars, a glowing hold. They are a piece of work in their own
 * right and they are the next thing to build.
 *
 * Until then this holds the exact slot they will occupy — 448×336, the mockup's
 * size — and says out loud that it is empty. A convincing stand-in would be
 * worse: someone would ship it.
 */

type StepSceneProps = {
  number: string;
  className?: string;
};

export function StepScene({ number, className }: StepSceneProps) {
  return (
    <div
      aria-hidden
      className={`border-border/70 bg-surface/60 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed ${className ?? ""}`}
    >
      <span className="text-separator font-display text-6xl font-bold">{number}</span>
    </div>
  );
}
