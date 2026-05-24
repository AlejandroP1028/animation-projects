"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES, CHAR_CLASSES, CHAR_WIDTH } from "./button-shell";

const GRADIENT = ["█", "▓", "▒", "░"];
const STEP_DURATION = 0.075;
const STAGGER = 0.03;
const COOLDOWN_MS = 250;

export function AsciiPropagateButton({ label }: { label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const playing = useRef(false);
  const lastDoneRef = useRef(0);

  useGSAP(
    () => {
      const btn = btnRef.current;
      if (!btn) return;

      const onEnter = (e: PointerEvent) => {
        if (playing.current) return;
        if (performance.now() - lastDoneRef.current < COOLDOWN_MS) return;
        playing.current = true;

        const rect = btn.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const n = label.length;
        const entryIndex = Math.max(0, Math.min(n - 1, Math.round(relX * (n - 1))));

        const master = gsap.timeline({
          onComplete: () => {
            playing.current = false;
            lastDoneRef.current = performance.now();
          },
        });

        charRefs.current.forEach((el, i) => {
          if (!el) return;
          const original = label[i];
          if (original === " ") return;

          const dist = Math.abs(i - entryIndex);
          const startAt = dist * STAGGER;

          GRADIENT.forEach((g, k) => {
            master.call(
              () => {
                el.textContent = g;
              },
              undefined,
              startAt + k * STEP_DURATION,
            );
          });
          master.call(
            () => {
              el.textContent = original;
            },
            undefined,
            startAt + GRADIENT.length * STEP_DURATION,
          );
        });
      };

      btn.addEventListener("pointerenter", onEnter);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
      };
    },
    { scope: btnRef },
  );

  return (
    <button ref={btnRef} type="button" className={BUTTON_CLASSES}>
      {label.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className={CHAR_CLASSES}
          style={{ width: CHAR_WIDTH }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </button>
  );
}
