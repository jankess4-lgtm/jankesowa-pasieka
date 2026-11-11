import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności sklepu internetowego Jankesowa Pasieka.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

export default function PolitykaPrywatnosci() {
  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-brand-creamDark p-10 shadow-sm">
          <h1 className="font-serif text-4xl text-brand-brown mb-8 tracking-tight">Polityka Prywatności Jankesowa Pasieka</h1>

          <div className="prose prose-brand max-w-none text-brand-brown/90 leading-relaxed space-y-6">
            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">1. Administrator danych</h2>
              <p>Administratorem danych osobowych jest Jankesowa Pasieka, Topolno 45, 86-120 Pruszcz (Kujawy nadwiślańskie), e-mail: kontakt@jankesowapasieka.pl, tel. +48 514 070 298.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">2. Jakie dane przetwarzamy</h2>
              <p>W zależności od tego, jak korzystasz ze sklepu, możemy przetwarzać:</p>
              <ul className="list-disc pl-6">
                <li>imię i nazwisko,</li>
                <li>adres dostawy (ulica, kod pocztowy, miejscowość) – przy wysyłce kurierem,</li>
                <li>adres e-mail i numer telefonu,</li>
                <li>dane zamówienia (wybrane produkty, sposób dostawy, w tym kod paczkomatu, kwota i status płatności),</li>
                <li>treść wiadomości wysłanej przez formularz kontaktowy,</li>
                <li>dane techniczne, takie jak adres IP i informacje o urządzeniu lub przeglądarce, związane z działaniem strony i bezpieczeństwem,</li>
                <li>pliki cookies i podobne dane zapisane w przeglądarce (np. koszyk oraz – za zgodą – narzędzia statystyczne i reklamowe).</li>
              </ul>
              <p className="mt-3">Nie otrzymujemy pełnych danych Twojej karty płatniczej. Płatności obsługuje Stripe; my widzimy jedynie potwierdzenie transakcji i dane potrzebne do realizacji zamówienia.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">3. Cele przetwarzania danych</h2>
              <p>Dane osobowe przetwarzamy w celu:</p>
              <ul className="list-disc pl-6">
                <li>realizacji zamówień i umowy sprzedaży,</li>
                <li>przetwarzania płatności (przez Stripe),</li>
                <li>kontaktu z klientem w sprawie zamówienia,</li>
                <li>odpowiedzi na wiadomości z formularza kontaktowego,</li>
                <li>spełnienia obowiązków prawnych (księgowość, reklamacje),</li>
                <li>pomiaru działania strony i reklam – wyłącznie gdy wyrazisz na to zgodę w ustawieniach cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">4. Podstawa prawna</h2>
              <p>Przetwarzanie odbywa się na podstawie:</p>
              <ul className="list-disc pl-6">
                <li>art. 6 ust. 1 lit. b RODO (wykonanie umowy),</li>
                <li>art. 6 ust. 1 lit. c RODO (obowiązek prawny),</li>
                <li>art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes – obsługa zapytań, dochodzenie lub obrona roszczeń oraz bezpieczeństwo sklepu),</li>
                <li>art. 6 ust. 1 lit. a RODO (zgoda – cookies analityczne i reklamowe).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">5. Odbiorcy danych</h2>
              <p>Dane mogą być przekazywane zaufanym podmiotom, które pomagają nam prowadzić sklep, wyłącznie w zakresie potrzebnym do ich zadań:</p>
              <ul className="list-disc pl-6">
                <li>Stripe – operator płatności (karta, BLIK, Przelewy24); nie otrzymujemy pełnych danych karty,</li>
                <li>InPost (paczkomat) albo firma kurierska – w celu dostawy zamówienia,</li>
                <li>Vercel – hosting strony oraz Vercel Web Analytics (anonimowe statystyki odwiedzin),</li>
                <li>home.pl – poczta elektroniczna domeny sklepu (m.in. kontakt@jankesowapasieka.pl),</li>
                <li>Resend – wysyłka potwierdzeń z formularza kontaktowego oraz powiadomień o zamówieniach,</li>
                <li>Google – tag Google Ads i Consent Mode (za Twoją zgodą), opinie z Google Places na stronie głównej oraz, na stronie kontaktu, osadzona mapa Google,</li>
                <li>biuro rachunkowe – w zakresie wymaganym przepisami o rachunkowości.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">6. Przekazywanie danych poza Europejski Obszar Gospodarczy</h2>
              <p>Niektórzy z naszych dostawców mają siedzibę w Stanach Zjednoczonych albo mogą przetwarzać dane na serwerach poza EOG. Dotyczy to w szczególności Stripe, Google, Vercel i Resend. Przekazanie odbywa się na podstawie decyzji Komisji Europejskiej o adekwatności dla programu EU–US Data Privacy Framework, gdy dany podmiot jest w nim certyfikowany, a w pozostałych przypadkach na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską oraz – w razie potrzeby – dodatkowych zabezpieczeń.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">7. Okres przechowywania</h2>
              <p>Dane przechowujemy tylko tak długo, jak jest to potrzebne do celów, dla których je zebraliśmy, albo jak wymagają tego przepisy:</p>
              <ul className="list-disc pl-6">
                <li>dane zamówień i rozliczeń księgowych – przez 5 lat, licząc od końca roku podatkowego, w którym powstało zobowiązanie,</li>
                <li>korespondencję z formularza kontaktowego – do zakończenia sprawy, a następnie przez okres przedawnienia ewentualnych roszczeń,</li>
                <li>dane przetwarzane na podstawie zgody – do jej wycofania,</li>
                <li>pliki cookies – zgodnie z Twoimi ustawieniami i czasem życia danego pliku.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">8. Dobrowolność podania danych i zautomatyzowane decyzje</h2>
              <p>Podanie danych jest dobrowolne, ale niezbędne do złożenia zamówienia, odbioru płatności, dostawy albo odpowiedzi na wiadomość z formularza. Bez tych danych nie będziemy mogli zrealizować zamówienia ani odpowiedzieć na zapytanie.</p>
              <p className="mt-3">Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na Ciebie wpływały.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">9. Bezpieczeństwo danych</h2>
              <p>Dbamy o to, aby dane były odpowiednio zabezpieczone. Strona działa w szyfrowanym połączeniu SSL/TLS. Dostęp do danych mają tylko osoby, które potrzebują go do realizacji zamówień, obsługi zapytań albo obowiązków prawnych. Korzystamy też z zabezpieczeń stosowanych przez naszych zaufanych dostawców (m.in. Stripe, Vercel i Resend).</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">10. Prawa osoby, której dane dotyczą</h2>
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
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">11. Pliki cookies</h2>
              <p>Nasza strona korzysta z plików cookies niezbędnych do funkcjonowania sklepu (np. koszyk, sesja). Za Twoją zgodą możemy też używać cookies analitycznych i reklamowych (m.in. Google Ads / Google tag), aby mierzyć skuteczność reklam i statystyki. Możesz w każdej chwili zmienić wybór w stopce strony („Ustawienia cookies”). Nie używamy cookies marketingowych bez Twojej zgody.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">12. Zmiany polityki</h2>
              <p>Politykę prywatności możemy od czasu do czasu zaktualizować, na przykład gdy zmienią się przepisy, narzędzia, z których korzystamy, albo sposób działania sklepu. Aktualna wersja jest zawsze dostępna na tej stronie, a data ostatniej aktualizacji widnieje poniżej.</p>
            </section>

            <section>
              <h2 className="font-medium text-xl text-brand-brown mt-8 mb-3">13. Kontakt</h2>
              <p>W sprawach związanych z przetwarzaniem danych kontaktuj się z nami: <a href="mailto:kontakt@jankesowapasieka.pl" className="text-brand-gold underline">kontakt@jankesowapasieka.pl</a></p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-creamDark text-sm text-brand-brown/60">
            Ostatnia aktualizacja: 11 listopada 2026
          </div>

          <div className="mt-8">
            <Link href="/" className="text-sm text-brand-brown hover:text-brand-gold underline">← Powrót do strony głównej</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
