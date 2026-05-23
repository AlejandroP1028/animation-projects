import type { ReactNode, Ref } from "react";

export function SceneFrame({
  label,
  innerRef,
  children,
}: {
  label: string;
  innerRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col border border-foreground/10 bg-foreground/[0.02]">
      <div className="border-b border-foreground/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-foreground/50">
        {label}
      </div>
      <div
        ref={innerRef}
        className="relative flex h-44 items-center justify-center overflow-hidden p-4"
      >
        {children}
      </div>
    </div>
  );
}
