import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 text-6xl md:text-8xl">Page introuvable</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Ce véhicule a peut-être été vendu, ou la page a changé d&apos;adresse.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild className="bg-signal text-signal-foreground"><Link href="/stock">Voir le stock</Link></Button>
        <Button asChild variant="outline"><Link href="/">Accueil</Link></Button>
      </div>
    </div>
  );
}
