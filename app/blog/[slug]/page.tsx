import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "@/lib/blog";
import { Button } from "@/components/ui/Button";
import { articleJsonLd } from "@/lib/structured-data";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";

const BASE_URL = "https://jankesowapasieka.pl";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="bg-[#F5EDE4] min-h-screen py-10 md:py-14">
      <JsonLd data={articleJsonLd(post)} />
      <article className="max-w-3xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { name: "Strona główna", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <h1 className="font-serif text-4xl md:text-5xl leading-tight text-brand-brown tracking-[-1px] mb-4">{post.title}</h1>
        <div className="text-sm text-brand-brown/60 mb-8">
          Krzysztof, Jankesowa Pasieka • {new Date(post.date).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
        </div>

        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-10 border border-brand-creamDark">
          <Image src={post.image} alt={post.imageAlt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        <div className="text-[17px] leading-relaxed text-[#374151] space-y-5">
          <p className="text-lg"><RichText text={post.intro} /></p>
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-brand-brown pt-6">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}><RichText text={paragraph} /></p>
              ))}
              {section.list && (
                <ul className="list-disc pl-6 space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i}><RichText text={item} /></li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 bg-brand-green text-white rounded-3xl p-8 md:p-10 text-center">
          <h2 className="font-serif text-3xl mb-3">Miód prosto z naszej pasieki</h2>
          <p className="text-white/80 mb-7">{post.cta.text}</p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            {post.cta.links.map((l) => (
              <Link key={l.href} href={l.href}>
                <Button size="lg" className="w-full sm:w-auto bg-white text-brand-green hover:bg-white/90">{l.label}</Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-brand-gold hover:underline">← Wszystkie wpisy</Link>
        </div>
      </article>
    </div>
  );
}
