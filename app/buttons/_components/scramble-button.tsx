"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES, CHAR_CLASSES, CHAR_WIDTH } from "./button-shell";

const SYMBOLS = "!@#$%^&*()_+-=[]{}<>?/\\|~";
const SCRAMBLE_DURATION = 0.2;
const SWAP_INTERVAL = 0.01;

function randSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function ScrambleButton({ label }: { label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeIndex = useRef<number>(-1);
  const tweens = useRef<Map<number, gsap.core.Tween>>(new Map());

  useGSAP(
    () => {
      const btn = btnRef.current;
      if (!btn) return;

      const scrambleChar = (i: number) => {
        const el = charRefs.current[i];
        if (!el) return;
        const original = label[i];
        if (original === " ") return;

        tweens.current.get(i)?.kill();

        const state = { t: 0 };
        let lastSwap = -Infinity;
        const tween = gsap.to(state, {
          t: SCRAMBLE_DURATION,
          duration: SCRAMBLE_DURATION,
          ease: "none",
          onUpdate() {
            if (state.t - lastSwap >= SWAP_INTERVAL) {
              lastSwap = state.t;
              el.textContent = randSymbol();
            }
          },
          onComplete() {
            el.textContent = original;
            tweens.current.delete(i);
          },
        });
        tweens.current.set(i, tween);
      };

      const findCharIndex = (clientX: number) => {
        let best = -1;
        let bestDist = Infinity;
        charRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const d = Math.abs(clientX - cx);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      };

      const onMove = (e: PointerEvent) => {
        const i = findCharIndex(e.clientX);
        if (i !== activeIndex.current) {
          activeIndex.current = i;
          if (i >= 0) scrambleChar(i);
        }
      };

      const onLeave = () => {
        activeIndex.current = -1;
      };

      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerleave", onLeave);
        tweens.current.forEach((t) => t.kill());
        tweens.current.clear();
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
          {ch === " " ? " " : ch}
        </span>
      ))}
    </button>
  );
}
