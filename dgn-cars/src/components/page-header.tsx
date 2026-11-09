import Image from "next/image";

export function PageHeader({ eyebrow, title, children, image, imageAlt }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; image?: string; imageAlt?: string }) {
  return (
    <section className="border-b bg-ink text-[#eceae5]">
      <div className="grid md:grid-cols-[1.3fr_1fr]">
        <div className="container-page py-14 md:mr-0 md:py-20 md:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
          <p className="eyebrow text-[#a9aeb3]">{eyebrow}</p>
          <h1 className="mt-4 text-5xl md:text-7xl">{title}</h1>
          {children && <div className="mt-5 max-w-xl text-[#b9bdc1] md:text-lg">{children}</div>}
        </div>
        {image && (
          <div className="relative hidden min-h-[280px] md:block">
            <Image src={image} alt={imageAlt ?? ""} fill unoptimized priority className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
