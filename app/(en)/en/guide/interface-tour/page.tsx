import { GuidePage } from "@/components/guide/GuidePage";
import { InterfaceTourEn } from "@/components/guide/guides/interface-tour/en";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("interface-tour");

export const metadata = guideMetadata(guide, "en");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="en">
      <InterfaceTourEn />
    </GuidePage>
  );
}
