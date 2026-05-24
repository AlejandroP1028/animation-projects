"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useDemoControls } from "../../_components/demo-grid";

gsap.registerPlugin(useGSAP);

const SOURCE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";

function buildLines(lineCount: number, charCount: number): string[] {
  const words = SOURCE.split(" ");
  const lines: string[] = [];
  let current = "";
  let wi = 0;
  while (lines.length < lineCount && wi < words.length) {
    const w = words[wi];
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > charCount && current) {
      lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
    wi++;
    if (wi === words.length) wi = 0;
  }
  if (lines.length < lineCount && current) lines.push(current);
  while (lines.length < lineCount) lines.push(current || "lorem ipsum");
  return lines.slice(0, lineCount);
}

const BAR_DURATION = 0.6;
const LINE_STAGGER = 0.12;

export function BarReveal({
  id,
  fontSize,
  lineCount,
  charCount,
  customText,
}: {
  id: string;
  fontSize: number;
  lineCount: number;
  charCount: number;
  customText?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buildRef = useRef<(() => gsap.core.Timeline) | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  const lines = useMemo(() => {
    const trimmed = customText?.trim();
    if (trimmed) {
      const split = trimmed.split(/\r?\n/).filter((l) => l.length > 0);
      if (split.length > 0) return split;
    }
    return buildLines(lineCount, charCount);
  }, [customText, lineCount, charCount]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const lineEls = root.querySelectorAll<HTMLElement>("[data-line]");

      const reset = () => {
        lineEls.forEach((line) => {
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
        lineEls.forEach((line, i) => {
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
    { scope: rootRef, dependencies: [lines] },
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
    <div
      ref={rootRef}
      className="flex flex-col leading-tight"
      style={{ fontSize: `${fontSize}px` }}
    >
      {lines.map((line, i) => (
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
