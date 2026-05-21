import type { ReactNode } from "react";

type Demo = {
  id: string;
  label: string;
  node: ReactNode;
};

const CELLS = 16;

export function DemoGrid({ title, demos }: { title: string; demos: Demo[] }) {
  return (
    <main className="flex flex-1 flex-col font-(family-name:--font-ubuntu-mono)">
      <header className="border-b border-foreground/10 px-6 py-4 pl-16 md:pl-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <div className="relative flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2 grid-rows-8 md:grid-cols-4 md:grid-rows-4 -mr-px -mb-px">
          {Array.from({ length: CELLS }).map((_, i) => {
            const demo = demos[i];
            const mobileDark = (Math.floor(i / 2) + (i % 2)) % 2 === 1;
            const desktopDark = (Math.floor(i / 4) + (i % 4)) % 2 === 1;
            const mobileBg = mobileDark ? "bg-foreground/[0.04]" : "";
            const desktopBg = desktopDark
              ? "md:bg-foreground/[0.04]"
              : "md:bg-transparent";
            return (
              <div
                key={i}
                className={`relative flex min-h-32 flex-col items-center justify-center gap-2 border-r border-b border-foreground/10 p-4 ${mobileBg} ${desktopBg}`}
              >
                {demo ? (
                  <>
                    {demo.node}
                    <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider text-foreground/40">
                      {demo.label}
                    </span>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
