"use client";

import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({ label, error, htmlFor, className, children, hint }: { label: string; error?: string; htmlFor: string; className?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="font-mono text-[0.7rem] font-medium tracking-wider text-muted-foreground uppercase">{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export const selectCls =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 aria-invalid:border-destructive";

/** Champ piège anti-spam, invisible pour les humains. */
export function Honeypot({ register }: { register: object }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Site web<input tabIndex={-1} autoComplete="off" {...register} /></label>
    </div>
  );
}

export function Success({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-signal bg-card p-6" role="status">
      <p className="flex items-center gap-2 font-display text-2xl font-bold uppercase"><CheckCircle2 className="size-6" strokeWidth={1.75} /> {title}</p>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </div>
  );
}
