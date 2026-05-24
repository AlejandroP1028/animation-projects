"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useDemoControls } from "../../_components/demo-grid";

gsap.registerPlugin(useGSAP);

const SOURCE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum";

const GRADIENT = ["█", "▓", "▒", "░"];
const STEP_DURATION = 0.05;
const CHAR_STAGGER = 0.015;
const LINE_STAGGER = 0.18;

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

export function AsciiReveal({
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
      const charEls = Array.from(
        root.querySelectorAll<HTMLElement>("[data-char]"),
      );

      const reset = () => {
        charEls.forEach((el) => {
          el.textContent = " ";
        });
      };

      const build = () => {
        reset();
        const tl = gsap.timeline({ paused: true });
        charEls.forEach((el) => {
          const original = el.dataset.original ?? "";
          if (original === " ") return;
          const lineIdx = Number(el.dataset.line ?? 0);
          const charIdx = Number(el.dataset.col ?? 0);
          const startAt = lineIdx * LINE_STAGGER + charIdx * CHAR_STAGGER;

          GRADIENT.forEach((g, k) => {
            tl.call(
              () => {
                el.textContent = g;
              },
              undefined,
              startAt + k * STEP_DURATION,
            );
          });
          tl.call(
            () => {
              el.textContent = original;
            },
            undefined,
            startAt + GRADIENT.length * STEP_DURATION,
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
      className="flex flex-col leading-tight font-(family-name:--font-ubuntu-mono)"
      style={{ fontSize: `${fontSize}px` }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block whitespace-pre">
          {line.split("").map((ch, j) => (
            <span
              key={j}
              data-char
              data-original={ch}
              data-line={i}
              data-col={j}
              className="inline-block text-center"
              style={{ width: "1ch" }}
            >
              {" "}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
