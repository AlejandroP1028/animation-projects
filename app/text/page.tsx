"use client";

import { useState } from "react";
import { DemoGrid } from "../_components/demo-grid";
import { BarReveal } from "./_components/bar-reveal";
import { AsciiReveal } from "./_components/ascii-reveal";
import { useDebounced } from "../_components/use-debounced";

function Lever({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-foreground cursor-pointer"
      />
      <span className="tabular-nums text-foreground w-6 text-right">{value}</span>
    </label>
  );
}

export default function TextPage() {
  const [fontSize, setFontSize] = useState(14);
  const [lineCount, setLineCount] = useState(4);
  const [charCount, setCharCount] = useState(22);
  const [customText, setCustomText] = useState("");

  const dFontSize = useDebounced(fontSize);
  const dLineCount = useDebounced(lineCount);
  const dCharCount = useDebounced(charCount);
  const dCustomText = useDebounced(customText, 400);

  const demos = [
    {
      id: "bar-reveal",
      label: "bar reveal",
      node: (
        <BarReveal
          id="bar-reveal"
          fontSize={dFontSize}
          lineCount={dLineCount}
          charCount={dCharCount}
          customText={dCustomText}
        />
      ),
    },
    {
      id: "ascii-reveal",
      label: "ascii reveal",
      node: (
        <AsciiReveal
          id="ascii-reveal"
          fontSize={dFontSize}
          lineCount={dLineCount}
          charCount={dCharCount}
          customText={dCustomText}
        />
      ),
    },
  ];

  const customActive = customText.trim().length > 0;

  return (
    <DemoGrid
      title="Text"
      demos={demos}
      tabs={
        <div className="flex flex-wrap items-center gap-4">
          <Lever label="size" value={fontSize} min={8} max={32} onChange={setFontSize} />
          <Lever
            label="lines"
            value={lineCount}
            min={1}
            max={8}
            onChange={setLineCount}
          />
          <Lever
            label="chars"
            value={charCount}
            min={6}
            max={60}
            onChange={setCharCount}
          />
          <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60">
            <span>text</span>
            <textarea
              rows={1}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="custom (one line per newline)"
              className={`w-56 rounded border border-foreground/20 bg-transparent px-2 py-1 text-xs normal-case tracking-normal resize-y ${
                customActive ? "text-foreground" : "text-foreground/60"
              }`}
            />
          </label>
        </div>
      }
    />
  );
}
