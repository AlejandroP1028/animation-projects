"use client";

import { useRef } from "react";
import { useSceneLoop } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";

interface Props {
  ease: string;
  duration: number;
  paused: boolean;
}

export function SceneCircle(props: Props) {
  const armRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const arm = armRef.current;
    if (!arm) return;
    tl.fromTo(arm, { rotation: 0 }, { rotation: 360 });
  }, props);

  return (
    <SceneFrame label="point on circle" innerRef={frameRef}>
      <div className="relative h-28 w-28 rounded-full border border-dashed border-foreground/20">
        <div
          ref={armRef}
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ transformOrigin: "0 0" }}
        >
          <div
            className="absolute h-3 w-3 -translate-y-1/2 rounded-full bg-foreground"
            style={{ left: "3.5rem" }}
          />
        </div>
      </div>
    </SceneFrame>
  );
}
