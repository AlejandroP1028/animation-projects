"use client";

import { useEffect, useRef, useState } from "react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import { SceneFrame } from "./scene-frame";


const PATH_D = "M10,80 C40,10 80,10 110,80 S180,150 210,80";

export function ScenePath(props: SceneProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    setLength(p.getTotalLength());
  }, []);

  const frameRef = useSceneLoop((tl) => {
    const p = pathRef.current;
    if (!p || !length) return;
    tl.fromTo(p, { strokeDashoffset: length }, { strokeDashoffset: 0 });
  }, props);

  return (
    <SceneFrame label="svg path draw" innerRef={frameRef}>
      <svg viewBox="0 0 220 160" className="h-full w-full">
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length}
        />
      </svg>
    </SceneFrame>
  );
}
