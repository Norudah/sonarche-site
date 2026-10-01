import { GuideIndex, guideIndexMetadata } from "@/components/guide/GuideIndex";

export const metadata = guideIndexMetadata("fr");

export default function FrGuideIndex() {
  return <GuideIndex locale="fr" />;
}
