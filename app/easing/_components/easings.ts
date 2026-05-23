import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

let registered = false;
function ensureRegistered() {
  if (registered) return;
  gsap.registerPlugin(CustomEase);
  registered = true;
}

export const FAMILIES = [
  "power1",
  "power2",
  "power3",
  "power4",
  "back",
  "elastic",
  "bounce",
  "circ",
  "expo",
  "sine",
  "steps",
  "none",
  "custom",
] as const;

export type Family = (typeof FAMILIES)[number];

export const VARIANTS = ["in", "out", "inOut"] as const;
export type Variant = (typeof VARIANTS)[number];

export const VARIANTLESS: Family[] = ["none", "custom", "steps"];

export interface PlaygroundState {
  family: Family;
  variant: Variant;
  steps: number;
  duration: number;
  paused: boolean;
  loop: boolean;
  playToken: number;
  customPath: string;
}

export const DEFAULT_CUSTOM_PATH = "M0,0 C0.25,0.1 0.25,1 1,1";
const CUSTOM_NAME = "playground-custom";

export function buildEaseString(state: PlaygroundState): string {
  ensureRegistered();
  switch (state.family) {
    case "none":
      return "none";
    case "steps":
      return `steps(${Math.max(1, Math.floor(state.steps))})`;
    case "custom": {
      try {
        CustomEase.create(CUSTOM_NAME, state.customPath);
        return CUSTOM_NAME;
      } catch {
        CustomEase.create(CUSTOM_NAME, DEFAULT_CUSTOM_PATH);
        return CUSTOM_NAME;
      }
    }
    default:
      return `${state.family}.${state.variant}`;
  }
}

export function sampleEase(
  ease: string,
  n = 60,
): { x: number; y: number }[] {
  ensureRegistered();
  const fn = gsap.parseEase(ease);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push({ x: t, y: fn(t) });
  }
  return out;
}

const PATH_RE =
  /^\s*M\s*0\s*,\s*0\s+C\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s+(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s+1\s*,\s*1\s*$/;

export function parseCubicPath(
  path: string,
): { x1: number; y1: number; x2: number; y2: number } | null {
  const m = path.match(PATH_RE);
  if (!m) return null;
  return {
    x1: parseFloat(m[1]),
    y1: parseFloat(m[2]),
    x2: parseFloat(m[3]),
    y2: parseFloat(m[4]),
  };
}

export function formatCubicPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const r = (n: number) => Number(n.toFixed(4)).toString();
  return `M0,0 C${r(x1)},${r(y1)} ${r(x2)},${r(y2)} 1,1`;
}
