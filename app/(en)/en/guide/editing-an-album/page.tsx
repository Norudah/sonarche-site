import { GuidePage } from "@/components/guide/GuidePage";
import { EditAlbumEn } from "@/components/guide/guides/edit-album/en";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("edit-album");

export const metadata = guideMetadata(guide, "en");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="en">
      <EditAlbumEn />
    </GuidePage>
  );
}
