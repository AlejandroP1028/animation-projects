"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Setup = (tl: gsap.core.Timeline) => void;

export interface SceneProps {
  ease: string;
  duration: number;
  paused: boolean;
  loop: boolean;
  playToken: number;
}

export function useSceneLoop(setup: Setup, deps: SceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useGSAP(
    () => {
      const tl = gsap.timeline({
        repeat: deps.loop ? -1 : 0,
        yoyo: false,
        repeatDelay: deps.loop ? deps.duration * 0.15 : 0,
        defaults: { duration: deps.duration, ease: deps.ease },
        paused: true,
      });
      tlRef.current = tl;
      setupRef.current(tl);
      if (deps.loop && !deps.paused) tl.play();
      return () => {
        tl.kill();
        tlRef.current = null;
      };
    },
    {
      scope: ref,
      dependencies: [deps.ease, deps.duration, deps.loop],
    },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl || !deps.loop) return;
      if (deps.paused) tl.pause();
      else tl.resume();
    },
    { scope: ref, dependencies: [deps.paused] },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl || deps.loop || deps.playToken === 0) return;
      tl.restart();
    },
    { scope: ref, dependencies: [deps.playToken] },
  );

  return ref;
}
