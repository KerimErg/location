"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cancelReservation } from "@/app/actions/reservation";

export function CancelButton({ id, reference }: { id: string; reference: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Annuler</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annuler la réservation {reference} ?</DialogTitle>
          <DialogDescription>L&apos;annulation est gratuite. Le remboursement intégral est effectué sous 5 jours ouvrés.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Conserver</Button></DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await cancelReservation(id);
                if (res.ok) {
                  toast.success("Réservation annulée");
                  setOpen(false);
                } else toast.error(res.error);
              })
            }
          >
            {pending ? "Annulation…" : "Confirmer l'annulation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
