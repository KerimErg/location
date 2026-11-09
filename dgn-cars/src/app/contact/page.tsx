import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SITE, mapsUrl } from "@/config/site";
import { ContactForm } from "@/components/forms/contact-form";
import { GarageMapLazy } from "@/components/map-lazy";
import { InstagramIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Contact & rendez-vous", description: `Prenez rendez-vous chez DGN Cars, ${SITE.address.street}, ${SITE.address.postalCode} Rocourt (Liège).` };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ objet?: string }> }) {
  const { objet } = await searchParams;
  return (
    <div className="pb-24">
      <div className="border-b bg-card">
        <div className="container-page py-10 md:py-14">
          <p className="eyebrow">Contact · Rendez-vous</p>
          <h1 className="mt-3 text-5xl md:text-7xl">Venir nous voir</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Les visites et essais se font sur rendez-vous : le véhicule est préparé avant votre arrivée.</p>
        </div>
      </div>
      <div className="container-page mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <ContactForm defaultSubject={objet} />
        <aside className="grid content-start gap-8">
          <div className="border">
            <div className="relative z-0 h-64"><GarageMapLazy /></div>
            <div className="border-t p-5">
              <p className="font-display text-2xl font-bold uppercase">{SITE.address.street}</p>
              <p className="text-muted-foreground">{SITE.address.postalCode} {SITE.address.city}</p>
              <a href={mapsUrl} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-sm underline">Itinéraire <ArrowUpRight className="size-4" /></a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Horaires</p>
            <table className="mt-2 w-full text-sm"><tbody>{SITE.hours.map((h) => <tr key={h.days} className="border-b"><td className="py-2.5">{h.days}</td><td className="py-2.5 text-right font-mono text-xs">{h.hours}</td></tr>)}</tbody></table>
          </div>
          <div className="grid gap-2 text-sm">
            {SITE.phone.href && <a className="underline" href={`tel:${SITE.phone.href}`}>Garage : {SITE.phone.display}</a>}
            {SITE.mobile.href && <a className="underline" href={`tel:${SITE.mobile.href}`}>GSM : {SITE.mobile.display}</a>}
            {SITE.whatsapp && <a className="underline" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>}
            {SITE.email && <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>}
            <a className="inline-flex items-center gap-2 underline" href={SITE.instagram} target="_blank" rel="noopener"><InstagramIcon className="size-4" /> @dgn_cars</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
