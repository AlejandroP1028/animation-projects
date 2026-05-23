"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneDrop(props: SceneProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const dot = dotRef.current;
    const track = trackRef.current;
    if (!dot || !track) return;
    const distance = track.clientHeight - dot.clientHeight;
    tl.fromTo(dot, { y: 0 }, { y: distance });
  }, props);

  return (
    <SceneFrame label="vertical drop" innerRef={frameRef}>
      <div ref={trackRef} className="relative h-full w-2 rounded bg-foreground/10">
        <div
          ref={dotRef}
          className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-foreground"
        />
      </div>
    </SceneFrame>
  );
}
