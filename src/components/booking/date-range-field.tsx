"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fmtDate } from "@/lib/format";
import { combine, toDateParam } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function DateRangeField({
  from,
  to,
  onChange,
  invalid,
  className,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  invalid?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected: DateRange = { from: from ? combine(from, "00:00") : undefined, to: to ? combine(to, "00:00") : undefined };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-invalid={invalid}
          className={cn(
            "flex h-14 w-full items-center gap-3 rounded-xl border border-input bg-background px-4 text-left text-sm transition outline-none hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 aria-invalid:border-destructive",
            className,
          )}
        >
          <CalendarDays className="size-5 shrink-0 text-primary" />
          <span className="grid flex-1 grid-cols-2 gap-2">
            <span>
              <span className="block text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">Départ</span>
              <span className="font-medium capitalize">{from ? fmtDate(combine(from, "00:00"), "EEE d MMM") : "—"}</span>
            </span>
            <span>
              <span className="block text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">Retour</span>
              <span className="font-medium capitalize">{to ? fmtDate(combine(to, "00:00"), "EEE d MMM") : "—"}</span>
            </span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <Calendar
          mode="range"
          numberOfMonths={typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1}
          defaultMonth={selected.from}
          selected={selected}
          disabled={{ before: today }}
          onSelect={(range, day) => {
            // Un clic après une plage complète redémarre la sélection.
            if (selected.from && selected.to) {
              onChange(toDateParam(day), "");
              return;
            }
            const f = range?.from ? toDateParam(range.from) : "";
            const t = range?.to && range.to.getTime() !== range.from?.getTime() ? toDateParam(range.to) : "";
            onChange(f, t);
            if (f && t) setOpen(false);
          }}
        />
        <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">Tarif dégressif dès 3 jours · -12 % dès 7 jours · -20 % dès 28 jours</p>
      </PopoverContent>
    </Popover>
  );
}
