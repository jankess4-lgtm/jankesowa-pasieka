"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  applyConsentUpdate,
  getStoredConsent,
  setStoredConsent,
  type ConsentChoice,
} from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    setVisible(stored === null);
    setReady(true);

    const onOpenSettings = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    setStoredConsent(choice);
    applyConsentUpdate(choice);
    setVisible(false);
  }, []);

  if (!ready || !visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-creamDark bg-white shadow-[0_8px_30px_rgba(60,40,20,0.18)]">
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <h2
            id="cookie-banner-title"
            className="font-serif text-xl text-brand-brown tracking-tight mb-2"
          >
            Pliki cookies
          </h2>
          <p
            id="cookie-banner-desc"
            className="text-sm text-brand-brown/80 leading-relaxed mb-5"
          >
            Używamy plików cookies do prawidłowego działania sklepu oraz – za Twoją
            zgodą – do statystyk i reklam (Google Ads). Możesz zaakceptować lub
            odrzucić cookies marketingowe i analityczne. Szczegóły w{" "}
            <Link
              href="/polityka-prywatnosci"
              className="underline hover:text-brand-gold transition-colors"
            >
              Polityce prywatności
            </Link>
            .
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => choose("denied")}
            >
              Odrzucam
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => choose("granted")}
            >
              Akceptuję
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
