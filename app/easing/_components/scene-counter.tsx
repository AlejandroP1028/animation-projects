"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


export function SceneCounter(props: SceneProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const frameRef = useSceneLoop((tl) => {
    const el = textRef.current;
    if (!el) return;
    const state = { n: 0 };
    tl.fromTo(
      state,
      { n: 0 },
      {
        n: 100,
        onUpdate: () => {
          el.textContent = state.n.toFixed(0);
        },
      },
    );
  }, props);

  return (
    <SceneFrame label="counter 0→100" innerRef={frameRef}>
      <span
        ref={textRef}
        className="font-(family-name:--font-ubuntu-mono) text-5xl font-bold tabular-nums"
      >
        0
      </span>
    </SceneFrame>
  );
}
