import type { SceneTags } from "./copy";
import { AboardScene } from "./iso/scenes/ark/AboardScene";
import { NamedScene } from "./iso/scenes/library/NamedScene";
import { PasteScene } from "./iso/scenes/paste/PasteScene";
import { FingerprintScene } from "./iso/scenes/sonar/FingerprintScene";

/* One diorama per step, server-rendered on its last frame: the still that reduced motion and
   no-JavaScript readers get. Drawn on a 560×420 stage. */

type IsoSceneProps = {
  step: number;
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
