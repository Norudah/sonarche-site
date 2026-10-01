import type { ReactNode } from "react";

import "@/app/globals.css";
import { Document } from "@/components/layout/Document";
import { VIEWPORT, layoutMetadata } from "@/lib/metadata";

export const metadata = layoutMetadata("en");
export const viewport = VIEWPORT;

export default function EnLayout({ children }: { children: ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
