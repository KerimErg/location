import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FormField({ label, error, hint, className, children, htmlFor }: { label: string; error?: string; hint?: string; className?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export const nativeSelect =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25";
