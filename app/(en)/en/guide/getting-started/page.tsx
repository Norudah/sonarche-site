import { GuidePage } from "@/components/guide/GuidePage";
import { GettingStartedEn } from "@/components/guide/guides/getting-started/en";
import { guideById, guideMetadata } from "@/lib/guide";

const guide = guideById("getting-started");

export const metadata = guideMetadata(guide, "en");

export default function Page() {
  return (
    <GuidePage guide={guide} locale="en">
      <GettingStartedEn />
    </GuidePage>
  );
}
