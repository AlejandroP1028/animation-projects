"use client";

import { useMemo } from "react";
import { sampleEase } from "./easings";

export function CurveGraph({ ease, size = 140 }: { ease: string; size?: number }) {
  const pts = useMemo(() => sampleEase(ease, 80), [ease]);
  const pad = 8;
  const inner = size - pad * 2;

  const d = pts
    .map((p, i) => {
      const x = pad + p.x * inner;
      const y = pad + (1 - p.y) * inner;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      className="rounded border border-foreground/10 bg-foreground/[0.02]"
    >
      <line
        x1={pad}
        y1={size - pad}
        x2={size - pad}
        y2={size - pad}
        stroke="currentColor"
        strokeOpacity={0.2}
      />
      <line
        x1={pad}
        y1={pad}
        x2={pad}
        y2={size - pad}
        stroke="currentColor"
        strokeOpacity={0.2}
      />
      <line
        x1={pad}
        y1={pad}
        x2={size - pad}
        y2={size - pad}
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeDasharray="2 3"
      />
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}
