import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function Categories() {
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow="Notre flotte" title="Le bon véhicule pour chaque trajet" description="Plus de 3 500 véhicules récents, entretenus avec exigence et livrés propres, chargés et prêts à partir." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.value} delay={i * 0.05}>
            <Link
              href={`/vehicules?categorie=${c.slug}`}
              className={cn(
                "group relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift",
                c.value === "PREMIUM" ? "bg-ink text-white" : "bg-surface",
              )}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{c.label}</h3>
                  <p className={cn("mt-1 text-sm", c.value === "PREMIUM" ? "text-white/60" : "text-muted-foreground")}>{c.tagline}</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-soft transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-white">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <Image
                src={`/categories/${c.slug}.png`}
                alt={`Location ${c.label}`}
                width={900}
                height={600}
                className="absolute -right-6 -bottom-8 w-[88%] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-x-2"
              />
              <p className="relative z-10 text-sm">
                <span className={c.value === "PREMIUM" ? "text-white/60" : "text-muted-foreground"}>dès </span>
                <span className="font-display text-xl font-bold">{c.from} €</span>
                <span className={c.value === "PREMIUM" ? "text-white/60" : "text-muted-foreground"}> /jour</span>
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
