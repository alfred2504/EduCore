"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Keep document root class in sync as a fallback for immediate visual change
  useEffect(() => {
    const current = resolvedTheme ?? theme;
    if (typeof window !== "undefined") {
      if (current === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, resolvedTheme]);

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      }}
      className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle color theme"
    >
      {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
    </button>
  );
}
