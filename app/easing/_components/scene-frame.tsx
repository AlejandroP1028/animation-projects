import type { ReactNode, Ref } from "react";

export function SceneFrame({
  innerRef,
  children,
}: {
  innerRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      {children}
    </div>
  );
}
