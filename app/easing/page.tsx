"use client";

import { useMemo, useState } from "react";
import { useDebounced } from "../_components/use-debounced";
import {
  DEFAULT_CUSTOM_PATH,
  buildEaseString,
  type PlaygroundState,
} from "./_components/easings";
import { Controls } from "./_components/controls";
import { SceneBall } from "./_components/scene-ball";
import { SceneDrop } from "./_components/scene-drop";
import { SceneCircle } from "./_components/scene-circle";
import { SceneRotation } from "./_components/scene-rotation";
import { SceneScale } from "./_components/scene-scale";
import { SceneBar } from "./_components/scene-bar";
import { SceneFade } from "./_components/scene-fade";
import { SceneHue } from "./_components/scene-hue";
import { ScenePath } from "./_components/scene-path";
import { SceneCounter } from "./_components/scene-counter";
import { SceneStagger } from "./_components/scene-stagger";
import { ScenePendulum } from "./_components/scene-pendulum";

const INITIAL: PlaygroundState = {
  family: "power2",
  variant: "out",
  steps: 5,
  duration: 1.2,
  paused: false,
  loop: true,
  playToken: 0,
  customPath: DEFAULT_CUSTOM_PATH,
};

const CELLS = 16;

export default function EasingPlaygroundPage() {
  const [state, setState] = useState<PlaygroundState>(INITIAL);
  const debouncedCustomPath = useDebounced(state.customPath, 200);
  const ease = useMemo(
    () => buildEaseString({ ...state, customPath: debouncedCustomPath }),
    [state, debouncedCustomPath],
  );

  const sceneProps = {
    ease,
    duration: state.duration,
    paused: state.paused,
    loop: state.loop,
    playToken: state.playToken,
  };

  const scenes = [
    { label: "ball L→R", node: <SceneBall {...sceneProps} /> },
    { label: "vertical drop", node: <SceneDrop {...sceneProps} /> },
    { label: "point on circle", node: <SceneCircle {...sceneProps} /> },
    { label: "rotation 360°", node: <SceneRotation {...sceneProps} /> },
    { label: "scale pulse", node: <SceneScale {...sceneProps} /> },
    { label: "bar fill", node: <SceneBar {...sceneProps} /> },
    { label: "fade in", node: <SceneFade {...sceneProps} /> },
    { label: "hue shift", node: <SceneHue {...sceneProps} /> },
    { label: "svg path draw", node: <ScenePath {...sceneProps} /> },
    { label: "counter 0→100", node: <SceneCounter {...sceneProps} /> },
    { label: "stagger row", node: <SceneStagger {...sceneProps} /> },
    { label: "pendulum", node: <ScenePendulum {...sceneProps} /> },
  ];

  return (
    <main className="flex flex-1 flex-col font-(family-name:--font-ubuntu-mono)">
      <header className="border-b border-foreground/10 px-6 py-4 pl-16 md:pl-6">
        <h1 className="text-2xl font-bold">Easing Playground</h1>
      </header>

      <Controls state={state} setState={setState} ease={ease} />

      <div className="relative flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2 grid-rows-8 md:grid-cols-4 md:grid-rows-4 -mr-px -mb-px">
          {Array.from({ length: CELLS }).map((_, i) => {
            const scene = scenes[i];
            const mobileDark = (Math.floor(i / 2) + (i % 2)) % 2 === 1;
            const desktopDark = (Math.floor(i / 4) + (i % 4)) % 2 === 1;
            const mobileBg = mobileDark ? "bg-foreground/[0.04]" : "";
            const desktopBg = desktopDark
              ? "md:bg-foreground/[0.04]"
              : "md:bg-transparent";
            return (
              <div
                key={i}
                className={`relative flex min-h-32 flex-col items-center justify-center gap-2 border-r border-b border-foreground/10 p-4 ${mobileBg} ${desktopBg}`}
              >
                {scene ? (
                  <>
                    {scene.node}
                    <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider text-foreground/40">
                      {scene.label}
                    </span>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
