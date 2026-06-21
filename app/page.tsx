// Full working homepage with current Jankesowa Pasieka data (Kujawy, Topolno, products, etc.)
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Leaf, Award, Users, Heart } from "lucide-react";
import Image from "next/image";

const featuredProducts = products.slice(0, 4);

const benefits = [
  {
    icon: Leaf,
    title: "Nadwiślańskie Kujawy",
    desc: "Bogata baza pożytkowa: łąki, zadrzewienia, rzepak, lipy, akacje, gryka i późna spadź. Czyste powietrze z dala od przemysłu.",
  },
  {
    icon: Award,
    title: "Wirowany na zimno",
    desc: "Miód zbierany wyłącznie z dojrzałych plastrów. Bez pasteryzacji i mieszania — zachowuje wszystkie naturalne enzymy.",
  },
  {
    icon: Users,
    title: "Rodzinna pasieka",
    desc: "Mała, rodzinna skala produkcji. Ręcznie rozlewany miód z troską o najwyższą jakość i dobrostan pszczół.",
  },
  {
    icon: Heart,
    title: "Naturalne metody",
    desc: "Bez antybiotyków i syntetycznych środków. Regularne badania laboratoryjne i weterynaryjny numer identyfikacyjny.",
  },
];

const testimonials = [
  {
    quote: "Najlepszy miód gryczany jaki jadłem w życiu. Intensywny, prawdziwy smak. Kupuję tu od kilku lat.",
    author: "Marek K., Bydgoszcz",
  },
  {
    quote: "Miód akacjowy to codzienność w naszej kuchni. Wyjątkowa jakość i smak.",
    author: "Anna i Tomasz, Toruń",
  },
  {
    quote: "Świece z wosku i miód nawłociowy — wszystko pachnie prawdziwą pasieką. Polecam z całego serca.",
    author: "Joanna M., Gdańsk",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#F5EDE4]">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/pasieka.PNG" 
          alt="Jankesowa Pasieka" 
          fill 
          className="object-cover" 
          priority 
        />
        {/* Dark elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />
        
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur text-xs tracking-[3px] mb-4 border border-white/30">
            TERENY NADWIŚLAŃSKIE KUJAW
          </div>
          
          <h1 className="font-serif text-[72px] sm:text-[88px] leading-[0.92] tracking-[-2.5px] mb-4">
            Jankesowa<br />Pasieka
          </h1>
          <p className="text-2xl sm:text-3xl font-light tracking-tight text-white/90 mb-10">
            Najczystsze miody prosto z ula
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produkty">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-4 shadow-xl">
                Zobacz ofertę
              </Button>
            </Link>
            <Link href="/o-nas">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-9 py-4 border-white/70 text-white hover:bg-white/10 hover:text-white">
                Poznaj naszą pasiekę
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-xs tracking-widest text-white/70">RĘCZNIE • BEZ PASTERYZACJI • BEZ POŚREDNIKÓW</div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 text-[10px] tracking-[1.5px]">
          PRZEWIN
          <div className="h-8 w-px bg-white/40 mt-2" />
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-b border-brand-brown/10 bg-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-3 text-sm text-brand-brown/70 tracking-wider">
          <div>RODZINNA PASIEKA</div>
          <div className="text-brand-gold">•</div>
          <div>NATURALNY WOSK</div>
          <div className="text-brand-gold">•</div>
          <div>BEZ CUKRU DODANEGO</div>
          <div className="text-brand-gold">•</div>
          <div>KUJAWY NAD WIŚLĄ</div>
        </div>
      </div>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-10">
          <div className="section-divider mb-4" />
          <h2 className="font-serif text-4xl text-brand-brown tracking-tight">Dlaczego wybierają nas</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-brand-creamDark group">
              <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center mb-5 group-hover:bg-brand-gold/10 transition">
                <b.icon className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-serif text-xl mb-2.5 text-brand-brown">{b.title}</h3>
              <p className="text-sm leading-relaxed text-[#374151]">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-16 border-y border-brand-brown/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-9">
            <div>
              <div className="uppercase text-xs tracking-[2px] text-brand-gold mb-1">NAJLEPSZE WYBORY</div>
              <h2 className="font-serif text-4xl text-brand-brown tracking-tight">Polecane produkty</h2>
            </div>
            <Link href="/produkty" className="hidden md:block text-sm font-medium text-brand-gold hover:underline">
              Zobacz całą ofertę →
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-9 md:hidden">
            <Link href="/produkty">
              <Button variant="outline">Zobacz pełną ofertę</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="section-divider mb-4" />
          <h2 className="font-serif text-4xl text-brand-brown tracking-tight">Głosy naszych klientów</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-brand-creamDark flex flex-col">
              <div className="text-6xl text-brand-gold/30 font-serif leading-none mb-3">„</div>
              <p className="text-[15px] text-[#374151] flex-1 leading-relaxed">„{t.quote}”</p>
              <div className="mt-6 pt-4 border-t border-brand-cream text-sm font-medium text-brand-brown/80">{t.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand-green text-white py-16">
        <div className="max-w-xl mx-auto text-center px-6">
          <h2 className="font-serif text-4xl tracking-tight mb-4">Chcesz poznać pełną ofertę?</h2>
          <p className="text-white/80 mb-8">W naszej pasiece znajdziesz najwyższej jakości miody oraz wyjątkowe produkty pszczele z kujawskich terenów nadwiślańskich.</p>
          <Link href="/produkty">
            <Button variant="primary" size="lg" className="bg-white text-brand-green hover:bg-white/90">Przeglądaj miody i produkty</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
