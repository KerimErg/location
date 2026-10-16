import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Style = "rouge" | "blanc" | "contour" | "contour-blanc" | "encre";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-display font-extrabold tracking-[0.01em] transition-[background,color,box-shadow,transform] duration-300 ease-[var(--ease-pro)] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";
const tailles = { md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-8 text-base" };
const styles: Record<Style, string> = {
  rouge: "bg-rouge text-white shadow-[0_12px_28px_-12px_rgba(140,2,10,.7)] hover:bg-rouge-fonce",
  blanc: "bg-white text-rouge shadow-[0_12px_30px_-14px_rgba(0,0,0,.5)] hover:bg-creme",
  encre: "bg-encre text-white hover:bg-encre-2",
  contour: "border-2 border-rouge text-rouge hover:bg-rouge hover:text-white",
  "contour-blanc": "border-2 border-white/80 text-white backdrop-blur-sm bg-white/10 hover:bg-white hover:text-encre",
};

export function classesBouton(style: Style = "rouge", taille: keyof typeof tailles = "md", extra = "") {
  return `${base} ${tailles[taille]} ${styles[style]} ${extra}`;
}

export function LienBouton({
  href, style, taille, className, children, externe, ...rest
}: { href: string; style?: Style; taille?: keyof typeof tailles; className?: string; children: ReactNode; externe?: boolean } & Omit<ComponentProps<"a">, "href" | "style">) {
  const cls = classesBouton(style, taille, className);
  if (externe) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>{children}</a>;
  return <Link href={href} className={cls} {...rest}>{children}</Link>;
}
