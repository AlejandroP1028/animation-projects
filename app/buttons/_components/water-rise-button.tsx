"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const W = 176;
const H = 56;
const PADDING = 80;
const AMP = 9;
const FREQ = 2.4;
const RIPPLE_AMP = 3;
const RIPPLE_FREQ = 4.1;
const STEPS = 48;
const RISE_DURATION = 1.2;
const WAVE_PERIOD = 1.4;
const FONT_STACK =
  "var(--font-ubuntu-mono), ui-monospace, SFMono-Regular, Menlo, monospace";

function buildWave(p: number, phase: number): string {
  const startBelow = H + AMP + RIPPLE_AMP + 12;
  const endAbove = -AMP - RIPPLE_AMP - 12;
  const baseY = startBelow + (endAbove - startBelow) * p;
  const samples: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const x = (W / STEPS) * i;
    const u = x / W;
    const y =
      baseY +
      AMP * Math.sin(u * FREQ * Math.PI * 2 + phase) +
      RIPPLE_AMP * Math.sin(u * RIPPLE_FREQ * Math.PI * 2 - phase * 1.7);
    samples.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)},${y.toFixed(2)}`);
  }
  samples.push(`L ${W},${H + PADDING}`);
  samples.push(`L 0,${H + PADDING}`);
  samples.push("Z");
  return samples.join(" ");
}

export function WaterRiseButton({ label }: { label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const invertedRef = useRef<HTMLSpanElement>(null);
  const riseRef = useRef<gsap.core.Tween | null>(null);
  const phaseRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const fill = fillRef.current;
      const inverted = invertedRef.current;
      if (!btn || !fill || !inverted) return;

      const state = { p: 0, phase: 0 };
      const apply = () => {
        const d = buildWave(state.p, state.phase);
        fill.setAttribute("d", d);
        const cp = `path("${d}")`;
        inverted.style.clipPath = cp;
        inverted.style.setProperty("-webkit-clip-path", cp);
      };
      apply();

      phaseRef.current = gsap.to(state, {
        phase: Math.PI * 2,
        duration: WAVE_PERIOD,
        ease: "none",
        repeat: -1,
        onUpdate: apply,
      });

      riseRef.current = gsap.to(state, {
        p: 1,
        duration: RISE_DURATION,
        ease: "power2.out",
        paused: true,
        onUpdate: apply,
      });

      const onEnter = () => riseRef.current?.play();
      const onLeave = () => riseRef.current?.reverse();

      btn.addEventListener("pointerenter", onEnter);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
        btn.removeEventListener("pointerleave", onLeave);
        phaseRef.current?.kill();
        riseRef.current?.kill();
      };
    },
    { scope: btnRef },
  );

  const initialD = buildWave(0, 0);

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
