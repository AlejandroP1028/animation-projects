"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const W = 176;
const H = 56;
const DOME_MAX = 28;
const PADDING = 80;
const TY_START = H + DOME_MAX + 6;
const TY_END = 0;
const DURATION = 0.45;
const FONT_STACK =
  "var(--font-ubuntu-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

function buildPath(ty: number, dome: number): string {
  const peakY = ty - dome;
  return `M 0,${ty} Q ${W / 2},${peakY} ${W},${ty} L ${W},${H + PADDING} L 0,${
    H + PADDING
  } Z`;
}

export function SemicircleRiseButton({
  label,
  ease = "power3.out",
}: {
  label: string;
  ease?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const invertedRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const fill = fillRef.current;
      const inverted = invertedRef.current;
      if (!btn || !fill || !inverted) return;

      const state = { p: 0 };
      const applyD = () => {
        const ty = TY_START + (TY_END - TY_START) * state.p;
        const dome = DOME_MAX * (1 - state.p);
        const d = buildPath(ty, dome);
        fill.setAttribute("d", d);
        const cp = `path("${d}")`;
        inverted.style.clipPath = cp;
        inverted.style.setProperty("-webkit-clip-path", cp);
      };
      applyD();

      const tl = gsap.timeline({ paused: true });
      tl.to(state, {
        p: 1,
        duration: DURATION,
        ease,
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
        className="pointer-events-none absolute inset-0 text-foreground"
      >
        <path ref={fillRef} d={initialD} fill="currentColor" />
      </svg>
      <span
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-base font-medium text-foreground"
        style={{ fontFamily: FONT_STACK }}
        aria-hidden="true"
      >
        {label}
      </span>
      <span
        ref={invertedRef}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-base font-medium text-background"
        style={{
          fontFamily: FONT_STACK,
          clipPath: `path("${initialD}")`,
          WebkitClipPath: `path("${initialD}")`,
        }}
        aria-hidden="true"
      >
        {label}
      </span>
    </button>
  );
}
