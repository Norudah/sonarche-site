import { GuidePage } from "@/components/guide/GuidePage";
import { GettingStartedFr } from "@/components/guide/guides/getting-started/fr";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("getting-started");

export const metadata = guideMetadata(guide, "fr");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="fr">
      <GettingStartedFr />
    </GuidePage>
  );
}
