"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Basculer le mode clair / sombre"
      className={cn("relative inline-flex size-10 items-center justify-center rounded-md hover:bg-muted", className)}
    >
      <Sun className="size-[18px] dark:hidden" strokeWidth={1.75} />
      <Moon className="hidden size-[18px] dark:block" strokeWidth={1.75} />
    </button>
  );
}
