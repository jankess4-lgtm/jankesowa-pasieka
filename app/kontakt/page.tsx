"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Prosimy wypełnić wymagane pola");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Wiadomość wysłana", {
        description: "Dziękujemy! Odpowiemy w ciągu 48 godzin.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSubmitted(false), 4200);
    }, 1100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#F5EDE4]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="max-w-2xl mb-10">
          <div className="uppercase tracking-[3px] text-xs text-brand-gold mb-2">ZAPRASZAMY</div>
          <h1 className="font-serif text-6xl tracking-[-1px] text-brand-brown">Kontakt</h1>
          <p className="mt-3 text-xl text-[#374151]">Chętnie odpowiemy na pytania i pomożemy z zamówieniem.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
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

                <a href="tel:+48514070298" className="flex gap-4 group">
                  <Phone className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition" />
                  <div>
                    <div>+48 514 070 298</div>
                    <div className="text-xs text-brand-brown/60">Poniedziałek – Sobota: 8:00 – 20:00</div>
                  </div>
                </a>

                <a href="mailto:jankesowa.pasieka@gmail.com" className="flex gap-4 group">
                  <Mail className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition" />
                  <div>jankesowa.pasieka@gmail.com</div>
                </a>

                <div className="flex gap-4 pt-2 border-t border-brand-creamDark">
                  <Clock className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div className="text-sm leading-snug">
                    Wizyty w pasiece<br />tylko po wcześniejszym uzgodnieniu telefonicznym lub mailowym
                  </div>
                </div>
              </div>
            </div>

            <div className="px-1 text-xs text-brand-brown/60 leading-relaxed">
              Zamówienia hurtowe i hurtowe dostawy dla sklepów — prosimy o kontakt mailowy lub telefoniczny.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-brand-creamDark p-8 md:p-9 space-y-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-brown mb-1.5">Wiadomość *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Napisz czym możemy Ci pomóc..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-base" 
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? "Wysyłanie..." : submitted ? "Dziękujemy! ✓" : "Wyślij wiadomość"}
              </Button>

              <p className="text-center text-[10px] text-brand-brown/50">Odpowiadamy zwykle w ciągu 1–2 dni roboczych.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
