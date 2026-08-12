import { GuidePage } from "@/components/guide/GuidePage";
import { EditAlbumFr } from "@/components/guide/guides/edit-album/fr";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("edit-album");

export const metadata = guideMetadata(guide, "fr");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="fr">
      <EditAlbumFr />
    </GuidePage>
  );
}
