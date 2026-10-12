import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-4 text-center text-white">
      <p className="font-display text-[8rem] leading-none font-bold text-primary md:text-[12rem]">404</p>
      <h1 className="mt-4 text-2xl font-bold md:text-4xl">Cette route ne mène nulle part.</h1>
      <p className="mt-3 text-white/60">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/">Retour à l&apos;accueil</Link></Button>
        <Button asChild variant="glass"><Link href="/vehicules">Voir les véhicules</Link></Button>
      </div>
    </div>
  );
}
