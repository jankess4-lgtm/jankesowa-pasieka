import Link from "next/link";
import Image from "next/image";

export default function ChristmasGiftLink() {
  return (
    <Link
      href="/blog/miod-na-prezent-swiateczny-jak-wybrac"
      className="mt-10 flex flex-col sm:flex-row gap-5 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-4 sm:p-5 hover:bg-brand-gold/[0.14] transition group"
    >
      <div className="relative w-full sm:w-44 h-36 sm:h-auto sm:min-h-[9rem] rounded-xl overflow-hidden shrink-0 bg-brand-cream">
        <Image
          src="/images/pasieka/ramka-miod.webp"
          alt="Ramka z miodem z Jankesowej Pasieki – inspiracja na prezent świąteczny"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 176px"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="uppercase text-[10px] tracking-[2px] text-brand-gold mb-1">Na święta</div>
        <h3 className="font-serif text-2xl text-brand-brown tracking-tight group-hover:text-brand-gold transition-colors">
          Miód na prezent świąteczny – jak wybrać
        </h3>
        <p className="mt-2 text-sm text-[#374151] leading-relaxed">
          Z pasieki na Kujawach podpowiadam, którą odmianę wybrać, kiedy lepiej sprawdzi się
          zestaw i na co zwrócić uwagę przed wysyłką.
        </p>
        <span className="mt-3 text-sm font-medium text-brand-gold">Przeczytaj poradnik →</span>
      </div>
    </Link>
  );
}
