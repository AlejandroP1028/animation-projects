"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IconPlayerPlayFilled, IconRefresh } from "@tabler/icons-react";

type Demo = {
  id: string;
  label: string;
  node: ReactNode;
};

type Handlers = { play?: () => void; clear?: () => void };

const DemoContext = createContext<{
  register: (id: string, handlers: Handlers) => () => void;
} | null>(null);

export function useDemoControls(id: string, handlers: Handlers) {
  const ctx = useContext(DemoContext);
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    if (!ctx) return;
    return ctx.register(id, {
      play: () => ref.current.play?.(),
      clear: () => ref.current.clear?.(),
    });
  }, [id, ctx]);
}

const CELLS = 16;

export function DemoGrid({
  title,
  demos,
  tabs,
}: {
  title: string;
  demos: Demo[];
  tabs?: ReactNode;
}) {
  const registryRef = useRef<Map<string, Handlers>>(new Map());
  const [active, setActive] = useState<Map<string, { play: boolean; clear: boolean }>>(
    new Map(),
  );

  const register = useCallback((id: string, handlers: Handlers) => {
    registryRef.current.set(id, handlers);
    setActive((prev) => {
      const next = new Map(prev);
      next.set(id, { play: !!handlers.play, clear: !!handlers.clear });
      return next;
    });
    return () => {
      registryRef.current.delete(id);
      setActive((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const play = (id: string) => registryRef.current.get(id)?.play?.();
  const clear = (id: string) => registryRef.current.get(id)?.clear?.();

  const ctxValue = useMemo(() => ({ register }), [register]);

  return (
    <DemoContext.Provider value={ctxValue}>
      <main className="flex flex-1 flex-col font-(family-name:--font-ubuntu-mono)">
        <header className="border-b border-foreground/10 px-6 py-4 pl-16 md:pl-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {tabs}
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
              const flags = demo ? active.get(demo.id) : undefined;
              return (
                <div
                  key={i}
                  className={`relative flex min-h-32 flex-col items-center justify-center gap-2 border-r border-b border-foreground/10 p-4 ${mobileBg} ${desktopBg}`}
                >
                  {demo ? (
                    <>
                      {demo.node}
                      <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-foreground/40">
                        {flags?.play && (
                          <button
                            type="button"
                            onClick={() => play(demo.id)}
                            aria-label={`Play ${demo.label}`}
                            className="cursor-pointer text-foreground/40 hover:text-foreground transition-colors"
                          >
                            <IconPlayerPlayFilled size={10} />
                          </button>
                        )}
                        {flags?.clear && (
                          <button
                            type="button"
                            onClick={() => clear(demo.id)}
                            aria-label={`Clear ${demo.label}`}
                            className="cursor-pointer text-foreground/40 hover:text-foreground transition-colors"
                          >
                            <IconRefresh size={10} />
                          </button>
                        )}
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
    </DemoContext.Provider>
  );
}
