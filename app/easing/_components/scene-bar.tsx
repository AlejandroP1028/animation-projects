"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneBar(props: SceneProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const bar = barRef.current;
    if (!bar) return;
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1 });
  }, props);

  return (
    <SceneFrame label="bar fill" innerRef={frameRef}>
      <div className="relative h-6 w-full rounded bg-foreground/10">
        <div
          ref={barRef}
          className="absolute inset-0 rounded bg-foreground"
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </SceneFrame>
  );
}
