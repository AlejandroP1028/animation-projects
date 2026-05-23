"use client";

import { useRef } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


const COUNT = 5;

export function SceneStagger(props: SceneProps) {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const frameRef = useSceneLoop((tl) => {
    const dots = dotsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!dots.length) return;
    tl.fromTo(
      dots,
      { y: 0 },
      { y: -32, stagger: { each: 0.08, from: "start" } },
    );
  }, props);

  return (
    <SceneFrame label="stagger row" innerRef={frameRef}>
      <div className="flex items-center gap-3">
        {Array.from({ length: COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
            className="h-4 w-4 rounded-full bg-foreground"
          />
        ))}
      </div>
    </SceneFrame>
  );
}
