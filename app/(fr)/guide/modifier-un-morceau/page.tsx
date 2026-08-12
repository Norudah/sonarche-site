import { GuidePage } from "@/components/guide/GuidePage";
import { EditTrackFr } from "@/components/guide/guides/edit-track/fr";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("edit-track");

export const metadata = guideMetadata(guide, "fr");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="fr">
      <EditTrackFr />
    </GuidePage>
  );
}
