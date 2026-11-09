import PromoSwiecie from "@/components/PromoSwiecie";
import ShippingNote from "@/components/ShippingNote";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getHomepageFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Leaf, Award, Users, Heart } from "lucide-react";
import Image from "next/image";

const featuredProducts = getHomepageFeaturedProducts();

const GOOGLE_PROFILE_URL =
  "https://www.google.com/search?q=Jankesowa+Pasieka&ludocid=18042859571763100062";
const GOOGLE_REVIEW_URL = "https://g.page/r/CZ45MnMvHWX6EBM/review";

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

export default function HomePage() {
  return (
    <div className="bg-[#F5EDE4]">
      <section className="relative min-h-[220px] h-[34vh] max-h-[320px] sm:min-h-[280px] sm:h-[42vh] sm:max-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/pasieka.jpg"
          alt="Jankesowa Pasieka - widok z ulami na tle łąk"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />

        <div className="relative z-10 max-w-4xl px-6 text-center text-white py-8">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur text-[10px] sm:text-xs tracking-[3px] mb-3 border border-white/30">
            TERENY NADWIŚLAŃSKIE KUJAW
          </div>

          <h1 className="font-serif text-[40px] sm:text-[64px] leading-[0.94] tracking-[-1.5px] mb-3">
            Jankesowa<br />Pasieka
          </h1>
          <p className="text-lg sm:text-2xl font-light tracking-tight text-white/90 mb-6">
            Najczystsze miody prosto z ula
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/produkty">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3 shadow-xl">
                Zobacz ofertę
              </Button>
            </Link>
            <Link href="/o-nas">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-7 py-3 border-white/70 text-white hover:bg-white/10 hover:text-white">
                Poznaj naszą pasiekę
              </Button>
            </Link>
          </div>
          <div className="mt-5 text-[10px] tracking-widest text-white/70">RĘCZNIE • BEZ PASTERYZACJI • BEZ POŚREDNIKÓW</div>
        </div>
      </section>

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

      <section className="bg-white py-10 border-b border-brand-brown/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="uppercase text-xs tracking-[2px] text-brand-gold mb-1">DOSTĘPNE TERAZ</div>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown tracking-tight">Miody i zestawy</h2>
              <p className="mt-2 text-sm text-[#374151] max-w-xl">
                Zestaw dwóch dużych słoików za 110 zł albo trzech małych za 80 zł — oszczędzasz 10 zł,
                a wysyłka kosztuje tyle samo co za jeden słoik.
              </p>
            </div>
            <Link href="/produkty" className="hidden md:block text-sm font-medium text-brand-gold hover:underline">
              Zobacz całą ofertę →
            </Link>
          </div>

          <ShippingNote className="mb-6" />

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/produkty">
              <Button variant="outline">Zobacz pełną ofertę</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
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

      <div className="max-w-6xl mx-auto px-6 pb-8">
        <PromoSwiecie className="text-center" />
      </div>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="section-divider mb-4" />
        <h2 className="font-serif text-4xl text-brand-brown tracking-tight mb-4">Opinie w Google</h2>
        <p className="text-[#374151] mb-8">
          Zapraszamy do naszego profilu w Google — tam znajdziesz opinie klientów,
          a po zakupie możesz zostawić swoją. Pomożesz innym znaleźć prawdziwy miód prosto z pasieki.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline">Zobacz profil w Google</Button>
          </a>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Zostaw opinię w Google</Button>
          </a>
        </div>
      </section>

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
