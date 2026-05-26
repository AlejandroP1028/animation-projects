"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES } from "./button-shell";

gsap.registerPlugin(useGSAP);

const DURATION = 0.6;
const COOLDOWN_MS = 250;

export function SwapRiseButton({
  label,
  altLabel,
  ease = "power3.out",
}: {
  label: string;
  altLabel?: string;
  ease?: string;
}) {
  const labels = [label, altLabel ?? label];
  const btnRef = useRef<HTMLButtonElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const idxRef = useRef(0);
  const animatingRef = useRef(false);
  const lastDoneRef = useRef(0);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const a = aRef.current;
      const b = bRef.current;
      if (!btn || !a || !b) return;

      gsap.set(b, { yPercent: 100 });

      const onEnter = () => {
        if (animatingRef.current) return;
        if (performance.now() - lastDoneRef.current < COOLDOWN_MS) return;
        animatingRef.current = true;

        const outgoing = idxRef.current % 2 === 0 ? a : b;
        const incoming = idxRef.current % 2 === 0 ? b : a;
        const nextIdx = (idxRef.current + 1) % labels.length;
        incoming.textContent = labels[nextIdx];

        gsap.set(incoming, { yPercent: 100 });
        const tl = gsap.timeline({
          onComplete: () => {
            idxRef.current = (idxRef.current + 1) % 2;
            animatingRef.current = false;
            lastDoneRef.current = performance.now();
          },
        });
        tl.to(outgoing, {
          yPercent: -100,
          duration: DURATION,
          ease,
        }).to(
          incoming,
          { yPercent: 0, duration: DURATION, ease },
          0,
        );
      };

      btn.addEventListener("pointerenter", onEnter);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
      };
    },
    { scope: btnRef, dependencies: [label, altLabel] },
  );

  return (
    <button ref={btnRef} type="button" className={BUTTON_CLASSES}>
      <span
        className="relative inline-block overflow-hidden leading-none"
        aria-label={label}
      >
        <span ref={aRef} className="inline-block" aria-hidden="true">
          {labels[0]}
        </span>
        <span
          ref={bRef}
          className="absolute inset-0 inline-block"
          aria-hidden="true"
        >
          {labels[1]}
        </span>
      </span>
    </button>
  );
}
