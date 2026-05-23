"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneScale(props: SceneProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const box = boxRef.current;
    if (!box) return;
    tl.fromTo(box, { scale: 0 }, { scale: 1 });
  }, props);

  return (
    <SceneFrame label="scale pulse" innerRef={frameRef}>
      <div ref={boxRef} className="h-24 w-24 bg-foreground" />
    </SceneFrame>
  );
}
