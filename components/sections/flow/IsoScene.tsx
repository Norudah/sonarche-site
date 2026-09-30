import type { SceneTags } from "./copy";
import { AboardScene } from "./iso/scenes/AboardScene";
import { FingerprintScene } from "./iso/scenes/FingerprintScene";
import { NamedScene } from "./iso/scenes/NamedScene";
import { PasteScene } from "./iso/scenes/PasteScene";

/*
 * The flow's four dioramas, one per step, one track's voyage: the stream, the
 * Ark, the sonar, the library. Isometric models built from world coordinates
 * (iso/iso.ts) and directed by GSAP (iso/useDiorama.ts). Each is server-rendered on its last frame, which is the
 * still that reduced motion and no-JavaScript readers get.
 *
 * Drawn on a 560×420 stage and scaled to whatever slot they are given.
 */

type IsoSceneProps = {
  /** 0–3, matching the flow's four steps. */
  step: number;
  /** Step 04's tag labels, in the page's language. */
  tags: SceneTags;
  className?: string;
};

export function IsoScene({ step, tags, className }: IsoSceneProps) {
  return (
    <div aria-hidden className={className}>
      <div className="relative aspect-[4/3] w-full">
        {step === 0 && <PasteScene />}
        {step === 1 && <AboardScene />}
        {step === 2 && <FingerprintScene />}
        {step === 3 && <NamedScene tags={tags} />}
      </div>
    </div>
  );
}
