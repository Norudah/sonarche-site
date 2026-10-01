import type { ReactNode } from "react";

import { Ark } from "@/components/brand/Ark";
import { Onde } from "@/components/brand/Onde";
import { LiveSea } from "@/components/brand/scene/LiveSea";
import scene from "@/components/brand/scene/scene.module.css";
import { SeaBody } from "@/components/brand/sea/SeaBody";
import { SeaLayer } from "@/components/brand/sea/SeaLayer";
import { buildSea, SEA_CALM } from "@/components/brand/sea/sea";

/* The hull bottoms out 96px up: a 92px waterline bites 4px into it, like the hero's. */
const WATERLINE = 92;

/* The hero's sea, calmed. The drawing is the poster the live scene takes over from on wide screens. */
export function Harbour({ children }: { children: ReactNode }) {
  const sea = buildSea(SEA_CALM, WATERLINE);

  return (
    <div className="relative mt-10 h-[19.5rem]" style={sea.style}>
      <div aria-hidden className={`${scene.poster} absolute inset-0`}>
        <SeaBody body={sea.body} />
        <SeaLayer bars={sea.deep} deep />
        <SeaLayer bars={sea.back} />

        <Ark
          className="absolute bottom-[3.625rem] left-1/2 z-[2] h-[14.375rem] w-[14.375rem] -translate-x-1/2"
          shadow="0 6px 12px oklch(0.38 0.1 277 / 0.16)"
        >
          <Onde />
        </Ark>

        <SeaLayer bars={sea.front} className="z-[3]" />
      </div>
      <LiveSea weather="calm" waterline={WATERLINE} className="z-[3]" />

      {children}
    </div>
  );
}
