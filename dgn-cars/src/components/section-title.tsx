import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

/** Titre de section : petit surtitre rouge + grand titre, centré par défaut. */
export function SectionTitle({ eyebrow, title, children, align = "center", className, dark }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; align?: "center" | "left"; className?: string; dark?: boolean }) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      <p className={cn("inline-flex items-center gap-3 font-mono text-[0.72rem] font-medium tracking-[0.18em] uppercase", dark ? "text-[#ff6b6b]" : "text-signal")}>
        <span className="h-px w-8 bg-current" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-current" />}
      </p>
      <h2 className="mt-4 text-4xl md:text-6xl">{title}</h2>
      {children && <div className={cn("mt-4 md:text-lg", dark ? "text-[#b9bdc1]" : "text-muted-foreground", align === "center" && "mx-auto max-w-2xl")}>{children}</div>}
    </Reveal>
  );
}
