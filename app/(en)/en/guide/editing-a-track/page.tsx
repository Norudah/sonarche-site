import { GuidePage } from "@/components/guide/GuidePage";
import { EditTrackEn } from "@/components/guide/guides/edit-track/en";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("edit-track");

export const metadata = guideMetadata(guide, "en");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="en">
      <EditTrackEn />
    </GuidePage>
  );
}
