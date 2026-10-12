import Link from "next/link";
import { Briefcase, Fuel, Settings2, Users, Zap } from "lucide-react";
import type { Vehicle } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABEL, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { eur, parseImages } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VehicleVisual } from "./vehicle-visual";

export type CardVehicle = Pick<Vehicle, "id" | "slug" | "name" | "category" | "seats" | "transmission" | "fuel" | "luggage" | "pricePerDay" | "images" | "featured" | "color">;

export function VehicleSpecs({ v, className }: { v: Pick<Vehicle, "seats" | "transmission" | "fuel" | "luggage">; className?: string }) {
  const FuelIcon = v.fuel === "ELECTRIC" ? Zap : Fuel;
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground", className)}>
      <li className="flex items-center gap-2"><Users className="size-4" /> {v.seats} places</li>
      <li className="flex items-center gap-2"><Settings2 className="size-4" /> {TRANSMISSION_LABEL[v.transmission]}</li>
      <li className="flex items-center gap-2"><FuelIcon className="size-4" /> {FUEL_LABEL[v.fuel]}</li>
      <li className="flex items-center gap-2"><Briefcase className="size-4" /> {v.luggage} bagage{v.luggage > 1 ? "s" : ""}</li>
    </ul>
  );
}

export function VehicleCard({
  v,
  query,
  days,
  total,
  unavailable,
  priority,
}: {
  v: CardVehicle;
  query?: string;
  days?: number;
  total?: number;
  unavailable?: boolean;
  priority?: boolean;
}) {
  const img = parseImages(v.images)[0];
  return (
    <Link
      href={`/vehicules/${v.slug}${query ? `?${query}` : ""}`}
      aria-disabled={unavailable}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lift",
        unavailable && "opacity-60",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">{CATEGORY_LABEL[v.category]}</Badge>
          {v.featured && !unavailable && <Badge>Coup de cœur</Badge>}
          {unavailable && <Badge variant="danger">Indisponible</Badge>}
        </div>
        <VehicleVisual
          src={img}
          alt={v.name}
          color={v.color}
          category={v.category}
          priority={priority}
          sizes="(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw"
          className="absolute inset-0"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{v.name}</h3>
            <p className="text-xs text-muted-foreground">ou modèle similaire</p>
          </div>
        </div>
        <VehicleSpecs v={v} className="mt-5" />
        <div className="mt-6 flex items-end justify-between border-t pt-5">
          <div>
            <p className="font-display text-2xl font-bold">
              {eur(v.pricePerDay)}<span className="text-sm font-normal text-muted-foreground"> /jour</span>
            </p>
            {days && total !== undefined ? (
              <p className="text-xs text-muted-foreground">{eur(total)} pour {days} jour{days > 1 ? "s" : ""}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Kilométrage illimité</p>
            )}
          </div>
          <span className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors group-hover:bg-primary group-hover:text-white">
            {unavailable ? "Voir" : "Choisir"}
          </span>
        </div>
      </div>
    </Link>
  );
}
