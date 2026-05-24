"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneFade(props: SceneProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const box = boxRef.current;
    if (!box) return;
    tl.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1 });
  }, props);

  return (
    <SceneFrame innerRef={frameRef}>
      <div ref={boxRef} className="h-20 w-20 bg-foreground" />
    </SceneFrame>
  );
}
