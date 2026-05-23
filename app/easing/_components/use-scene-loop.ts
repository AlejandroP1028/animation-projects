"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Setup = (tl: gsap.core.Timeline) => void;

interface Deps {
  ease: string;
  duration: number;
  paused: boolean;
}

export function useSceneLoop(setup: Setup, deps: Deps) {
  const ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { duration: deps.duration, ease: deps.ease },
        paused: deps.paused,
      });
      tlRef.current = tl;
      setup(tl);
      return () => {
        tl.kill();
        tlRef.current = null;
      };
    },
    { scope: ref, dependencies: [deps.ease, deps.duration] },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl) return;
      if (deps.paused) tl.pause();
      else tl.resume();
    },
    { scope: ref, dependencies: [deps.paused] },
  );

  return ref;
}
