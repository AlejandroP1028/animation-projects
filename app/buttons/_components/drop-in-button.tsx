"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES } from "./button-shell";

gsap.registerPlugin(useGSAP, SplitText);

const DURATION = 0.3;
const STAGGER = 0.015;
const COOLDOWN_MS = 250;

export function DropInButton({
  label,
  ease = "power3.inOut",
}: {
  label: string;
  ease?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lockedRef = useRef(false);

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

      gsap.set(splitBottom.chars, { yPercent: -100 });

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(splitTop.chars, { yPercent: -100 });
          gsap.set(splitBottom.chars, { yPercent: 0 });
          setTimeout(() => {
            lockedRef.current = false;
          }, COOLDOWN_MS);
        },
      });
      tl.to(splitTop.chars, {
        yPercent: 100,
        duration: DURATION,
        ease,
        stagger: STAGGER,
      }).to(
        splitBottom.chars,
        {
          yPercent: 0,
          duration: DURATION,
          ease,
          stagger: STAGGER,
        },
        0,
      );
      tlRef.current = tl;

      const onEnter = () => {
        if (lockedRef.current) return;
        lockedRef.current = true;
        gsap.set(splitTop.chars, { yPercent: 0 });
        gsap.set(splitBottom.chars, { yPercent: -100 });
        tl.restart();
      };

      btn.addEventListener("pointerenter", onEnter);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
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
