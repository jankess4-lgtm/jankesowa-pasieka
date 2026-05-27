import Link from "next/link";
import { Hexagon, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white/90 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-y-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Hexagon className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-serif text-2xl tracking-tight">Jankesowa Pasieka</span>
          </div>
          <p className="max-w-sm text-sm text-white/70 leading-relaxed">
            Rodzinna pasieka na malowniczych terenach nadwiślańskich Kujaw. 
            Dbamy o pszczoły i produkujemy najczystsze, niepasteryzowane miody oraz produkty pszczele.
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-3 text-sm">
          <div className="font-medium text-white mb-4 tracking-wider text-xs uppercase">Nawigacja</div>
          <div className="space-y-2.5">
            <Link href="/produkty" className="block hover:text-white transition">Oferta produktów</Link>
            <Link href="/o-nas" className="block hover:text-white transition">Historia pasieki</Link>
            <Link href="/kontakt" className="block hover:text-white transition">Kontakt i dojazd</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-4 text-sm">
          <div className="font-medium text-white mb-4 tracking-wider text-xs uppercase">Jankesowa Pasieka</div>
          <div className="space-y-3 text-white/80">
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                Topolno 45<br />
                86-120 Pruszcz<br />
                Kujawy nadwiślańskie
              </div>
            </div>
            <a href="tel:+48514070298" className="flex gap-3 hover:text-white transition">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>+48 514 070 298</span>
            </a>
            <a href="mailto:jankesowapasieka@gmail.com" className="flex gap-3 hover:text-white transition">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>jankesowapasieka@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-white/15 pt-6 text-xs text-white/50 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-y-2 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Jankesowa Pasieka. Wszelkie prawa zastrzeżone.</div>
        <div>Tradycja • Natura • Jakość</div>
      </div>
    </footer>
  );
}
