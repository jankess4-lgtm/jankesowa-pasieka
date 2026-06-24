import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white/90 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-y-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <Link href="/" className="flex items-center gap-2 mb-3" aria-label="Jankesowa Pasieka - Strona główna">
            <Image 
              src="/logo.png" 
              alt="Jankesowa Pasieka" 
              width={160} 
              height={48} 
              className="h-12 w-auto object-contain" 
            />
            <span 
              className="text-[#78350F] text-base md:text-lg tracking-[0.5px] font-normal"
              style={{ fontFamily: "'Kristen ITC', cursive" }}
            >
              JANKESOWA PASIEKA
            </span>
          </Link>
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
            <Link href="/o-nas" className="block hover:text-white transition">O pasiece</Link>
            <Link href="/kontakt" className="block hover:text-white transition">Kontakt i dojazd</Link>
            <Link href="/regulamin" className="block hover:text-white transition">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="block hover:text-white transition">Polityka prywatności</Link>
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
