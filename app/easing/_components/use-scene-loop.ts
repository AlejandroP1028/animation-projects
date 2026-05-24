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
        yoyo: false,
        repeatDelay: 0.15,
        defaults: { duration: 1, ease: deps.ease },
        paused: true,
      });
      tlRef.current = tl;
      setupRef.current(tl);
      return () => {
        tl.kill();
        tlRef.current = null;
      };
    },
    { scope: ref, dependencies: [deps.ease] },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl) return;
      tl.timeScale(1 / deps.duration);
      tl.repeat(deps.loop ? -1 : 0);
      if (deps.loop) {
        if (deps.paused) tl.pause();
        else tl.play();
      } else {
        tl.pause(0);
      }
    },
    {
      scope: ref,
      dependencies: [deps.ease, deps.duration, deps.loop, deps.paused],
    },
  );

  useGSAP(
    () => {
      const tl = tlRef.current;
      if (!tl || deps.loop || deps.playToken === 0) return;
      tl.repeat(0);
      tl.restart();
    },
    { scope: ref, dependencies: [deps.playToken] },
  );

  return ref;
}
