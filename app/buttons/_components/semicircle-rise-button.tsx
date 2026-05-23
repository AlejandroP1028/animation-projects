"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const W = 176;
const H = 56;
const DOME_MAX = 28;
const PADDING = 80;
const TY_START = H + DOME_MAX + 6;
const TY_END = 0;
const DURATION = 0.45;

function buildPath(ty: number, dome: number): string {
  const peakY = ty - dome;
  return `M 0,${ty} Q ${W / 2},${peakY} ${W},${ty} L ${W},${H + PADDING} L 0,${
    H + PADDING
  } Z`;
}

export function SemicircleRiseButton({ label }: { label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reactId = useId();
  const clipId = `clip-${reactId.replace(/:/g, "")}`;

  useGSAP(
    () => {
      const btn = btnRef.current;
      const fill = fillRef.current;
      const clip = clipRef.current;
      if (!btn || !fill || !clip) return;

      const state = { p: 0 };
      const applyD = () => {
        const ty = TY_START + (TY_END - TY_START) * state.p;
        const dome = DOME_MAX * (1 - state.p);
        const d = buildPath(ty, dome);
        fill.setAttribute("d", d);
        clip.setAttribute("d", d);
      };
      applyD();

      const tl = gsap.timeline({ paused: true });
      tl.to(state, {
        p: 1,
        duration: DURATION,
        ease: "power3.out",
        onUpdate: applyD,
      });
      tlRef.current = tl;

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();
      btn.addEventListener("pointerenter", onEnter);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
        btn.removeEventListener("pointerleave", onLeave);
        tl.kill();
      };
    },
    { scope: btnRef },
  );

  const initialD = buildPath(TY_START, DOME_MAX);

  return (
    <button
      ref={btnRef}
      type="button"
      className="relative h-14 w-44 cursor-pointer overflow-hidden rounded border border-foreground/20 bg-background"
      aria-label={label}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0"
      >
        <defs>
          <clipPath id={clipId}>
            <path ref={clipRef} d={initialD} />
          </clipPath>
        </defs>
        <path ref={fillRef} d={initialD} fill="var(--foreground)" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--foreground)"
          style={{ fontFamily: "inherit", fontSize: 16, fontWeight: 500 }}
        >
          {label}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--background)"
          clipPath={`url(#${clipId})`}
          style={{ fontFamily: "inherit", fontSize: 16, fontWeight: 500 }}
        >
          {label}
        </text>
      </svg>
    </button>
  );
}
