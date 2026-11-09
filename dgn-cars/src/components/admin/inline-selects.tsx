"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { LeadStatus, VehicleStatus } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { LEAD_STATUS, STATUS } from "@/lib/labels";
import { deleteVehicle, setLeadStatus, setVehicleStatus } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

const cls = "h-9 rounded-md border border-input bg-background px-2 text-xs";

export function VehicleStatusSelect({ id, status }: { id: string; status: VehicleStatus }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Statut" className={cn(cls, pending && "opacity-50")} defaultValue={status} onChange={(e) => start(async () => { await setVehicleStatus(id, e.target.value as VehicleStatus); toast.success("Statut mis à jour"); })}>
      {Object.entries(STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Statut" className={cn(cls, pending && "opacity-50")} defaultValue={status} onChange={(e) => start(async () => { await setLeadStatus(id, e.target.value as LeadStatus); toast.success("Demande mise à jour"); })}>
      {Object.entries(LEAD_STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}

export function DeleteVehicleButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Supprimer"
      className="inline-flex size-9 items-center justify-center rounded-md text-destructive hover:bg-muted"
      onClick={() => {
        if (!confirm(`Supprimer définitivement « ${name} » ? Préférez le statut « Vendu » pour garder l'historique.`)) return;
        start(async () => { await deleteVehicle(id); toast.success("Véhicule supprimé"); });
      }}
    >
      <Trash2 className="size-4" />
    </button>
  );
}
