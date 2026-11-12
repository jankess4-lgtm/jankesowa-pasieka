"use client";
import PromoSwiecie from "@/components/PromoSwiecie";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Prosimy wypełnić wymagane pola");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "", website: "" });
        toast.success("Wiadomość wysłana", {
          description: "Na Twój e-mail poszło potwierdzenie.",
        });
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data?.error || "Wystąpił błąd podczas wysyłania wiadomości");
      }
    } catch {
      toast.error("Nie udało się wysłać wiadomości. Spróbuj później.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#F5EDE4] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="max-w-2xl mb-10">
          <div className="uppercase tracking-[3px] text-xs text-brand-gold mb-2">ZAPRASZAMY</div>
          <h1 className="font-serif text-6xl tracking-[-1px] text-brand-brown">Kontakt i dojazd</h1>
          <p className="mt-3 text-xl text-[#374151]">Chętnie odpowiemy na pytania i pomożemy z zamówieniem.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Lewa kolumna */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-brand-creamDark p-8">
              <h3 className="font-medium text-brand-brown mb-5 text-lg">Jankesowa Pasieka</h3>

              <div className="space-y-6 text-sm">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-brand-brown">Topolno 45</div>
                    <div className="text-brand-brown/70">86-120 Pruszcz</div>
                    <div className="text-brand-brown/70">Kujawy nadwiślańskie</div>
                  </div>
                </div>
                <a href="tel:+48514070298" className="flex gap-4 group hover:text-brand-gold transition">
                  <Phone className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div>+48 514 070 298</div>
                    <div className="text-xs text-brand-brown/60">Pasieka w Topolnie: poniedziałek – piątek 16:00 – 20:00, sobota 8:00 – 13:00, niedziela nieczynne</div>
                    <div className="text-xs text-brand-brown/60">Odbiór w Bydgoszczy: ul. Jagiellońska (koło hotelu City), w dni robocze po 15:00, po wcześniejszym telefonie</div>
                    <div className="text-xs text-brand-brown/60">Odbiór w Świeciu: zawsze po wcześniejszym umówieniu</div>
                  </div>
                </a>
                <a href="mailto:kontakt@jankesowapasieka.pl" className="flex gap-4 group hover:text-brand-gold transition">
                  <Mail className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>kontakt@jankesowapasieka.pl</div>
                </a>
                <div className="flex gap-4 pt-2 border-t border-brand-creamDark">
                  <Clock className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div className="text-sm leading-snug">
                    Wizyty w pasiece<br />tylko po wcześniejszym uzgodnieniu
                  </div>
                </div>
                <PromoSwiecie />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-brand-creamDark p-8">
              <h4 className="font-medium text-brand-brown mb-4">Pobierz wizytówkę</h4>
              <p className="text-sm text-brand-brown/70 mb-5">Zapisz nasze dane w telefonie lub wydrukuj.</p>

              <div className="space-y-3">
                <a href="/wizytowka.pdf" download className="flex items-center gap-3 w-full bg-brand-gold hover:bg-amber-600 text-white py-3.5 px-5 rounded-xl transition font-medium">
                  <Download className="w-5 h-5" />
                  Pobierz wizytówkę PDF
                </a>
                <a href="/wizytowka.png" download className="flex items-center gap-3 w-full border border-brand-creamDark hover:bg-brand-cream py-3.5 px-5 rounded-xl transition">
                  <Download className="w-5 h-5" />
                  Pobierz wizytówkę PNG
                </a>
                <a href="/jankesowa-pasieka.vcf" download className="flex items-center gap-3 w-full border border-brand-creamDark hover:bg-brand-cream py-3.5 px-5 rounded-xl transition">
                  <Download className="w-5 h-5" />
                  Dodaj do kontaktów (vCard)
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-brand-creamDark overflow-hidden">
              <div className="p-4 border-b border-brand-creamDark">
                <h4 className="font-medium text-brand-brown">Jak do nas dojechać</h4>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2421.5!2d18.45!3d53.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDIxJzAwLjAiTiAxOMKwMjcnMDAuMCJF!5e0!3m2!1spl!2spl!4v1720000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Formularz / potwierdzenie */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="bg-white rounded-3xl border border-brand-creamDark p-8 md:p-10 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden />
                </div>
                <h2 className="font-serif text-3xl text-brand-brown mb-3">
                  Dziękujemy za wiadomość!
                </h2>
                <p className="text-lg text-[#374151] leading-relaxed max-w-md mx-auto">
                  Odpowiemy niezwłocznie, zwykle w ciągu <strong>24 godzin</strong>.
                  Na Twój e-mail wysłaliśmy też potwierdzenie z kopią wiadomości.
                </p>
                <p className="mt-4 text-sm text-brand-brown/70">
                  Kontakt:{" "}
                  <a href="mailto:kontakt@jankesowapasieka.pl" className="text-brand-gold underline">
                    kontakt@jankesowapasieka.pl
                  </a>
                </p>
                <Button
                  type="button"
                  className="mt-8 px-6 py-3"
                  onClick={() => setSubmitted(false)}
                >
                  Napisz kolejną wiadomość
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative bg-white rounded-3xl border border-brand-creamDark p-8 md:p-9 space-y-6">
                {/* Honeypot — ukryte przed użytkownikami */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Strona www</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1.5">Imię i nazwisko *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                      maxLength={120}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="Opcjonalnie"
                      maxLength={40}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1.5">Adres e-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1.5">Wiadomość *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea h-32"
                    placeholder="Napisz czym możemy Ci pomóc..."
                    required
                    maxLength={4000}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
                <p className="text-center text-[10px] text-brand-brown/50">
                  Odpowiadamy zwykle w ciągu 24 godzin. Po wysłaniu dostaniesz potwierdzenie e-mailem.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
