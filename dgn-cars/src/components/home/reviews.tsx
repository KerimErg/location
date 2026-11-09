import { ArrowUpRight, Star } from "lucide-react";
import { RATING, REVIEWS } from "@/config/reviews";
import { SITE } from "@/config/site";
import { Stagger, StaggerItem } from "@/components/motion";

export function Reviews() {
  return (
    <section id="avis" className="scroll-mt-28 bg-ink py-20 text-[#eceae5] md:py-24">
      <div className="container-page">
        <div className="grid gap-8 border-t border-white/30 pt-5 md:grid-cols-[220px_1fr_auto] md:items-end">
          <p className="font-mono text-[0.72rem] font-medium tracking-[0.18em] text-[#ff6b6b] uppercase">Avis clients</p>
          <div>
            <p className="font-display text-7xl leading-none font-bold md:text-8xl">{RATING.average.toLocaleString("fr-BE")}<span className="text-3xl text-[#a9aeb3]"> / 5</span></p>
            <p className="mt-3 font-mono text-xs tracking-wide text-[#a9aeb3] uppercase">{RATING.count} avis vérifiés sur {RATING.source} · {RATING.recommend} % recommandent</p>
          </div>
          <a href={SITE.autoscout} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-md bg-signal px-5 text-sm font-semibold tracking-wide text-signal-foreground uppercase">Tous les avis <ArrowUpRight className="size-4" /></a>
        </div>
        <Stagger as="ul" className="mt-12 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <StaggerItem as="li" key={r.name + r.date} className="flex flex-col bg-ink p-6">
              <div className="flex gap-0.5 text-signal" aria-label={`${r.stars} étoiles sur 5`}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < r.stars ? "size-4 fill-current" : "size-4 opacity-30"} />)}
              </div>
              <p className="mt-4 flex-1 leading-relaxed">« {r.text} »</p>
              <p className="mt-5 font-mono text-xs tracking-wide text-[#a9aeb3] uppercase">{r.name} · {r.date}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-4 font-mono text-[0.68rem] text-[#8a9097] uppercase">Source : fiche {RATING.source} de DGN Cars, relevé de {RATING.asOf}.</p>
      </div>
    </section>
  );
}
