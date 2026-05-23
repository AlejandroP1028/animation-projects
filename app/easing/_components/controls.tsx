"use client";

import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import {
  FAMILIES,
  VARIANTLESS,
  VARIANTS,
  type Family,
  type PlaygroundState,
  type Variant,
} from "./easings";
import { CurveGraph } from "./curve-graph";
import { CustomEasingEditor } from "./custom-easing-editor";

interface Props {
  state: PlaygroundState;
  setState: React.Dispatch<React.SetStateAction<PlaygroundState>>;
  ease: string;
}

const SELECT_CLASS =
  "rounded border border-foreground/20 bg-background px-2 py-1 text-sm font-(family-name:--font-ubuntu-mono) cursor-pointer";

export function Controls({ state, setState, ease }: Props) {
  const showVariant = !VARIANTLESS.includes(state.family);
  const showSteps = state.family === "steps";
  const showCustom = state.family === "custom";

  return (
    <div className="flex flex-col gap-4 border-b border-foreground/10 px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <CurveGraph ease={ease} size={120} />
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
            family
            <select
              value={state.family}
              onChange={(e) =>
                setState((s) => ({ ...s, family: e.target.value as Family }))
              }
              className={SELECT_CLASS}
            >
              {FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>

          {showVariant && (
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
              variant
              <select
                value={state.variant}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    variant: e.target.value as Variant,
                  }))
                }
                className={SELECT_CLASS}
              >
                {VARIANTS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          )}

          {showSteps && (
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
              steps
              <input
                type="number"
                min={1}
                max={50}
                value={state.steps}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    steps: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className={`${SELECT_CLASS} w-16`}
              />
            </label>
          )}

          <label className="flex flex-1 min-w-[200px] items-center gap-3 text-xs uppercase tracking-wider text-foreground/60">
            duration
            <input
              type="range"
              min={0.1}
              max={4}
              step={0.05}
              value={state.duration}
              onChange={(e) =>
                setState((s) => ({ ...s, duration: parseFloat(e.target.value) }))
              }
              className="flex-1 cursor-pointer accent-foreground"
            />
            <span className="w-12 text-right font-(family-name:--font-ubuntu-mono) text-sm normal-case tracking-normal tabular-nums">
              {state.duration.toFixed(2)}s
            </span>
          </label>

          <button
            type="button"
            onClick={() => setState((s) => ({ ...s, paused: !s.paused }))}
            className="flex cursor-pointer items-center gap-2 rounded border border-foreground/20 px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-foreground/10"
            aria-label={state.paused ? "Play" : "Pause"}
          >
            {state.paused ? (
              <IconPlayerPlay size={14} stroke={1.5} />
            ) : (
              <IconPlayerPause size={14} stroke={1.5} />
            )}
            {state.paused ? "play" : "pause"}
          </button>
        </div>
      </div>

      {showCustom && (
        <CustomEasingEditor
          path={state.customPath}
          onChange={(customPath) => setState((s) => ({ ...s, customPath }))}
        />
      )}
    </div>
  );
}
