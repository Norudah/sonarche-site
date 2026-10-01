import { LandingPage, landingMetadata } from "@/components/layout/LandingPage";

export const metadata = landingMetadata("en");

export default function EnHome() {
  return <LandingPage locale="en" />;
}
