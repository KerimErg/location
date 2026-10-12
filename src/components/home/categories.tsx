import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, CarFront, Crown, Mountain, Truck, Zap } from "lucide-react";
import type { Category } from "@prisma/client";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const ICONS: Record<Category, typeof Car> = { CITADINE: Car, BERLINE: CarFront, SUV: Mountain, UTILITAIRE: Truck, PREMIUM: Crown, ELECTRIQUE: Zap };

export function Categories({ counts }: { counts: Partial<Record<Category, number>> }) {
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow="Notre flotte" title="Le bon véhicule pour chaque trajet" description="Des véhicules récents, entretenus avec exigence et livrés propres, chargés et prêts à partir." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const Icon = ICONS[c.value];
          const dark = c.value === "PREMIUM";
          return (
            <Reveal key={c.value} delay={i * 0.05}>
              <Link
                href={`/vehicules?categorie=${c.slug}`}
                className={cn(
                  "group relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift",
                  "border-transparent bg-ink text-white",
                )}
              >
                <Image src={c.image} alt={`Location ${c.label}`} fill unoptimized sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                <div className="relative flex items-start justify-between">
                  <span className={cn("flex size-12 items-center justify-center rounded-2xl", dark ? "bg-primary text-white" : "bg-white/15 text-white backdrop-blur")}>
                    <Icon className="size-6" />
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-soft transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <div className="relative">
                  <h3 className="text-2xl font-bold">{c.label}</h3>
                  <p className={cn("mt-1 text-sm", "text-white/70")}>{c.tagline}</p>
                  <p className="mt-4 text-sm">
                    <span className={"text-white/70"}>dès </span>
                    <span className="font-display text-xl font-bold">{c.from} €</span>
                    <span className={"text-white/70"}> /jour · {counts[c.value] ?? 0} modèles</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
