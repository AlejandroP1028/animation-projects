"use client";

import { useState } from "react";
import { DemoGrid } from "../_components/demo-grid";
import { ScrambleButton } from "./_components/scramble-button";
import { AsciiPropagateButton } from "./_components/ascii-propagate-button";
import { SplitRiseButton } from "./_components/split-rise-button";
import { SemicircleRiseButton } from "./_components/semicircle-rise-button";
import { WaterRiseButton } from "./_components/water-rise-button";
import { SwapRiseButton } from "./_components/swap-rise-button";
import { SwapFallButton } from "./_components/swap-fall-button";
import { ArrowSlideButton } from "./_components/arrow-slide-button";
import { ArrowFillSlideButton } from "./_components/arrow-fill-slide-button";
import { DropInButton } from "./_components/drop-in-button";
import { EasePicker } from "./_components/ease-picker";

const DEFAULTS: Record<string, string> = {
  "split-rise": "power3.inOut",
  "semicircle-rise": "power3.out",
  "water-rise": "power2.out",
  "swap-rise": "power3.out",
  "swap-fall": "power3.out",
  "drop-in": "power3.inOut",
  "arrow-slide": "power3.inOut",
  "arrow-fill-slide": "power3.inOut",
};

const TABS = [
  { id: "text", label: "Text" },
  { id: "icons", label: "Icons" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ButtonsPage() {
  const [tab, setTab] = useState<TabId>("text");
  const [eases, setEases] = useState<Record<string, string>>(DEFAULTS);

  const setEase = (id: string) => (ease: string) =>
    setEases((s) => ({ ...s, [id]: ease }));

  const pickerFor = (id: string) => (
    <EasePicker
      key={`${id}-${eases[id]}`}
      value={eases[id]}
      defaultValue={DEFAULTS[id]}
      onChange={setEase(id)}
    />
  );

  const textDemos = [
    {
      id: "scramble",
      label: "scramble on hover",
      node: <ScrambleButton label="HOVER ME" />,
    },
    {
      id: "ascii-propagate",
      label: "ascii propagate",
      node: <AsciiPropagateButton label="HOVER ME" />,
    },
    {
      id: "split-rise",
      label: "split rise on hover",
      node: (
        <SplitRiseButton
          key={eases["split-rise"]}
          label="HOVER ME"
          ease={eases["split-rise"]}
        />
      ),
      controls: pickerFor("split-rise"),
    },
    {
      id: "semicircle-rise",
      label: "semicircle rise on hover",
      node: (
        <SemicircleRiseButton
          key={eases["semicircle-rise"]}
          label="HOVER ME"
          ease={eases["semicircle-rise"]}
        />
      ),
      controls: pickerFor("semicircle-rise"),
    },
    {
      id: "water-rise",
      label: "water rise on hover",
      node: (
        <WaterRiseButton
          key={eases["water-rise"]}
          label="HOVER ME"
          ease={eases["water-rise"]}
        />
      ),
      controls: pickerFor("water-rise"),
    },
    {
      id: "swap-rise",
      label: "swap rise on hover",
      node: (
        <SwapRiseButton
          key={eases["swap-rise"]}
          label="HOVER ME"
          ease={eases["swap-rise"]}
        />
      ),
      controls: pickerFor("swap-rise"),
    },
    {
      id: "swap-fall",
      label: "swap fall on hover",
      node: (
        <SwapFallButton
          key={eases["swap-fall"]}
          label="HOVER ME"
          ease={eases["swap-fall"]}
        />
      ),
      controls: pickerFor("swap-fall"),
    },
    {
      id: "drop-in",
      label: "drop in on hover",
      node: (
        <DropInButton
          key={eases["drop-in"]}
          label="HOVER ME"
          ease={eases["drop-in"]}
        />
      ),
      controls: pickerFor("drop-in"),
    },
  ];

  const iconDemos = [
    {
      id: "arrow-slide",
      label: "arrow slide on hover",
      node: (
        <ArrowSlideButton
          key={eases["arrow-slide"]}
          ease={eases["arrow-slide"]}
        />
      ),
      controls: pickerFor("arrow-slide"),
    },
    {
      id: "arrow-fill-slide",
      label: "arrow + bg slide on hover",
      node: (
        <ArrowFillSlideButton
          key={eases["arrow-fill-slide"]}
          ease={eases["arrow-fill-slide"]}
        />
      ),
      controls: pickerFor("arrow-fill-slide"),
    },
  ];

  const active =
    tab === "text" ? textDemos : iconDemos;

  return (
    <DemoGrid
      title="Buttons"
      demos={active}
      tabs={
        <div className="flex gap-1 rounded border border-foreground/15 p-1 text-xs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`cursor-pointer rounded px-3 py-1 uppercase tracking-wider transition-colors ${
                t.id === tab
                  ? "bg-foreground text-background"
                  : "hover:bg-foreground/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
    />
  );
}
