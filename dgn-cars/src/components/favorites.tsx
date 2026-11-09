"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "dgn-favoris";
const Ctx = createContext<{ ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean }>({ ids: [], toggle: () => {}, has: () => false });

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {}
  }, []);
  const toggle = useCallback((id: string) => {
    setIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  return <Ctx.Provider value={{ ids, toggle, has: (id) => ids.includes(id) }}>{children}</Ctx.Provider>;
}

export const useFavorites = () => useContext(Ctx);

export function FavoriteButton({ id, className }: { id: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const on = has(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={on}
      aria-label={on ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn("inline-flex size-9 items-center justify-center rounded-md bg-background/95 transition hover:bg-background", className)}
    >
      <Heart className={cn("size-[18px]", on && "fill-signal text-foreground")} strokeWidth={1.75} />
    </button>
  );
}
