import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Vehicle } from "@prisma/client";
import { FavoriteButton } from "@/components/favorites";
import { FUEL, GEARBOX, kwToHp } from "@/lib/labels";
import { eur, km, regDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VehiclePhoto } from "./vehicle-photo";

export type CardVehicle = Pick<
  Vehicle,
  "id" | "slug" | "reference" | "make" | "model" | "version" | "firstRegistration" | "mileage" | "price" | "previousPrice" | "vatDeductible" | "fuel" | "gearbox" | "powerKw" | "images" | "status" | "warrantyMonths" | "carPass"
>;

export function StatusTag({ status, className }: { status: Vehicle["status"]; className?: string }) {
  if (status === "DISPONIBLE") return null;
  return (
    <span className={cn("rounded-sm px-2 py-1 font-mono text-[0.68rem] font-medium tracking-wider uppercase", status === "RESERVE" ? "bg-signal text-signal-foreground" : "bg-ink text-white", className)}>
      {status === "RESERVE" ? "Réservé" : "Vendu"}
    </span>
  );
}

export function VehicleCard({ v, priority }: { v: CardVehicle; priority?: boolean }) {
  const sold = v.status === "VENDU";
  return (
    <Link href={`/stock/${v.slug}`} className="group flex flex-col border bg-card transition-colors hover:border-foreground/40">
      <div className="relative">
        <VehiclePhoto
          src={v.images[0]}
          alt={`${v.make} ${v.model} ${v.version}`}
          priority={priority}
          sizes="(min-width:1280px) 420px, (min-width:768px) 50vw, 100vw"
          className="aspect-[4/3]"
          imgClassName={cn("transition-transform duration-500 group-hover:scale-[1.03]", sold && "grayscale")}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-sm bg-background/95 px-2 py-1 font-mono text-[0.68rem] tracking-wider">{v.reference}</span>
          <StatusTag status={v.status} />
        </div>
        <FavoriteButton id={v.id} className="absolute top-3 right-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{v.make}</p>
        <h3 className="mt-1 text-[1.65rem]">{v.model}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{v.version}</p>
        <dl className="mt-4 grid grid-cols-3 border-y font-mono text-xs">
          <div className="py-2.5 pr-2"><dt className="sr-only">1re immatriculation</dt><dd>{regDate(v.firstRegistration)}</dd></div>
          <div className="border-x px-2 py-2.5"><dt className="sr-only">Kilométrage</dt><dd>{km(v.mileage)}</dd></div>
          <div className="py-2.5 pl-2"><dt className="sr-only">Puissance</dt><dd>{kwToHp(v.powerKw)} ch</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">{FUEL[v.fuel]} · {GEARBOX[v.gearbox]}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {v.previousPrice && v.previousPrice > v.price && <p className="font-mono text-xs text-muted-foreground line-through">{eur(v.previousPrice)}</p>}
            <p className="font-display text-[2rem] leading-none font-bold">{eur(v.price)}</p>
            <p className="mt-1 font-mono text-[0.68rem] tracking-wide text-muted-foreground uppercase">TVAC{v.vatDeductible ? " · TVA déductible" : ""}</p>
          </div>
          {v.carPass && v.warrantyMonths > 0 && (
            <p className="flex items-center gap-1.5 text-right text-xs text-muted-foreground"><ShieldCheck className="size-4 text-foreground" strokeWidth={1.75} /> Garantie {v.warrantyMonths} mois</p>
          )}
        </div>
      </div>
    </Link>
  );
}
