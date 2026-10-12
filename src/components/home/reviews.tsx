import { Quote, Star } from "lucide-react";
import type { Review } from "@prisma/client";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section id="avis" className="container-page py-20 md:py-28">
      <SectionHeading eyebrow="Avis clients" title="Ils ont pris la route avec nous" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 0.08} className="flex flex-col rounded-3xl border bg-card p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className={k < r.rating ? "size-4 fill-current" : "size-4 text-muted-foreground/30"} />
                ))}
              </div>
              <Quote className="size-6 text-muted-foreground/20" />
            </div>
            <p className="mt-5 flex-1 leading-relaxed">« {r.comment} »</p>
            <div className="mt-6 flex items-center gap-3 border-t pt-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-foreground">{r.author[0]}</span>
              <div className="text-sm">
                <p className="font-semibold">{r.author}</p>
                <p className="text-muted-foreground">{r.city}{r.vehicle ? ` · ${r.vehicle}` : ""}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
