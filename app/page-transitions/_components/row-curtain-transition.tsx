"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { BUTTON_CLASSES } from "../../buttons/_components/button-shell";

gsap.registerPlugin(useGSAP, SplitText);

const ROWS = 5;
const COVER_DURATION = 0.45;
const REVEAL_DURATION = 0.45;
const STAGGER = 0.08;
const CHAR_STAGGER = 0.04;
const HOLD = 0.6;

export function RowCurtainTransition({
  name = "ROW CURTAIN",
}: {
  name?: string;
}) {
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  const play = () => {
    if (playing) return;
    setMounted(true);
    setPlaying(true);
    requestAnimationFrame(() => {
      const textEl = textRef.current;
      if (!textEl) return;

      gsap.set(rowsRef.current, { scaleX: 0, transformOrigin: "left center" });

      const split = SplitText.create(textEl, { type: "chars", aria: "none" });
      gsap.set(textEl, { autoAlpha: 1 });
      gsap.set(split.chars, { yPercent: 100, autoAlpha: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          split.revert();
          setPlaying(false);
          setMounted(false);
        },
      });

      tl.to(rowsRef.current, {
        scaleX: 1,
        duration: COVER_DURATION,
        ease: "power3.inOut",
        stagger: STAGGER,
      })
        .to(
          split.chars,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: CHAR_STAGGER,
          },
          ">-0.15",
        )
        .to(
          split.chars,
          {
            yPercent: -100,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power3.in",
            stagger: CHAR_STAGGER,
          },
          `>+${HOLD}`,
        )
        .set(rowsRef.current, { transformOrigin: "right center" }, ">-0.1")
        .to(
          rowsRef.current,
          {
            scaleX: 0,
            duration: REVEAL_DURATION,
            ease: "power3.inOut",
            stagger: STAGGER,
          },
          "<",
        );
    });
  };

  const overlay =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 flex flex-col">
              {Array.from({ length: ROWS }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) rowsRef.current[i] = el;
                  }}
                  className="flex-1 bg-foreground"
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div
                ref={textRef}
                className="text-background font-bold text-4xl tracking-widest font-(family-name:--font-ubuntu-mono)"
                style={{ opacity: 0 }}
              >
                {name}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={play}
        className={BUTTON_CLASSES}
        disabled={playing}
      >
        TRANSITION
      </button>
      {overlay}
    </>
  );
}
