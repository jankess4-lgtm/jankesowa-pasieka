import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog pszczelarza – o miodzie prosto z pasieki",
  description:
    "Porady pszczelarza z Jankesowej Pasieki w Topolnie: krystalizacja miodu, miód akacjowy, jak rozpoznać prawdziwy miód i gdzie go kupić w okolicach Torunia, Bydgoszczy i Świecia.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog Jankesowej Pasieki", url: "https://jankesowapasieka.pl/blog", images: [{ url: "/og-image.jpg" }] },
};

export default function BlogPage() {
  return (
    <div className="bg-[#F5EDE4] min-h-[80vh]">
      <div className="bg-white border-b border-brand-brown/10 pt-14 pb-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="uppercase text-xs tracking-[3px] text-brand-gold mb-2">PROSTO Z PASIEKI</div>
          <h1 className="font-serif text-6xl text-brand-brown tracking-[-1.5px]">Blog pszczelarza</h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-[#374151]">
            O miodzie, pszczołach i życiu pasieki nad Wisłą.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="bg-white rounded-2xl overflow-hidden border border-brand-creamDark h-full flex flex-col shadow-sm hover:shadow-lg transition">
              <div className="relative aspect-[4/3]">
                <Image src={post.image} alt={post.imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-serif text-xl leading-tight text-brand-brown mb-3 group-hover:text-brand-gold transition-colors">{post.title}</h2>
                <p className="text-sm text-[#374151] line-clamp-4 flex-1">{post.description}</p>
                <div className="mt-4 text-sm font-medium text-brand-gold">Czytaj dalej →</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
