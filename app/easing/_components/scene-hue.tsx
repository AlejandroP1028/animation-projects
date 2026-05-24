"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneHue(props: SceneProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const box = boxRef.current;
    if (!box) return;
    const state = { h: 0 };
    tl.fromTo(
      state,
      { h: 0 },
      {
        h: 360,
        onUpdate: () => {
          box.style.filter = `hue-rotate(${state.h}deg)`;
        },
      },
    );
  }, props);

  return (
    <SceneFrame innerRef={frameRef}>
      <div
        ref={boxRef}
        className="h-20 w-20"
        style={{ backgroundColor: "#ff3366" }}
      />
    </SceneFrame>
  );
}
