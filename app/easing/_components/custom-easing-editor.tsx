"use client";

import { useRef, useState } from "react";
import {
  DEFAULT_CUSTOM_PATH,
  formatCubicPath,
  parseCubicPath,
} from "./easings";

interface Props {
  path: string;
  onChange: (path: string) => void;
}

const SIZE = 200;
const PAD = 16;
const INNER = SIZE - PAD * 2;

function toSvgCoords(x: number, y: number) {
  return { sx: PAD + x * INNER, sy: PAD + (1 - y) * INNER };
}

function fromSvgCoords(sx: number, sy: number) {
  const x = (sx - PAD) / INNER;
  const y = 1 - (sy - PAD) / INNER;
  return { x: Math.max(0, Math.min(1, x)), y };
}

type DragTarget = "p1" | "p2" | null;

export function CustomEasingEditor({ path, onChange }: Props) {
  const parsed = parseCubicPath(path) ?? parseCubicPath(DEFAULT_CUSTOM_PATH)!;
  const [invalidText, setInvalidText] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<DragTarget>(null);

  const p1 = toSvgCoords(parsed.x1, parsed.y1);
  const p2 = toSvgCoords(parsed.x2, parsed.y2);
  const start = toSvgCoords(0, 0);
  const end = toSvgCoords(1, 1);

  function startDrag(which: "p1" | "p2", e: React.PointerEvent) {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(which);
  }

  function handleMove(e: React.PointerEvent) {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * SIZE;
    const sy = ((e.clientY - rect.top) / rect.height) * SIZE;
    const { x, y } = fromSvgCoords(sx, sy);
    const next = { ...parsed };
    if (dragging === "p1") {
      next.x1 = x;
      next.y1 = y;
    } else {
      next.x2 = x;
      next.y2 = y;
    }
    onChange(formatCubicPath(next.x1, next.y1, next.x2, next.y2));
  }

  function handleUp(e: React.PointerEvent) {
    setDragging(null);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  function handleTextChange(v: string) {
    const ok = parseCubicPath(v);
    if (ok) {
      setInvalidText(null);
      onChange(v);
    } else {
      setInvalidText(v);
    }
  }

  const displayedText = invalidText ?? path;
  const valid = invalidText === null;

  return (
    <div className="flex flex-wrap items-start gap-4">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        className="rounded border border-foreground/10 bg-foreground/[0.02]"
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      >
        <line
          x1={PAD}
          y1={SIZE - PAD}
          x2={SIZE - PAD}
          y2={SIZE - PAD}
          stroke="currentColor"
          strokeOpacity={0.2}
        />
        <line
          x1={PAD}
          y1={PAD}
          x2={PAD}
          y2={SIZE - PAD}
          stroke="currentColor"
          strokeOpacity={0.2}
        />
        <line
          x1={start.sx}
          y1={start.sy}
          x2={p1.sx}
          y2={p1.sy}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="2 3"
        />
        <line
          x1={end.sx}
          y1={end.sy}
          x2={p2.sx}
          y2={p2.sy}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="2 3"
        />
        <path
          d={`M${start.sx},${start.sy} C${p1.sx},${p1.sy} ${p2.sx},${p2.sy} ${end.sx},${end.sy}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        <circle cx={start.sx} cy={start.sy} r={3} fill="currentColor" />
        <circle cx={end.sx} cy={end.sy} r={3} fill="currentColor" />
        <circle
          cx={p1.sx}
          cy={p1.sy}
          r={7}
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth={2}
          onPointerDown={(e) => startDrag("p1", e)}
          style={{ cursor: "grab", touchAction: "none" }}
        />
        <circle
          cx={p2.sx}
          cy={p2.sy}
          r={7}
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth={2}
          onPointerDown={(e) => startDrag("p2", e)}
          style={{ cursor: "grab", touchAction: "none" }}
        />
      </svg>
      <div className="flex flex-1 min-w-[260px] flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-foreground/50">
          CustomEase path
        </label>
        <input
          type="text"
          value={displayedText}
          onChange={(e) => handleTextChange(e.target.value)}
          className={`w-full rounded border bg-background px-2 py-1.5 font-(family-name:--font-ubuntu-mono) text-xs ${
            valid ? "border-foreground/20" : "border-red-500"
          }`}
          spellCheck={false}
        />
        <p className="text-[10px] text-foreground/40">
          Shape: <code>M0,0 C{"{x1}"},{"{y1}"} {"{x2}"},{"{y2}"} 1,1</code>
        </p>
      </div>
    </div>
  );
}
