"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconArrowRight } from "@tabler/icons-react";

gsap.registerPlugin(useGSAP);

const DURATION = 0.35;

export function ArrowFillSlideButton({
  ease = "power3.inOut",
}: {
  ease?: string;
} = {}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const a = aRef.current;
      const b = bRef.current;
      if (!btn || !a || !b) return;

      gsap.set(a, { xPercent: 0 });
      gsap.set(b, { xPercent: -100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(a, {
        xPercent: 100,
        duration: DURATION,
        ease,
      }).to(
        b,
        { xPercent: 0, duration: DURATION, ease },
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
        tl.kill();
      };
    },
    { scope: btnRef },
  );

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="next"
      className="relative h-12 w-12 cursor-pointer overflow-hidden rounded border border-foreground/20"
    >
      <span
        ref={aRef}
        className="absolute inset-0 flex items-center justify-center bg-background text-foreground"
      >
        <IconArrowRight size={20} stroke={1.75} />
      </span>
      <span
        ref={bRef}
        className="absolute inset-0 flex items-center justify-center bg-foreground text-background"
      >
        <IconArrowRight size={20} stroke={1.75} />
      </span>
    </button>
  );
}
