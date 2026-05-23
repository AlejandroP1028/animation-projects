"use client";

import { useRef } from "react";
import { useSceneLoop } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";

interface Props {
  ease: string;
  duration: number;
  paused: boolean;
}

export function SceneRotation(props: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const box = boxRef.current;
    if (!box) return;
    tl.fromTo(box, { rotation: 0 }, { rotation: 360 });
  }, props);

  return (
    <SceneFrame label="rotation 360°" innerRef={frameRef}>
      <div ref={boxRef} className="h-16 w-16 bg-foreground" />
    </SceneFrame>
  );
}
