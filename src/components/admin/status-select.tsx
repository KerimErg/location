"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ReservationStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABEL } from "@/lib/constants";
import { updateReservationStatus } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export function StatusSelect({ id, status }: { id: string; status: ReservationStatus }) {
  const [pending, start] = useTransition();
  return (
    <Select
      value={status}
      onValueChange={(v) =>
        start(async () => {
          await updateReservationStatus(id, v as ReservationStatus);
          toast.success(`Statut : ${STATUS_LABEL[v as ReservationStatus]}`);
        })
      }
    >
      <SelectTrigger className={cn("h-9 w-36 rounded-full text-xs", pending && "opacity-50")} aria-label="Statut">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABEL).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
