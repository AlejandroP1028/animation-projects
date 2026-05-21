"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { IconMenu2, IconX } from "@tabler/icons-react";

const sections = [
  {
    title: "Animations",
    items: [
      { href: "/buttons", label: "Buttons" },
      { href: "/page-transitions", label: "Page Transitions" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="md:hidden fixed top-3 left-3 z-50 cursor-pointer rounded border border-foreground/20 bg-background p-2"
      >
        {open ? <IconX size={18} stroke={1.5} /> : <IconMenu2 size={18} stroke={1.5} />}
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/40"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40 h-screen w-60 shrink-0
          border-r border-foreground/10 bg-background p-6
          font-(family-name:--font-ubuntu-mono)
          transition-transform duration-200
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Link href="/" className="block text-lg font-bold mb-8 mt-10 md:mt-0 hover:opacity-70">
          ./animations
        </Link>
        <nav className="flex flex-col gap-6">
          {sections.map(({ title, items }) => (
            <div key={title} className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-foreground/40">
                {title}
              </span>
              <ul className="flex flex-col gap-1">
                {items.map(({ href, label }) => {
                  const active =
                    pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`block rounded px-2 py-1 text-sm transition-colors ${
                          active
                            ? "bg-foreground text-background"
                            : "hover:bg-foreground/10"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
