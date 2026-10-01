import type { ReactNode } from "react";

import "@/app/globals.css";
import { Document } from "@/components/layout/Document";
import { VIEWPORT, layoutMetadata } from "@/lib/metadata";

export const metadata = layoutMetadata("fr");
export const viewport = VIEWPORT;

export default function FrLayout({ children }: { children: ReactNode }) {
  return <Document lang="fr">{children}</Document>;
}
