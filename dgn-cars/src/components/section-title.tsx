import { cn } from "@/lib/utils";

export function SectionTitle({ index, label, title, children, className }: { index: string; label: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-10 grid gap-4 border-t border-foreground pt-5 md:mb-14 md:grid-cols-[220px_1fr]", className)}>
      <p className="eyebrow">{index} — {label}</p>
      <div>
        <h2 className="max-w-3xl text-4xl md:text-6xl">{title}</h2>
        {children && <div className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{children}</div>}
      </div>
    </div>
  );
}
