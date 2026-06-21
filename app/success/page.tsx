"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/useCart";

interface SessionData {
  id: string;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  customer_email: string | null;
  metadata: any;
  line_items?: Array<{
    description: string | null;
    quantity: number | null;
    amount_total: number | null;
  }>;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderRef = searchParams.get("order");

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setError("Brak identyfikatora sesji płatności.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/checkout-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Nie udało się pobrać danych płatności");

        const data = await res.json();
        setSessionData(data);

        // Clear the cart after successful payment
        clearCart();
      } catch (err) {
        console.error(err);
        setError("Nie udało się potwierdzić płatności. Skontaktuj się z nami.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  const formatAmount = (amount: number | null) => {
    if (!amount) return "—";
    return (amount / 100).toFixed(2).replace(".", ",");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5EDE4]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-brand-brown">Potwierdzamy płatność...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5EDE4] px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-4xl text-brand-brown mb-4">Coś poszło nie tak</h1>
          <p className="text-brand-brown/70 mb-8">{error || "Nie znaleziono sesji płatności."}</p>
          <Link href="/produkty">
            <Button variant="secondary">Wróć do oferty</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE4] min-h-[80vh] py-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-brand-creamDark p-10 text-center shadow-sm">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-11 h-11 text-emerald-600" />
          </div>

          <h1 className="font-serif text-5xl text-brand-brown tracking-tight mb-3">
            Dziękujemy za zamówienie!
          </h1>
          <p className="text-xl text-brand-brown/70 mb-8">
            Płatność została przyjęta pomyślnie.
          </p>

          {/* Order info */}
          <div className="bg-[#F8F4EF] rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs uppercase tracking-[2px] text-brand-brown/50">Numer zamówienia</div>
                <div className="font-semibold text-2xl text-brand-brown tabular-nums">
                  {orderRef || "JP-" + sessionData.id.slice(-8).toUpperCase()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-[2px] text-brand-brown/50">Status</div>
                <div className="font-medium text-emerald-600">Opłacone</div>
              </div>
            </div>

            <div className="border-t border-brand-creamDark pt-4 space-y-1 text-sm">
              {sessionData.line_items && sessionData.line_items.length > 0 ? (
                sessionData.line_items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-brand-brown/80">
                    <span>{item.quantity} × {item.description}</span>
                    <span className="tabular-nums">{formatAmount(item.amount_total)} zł</span>
                  </div>
                ))
              ) : (
                <p className="text-brand-brown/70">Szczegóły zamówienia w potwierdzeniu e-mail</p>
              )}

              <div className="pt-3 mt-3 border-t border-brand-creamDark flex justify-between font-semibold text-lg text-brand-brown">
                <span>Razem</span>
                <span className="tabular-nums">{formatAmount(sessionData.amount_total)} zł</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-brand-brown/60 mb-8 leading-relaxed max-w-md mx-auto">
            Na Twój adres e-mail wyślemy potwierdzenie wraz z danymi do śledzenia zamówienia.
            Skontaktujemy się z Tobą wkrótce w sprawie dostawy (lub odbioru osobistego).
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/produkty">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <ShoppingBag className="w-4 h-4" /> Przeglądaj ofertę
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto gap-2">
                Strona główna <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-10 text-[11px] text-brand-brown/40">
            ID sesji: {sessionData.id}
          </p>
        </div>

        <p className="text-center text-xs text-brand-brown/50 mt-8">
          Masz pytania? Napisz na <a href="mailto:jankesowapasieka@gmail.com" className="underline">jankesowapasieka@gmail.com</a> lub zadzwoń +48 514 070 298
        </p>
      </div>
    </div>
  );
}
