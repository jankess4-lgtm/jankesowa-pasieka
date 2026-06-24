import Link from "next/link";

export default function Regulamin() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-brand-creamDark p-10 shadow-sm">
          <h1 className="font-serif text-4xl text-brand-brown mb-8 tracking-tight">Regulamin sklepu internetowego Jankesowa Pasieka</h1>

          <div className="prose prose-brand max-w-none text-brand-brown/90 leading-relaxed space-y-6">
            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 1. Postanowienia ogólne</h2>
              <p>1. Niniejszy Regulamin określa zasady dokonywania zakupów w sklepie internetowym Jankesowa Pasieka, prowadzonym przez:</p>
              <p className="mt-2"><strong>Jankesowa Pasieka</strong><br />Topolno 45<br />86-120 Pruszcz<br />Kujawy nadwiślańskie<br />NIP: [do uzupełnienia]<br />e-mail: jankesowa.pasieka@gmail.com<br />tel.: +48 514 070 298</p>
              <p>2. Sklep oferuje naturalne miody i produkty pszczele.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 2. Zamówienia</h2>
              <p>1. Zamówienia przyjmowane są wyłącznie za pośrednictwem formularza na stronie sklepu.</p>
              <p>2. Klient dokonuje wyboru produktów, metody dostawy i płatności, a następnie potwierdza zamówienie.</p>
              <p>3. Po złożeniu zamówienia Klient otrzymuje potwierdzenie na podany adres e-mail.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 3. Ceny i płatności</h2>
              <p>1. Wszystkie ceny podane są w złotych polskich (PLN) i zawierają podatek VAT.</p>
              <p>2. Płatności realizowane są za pośrednictwem Stripe (karta, BLIK, przelew online).</p>
              <p>3. Zamówienie realizowane jest po otrzymaniu płatności.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 4. Dostawa</h2>
              <p>1. Koszty dostawy:</p>
              <ul className="list-disc pl-6">
                <li>Paczkomat InPost – 14 zł</li>
                <li>Kurier na adres – 16 zł</li>
                <li>Odbiór osobisty w pasiece (Topolno) – 0 zł</li>
              </ul>
              <p>2. Czas realizacji: 1–3 dni robocze od zaksięgowania płatności.</p>
              <p>3. Odbiór osobisty po wcześniejszym uzgodnieniu terminu.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 5. Reklamacje i odstąpienie od umowy</h2>
              <p>1. Klient ma prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny (z wyjątkiem produktów otwartych lub o krótkim terminie ważności).</p>
              <p>2. Reklamacje należy zgłaszać na adres e-mail: jankesowa.pasieka@gmail.com</p>
              <p>3. Sprzedawca rozpatruje reklamację w ciągu 14 dni.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 6. Ochrona danych osobowych</h2>
              <p>Dane osobowe przetwarzane są zgodnie z Polityką Prywatności dostępną na stronie sklepu.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">§ 7. Postanowienia końcowe</h2>
              <p>1. Regulamin dostępny jest na stronie sklepu.</p>
              <p>2. Sprzedawca zastrzega sobie prawo do zmiany Regulaminu. Zmiany wchodzą w życie po opublikowaniu na stronie.</p>
              <p>3. W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności Kodeks cywilny.</p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-creamDark text-sm text-brand-brown/60">
            Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
          </div>

          <div className="mt-8">
            <Link href="/" className="text-sm text-brand-brown hover:text-brand-gold underline">← Powrót do strony głównej</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
