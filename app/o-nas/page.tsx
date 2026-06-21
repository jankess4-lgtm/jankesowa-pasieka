import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Leaf, Award, Heart } from "lucide-react";
import Image from "next/image";

export default function ONasPage() {
  return (
    <div className="bg-[#F5EDE4]">
      {/* Hero section with apiary photo */}
      <div className="relative h-[380px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/pasieka.PNG" 
          alt="Jankesowa Pasieka - widok z ulami na tle łąk" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="relative z-10 text-center px-6 text-white">
          <div className="tracking-[3px] uppercase text-xs mb-2 text-white/70">TERENY NADWIŚLAŃSKIE KUJAW</div>
          <h1 className="font-serif text-6xl tracking-[-1.2px]">O pasiece</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-14 text-[#2F2A23]">
        {/* Main description - exactly as provided, warm & professional */}
        <div className="prose prose-lg max-w-none text-[15.5px] leading-relaxed text-[#2F2A23]">
          <p className="text-xl md:text-2xl leading-tight font-light text-brand-brown mb-8">
            JANKESOWA PASIEKA to mała, rodzinna pasieka położona na malowniczych terenach nadwiślańskich Kujaw.
          </p>

          <p className="mb-6">
            Prowadzimy ją z największą dbałością o zdrowie pszczół i jakość produkowanego miodu. Korzystamy z różnorodnych uli – tradycyjnych drewnianych oraz nowoczesnych poliuretanowych, co pozwala pszczołom na optymalne warunki przez cały rok.
          </p>

          <p className="mb-6">
            Dzięki położeniu nad Wisłą nasze pszczoły mają dostęp do bogatej, zróżnicowanej bazy pożytkowej: łąk, zadrzewień, rzepaku, lip, akacji, gryki oraz późnoletnich spadzi. Czyste, nadwiślańskie powietrze i brak dużych zakładów przemysłowych w bezpośrednim sąsiedztwie przekładają się na wyjątkową jakość i aromat naszych produktów.
          </p>

          <p className="mb-6">
            Stosujemy wyłącznie naturalne metody hodowli – nie używamy antybiotyków ani syntetycznych środków. Miód zbieramy wyłącznie z dojrzałych plastrów, wirowany na zimno, bez pasteryzacji i mieszania. Pasieka posiada weterynaryjny numer identyfikacyjny i regularnie poddaje produkty badaniom laboratoryjnym.
          </p>

          <p>
            Mała skala produkcji gwarantuje, że każdy słoik trafiający do Ciebie jest pełen naturalnej mocy prosto z kujawskich terenów nadwiślańskich.
          </p>
        </div>

        {/* Values / Principles */}
        <div className="bg-white border border-brand-creamDark rounded-3xl p-9 md:p-12">
          <h3 className="font-serif text-3xl text-brand-brown mb-8 tracking-tight">Nasze zasady</h3>
          
          <div className="grid md:grid-cols-3 gap-9">
            <div>
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Leaf className="w-5 h-5" /> 
                <span className="font-medium text-brand-brown">Naturalna hodowla</span>
              </div>
              <p className="text-sm leading-relaxed text-[#374151]">
                Żadnych antybiotyków ani syntetycznych środków. Pszczoły zimują na własnych zapasach. Dbamy o zdrowie owadów i różnorodność roślin wokół pasieki.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Award className="w-5 h-5" /> 
                <span className="font-medium text-brand-brown">Najwyższa jakość</span>
              </div>
              <p className="text-sm leading-relaxed text-[#374151]">
                Miód tylko z dojrzałych plastrów. Wirowany na zimno, bez pasteryzacji i mieszania. Regularne badania laboratoryjne i weterynaryjny numer identyfikacyjny.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3 text-brand-gold">
                <Heart className="w-5 h-5" /> 
                <span className="font-medium text-brand-brown">Rodzinna skala</span>
              </div>
              <p className="text-sm leading-relaxed text-[#374151]">
                Mała, rodzinna produkcja. Każdy słoik jest ręcznie rozlewany z troską o jakość. Bez pośpiechu i masowej produkcji.
              </p>
            </div>
          </div>
        </div>

        {/* Location highlight */}
        <div className="text-center py-4">
          <div className="inline-block bg-white border border-brand-creamDark rounded-2xl px-8 py-6">
            <p className="font-medium text-brand-brown text-lg tracking-tight">Topolno • gmina Pruszcz • Kujawy nad Wisłą</p>
            <p className="text-sm text-brand-brown/70 mt-1">Czyste powietrze, bogata baza pożytkowa, rodzinna tradycja</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-brand-brown/10 py-12 bg-white">
        <div className="max-w-md mx-auto text-center px-6">
          <p className="mb-5 text-lg">Chcesz odwiedzić pasiekę lub złożyć większe zamówienie?</p>
          <Link href="/kontakt">
            <Button variant="secondary" size="lg">Skontaktuj się z nami</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
