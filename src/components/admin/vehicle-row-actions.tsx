"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { deleteVehicle, toggleVehicle } from "@/app/actions/admin";

export function VehicleRowActions({ id, active, name }: { id: string; active: boolean; name: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center justify-end gap-2">
      <Switch checked={active} disabled={pending} aria-label="Actif" onCheckedChange={(c) => start(() => toggleVehicle(id, c))} />
      <Button asChild variant="ghost" size="icon" className="size-8"><Link href={`/admin/vehicules/${id}`} aria-label="Modifier"><Pencil /></Link></Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-destructive"
        aria-label="Supprimer"
        disabled={pending}
        onClick={() => {
          if (!confirm(`Supprimer définitivement ${name} ?`)) return;
          start(async () => {
            const res = await deleteVehicle(id);
            if (res.ok) toast.success("Véhicule supprimé");
            else toast.error(res.error);
          });
        }}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
