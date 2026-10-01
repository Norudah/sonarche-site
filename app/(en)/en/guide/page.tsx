import { GuideIndex, guideIndexMetadata } from "@/components/guide/GuideIndex";

export const metadata = guideIndexMetadata("en");

export default function EnGuideIndex() {
  return <GuideIndex locale="en" />;
}
