import { ShoppingBag, Truck, CreditCard, Package } from "lucide-react";

const steps = [
  {
    icon: ShoppingBag,
    title: "Wybierz miód lub zestaw",
    desc: "Wybierz gatunek albo gotowy zestaw i dodaj go do koszyka.",
  },
  {
    icon: Truck,
    title: "Wybierz sposób dostawy",
    desc: "W koszyku wybierz paczkomat InPost (14 zł), kuriera (16 zł) albo odbiór osobisty w pasiece lub w Bydgoszczy po uzgodnieniu.",
  },
  {
    icon: CreditCard,
    title: "Zapłać bezpiecznie online",
    desc: "Płatność kartą, BLIK-iem lub Przelewy24 obsługuje Stripe. Nie otrzymujemy danych Twojej karty.",
  },
  {
    icon: Package,
    title: "Pakujemy i wysyłamy",
    desc: "Po opłaceniu pakujemy słoiki i wysyłamy zamówienie albo umawiamy odbiór. Wysyłka w ciągu 1–3 dni roboczych.",
  },
];

export default function HowToShop() {
  return (
    <section className="bg-white py-14 border-y border-brand-brown/10" aria-labelledby="jak-zrobic-zakupy">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="section-divider mb-4" />
          <h2 id="jak-zrobic-zakupy" className="font-serif text-4xl text-brand-brown tracking-tight">
            Jak zrobić zakupy?
          </h2>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative bg-[#F5EDE4] rounded-2xl p-7 border border-brand-creamDark"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#78350F] text-[#F5EDE4] font-serif text-lg leading-none">
                  {i + 1}
                </span>
                <step.icon className="w-5 h-5 text-brand-gold" aria-hidden />
              </div>
              <h3 className="font-serif text-xl mb-2.5 text-brand-brown">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#374151]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
