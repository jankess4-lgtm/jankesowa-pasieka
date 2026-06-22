"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  ShoppingBag, 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Package, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/useCart";

const STORAGE_KEY = "jankesowa_checkout_form";

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
  // Enriched from API
  orderRef?: string | null;
  shippingCost?: number;
  deliveryMethod?: string;
  deliverySummary?: string;
  customerName?: string | null;
  customerPhone?: string | null;
}

// Elegant loading
function SuccessLoading() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-brand-cream">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-brand-creamDark flex items-center justify-center mb-6">
          <div className="animate-spin w-7 h-7 border-[3px] border-brand-gold border-t-transparent rounded-full" />
        </div>
        <p className="text-brand-brown/70 tracking-wide">Potwierdzamy płatność...</p>
      </div>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderFromQuery = searchParams.get("order");

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { clearCart } = useCart();
  const cartClearedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Brak identyfikatora sesji płatności. Płatność nie została potwierdzona.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/checkout-session?session_id=${sessionId}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Nie udało się pobrać danych sesji płatności");
        }

        const data: SessionData = await res.json();
        setSessionData(data);

        // Clear cart once
        if (!cartClearedRef.current) {
          clearCart();
          cartClearedRef.current = true;
        }

        // Also clear saved checkout form data (we no longer need it)
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      } catch (err: any) {
        console.error("Błąd pobierania sesji płatności:", err);
        setError(err.message || "Nie udało się potwierdzić płatności. Skontaktuj się z nami.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, clearCart]);

  const formatAmount = (amount: number | null | undefined) => {
    if (amount == null) return "—";
    return (amount / 100).toFixed(2).replace(".", ",");
  };

  // Compute nice values from session + metadata
  const orderNumber = orderFromQuery || sessionData?.orderRef || (sessionData ? `JP-${sessionData.id.slice(-8).toUpperCase()}` : "JP-XXXXXXXX");

  const lineItems = sessionData?.line_items || [];
  const productsTotalCents = lineItems.reduce((sum, item) => sum + (item.amount_total || 0), 0);
  const shippingCost = sessionData?.shippingCost ?? 0;
  const grandTotalCents = (sessionData?.amount_total || productsTotalCents) + (shippingCost * 100);

  const deliveryMethod = sessionData?.deliveryMethod || "address";
  const customerName = sessionData?.customerName || sessionData?.metadata?.customer_name || "";
  const customerPhone = sessionData?.customerPhone || sessionData?.metadata?.customer_phone || "";
  const customerEmail = sessionData?.customer_email || sessionData?.metadata?.customer_email || "";

  const getDeliveryLabel = () => {
    if (deliveryMethod === "parcel") return "Paczkomat InPost";
    if (deliveryMethod === "pickup") return "Odbiór osobisty";
    return "Dostawa kurierem";
  };

  const getDeliveryIcon = () => {
    if (deliveryMethod === "parcel") return <Package className="w-5 h-5" />;
    if (deliveryMethod === "pickup") return <Home className="w-5 h-5" />;
    return <Truck className="w-5 h-5" />;
  };

  // Internal loading
  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-creamDark flex items-center justify-center mb-6">
            <div className="animate-spin w-7 h-7 border-[3px] border-brand-gold border-t-transparent rounded-full" />
          </div>
          <p className="text-brand-brown/70 tracking-wide">Potwierdzamy płatność...</p>
        </div>
      </div>
    );
  }

  // Error / missing session
  if (error || !sessionData) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-brand-cream px-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-brand-creamDark p-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-9 h-9 text-red-500" />
          </div>
          <h1 className="font-serif text-4xl text-brand-brown tracking-tight mb-3">Coś poszło nie tak</h1>
          <p className="text-brand-brown/70 mb-8 leading-relaxed">
            {error || "Nie udało się potwierdzić sesji płatności."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" /> Strona główna
              </Button>
            </Link>
            <Link href="/produkty">
              <Button variant="secondary" className="w-full sm:w-auto">Przejdź do oferty</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // === PREMIUM SUCCESS VIEW ===
  return (
    <div className="bg-brand-cream min-h-screen py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        {/* Main card */}
        <div className="bg-white rounded-3xl border border-brand-creamDark shadow-sm overflow-hidden">
          {/* Header / Thank you */}
          <div className="px-8 md:px-12 pt-10 pb-8 text-center border-b border-brand-creamDark bg-[#FBF7F2]">
            <div className="mx-auto w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6 ring-1 ring-brand-gold/20">
              <span className="text-5xl">🐝</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-brand-brown tracking-[-0.5px] leading-tight mb-4">
              Dziękujemy!<br />Twoje zamówienie zostało złożone pomyślnie.
            </h1>

            <p className="max-w-md mx-auto text-lg text-brand-brown/75 leading-relaxed">
              Wspierasz małą rodzinną pasiekę nad Wisłą. Każdy słoik miodu to owoc pracy naszych pszczół i naszej rodziny. Dziękujemy z całego serca.
            </p>
          </div>

          {/* Order number - prominent */}
          <div className="px-8 md:px-12 py-7 bg-white border-b border-brand-creamDark">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="uppercase tracking-[2.5px] text-xs font-medium text-brand-brown/50 mb-1">Numer zamówienia</div>
                <div className="font-serif text-4xl md:text-[42px] text-brand-brown tabular-nums tracking-[1px]">
                  {orderNumber}
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-5 py-1.5 text-sm font-medium self-start sm:self-center">
                <CheckCircle className="w-4 h-4" />
                Opłacone
              </div>
            </div>
          </div>

          {/* Summary + Delivery grid */}
          <div className="px-8 md:px-12 py-9 grid md:grid-cols-5 gap-8">
            {/* Order summary */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-brand-brown" />
                <h2 className="font-medium text-xl text-brand-brown tracking-tight">Podsumowanie zamówienia</h2>
              </div>

              <div className="bg-[#F8F4EF] rounded-2xl p-6 border border-brand-creamDark/60">
                <div className="space-y-3 text-[15px]">
                  {lineItems.length > 0 ? (
                    lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-start gap-4 text-brand-brown/90">
                        <div className="leading-tight">
                          <span className="font-medium">{item.quantity} × </span>
                          <span>{item.description}</span>
                        </div>
                        <div className="tabular-nums font-medium text-brand-brown whitespace-nowrap">
                          {formatAmount(item.amount_total)} zł
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-brand-brown/60">Szczegóły produktów znajdziesz w potwierdzeniu e-mail.</p>
                  )}
                </div>

                {/* Shipping + totals */}
                <div className="mt-6 pt-5 border-t border-brand-creamDark space-y-2.5 text-[15px]">
                  <div className="flex justify-between text-brand-brown/80">
                    <span>Wartość produktów</span>
                    <span className="tabular-nums">{formatAmount(productsTotalCents)} zł</span>
                  </div>

                  <div className="flex justify-between text-brand-brown/80">
                    <span>
                      {deliveryMethod === "pickup" ? "Odbiór osobisty" : "Koszt wysyłki"}
                    </span>
                    <span className="tabular-nums">
                      {shippingCost === 0 ? "0 zł" : `${shippingCost} zł`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 mt-1 border-t border-brand-creamDark text-xl font-semibold text-brand-brown">
                    <span>Razem zapłacono</span>
                    <span className="tabular-nums">{formatAmount(grandTotalCents)} zł</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery information */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-brand-brown" />
                <h2 className="font-medium text-xl text-brand-brown tracking-tight">Dane dostawy</h2>
              </div>

              <div className="bg-white border border-brand-creamDark rounded-2xl p-6 space-y-5">
                {/* Name */}
                {customerName && (
                  <div>
                    <div className="text-xs uppercase tracking-[1.5px] text-brand-brown/50 mb-1">Odbiorca</div>
                    <div className="font-medium text-brand-brown text-lg leading-tight">{customerName}</div>
                  </div>
                )}

                {/* Address / Locker */}
                <div>
                  <div className="text-xs uppercase tracking-[1.5px] text-brand-brown/50 mb-1.5">Dostawa</div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-brand-gold">{getDeliveryIcon()}</div>
                    <div className="text-brand-brown leading-snug">
                      <div className="font-medium">{getDeliveryLabel()}</div>
                      {deliveryMethod === "parcel" && sessionData.deliverySummary && (
                        <div className="text-sm text-brand-brown/75 mt-0.5">
                          {sessionData.deliverySummary}
                        </div>
                      )}
                      {deliveryMethod === "address" && sessionData.deliverySummary && (
                        <div className="text-sm text-brand-brown/75 mt-0.5">
                          {sessionData.deliverySummary}
                        </div>
                      )}
                      {deliveryMethod === "pickup" && (
                        <div className="text-sm text-brand-brown/75 mt-0.5">
                          Pasieka Jankesowa • Topolno nad Wisłą
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-1 space-y-3 text-sm">
                  {customerPhone && (
                    <div className="flex items-center gap-3 text-brand-brown/80">
                      <Phone className="w-4 h-4 text-brand-brown/60 flex-shrink-0" />
                      <span>{customerPhone}</span>
                    </div>
                  )}
                  {customerEmail && (
                    <div className="flex items-center gap-3 text-brand-brown/80">
                      <Mail className="w-4 h-4 text-brand-brown/60 flex-shrink-0" />
                      <span className="break-all">{customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping info */}
          <div className="mx-8 md:mx-12 mb-9 rounded-2xl bg-brand-cream/70 border border-brand-creamDark px-6 py-5">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Clock className="w-5 h-5 text-brand-brown" />
              </div>
              <div className="text-[15px] text-brand-brown/85 leading-relaxed">
                <p className="font-medium text-brand-brown mb-1">Twoje miody zostaną wysłane w ciągu 1–3 dni roboczych.</p>
                <p>
                  Starannie zapakujemy każde zamówienie. Otrzymasz e-mail z potwierdzeniem i informacją o nadaniu. 
                  W razie pytań jesteśmy do dyspozycji.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 md:px-12 pb-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center border-t border-brand-creamDark pt-8">
            <Link href="/produkty" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                <ShoppingBag className="w-4 h-4" />
                Powrót do oferty
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                <Home className="w-4 h-4" />
                Przejdź na stronę główną
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom contact */}
        <div className="mt-9 text-center">
          <p className="text-sm text-brand-brown/60">
            Masz pytania? Napisz do nas:{" "}
            <a href="mailto:jankesowapasieka@gmail.com" className="underline hover:text-brand-gold transition-colors">
              jankesowapasieka@gmail.com
            </a>{" "}
            lub zadzwoń{" "}
            <a href="tel:+48514070298" className="underline hover:text-brand-gold transition-colors">+48 514 070 298</a>
          </p>
          <p className="mt-3 text-[11px] text-brand-brown/40 tracking-wide">
            Pasieka Jankesowa • Topolno nad Wisłą
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  );
}
