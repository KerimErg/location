import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({ eyebrow, title, description, className, align = "left" }: { eyebrow?: string; title: React.ReactNode; description?: string; className?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl md:mb-14", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>}
      <h2 className="text-3xl font-bold text-balance md:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>}
    </Reveal>
  );
}
