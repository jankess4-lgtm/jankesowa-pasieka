import { Truck, MapPin, ShieldCheck, Clock, RotateCcw } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_PARCEL } from "@/lib/shipping";

const ITEMS = [
  {
    icon: Truck,
    title: `Darmowa wysyłka od ${FREE_SHIPPING_THRESHOLD} zł`,
    desc: `Poniżej tej kwoty paczkomat od ${SHIPPING_PARCEL} zł. Słoiki pakujemy starannie.`,
  },
  {
    icon: MapPin,
    title: "Odbiór osobisty – 0 zł",
    desc: "W pasiece w Topolnie i w Świeciu po umówieniu. W Bydgoszczy w dni robocze po 15:00, ul. Jagiellońska (koło hotelu City).",
  },
  {
    icon: ShieldCheck,
    title: "Bezpieczna płatność przez Stripe",
    desc: "Karta, BLIK lub Przelewy24. Nie widzimy danych Twojej karty.",
  },
  {
    icon: Clock,
    title: "Wysyłka w 1–3 dni robocze",
    desc: "Miód wysyłamy prosto z pasieki.",
  },
  {
    icon: RotateCcw,
    title: "14 dni na zwrot",
    desc: "Pytania? Napisz: kontakt@jankesowapasieka.pl",
  },
];

export default function TrustSignals({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul
      className={`rounded-xl border border-brand-brown/10 bg-white px-4 py-3 grid gap-3 ${compact ? "" : "sm:grid-cols-2"} ${className}`}
      aria-label="Dlaczego warto kupić u nas"
    >
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="flex gap-3 items-start">
          <Icon className="w-5 h-5 mt-0.5 shrink-0 text-brand-gold" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-brand-brown leading-snug">{title}</div>
            <div className="text-xs text-brand-brown/70 leading-relaxed break-words">{desc}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
