import { LandingPage, landingMetadata } from "@/components/layout/LandingPage";

export const metadata = landingMetadata("fr");

export default function FrHome() {
  return <LandingPage locale="fr" />;
}
