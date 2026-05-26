"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconArrowRight } from "@tabler/icons-react";
import { ICON_BUTTON_CLASSES } from "./button-shell";

gsap.registerPlugin(useGSAP);

const DURATION = 0.45;
const COOLDOWN_MS = 250;

export function ArrowSlideButton({
  ease = "power3.inOut",
}: {
  ease?: string;
} = {}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const animatingRef = useRef(false);
  const lastDoneRef = useRef(0);

  useGSAP(
    () => {
      const btn = btnRef.current;
      const a = aRef.current;
      const b = bRef.current;
      if (!btn || !a || !b) return;

      gsap.set(b, { xPercent: -200, autoAlpha: 0 });

      const onEnter = () => {
        if (animatingRef.current) return;
        if (performance.now() - lastDoneRef.current < COOLDOWN_MS) return;
        animatingRef.current = true;

        gsap.set(a, { xPercent: 0, autoAlpha: 1 });
        gsap.set(b, { xPercent: -200, autoAlpha: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(a, { xPercent: 0, autoAlpha: 1 });
            gsap.set(b, { xPercent: -200, autoAlpha: 0 });
            animatingRef.current = false;
            lastDoneRef.current = performance.now();
          },
        });
        tl.to(a, {
          xPercent: 200,
          autoAlpha: 0,
          duration: DURATION,
          ease,
        }).to(
          b,
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: DURATION,
            ease,
          },
          DURATION * 0.4,
        );
      };

      btn.addEventListener("pointerenter", onEnter);
      return () => {
        btn.removeEventListener("pointerenter", onEnter);
      };
    },
    { scope: btnRef },
  );

  return (
    <button ref={btnRef} type="button" className={ICON_BUTTON_CLASSES} aria-label="next">
      <span className="relative inline-flex h-6 w-6 items-center justify-center overflow-hidden">
        <span ref={aRef} className="absolute inset-0 flex items-center justify-center">
          <IconArrowRight size={20} stroke={1.75} />
        </span>
        <span ref={bRef} className="absolute inset-0 flex items-center justify-center">
          <IconArrowRight size={20} stroke={1.75} />
        </span>
      </span>
    </button>
  );
}
