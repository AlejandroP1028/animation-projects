"use client";

import { useRef } from "react";
import { IconBell, IconMenu2, IconRefresh } from "@tabler/icons-react";
import { useSceneLoop, type SceneProps } from "./use-scene-loop";
import type { Family, Variant } from "./easings";

function ExampleFrame({
  label,
  innerRef,
  children,
}: {
  label: string;
  innerRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border border-foreground/10 bg-foreground/[0.02]">
      <div className="border-b border-foreground/10 px-2 py-1 text-[9px] uppercase tracking-wider text-foreground/50">
        {label}
      </div>
      <div ref={innerRef} className="relative h-28 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// === Toast: appear / dismiss / swap ===

function ToastAppear(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { y: -50, autoAlpha: 0 }, { y: 8, autoAlpha: 1 });
  }, props);
  return (
    <ExampleFrame label="toast appear" innerRef={ref}>
      <div className="absolute inset-x-2 top-0">
        <div
          ref={r}
          className="flex items-center gap-2 rounded border border-foreground/20 bg-background px-3 py-2 shadow-sm"
        >
          <IconBell size={14} stroke={1.5} />
          <span className="text-[11px] font-semibold">Message sent</span>
        </div>
      </div>
    </ExampleFrame>
  );
}

function ToastDismiss(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { y: 8, autoAlpha: 1 }, { y: -50, autoAlpha: 0 });
  }, props);
  return (
    <ExampleFrame label="toast dismiss" innerRef={ref}>
      <div className="absolute inset-x-2 top-0">
        <div
          ref={r}
          className="flex items-center gap-2 rounded border border-foreground/20 bg-background px-3 py-2 shadow-sm"
        >
          <IconBell size={14} stroke={1.5} />
          <span className="text-[11px] font-semibold">Message sent</span>
        </div>
      </div>
    </ExampleFrame>
  );
}

function ToastSwap(props: SceneProps) {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!aRef.current || !bRef.current) return;
    tl.fromTo(aRef.current, { y: 0, autoAlpha: 1 }, { y: -40, autoAlpha: 0 }, 0);
    tl.fromTo(bRef.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0);
  }, props);
  return (
    <ExampleFrame label="toast swap" innerRef={ref}>
      <div className="absolute inset-x-2 top-3">
        <div
          ref={aRef}
          className="absolute inset-x-0 rounded border border-foreground/20 bg-background px-2 py-1.5 text-[10px]"
        >
          Saved
        </div>
        <div
          ref={bRef}
          className="absolute inset-x-0 rounded border border-foreground/20 bg-background px-2 py-1.5 text-[10px]"
        >
          Sent
        </div>
      </div>
    </ExampleFrame>
  );
}

// === Modal: open / close / morph ===

function ModalOpen(props: SceneProps) {
  const bdRef = useRef<HTMLDivElement>(null);
  const dlRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!bdRef.current || !dlRef.current) return;
    tl.fromTo(bdRef.current, { autoAlpha: 0 }, { autoAlpha: 1 }, 0);
    tl.fromTo(
      dlRef.current,
      { scale: 0.85, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1 },
      0,
    );
  }, props);
  return (
    <ExampleFrame label="modal open" innerRef={ref}>
      <div ref={bdRef} className="absolute inset-0 bg-foreground/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={dlRef}
          className="w-[80%] rounded border border-foreground/20 bg-background p-3"
        >
          <div className="text-[11px] font-semibold">Confirm</div>
          <div className="mt-1 text-[9px] text-foreground/50">Are you sure?</div>
        </div>
      </div>
    </ExampleFrame>
  );
}

function ModalClose(props: SceneProps) {
  const bdRef = useRef<HTMLDivElement>(null);
  const dlRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!bdRef.current || !dlRef.current) return;
    tl.fromTo(bdRef.current, { autoAlpha: 1 }, { autoAlpha: 0 }, 0);
    tl.fromTo(
      dlRef.current,
      { scale: 1, autoAlpha: 1 },
      { scale: 0.85, autoAlpha: 0 },
      0,
    );
  }, props);
  return (
    <ExampleFrame label="modal close" innerRef={ref}>
      <div ref={bdRef} className="absolute inset-0 bg-foreground/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={dlRef}
          className="w-[80%] rounded border border-foreground/20 bg-background p-3"
        >
          <div className="text-[11px] font-semibold">Confirm</div>
          <div className="mt-1 text-[9px] text-foreground/50">Are you sure?</div>
        </div>
      </div>
    </ExampleFrame>
  );
}

function ModalMorph(props: SceneProps) {
  const dlRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!dlRef.current) return;
    tl.fromTo(
      dlRef.current,
      { width: "50%", height: 40 },
      { width: "85%", height: 70 },
    );
  }, props);
  return (
    <ExampleFrame label="modal morph" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={dlRef}
          className="rounded border border-foreground/20 bg-background"
        />
      </div>
    </ExampleFrame>
  );
}

// === Drawer: open / close ===

function DrawerOpen(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { xPercent: -100 }, { xPercent: 0 });
  }, props);
  return (
    <ExampleFrame label="drawer open" innerRef={ref}>
      <div className="absolute inset-0 bg-foreground/5" />
      <div
        ref={r}
        className="absolute inset-y-0 left-0 flex w-2/3 flex-col gap-1 border-r border-foreground/20 bg-background p-2"
      >
        <div className="flex items-center gap-1.5">
          <IconMenu2 size={12} stroke={1.5} />
          <span className="text-[10px] font-semibold">Menu</span>
        </div>
        <div className="h-1.5 w-3/4 rounded bg-foreground/10" />
        <div className="h-1.5 w-2/3 rounded bg-foreground/10" />
      </div>
    </ExampleFrame>
  );
}

function DrawerClose(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { xPercent: 0 }, { xPercent: -100 });
  }, props);
  return (
    <ExampleFrame label="drawer close" innerRef={ref}>
      <div className="absolute inset-0 bg-foreground/5" />
      <div
        ref={r}
        className="absolute inset-y-0 left-0 flex w-2/3 flex-col gap-1 border-r border-foreground/20 bg-background p-2"
      >
        <div className="flex items-center gap-1.5">
          <IconMenu2 size={12} stroke={1.5} />
          <span className="text-[10px] font-semibold">Menu</span>
        </div>
        <div className="h-1.5 w-3/4 rounded bg-foreground/10" />
        <div className="h-1.5 w-2/3 rounded bg-foreground/10" />
      </div>
    </ExampleFrame>
  );
}

// === Fade: in / out / cross ===

function FadeIn(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { autoAlpha: 0 }, { autoAlpha: 1 });
  }, props);
  return (
    <ExampleFrame label="fade in" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={r}
          className="h-16 w-24 rounded border border-foreground/20 bg-background"
        />
      </div>
    </ExampleFrame>
  );
}

function FadeOut(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { autoAlpha: 1 }, { autoAlpha: 0 });
  }, props);
  return (
    <ExampleFrame label="fade out" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={r}
          className="h-16 w-24 rounded border border-foreground/20 bg-background"
        />
      </div>
    </ExampleFrame>
  );
}

function FadeCross(props: SceneProps) {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!aRef.current || !bRef.current) return;
    tl.fromTo(aRef.current, { autoAlpha: 1 }, { autoAlpha: 0 }, 0);
    tl.fromTo(bRef.current, { autoAlpha: 0 }, { autoAlpha: 1 }, 0);
  }, props);
  return (
    <ExampleFrame label="cross-fade" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={aRef} className="absolute h-16 w-24 rounded bg-foreground/80" />
        <div
          ref={bRef}
          className="absolute h-16 w-24 rounded border border-foreground/20 bg-background"
        />
      </div>
    </ExampleFrame>
  );
}

// === Tab indicator / page swap ===

function TabSwitch(props: SceneProps) {
  const ind = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!ind.current) return;
    tl.fromTo(ind.current, { xPercent: 0 }, { xPercent: 200 });
  }, props);
  return (
    <ExampleFrame label="tab switch" innerRef={ref}>
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2">
        <div className="grid grid-cols-3 text-center text-[10px] text-foreground/60">
          <span>Home</span>
          <span>Inbox</span>
          <span>About</span>
        </div>
        <div className="relative mt-1 h-0.5 bg-foreground/15">
          <div
            ref={ind}
            className="absolute left-0 top-0 h-full w-1/3 bg-foreground"
          />
        </div>
      </div>
    </ExampleFrame>
  );
}

function PageSwap(props: SceneProps) {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!aRef.current || !bRef.current) return;
    tl.fromTo(aRef.current, { xPercent: 0 }, { xPercent: -100 }, 0);
    tl.fromTo(bRef.current, { xPercent: 100 }, { xPercent: 0 }, 0);
  }, props);
  return (
    <ExampleFrame label="page swap" innerRef={ref}>
      <div
        ref={aRef}
        className="absolute inset-0 flex items-center justify-center bg-foreground/10 text-xs"
      >
        Page A
      </div>
      <div
        ref={bRef}
        className="absolute inset-0 flex items-center justify-center bg-foreground text-xs text-background"
      >
        Page B
      </div>
    </ExampleFrame>
  );
}

// === Bounce-y / playful ===

function Badge(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { scale: 0 }, { scale: 1 });
  }, props);
  return (
    <ExampleFrame label="badge pop" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-foreground/15" />
          <div
            ref={r}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
          >
            3
          </div>
        </div>
      </div>
    </ExampleFrame>
  );
}

function ButtonPress(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { scale: 1 }, { scale: 0.88 });
  }, props);
  return (
    <ExampleFrame label="button press" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={r}
          className="rounded bg-foreground px-5 py-2 text-xs font-semibold text-background"
        >
          Submit
        </div>
      </div>
    </ExampleFrame>
  );
}

function ErrorShake(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { x: -12 }, { x: 12 });
  }, props);
  return (
    <ExampleFrame label="error shake" innerRef={ref}>
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2">
        <div
          ref={r}
          className="rounded border-2 border-red-500 bg-background px-3 py-2 text-[11px] text-foreground/70"
        >
          Invalid password
        </div>
      </div>
    </ExampleFrame>
  );
}

function BallDrop(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { y: -60 }, { y: 0 });
  }, props);
  return (
    <ExampleFrame label="ball drop" innerRef={ref}>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <div ref={r} className="h-6 w-6 rounded-full bg-foreground" />
      </div>
    </ExampleFrame>
  );
}

// === Loading / linear ===

function Spinner(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { rotation: 0 }, { rotation: 360 });
  }, props);
  return (
    <ExampleFrame label="spinner" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={r}
          className="h-10 w-10 rounded-full border-2 border-foreground/15 border-t-foreground"
        />
      </div>
    </ExampleFrame>
  );
}

function Refresh(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { rotation: 0 }, { rotation: 360 });
  }, props);
  return (
    <ExampleFrame label="refresh icon" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={r}>
          <IconRefresh size={28} stroke={1.5} />
        </div>
      </div>
    </ExampleFrame>
  );
}

function ProgressBar(props: SceneProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!barRef.current || !textRef.current) return;
    const state = { v: 0 };
    tl.fromTo(
      state,
      { v: 0 },
      {
        v: 100,
        onUpdate: () => {
          barRef.current!.style.transform = `scaleX(${state.v / 100})`;
          textRef.current!.textContent = `${state.v.toFixed(0)}%`;
        },
      },
    );
  }, props);
  return (
    <ExampleFrame label="progress bar" innerRef={ref}>
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2">
        <div className="mb-1 flex justify-between text-[10px] text-foreground/60">
          <span>Uploading</span>
          <span ref={textRef} className="tabular-nums">0%</span>
        </div>
        <div className="h-1.5 rounded bg-foreground/15">
          <div
            ref={barRef}
            className="h-full rounded bg-foreground"
            style={{ transformOrigin: "left center", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </ExampleFrame>
  );
}

function Counter(props: SceneProps) {
  const r = useRef<HTMLSpanElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    const state = { n: 0 };
    tl.fromTo(state, { n: 0 }, {
      n: 1240,
      onUpdate: () => {
        r.current!.textContent = state.n.toFixed(0);
      },
    });
  }, props);
  return (
    <ExampleFrame label="stat counter" innerRef={ref}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={r}
          className="font-(family-name:--font-ubuntu-mono) text-2xl font-bold tabular-nums"
        >
          0
        </span>
        <span className="text-[9px] uppercase tracking-wider text-foreground/50">
          followers
        </span>
      </div>
    </ExampleFrame>
  );
}

function Typewriter(props: SceneProps) {
  const r = useRef<HTMLSpanElement>(null);
  const FULL = "Hello, world.";
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    const state = { i: 0 };
    tl.fromTo(state, { i: 0 }, {
      i: FULL.length,
      onUpdate: () => {
        r.current!.textContent = FULL.slice(0, Math.round(state.i));
      },
    });
  }, props);
  return (
    <ExampleFrame label="typewriter" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <span ref={r} className="font-(family-name:--font-ubuntu-mono) text-sm">
          {" "}
        </span>
        <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-foreground" />
      </div>
    </ExampleFrame>
  );
}

// === Ambient / sine ===

function Breathing(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { scale: 1, autoAlpha: 0.6 }, { scale: 1.15, autoAlpha: 1 });
  }, props);
  return (
    <ExampleFrame label="idle breathing" innerRef={ref}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={r} className="h-12 w-12 rounded-full bg-foreground" />
      </div>
    </ExampleFrame>
  );
}

function Parallax(props: SceneProps) {
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!farRef.current || !nearRef.current) return;
    tl.fromTo(farRef.current, { x: 0 }, { x: -40 }, 0);
    tl.fromTo(nearRef.current, { x: 0 }, { x: -100 }, 0);
  }, props);
  return (
    <ExampleFrame label="parallax pan" innerRef={ref}>
      <div ref={farRef} className="absolute top-3 flex gap-6 text-foreground/30">
        <span className="text-2xl">▲</span>
        <span className="text-2xl">▲</span>
        <span className="text-2xl">▲</span>
        <span className="text-2xl">▲</span>
      </div>
      <div ref={nearRef} className="absolute bottom-3 flex gap-4 text-foreground">
        <span className="text-xl">●</span>
        <span className="text-xl">●</span>
        <span className="text-xl">●</span>
        <span className="text-xl">●</span>
      </div>
    </ExampleFrame>
  );
}

function Accordion(props: SceneProps) {
  const r = useRef<HTMLDivElement>(null);
  const ref = useSceneLoop((tl) => {
    if (!r.current) return;
    tl.fromTo(r.current, { height: 0 }, { height: 60 });
  }, props);
  return (
    <ExampleFrame label="accordion" innerRef={ref}>
      <div className="absolute inset-x-3 top-3 flex flex-col">
        <div className="rounded-t border border-foreground/20 bg-background px-2 py-1.5 text-[10px] font-semibold">
          Section A
        </div>
        <div
          ref={r}
          className="overflow-hidden rounded-b border-x border-b border-foreground/20 bg-foreground/[0.04] px-2 text-[9px] text-foreground/60"
        >
          <p className="py-1">Body content body content body.</p>
          <p className="py-1">More lines hidden inside.</p>
        </div>
      </div>
    </ExampleFrame>
  );
}

// === Registry + combo map ===

const REGISTRY = {
  toastAppear: ToastAppear,
  toastDismiss: ToastDismiss,
  toastSwap: ToastSwap,
  modalOpen: ModalOpen,
  modalClose: ModalClose,
  modalMorph: ModalMorph,
  drawerOpen: DrawerOpen,
  drawerClose: DrawerClose,
  fadeIn: FadeIn,
  fadeOut: FadeOut,
  fadeCross: FadeCross,
  tabSwitch: TabSwitch,
  pageSwap: PageSwap,
  badge: Badge,
  button: ButtonPress,
  shake: ErrorShake,
  ballDrop: BallDrop,
  spinner: Spinner,
  refresh: Refresh,
  progress: ProgressBar,
  counter: Counter,
  typewriter: Typewriter,
  breathing: Breathing,
  parallax: Parallax,
  accordion: Accordion,
} as const;

type ExampleId = keyof typeof REGISTRY;

const ENTRANCE_DEFAULT: ExampleId[] = ["toastAppear", "modalOpen", "drawerOpen", "badge"];
const EXIT_DEFAULT: ExampleId[] = ["toastDismiss", "modalClose", "drawerClose", "fadeOut"];
const MORPH_DEFAULT: ExampleId[] = ["fadeCross", "tabSwitch", "accordion", "pageSwap"];
const LINEAR_DEFAULT: ExampleId[] = ["progress", "counter", "spinner", "typewriter"];

type ComboMap = Partial<Record<Variant, ExampleId[]>> & { default?: ExampleId[] };

const COMBO: Record<Family, ComboMap> = {
  power1: { in: EXIT_DEFAULT, out: ENTRANCE_DEFAULT, inOut: MORPH_DEFAULT },
  power2: { in: EXIT_DEFAULT, out: ENTRANCE_DEFAULT, inOut: MORPH_DEFAULT },
  power3: {
    in: ["modalClose", "drawerClose", "toastDismiss", "fadeOut"],
    out: ["modalOpen", "drawerOpen", "toastAppear", "tabSwitch"],
    inOut: ["tabSwitch", "pageSwap", "modalMorph", "fadeCross"],
  },
  power4: {
    in: ["drawerClose", "modalClose", "toastDismiss", "fadeOut"],
    out: ["drawerOpen", "modalOpen", "tabSwitch", "toastAppear"],
    inOut: ["pageSwap", "tabSwitch", "modalMorph", "fadeCross"],
  },
  back: {
    in: ["accordion", "modalClose", "drawerClose", "toastDismiss"],
    out: ["badge", "modalOpen", "button", "toastAppear"],
    inOut: ["modalMorph", "tabSwitch", "accordion", "pageSwap"],
  },
  elastic: {
    in: ["drawerClose", "pageSwap", "modalClose", "toastDismiss"],
    out: ["badge", "modalOpen", "toastAppear", "button"],
    inOut: ["parallax", "accordion", "modalMorph", "pageSwap"],
  },
  bounce: {
    in: ["fadeOut", "modalClose", "accordion", "toastDismiss"],
    out: ["ballDrop", "badge", "toastAppear", "accordion"],
    inOut: ["parallax", "pageSwap", "accordion", "modalMorph"],
  },
  circ: {
    in: ["drawerClose", "modalClose", "toastDismiss", "fadeOut"],
    out: ["parallax", "drawerOpen", "modalOpen", "toastAppear"],
    inOut: ["parallax", "pageSwap", "tabSwitch", "fadeCross"],
  },
  expo: {
    in: ["modalClose", "drawerClose", "toastDismiss", "fadeOut"],
    out: ["modalOpen", "drawerOpen", "tabSwitch", "toastAppear"],
    inOut: ["pageSwap", "tabSwitch", "modalMorph", "fadeCross"],
  },
  sine: {
    in: ["fadeOut", "drawerClose", "modalClose", "toastDismiss"],
    out: ["fadeIn", "drawerOpen", "modalOpen", "toastAppear"],
    inOut: ["breathing", "parallax", "fadeCross", "accordion"],
  },
  steps: { default: ["typewriter", "progress", "counter", "tabSwitch"] },
  none: { default: LINEAR_DEFAULT },
  custom: {
    in: EXIT_DEFAULT,
    out: ENTRANCE_DEFAULT,
    inOut: MORPH_DEFAULT,
    default: ENTRANCE_DEFAULT,
  },
};

function pickExamples(family: Family, variant: Variant): ExampleId[] {
  const m = COMBO[family];
  return m[variant] ?? m.default ?? ENTRANCE_DEFAULT;
}

interface Props extends SceneProps {
  family: Family;
  variant: Variant;
}

export function EasingExamples({ family, variant, ...props }: Props) {
  const ids = pickExamples(family, variant);
  const label =
    family === "none" || family === "steps" || family === "custom"
      ? family
      : `${family}.${variant}`;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-wider text-foreground/50">
        Examples — typical uses for{" "}
        <span className="text-foreground/80">{label}</span>
      </span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ids.map((id) => {
          const Cmp = REGISTRY[id];
          return <Cmp key={id} {...props} />;
        })}
      </div>
    </div>
  );
}
