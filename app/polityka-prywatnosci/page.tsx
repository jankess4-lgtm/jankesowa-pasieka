import Link from "next/link";

export default function PolitykaPrywatnosci() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-brand-creamDark p-10 shadow-sm">
          <h1 className="font-serif text-4xl text-brand-brown mb-8 tracking-tight">Polityka Prywatności Jankesowa Pasieka</h1>

          <div className="prose prose-brand max-w-none text-brand-brown/90 leading-relaxed space-y-6">
            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">1. Administrator danych</h2>
              <p>Administratorem danych osobowych jest Jankesowa Pasieka, Topolno 45, 86-120 Pruszcz (Kujawy nadwiślańskie), e-mail: jankesowa.pasieka@gmail.com, tel. +48 514 070 298.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">2. Cele przetwarzania danych</h2>
              <p>Dane osobowe przetwarzamy w celu:</p>
              <ul className="list-disc pl-6">
                <li>realizacji zamówień i umowy sprzedaży,</li>
                <li>przetwarzania płatności (przez Stripe),</li>
                <li>kontaktu z klientem w sprawie zamówienia,</li>
                <li>wysyłki newslettera (za zgodą),</li>
                <li>spełnienia obowiązków prawnych (księgowość, reklamacje).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">3. Podstawa prawna</h2>
              <p>Przetwarzanie odbywa się na podstawie:</p>
              <ul className="list-disc pl-6">
                <li>art. 6 ust. 1 lit. b RODO (wykonanie umowy),</li>
                <li>art. 6 ust. 1 lit. c RODO (obowiązek prawny),</li>
                <li>art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes – marketing bezpośredni),</li>
                <li>art. 6 ust. 1 lit. a RODO (zgoda – newsletter).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">4. Odbiorcy danych</h2>
              <p>Dane mogą być przekazywane:</p>
              <ul className="list-disc pl-6">
                <li>operatorowi płatności Stripe,</li>
                <li>firmie kurierskiej / InPost (w celu dostawy),</li>
                <li>biuru rachunkowemu,</li>
                <li>podmiotom świadczącym usługi IT (hosting, poczta).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">5. Okres przechowywania</h2>
              <p>Dane przechowujemy przez okres niezbędny do realizacji umowy oraz przez czas wymagany przepisami prawa (księgowość – 5 lat).</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">6. Prawa osoby, której dane dotyczą</h2>
              <p>Masz prawo do:</p>
              <ul className="list-disc pl-6">
                <li>dostępu do swoich danych,</li>
                <li>sprostowania, usunięcia lub ograniczenia przetwarzania,</li>
                <li>przenoszenia danych,</li>
                <li>wniesienia sprzeciwu,</li>
                <li>cofnięcia zgody w dowolnym momencie,</li>
                <li>wniesienia skargi do Prezesa UODO.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">7. Pliki cookies</h2>
              <p>Nasza strona korzysta z plików cookies niezbędnych do funkcjonowania sklepu. Nie używamy cookies marketingowych bez Twojej zgody.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">8. Kontakt</h2>
              <p>W sprawach związanych z przetwarzaniem danych kontaktuj się z nami: <a href="mailto:jankesowa.pasieka@gmail.com" className="text-brand-gold underline">jankesowa.pasieka@gmail.com</a></p>
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
