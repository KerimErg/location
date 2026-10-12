import { Logo } from "@/components/logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -top-1/4 -right-1/4 size-[70%] rounded-full bg-[#ff5f00]/25 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="relative">
          <p className="font-display text-5xl leading-tight font-bold">Votre prochain départ<br /><span className="text-primary">commence ici.</span></p>
          <p className="mt-6 max-w-md text-white/60">Retrouvez vos réservations, vos factures et vos conducteurs favoris dans votre espace TestLocation.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 pt-24 pb-12 lg:pt-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
