import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export type Crumb = {
  name: string;
  href: string;
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(items.map((item) => ({ name: item.name, url: item.href })))}
      />
      <nav aria-label="Okruszki" className="mb-8 text-sm text-brand-brown/70">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item.href}-${index}`}>
              {index > 0 && <span className="mx-2">/</span>}
              {isLast ? (
                <span className="text-brand-brown">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand-gold transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
