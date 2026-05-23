"use client";

import { useRef } from "react";
import { useSceneLoop } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";

interface Props {
  ease: string;
  duration: number;
  paused: boolean;
}

export function SceneBall(props: Props) {
  const dotRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const dot = dotRef.current;
    const track = trackRef.current;
    if (!dot || !track) return;
    const distance = track.clientWidth - dot.clientWidth;
    tl.fromTo(dot, { x: 0 }, { x: distance });
  }, props);

  return (
    <SceneFrame label="ball L→R" innerRef={frameRef}>
      <div ref={trackRef} className="relative h-2 w-full rounded bg-foreground/10">
        <div
          ref={dotRef}
          className="absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 rounded-full bg-foreground"
        />
      </div>
    </SceneFrame>
  );
}
