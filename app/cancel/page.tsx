"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CancelPage() {
  return (
    <div className="bg-[#F5EDE4] min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <XCircle className="w-11 h-11 text-red-500" />
        </div>

        <h1 className="font-serif text-4xl text-brand-brown mb-3 tracking-tight">Płatność anulowana</h1>
        <p className="text-lg text-brand-brown/70 mb-8">
          Transakcja została przerwana. Twój koszyk pozostał bez zmian.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/koszyk">
            <Button variant="secondary" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="w-4 h-4" /> Wróć do koszyka
            </Button>
          </Link>
          <Link href="/produkty">
            <Button className="w-full sm:w-auto">Przeglądaj ofertę</Button>
          </Link>
        </div>

        <p className="mt-10 text-sm text-brand-brown/50">
          Jeśli napotkałeś problem, skontaktuj się z nami:<br />
          <a href="mailto:jankesowapasieka@gmail.com" className="underline hover:text-brand-gold">jankesowapasieka@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
