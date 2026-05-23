"use client";

import { useState } from "react";
import { DemoGrid } from "../_components/demo-grid";
import { ScrambleButton } from "./_components/scramble-button";
import { AsciiPropagateButton } from "./_components/ascii-propagate-button";
import { SplitRiseButton } from "./_components/split-rise-button";
import { SemicircleRiseButton } from "./_components/semicircle-rise-button";

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
    node: <SplitRiseButton label="HOVER ME" />,
  },
  {
    id: "semicircle-rise",
    label: "semicircle rise on hover",
    node: <SemicircleRiseButton label="HOVER ME" />,
  },
];

const iconDemos: typeof textDemos = [];

const TABS = [
  { id: "text", label: "Text", demos: textDemos },
  { id: "icons", label: "Icons", demos: iconDemos },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ButtonsPage() {
  const [tab, setTab] = useState<TabId>("text");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <DemoGrid
      title="Buttons"
      demos={active.demos}
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
