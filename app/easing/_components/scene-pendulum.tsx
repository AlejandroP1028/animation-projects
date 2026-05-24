"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function ScenePendulum(props: SceneProps) {
  const armRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const arm = armRef.current;
    if (!arm) return;
    tl.fromTo(arm, { rotation: -45 }, { rotation: 45 });
  }, props);

  return (
    <SceneFrame innerRef={frameRef}>
      <div className="relative h-32 w-32">
        <div
          ref={armRef}
          className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-foreground/40"
          style={{ transformOrigin: "top center" }}
        >
          <div className="absolute -bottom-2 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-foreground" />
        </div>
      </div>
    </SceneFrame>
  );
}
