import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAgencies, getAgencyOptions } from "@/lib/queries";
import { defaultSearch } from "@/lib/dates";
import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { Why } from "@/components/home/why";
import { Reviews } from "@/components/home/reviews";
import { Faq, FAQ_ITEMS } from "@/components/home/faq";
import { Newsletter } from "@/components/home/newsletter";
import { AgenciesExplorer } from "@/components/agencies/agencies-explorer";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [agencyOptions, agencies, featured, reviews] = await Promise.all([
    getAgencyOptions(),
    getAgencies(),
    prisma.vehicle.findMany({ where: { featured: true, active: true }, orderBy: { pricePerDay: "asc" }, take: 6 }),
    prisma.review.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Hero agencies={agencyOptions} defaults={{ ...defaultSearch(), pickupAgency: "", returnAgency: "" }} />
      <Categories />

      <section className="container-page pb-20 md:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Sélection" title="Les favoris du moment" className="mb-10" />
          <Reveal className="mb-10">
            <Button asChild variant="outline">
              <Link href="/vehicules">Toute la flotte <ArrowRight /></Link>
            </Button>
          </Reveal>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.06}>
              <VehicleCard v={v} />
            </Reveal>
          ))}
        </div>
      </section>

      <Why />

      <section className="container-page py-20 md:py-28">
        <SectionHeading eyebrow="Nos agences" title="Toujours une agence près de vous" description="Gares, aéroports et centres-villes : retirez et restituez votre véhicule où vous voulez." />
        <Reveal>
          <AgenciesExplorer agencies={agencies} />
        </Reveal>
      </section>

      <Reviews reviews={reviews} />
      <Faq />
      <Newsletter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
