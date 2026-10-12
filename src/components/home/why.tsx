import { CalendarX2, Gauge, Headset, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const ITEMS = [
  { icon: Gauge, title: "Kilométrage illimité", text: "Roulez sans compter sur toutes nos locations de tourisme, en France et dans l'UE." },
  { icon: ShieldCheck, title: "Assurance incluse", text: "Responsabilité civile et protection de base incluses. Franchise 0 € en option." },
  { icon: Headset, title: "Assistance 24/7", text: "Une équipe joignable jour et nuit et un dépannage partout en Europe." },
  { icon: CalendarX2, title: "Annulation gratuite", text: "Modifiez ou annulez sans frais jusqu'à 48 h avant la prise du véhicule." },
];

export function Why() {
  return (
    <section id="pourquoi" className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading
            eyebrow="Pourquoi TestLocation"
            title="L'exigence premium, sans la complexité."
            description="Nous avons repensé la location de A à Z : des prix transparents, des véhicules irréprochables et un service qui répond présent."
            className="mb-0"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {ITEMS.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08} className="rounded-3xl border bg-background p-7 shadow-soft">
                <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <it.icon className="size-6" />
                </span>
                <h3 className="text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-6 border-t pt-12 md:grid-cols-4">
          {[
            ["3 500+", "véhicules récents"],
            ["40+", "agences en France"],
            ["4,8/5", "satisfaction client"],
            ["< 5 min", "pour réserver"],
          ].map(([k, v]) => (
            <Reveal key={v}>
              <p className="font-display text-3xl font-bold md:text-4xl">{k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
