"use client";

import { useEffect, useRef, useState } from "react";
import { IconRotate } from "@tabler/icons-react";
import {
  FAMILIES,
  VARIANTLESS,
  VARIANTS,
  type Family,
  type Variant,
} from "../../easing/_components/easings";

export function parseEase(ease: string): { family: Family; variant: Variant } {
  if (ease === "none")
    return { family: "none", variant: "inOut" };
  const [f, v] = ease.split(".") as [Family, Variant];
  if (!FAMILIES.includes(f)) return { family: "power3", variant: "inOut" };
  return {
    family: f,
    variant: VARIANTS.includes(v) ? v : "inOut",
  };
}

export function formatEase(family: Family, variant: Variant): string {
  if (VARIANTLESS.includes(family)) return family;
  return `${family}.${variant}`;
}

const PICKABLE_FAMILIES = FAMILIES.filter((f) => f !== "custom" && f !== "steps");

export function EasePicker({
  value,
  onChange,
  defaultValue,
}: {
  value: string;
  onChange: (ease: string) => void;
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { family, variant } = parseEase(value);
  const showVariant = !VARIANTLESS.includes(family);
  const modified = defaultValue !== undefined && value !== defaultValue;
  const defaultParsed = defaultValue ? parseEase(defaultValue) : null;
  const defaultFamily = defaultParsed?.family;
  const defaultVariant = defaultParsed?.variant;
  const defaultHasVariant =
    defaultParsed && !VARIANTLESS.includes(defaultParsed.family);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {modified && (
        <button
          type="button"
          onClick={() => defaultValue && onChange(defaultValue)}
          title={`reset to ${defaultValue}`}
          aria-label={`reset to ${defaultValue}`}
          className="cursor-pointer text-foreground/40 hover:text-foreground transition-colors"
        >
          <IconRotate size={10} />
        </button>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={defaultValue ? `default: ${defaultValue}` : undefined}
        className={`cursor-pointer rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
          modified
            ? "border-foreground/60 text-foreground"
            : "border-foreground/20 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
        }`}
      >
        {value}
        {modified && <span className="ml-1 text-foreground/60">*</span>}
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-1 z-10 flex gap-2 rounded border border-foreground/20 bg-background p-2 shadow">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-foreground/50">
              family
            </span>
            <select
              value={family}
              onChange={(e) =>
                onChange(formatEase(e.target.value as Family, variant))
              }
              className="rounded border border-foreground/20 bg-background px-1 py-0.5 text-[10px] cursor-pointer"
            >
              {PICKABLE_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                  {f === defaultFamily ? " ◆" : ""}
                </option>
              ))}
            </select>
          </div>
          {showVariant && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground/50">
                variant
              </span>
              <select
                value={variant}
                onChange={(e) =>
                  onChange(formatEase(family, e.target.value as Variant))
                }
                className="rounded border border-foreground/20 bg-background px-1 py-0.5 text-[10px] cursor-pointer"
              >
                {VARIANTS.map((v) => {
                  const isDefault = defaultHasVariant && v === defaultVariant;
                  return (
                    <option key={v} value={v}>
                      {v}
                      {isDefault ? " ◆" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
