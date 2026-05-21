"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
      className="cursor-pointer rounded border border-foreground/20 p-2 hover:bg-foreground/10 transition-colors"
    >
      {mounted ? (
        isDark ? (
          <IconSun size={18} stroke={1.5} />
        ) : (
          <IconMoon size={18} stroke={1.5} />
        )
      ) : (
        <span className="block w-[18px] h-[18px]" />
      )}
    </button>
  );
}
