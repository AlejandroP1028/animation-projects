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

  return (
    <main className="flex flex-1 flex-col font-(family-name:--font-ubuntu-mono)">
      <header className="border-b border-foreground/10 px-6 py-4 pl-16 md:pl-6">
        <h1 className="text-2xl font-bold">Easing Playground</h1>
      </header>

      <Controls state={state} setState={setState} ease={ease} />

      <div className="grid flex-1 grid-cols-1 gap-px bg-foreground/10 p-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SceneBall {...sceneProps} />
        <SceneDrop {...sceneProps} />
        <SceneCircle {...sceneProps} />
        <SceneRotation {...sceneProps} />
        <SceneScale {...sceneProps} />
        <SceneBar {...sceneProps} />
        <SceneFade {...sceneProps} />
        <SceneHue {...sceneProps} />
        <ScenePath {...sceneProps} />
        <SceneCounter {...sceneProps} />
        <SceneStagger {...sceneProps} />
        <ScenePendulum {...sceneProps} />
      </div>
    </main>
  );
}
