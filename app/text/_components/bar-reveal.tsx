"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useDemoControls } from "../../_components/demo-grid";

gsap.registerPlugin(useGSAP);

const LINES = [
  "Lorem ipsum dolor",
  "sit amet, consectetur",
  "adipiscing elit, sed",
  "do eiusmod tempor.",
];

const BAR_DURATION = 0.6;
const LINE_STAGGER = 0.12;

export function BarReveal({ id }: { id: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<(() => gsap.core.Timeline) | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const lines = root.querySelectorAll<HTMLElement>("[data-line]");

      const reset = () => {
        lines.forEach((line) => {
          const bar = line.querySelector<HTMLElement>("[data-bar]");
          const text = line.querySelector<HTMLElement>("[data-text]");
          if (!bar || !text) return;
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(text, { autoAlpha: 0 });
        });
      };

      const build = () => {
        reset();
        const tl = gsap.timeline({ paused: true });
        lines.forEach((line, i) => {
          const bar = line.querySelector<HTMLElement>("[data-bar]");
          const text = line.querySelector<HTMLElement>("[data-text]");
          if (!bar || !text) return;
          const start = i * LINE_STAGGER;
          tl.to(
            bar,
            { scaleX: 1, duration: BAR_DURATION, ease: "power4.inOut" },
            start,
          );
          tl.set(text, { autoAlpha: 1 }, start + BAR_DURATION);
          tl.set(bar, { transformOrigin: "right center" }, start + BAR_DURATION);
          tl.to(
            bar,
            { scaleX: 0, duration: BAR_DURATION, ease: "power4.inOut" },
            start + BAR_DURATION,
          );
        });
        return tl;
      };

      resetRef.current = reset;
      buildRef.current = build;
      tlRef.current = build();
      tlRef.current.play(0);

      return () => {
        tlRef.current?.kill();
      };
    },
    { scope: rootRef },
  );

  useDemoControls(id, {
    play: () => {
      tlRef.current?.kill();
      if (!buildRef.current) return;
      tlRef.current = buildRef.current();
      tlRef.current.play(0);
    },
    clear: () => {
      tlRef.current?.kill();
      resetRef.current?.();
    },
  });

  return (
    <div ref={rootRef} className="flex flex-col text-sm leading-tight">
      {LINES.map((line, i) => (
        <span
          key={i}
          data-line
          className="relative inline-block overflow-hidden"
        >
          <span data-text className="inline-block">
            {line}
          </span>
          <span
            data-bar
            aria-hidden="true"
            className="absolute inset-0 bg-foreground"
          />
        </span>
      ))}
    </div>
  );
}
