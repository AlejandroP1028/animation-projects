"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES } from "./button-shell";

gsap.registerPlugin(useGSAP, SplitText);

const DURATION = 0.3;
const STAGGER = 0.015;

export function SplitRiseButton({ label }: { label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;
      if (!btn || !top || !bottom) return;

      const splitTop = SplitText.create(top, { type: "chars", aria: "none" });
      const splitBottom = SplitText.create(bottom, {
        type: "chars",
        aria: "none",
      });

      gsap.set(splitBottom.chars, { yPercent: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(splitTop.chars, {
        yPercent: -100,
        duration: DURATION,
        ease: "power3.inOut",
        stagger: STAGGER,
      }).to(
        splitBottom.chars,
        {
          yPercent: 0,
          duration: DURATION,
          ease: "power3.inOut",
          stagger: STAGGER,
        },
        0,
      );
      tlRef.current = tl;

      const onEnter = () => tl.play();
      const onLeave = () => tl.reverse();

      btn.addEventListener("pointerenter", onEnter);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
        btn.removeEventListener("pointerleave", onLeave);
        splitTop.revert();
        splitBottom.revert();
        tl.kill();
      };
    },
    { scope: btnRef },
  );

  return (
    <button ref={btnRef} type="button" className={BUTTON_CLASSES}>
      <span
        className="relative inline-block overflow-hidden leading-none"
        aria-label={label}
      >
        <span ref={topRef} className="inline-block" aria-hidden="true">
          {label}
        </span>
        <span
          ref={bottomRef}
          className="absolute inset-0 inline-block"
          aria-hidden="true"
        >
          {label}
        </span>
      </span>
    </button>
  );
}
