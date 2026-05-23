# Easing Playground — Design

**Date:** 2026-05-24
**Route:** `/easing`
**Status:** Approved

## Purpose

A single-page playground for exploring GSAP easings. Picking one easing + duration applies it to a grid of animation scenes simultaneously, so the user can feel how a given easing behaves across different kinds of motion. Includes a custom cubic-bezier easing editor.

## Scope

In scope:
- Sidebar entry under a new "Playgrounds" section.
- Route `/easing` rendering controls + grid of 12 scenes.
- All GSAP core easing families and variants.
- Custom easing via GSAP `CustomEase` (cubic-bezier handles + path string, bidirectional).
- Live curve graph for the current easing.
- Auto-loop playback with a pause toggle.

Out of scope:
- ScrollTrigger or scroll-driven previews.
- MotionPath plugin scenes.
- Sharing / URL-encoding the current configuration.
- Saving custom easing presets.
- Keyboard shortcuts.
- Mobile-specific control reflow beyond Tailwind defaults.

## Architecture

### Routing

New route: `app/easing/page.tsx` (client component — owns playground state).

### Sidebar

`app/_components/sidebar.tsx` — add a second entry to the `sections` array:

```ts
{
  title: "Playgrounds",
  items: [{ href: "/easing", label: "Easing Playground" }],
}
```

Placement: above the existing "Animations" section.

### Page state

`page.tsx` holds:

```ts
type Variant = "in" | "out" | "inOut";
type Family =
  | "power1" | "power2" | "power3" | "power4"
  | "back" | "elastic" | "bounce" | "circ" | "expo" | "sine"
  | "steps" | "none" | "custom";

interface PlaygroundState {
  family: Family;
  variant: Variant;          // ignored when family is "none" or "custom"
  steps: number;             // used only when family is "steps"
  duration: number;          // seconds, 0.1–4.0
  paused: boolean;
  customPath: string;        // CustomEase SVG path string
}
```

Derived value `ease: string` is computed from state via `buildEaseString(state)` in `easings.ts` and passed down to every scene + the curve graph.

### File layout

```
app/easing/
  page.tsx
  _components/
    controls.tsx
    curve-graph.tsx
    custom-easing-editor.tsx
    easings.ts
    use-scene-loop.ts
    scene-frame.tsx
    scene-ball.tsx
    scene-drop.tsx
    scene-circle.tsx
    scene-rotation.tsx
    scene-scale.tsx
    scene-bar.tsx
    scene-fade.tsx
    scene-hue.tsx
    scene-path.tsx
    scene-counter.tsx
    scene-stagger.tsx
    scene-pendulum.tsx
```

### Module responsibilities

**`easings.ts`**
- Exports `FAMILIES`, `VARIANTS` constants.
- Registers `CustomEase` plugin once (guarded by a module-level flag).
- `buildEaseString(state): string` — returns the string passed to `gsap.to({ ease })`. For `custom`, calls `CustomEase.create("playground-custom", state.customPath)` and returns `"playground-custom"`. For `steps`, returns `` `steps(${state.steps})` ``. For `none`, returns `"none"`.
- `sampleEase(ease, n=60): {x:number,y:number}[]` — uses `gsap.parseEase(ease)` for the graph.

**`controls.tsx`**
- Sticky top bar.
- Family dropdown, variant dropdown (hidden when family ∈ {none, custom}), steps number input (only for `steps`), duration range slider + numeric readout, pause toggle button.
- Mounts `curve-graph.tsx` to the right of the dropdowns.
- When `family === "custom"`, mounts `custom-easing-editor.tsx` below the bar.

**`curve-graph.tsx`**
- Receives `ease: string`. Calls `sampleEase` and renders an SVG `polyline` inside a 140×140 box with axes.
- Re-samples on `ease` change only.

**`custom-easing-editor.tsx`**
- Cubic-bezier canvas: P0 = (0,0), P3 = (1,1) fixed; P1, P2 draggable handles inside a square area.
- Drag → updates `customPath` to `M0,0 C{x1},{y1} {x2},{y2} 1,1` (4-decimal precision).
- Path text input: editable. On valid parse, updates handle positions. On invalid parse, keeps the last valid path and shows an error border on the input.
- Parser: a small regex extracting two control points from the `M0,0 C ... 1,1` shape; reject anything else.

**`use-scene-loop.ts`**
- Hook signature: `useSceneLoop(setup: (tl: gsap.core.Timeline) => void, deps: { ease: string; duration: number; paused: boolean })`.
- Uses `useGSAP` from `@gsap/react` with the scope ref returned to the caller.
- Builds a fresh `gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: deps.duration, ease: deps.ease } })` each time `ease` or `duration` changes; calls `setup(tl)` to add the scene's tweens.
- On `paused` change, calls `tl.pause()` / `tl.resume()` without rebuilding.
- Returns the scope `ref` for the scene to attach to its root element.

**`scene-frame.tsx`**
- Presentational wrapper: label at top, fixed-aspect tile (roughly 1:1, ~280px wide), border consistent with existing demos.

**Scenes (each ~30–60 lines):**
| File | What animates | GSAP target props |
|------|---------------|-------------------|
| `scene-ball.tsx` | Dot translateX across track | `x: 0 → trackWidth` |
| `scene-drop.tsx` | Dot translateY top → bottom | `y: 0 → trackHeight` |
| `scene-circle.tsx` | Point orbits a circle | tween `rotation: 0 → 360` on a wrapper whose child is offset by `translateX(radius)` — child orbits as the wrapper rotates |
| `scene-rotation.tsx` | Square rotates 360° | `rotation: 0 → 360` |
| `scene-scale.tsx` | Box grows 0 → 1 | `scale: 0 → 1` |
| `scene-bar.tsx` | Bar width 0 → 100% | `scaleX: 0 → 1` (transform-origin left) |
| `scene-fade.tsx` | Element opacity 0 → 1 | `opacity` |
| `scene-hue.tsx` | Element hue shifts | tween a number `0 → 360`, apply to `style.filter = 'hue-rotate(...)'` via `onUpdate` |
| `scene-path.tsx` | SVG stroke draws | `strokeDashoffset: L → 0` (dash array preset to path length) |
| `scene-counter.tsx` | Number 0 → 100 | tween an object `{ n: 0 }` → `100`, write to text node in `onUpdate` |
| `scene-stagger.tsx` | 5 dots translateY | `gsap.to(dots, { y: -20, stagger: 0.08 })` inside the looped timeline |
| `scene-pendulum.tsx` | Swing arm rotation | `rotation: -45 → 45`, transform-origin top center |

For scenes that use plain `gsap.to` semantics (most), the timeline contains a single `tl.to(target, { ... })`. yoyo handles the return.

### Auto-loop semantics

- Timeline created with `repeat: -1, yoyo: true`. Each forward tween uses the chosen ease; the yoyo'd return uses the same ease running in reverse — this is GSAP default and is what the user wants for "feel the easing."
- Changing `ease` or `duration` rebuilds the timeline so the new ease takes effect immediately (otherwise GSAP keeps the original ease on existing tweens).
- Changing `paused` does not rebuild — just pause/resume.

### Curve graph behavior

`sampleEase` calls `gsap.parseEase(easeString)`, which returns a function `t => v`. Sample at `n` evenly spaced `t` values, map to SVG coordinates with `y` flipped (SVG y grows down). Render as a single `polyline`.

For `custom` family, `gsap.parseEase("playground-custom")` works after `CustomEase.create` has been called — `easings.ts` ensures the create happens inside `buildEaseString` before the graph reads the ease.

### Custom easing parsing

Accept exactly the shape `M0,0 C{n},{n} {n},{n} 1,1` with optional whitespace and numeric values (negative allowed for overshoot eases). Reject anything else. The bezier UI clamps handle X to [0, 1] but allows Y to be slightly outside [0, 1] so users can build `back`-style overshoots.

## Data flow

```
page.tsx (state)
  │
  ├─ buildEaseString(state) ──► ease: string
  │
  ├─► controls.tsx ──► curve-graph.tsx (reads ease)
  │                └─► custom-easing-editor.tsx (when family === "custom")
  │
  └─► scene-*.tsx × 12  (each reads ease, duration, paused; uses use-scene-loop)
```

## Error handling

- Invalid custom path → editor keeps last valid path, applies an error border to the input. No thrown error reaches the timeline.
- Plugin registration is idempotent (guarded). Safe under HMR.
- `gsap.parseEase` for an unknown ease string would throw — `buildEaseString` is the single source for ease strings, so unknown strings cannot reach the graph or scenes.

## Testing

Manual verification in the browser:
1. Each family + variant combination plays and re-renders the curve graph.
2. Duration slider changes loop length on next rebuild.
3. Pause toggle freezes all 12 scenes; resume continues from current position.
4. Custom: dragging handles updates the path string; editing the string moves the handles; invalid string shows the error state and does not crash.
5. Sidebar entry navigates correctly and is highlighted on `/easing`.

No unit tests for this route (matches existing demo routes — visual playgrounds verified manually).

## Open questions

None at design time. Defer any plugin-licensing concerns; `CustomEase` is part of the free GSAP core since 3.11.

## Follow-ups (not in this spec)

- Add a "copy ease string" affordance.
- Add URL-encoded sharing of the current playground state.
- Optional ScrollTrigger preview row.
