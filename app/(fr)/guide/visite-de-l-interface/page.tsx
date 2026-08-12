import { GuidePage } from "@/components/guide/GuidePage";
import { InterfaceTourFr } from "@/components/guide/guides/interface-tour/fr";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("interface-tour");

export const metadata = guideMetadata(guide, "fr");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="fr">
      <InterfaceTourFr />
    </GuidePage>
  );
}
