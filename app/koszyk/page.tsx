"use client";

import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck, Package, Search, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { startStripeCheckout, CheckoutCustomerData } from "@/lib/stripeCheckout";

type DeliveryMethod = "address" | "parcel" | "pickup";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  parcelLocker: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  parcelLocker?: string;
}

interface Paczkomat {
  code: string;
  address: string;
  city: string;
  hours: string;
  distanceKm?: number;
  lat: number;
  lng: number;
}

const STORAGE_KEY = "jankesowa_checkout_form";

// Expanded realistic InPost paczkomats - focused on Kujawy region + major cities
// Includes entries for Świecie, Toruń, Bydgoszcz, Chełmno etc. so local searches work
const SAMPLE_PACZKOMATS: Paczkomat[] = [
  // Warszawa (for completeness, but focus local)
  { code: "WAW123A", address: "ul. Marszałkowska 104/106", city: "Warszawa", hours: "24/7", distanceKm: 240, lat: 52.2297, lng: 21.0122 },
  { code: "WAW456B", address: "ul. Świętokrzyska 30", city: "Warszawa", hours: "24/7", distanceKm: 238, lat: 52.2319, lng: 21.0067 },
  // Kraków
  { code: "KRK789C", address: "ul. Floriańska 15", city: "Kraków", hours: "24/7", distanceKm: 380, lat: 50.0619, lng: 19.9373 },
  { code: "KRK012D", address: "ul. Długa 48", city: "Kraków", hours: "24/7", distanceKm: 382, lat: 50.0640, lng: 19.9390 },
  // Wrocław
  { code: "WRO345E", address: "ul. Rynek 5", city: "Wrocław", hours: "24/7", distanceKm: 290, lat: 51.1079, lng: 17.0385 },
  // Poznań
  { code: "POZ678F", address: "ul. Półwiejska 27", city: "Poznań", hours: "24/7", distanceKm: 150, lat: 52.4064, lng: 16.9252 },
  // Gdańsk
  { code: "GDA901G", address: "ul. Długa 41", city: "Gdańsk", hours: "24/7", distanceKm: 160, lat: 54.3520, lng: 18.6466 },
  // Świecie area (main focus)
  { code: "SWI001", address: "ul. Wojska Polskiego 12", city: "Świecie", hours: "24/7", distanceKm: 8, lat: 53.4090, lng: 18.4470 },
  { code: "SWI002", address: "ul. 1 Maja 5", city: "Świecie", hours: "24/7", distanceKm: 6, lat: 53.4125, lng: 18.4500 },
  { code: "SWI003", address: "ul. Chełmińska 20", city: "Świecie", hours: "06:00-22:00", distanceKm: 7, lat: 53.4080, lng: 18.4400 },
  { code: "SWI004", address: "ul. Bydgoska 8", city: "Świecie", hours: "24/7", distanceKm: 9, lat: 53.4150, lng: 18.4550 },
  { code: "SWI005", address: "ul. Szkolna 3", city: "Świecie", hours: "24/7", distanceKm: 4, lat: 53.4075, lng: 18.4485 },
  { code: "SWI006", address: "ul. Kościuszki 10", city: "Świecie", hours: "24/7", distanceKm: 5, lat: 53.4105, lng: 18.4420 },
  { code: "SWI007", address: "ul. Mickiewicza 2", city: "Świecie", hours: "06:00-22:00", distanceKm: 8, lat: 53.4060, lng: 18.4510 },
  { code: "SWI008", address: "ul. 3 Maja 15", city: "Świecie", hours: "24/7", distanceKm: 7, lat: 53.4110, lng: 18.4380 },
  // Toruń
  { code: "TOR112", address: "ul. Kopernika 15", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0138, lng: 18.5984 },
  { code: "TOR113", address: "ul. Bydgoska 45", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0155, lng: 18.5900 },
  { code: "TOR114", address: "ul. Chełmińska 10", city: "Toruń", hours: "06:00-23:00", distanceKm: 36, lat: 53.0120, lng: 18.6050 },
  { code: "TOR115", address: "ul. Mickiewicza 22", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0145, lng: 18.5950 },
  { code: "TOR116", address: "ul. Żeglarska 8", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0100, lng: 18.6100 },
  { code: "TOR117", address: "ul. Szeroka 12", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0170, lng: 18.5850 },
  { code: "TOR118", address: "ul. Dąbrowskiego 5", city: "Toruń", hours: "06:00-22:00", distanceKm: 33, lat: 53.0090, lng: 18.6000 },
  // Bydgoszcz
  { code: "BYD001", address: "ul. Gdańska 50", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1235, lng: 18.0084 },
  { code: "BYD002", address: "ul. Jagiellońska 15", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1300, lng: 18.0150 },
  { code: "BYD003", address: "ul. Długa 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1200, lng: 18.0000 },
  { code: "BYD004", address: "ul. Pomorska 12", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1250, lng: 17.9950 },
  { code: "BYD005", address: "ul. Gdańska 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1280, lng: 18.0100 },
  { code: "BYD006", address: "ul. Focha 3", city: "Bydgoszcz", hours: "24/7", distanceKm: 41, lat: 53.1180, lng: 18.0050 },
  { code: "BYD007", address: "ul. Nakielska 55", city: "Bydgoszcz", hours: "24/7", distanceKm: 50, lat: 53.1350, lng: 17.9800 },
  { code: "BYD008", address: "ul. Marszałka Focha 10", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1220, lng: 18.0120 },
  // Chełmno
  { code: "CHE001", address: "ul. Rynek 8", city: "Chełmno", hours: "24/7", distanceKm: 18, lat: 53.3480, lng: 18.4250 },
  { code: "CHE002", address: "ul. Toruńska 18", city: "Chełmno", hours: "24/7", distanceKm: 16, lat: 53.3500, lng: 18.4300 },
  { code: "CHE003", address: "ul. Świecka 5", city: "Chełmno", hours: "06:00-22:00", distanceKm: 19, lat: 53.3450, lng: 18.4200 },
  { code: "CHE004", address: "ul. Rynek 25", city: "Chełmno", hours: "24/7", distanceKm: 17, lat: 53.3475, lng: 18.4280 },
  { code: "CHE005", address: "ul. Wodna 2", city: "Chełmno", hours: "24/7", distanceKm: 15, lat: 53.3490, lng: 18.4220 },
  // Grudziądz
  { code: "GRU112", address: "ul. Długa 25", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4840, lng: 18.7530 },
  { code: "GRU113", address: "ul. Chełmińska 42", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4800, lng: 18.7600 },
  { code: "GRU114", address: "ul. Tczewska 10", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4870, lng: 18.7450 },
  { code: "GRU115", address: "ul. Rzeźnicka 5", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4820, lng: 18.7550 },
];

export default function KoszykPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("address");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    postalCode: "",
    city: "",
    parcelLocker: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // InPost parcel locker search state
  const [parcelSearch, setParcelSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Paczkomat[]>([]);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState<Paczkomat | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Shipping cost
  const shippingCost = deliveryMethod === "pickup" ? 0 : (deliveryMethod === "address" ? 16 : 14);
  const productsTotal = totalPrice;
  const grandTotal = productsTotal + shippingCost;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.deliveryMethod) setDeliveryMethod(parsed.deliveryMethod);
        if (parsed.formData) {
          setFormData(parsed.formData);
        }
        // Prefer full selectedPaczkomat object from storage
        if (parsed.selectedPaczkomat) {
          setSelectedPaczkomat(parsed.selectedPaczkomat);
          setParcelSearch(parsed.selectedPaczkomat.code);
        } else if (parsed.deliveryMethod === "parcel" && parsed.formData?.parcelLocker) {
          // Fallback for older saved data
          const found = SAMPLE_PACZKOMATS.find(p => p.code === parsed.formData.parcelLocker);
          if (found) {
            setSelectedPaczkomat(found);
            setParcelSearch(found.code);
          }
        }

        // Ensure suggestions are visible for parcel method after restore (prefer local)
        if (parsed.deliveryMethod === "parcel") {
          const local = SAMPLE_PACZKOMATS.filter(p => ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz"].includes(p.city));
          setSearchResults(local.length > 0 ? local.slice(0, 8) : SAMPLE_PACZKOMATS.slice(0, 8));
        }
      } catch {}
    }
  }, []);

  // Save to localStorage on change (include selected paczkomat for better persistence)
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ deliveryMethod, formData, selectedPaczkomat })
    );
  }, [deliveryMethod, formData, selectedPaczkomat]);

  // Debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(parcelSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [parcelSearch]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Normalize for Polish diacritics (so "swiecie" matches "Świecie")
  const normalize = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Perform search using debounced value - min 3 chars, always results for parcel
  useEffect(() => {
    const q = debouncedSearch.trim();
    if (deliveryMethod !== "parcel") {
      setSearchResults([]);
      return;
    }
    if (q.length >= 3) {
      const nq = normalize(q);
      const results = SAMPLE_PACZKOMATS.filter((p) =>
        normalize(p.code).includes(nq) ||
        normalize(p.city).includes(nq) ||
        normalize(p.address).includes(nq)
      );
      const sorted = [...results].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      setSearchResults(sorted.slice(0, 10));
    } else {
      // show local starters for parcel when < 3 chars
      const local = SAMPLE_PACZKOMATS.filter(p => 
        ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz"].includes(p.city)
      );
      setSearchResults(local.length > 0 ? local.slice(0, 8) : SAMPLE_PACZKOMATS.slice(0, 8));
    }
  }, [debouncedSearch, deliveryMethod]);

  const selectPaczkomat = (paczkomat: Paczkomat) => {
    setSelectedPaczkomat(paczkomat);
    // Auto-fill the parcel locker number with full info
    updateField("parcelLocker", paczkomat.code);

    // Keep search term visible for context, but results stay so user sees the list
    setParcelSearch(`${paczkomat.code}`);

    // Clear error
    if (errors.parcelLocker) {
      setErrors((prev) => ({ ...prev, parcelLocker: undefined }));
    }

    // Optional toast for confirmation
    toast.success(`Wybrano paczkomat ${paczkomat.code}`, {
      description: `${paczkomat.address}, ${paczkomat.city}`,
      duration: 2000,
    });
  };

  const clearSelectedPaczkomat = () => {
    setSelectedPaczkomat(null);
    updateField("parcelLocker", "");
    setParcelSearch("");
    // Show suggestions again so user can pick another easily (prefer local)
    const local = SAMPLE_PACZKOMATS.filter(p => ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz"].includes(p.city));
    setSearchResults(local.length > 0 ? local.slice(0, 8) : SAMPLE_PACZKOMATS.slice(0, 8));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Imię i nazwisko jest wymagane";
    if (!formData.phone.trim()) newErrors.phone = "Numer telefonu jest wymagany";
    if (!formData.email.trim()) {
      newErrors.email = "Adres e-mail jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Podaj poprawny adres e-mail";
    }

    if (deliveryMethod === "address") {
      if (!formData.street.trim()) newErrors.street = "Ulica i numer jest wymagany";
      if (!formData.postalCode.trim()) newErrors.postalCode = "Kod pocztowy jest wymagany";
      else if (!/^\d{2}-\d{3}$/.test(formData.postalCode.trim())) {
        newErrors.postalCode = "Kod pocztowy w formacie XX-XXX";
      }
      if (!formData.city.trim()) newErrors.city = "Miasto jest wymagane";
    } else if (deliveryMethod === "parcel") {
      if (!formData.parcelLocker.trim() && !selectedPaczkomat) {
        newErrors.parcelLocker = "Wybierz paczkomat z wyszukiwarki";
      }
    } else {
      // pickup - no extra validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeliveryChange = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    // Clear address/parcel specific errors when switching
    setErrors((prev) => ({
      ...prev,
      street: undefined,
      postalCode: undefined,
      city: undefined,
      parcelLocker: undefined,
    }));

    if (method === "pickup") {
      clearSelectedPaczkomat();
      setParcelSearch("");
      setSearchResults([]);
    } else if (method === "parcel") {
      // When switching to parcel, show suggestions immediately (prefer local kujawy)
      const local = SAMPLE_PACZKOMATS.filter(p => ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz"].includes(p.city));
      setSearchResults(local.length > 0 ? local.slice(0, 8) : SAMPLE_PACZKOMATS.slice(0, 8));
    } else {
      clearSelectedPaczkomat();
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!validateForm()) {
      toast.error("Uzupełnij wymagane pola", {
        description: "Sprawdź formularz i spróbuj ponownie.",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const customerData: CheckoutCustomerData & { deliveryMethod: DeliveryMethod } = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        deliveryMethod,
        ...(deliveryMethod === "address"
          ? {
              street: formData.street.trim(),
              postalCode: formData.postalCode.trim(),
              city: formData.city.trim(),
            }
          : deliveryMethod === "parcel"
          ? {
              parcelLocker: selectedPaczkomat 
                ? `${selectedPaczkomat.code} - ${selectedPaczkomat.address}, ${selectedPaczkomat.city}` 
                : formData.parcelLocker.trim(),
            }
          : {}),
      };

      await startStripeCheckout(items, customerData);
      // Stripe will redirect
    } catch (err: any) {
      toast.error("Błąd płatności", {
        description: err.message || "Nie udało się rozpocząć płatności.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5EDE4] px-6">
        <div className="text-center max-w-xs">
          <div className="mx-auto w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🪴</span>
          </div>
          <h1 className="font-serif text-3xl text-brand-brown mb-3">Koszyk jest pusty</h1>
          <p className="text-brand-brown/70 mb-8">Dodaj wybrane miody ze strony oferty.</p>
          <Link href="/produkty">
            <Button variant="secondary">Przejdź do oferty</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE4] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/produkty" className="text-sm text-brand-brown/70 hover:text-brand-brown flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Powrót do oferty
          </Link>
        </div>

        <h1 className="font-serif text-5xl text-brand-brown tracking-tight mb-2">Finalizacja zamówienia</h1>
        <p className="text-brand-brown/70 mb-8">Sprawdź koszyk i uzupełnij dane do dostawy</p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Items list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-sm font-medium text-brand-brown/70 mb-3 px-1">Twoje produkty</div>
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-brand-creamDark rounded-2xl p-5 flex gap-5">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-cream flex-shrink-0 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium text-lg leading-tight text-brand-brown">{item.name}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500/70 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center rounded-lg border border-brand-brown/20 text-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 active:bg-brand-cream rounded-l-lg disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={15} />
                      </button>
                      <span className="px-4 tabular-nums font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 active:bg-brand-cream rounded-r-lg disabled:opacity-40"
                        disabled={item.quantity >= item.inStock}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-semibold tabular-nums text-brand-brown">{item.price * item.quantity} zł</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              {/* Delivery method */}
              <div className="bg-white rounded-2xl border border-brand-creamDark p-7">
                <h3 className="font-medium text-xl text-brand-brown mb-5">Metoda dostawy</h3>

                <div className="space-y-3">
                  {/* Address option - premium card */}
                  <label
                    className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      deliveryMethod === "address"
                        ? "border-brand-gold bg-brand-cream/50 shadow-sm"
                        : "border-brand-creamDark hover:border-brand-brown/40 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "address"}
                      onChange={() => handleDeliveryChange("address")}
                      className="mt-1 accent-brand-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${deliveryMethod === "address" ? "bg-brand-gold/10" : "bg-brand-cream"}`}>
                          <Truck className="w-5 h-5 text-brand-brown" />
                        </div>
                        <span className="font-medium text-brand-brown">Dostawa kurierem na adres</span>
                        <span className="ml-auto text-sm font-semibold text-brand-brown tabular-nums">16 zł</span>
                      </div>
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">InPost / DPD • 1–3 dni robocze</p>
                    </div>
                  </label>

                  {/* Parcel locker - premium card */}
                  <label
                    className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      deliveryMethod === "parcel"
                        ? "border-brand-gold bg-brand-cream/50 shadow-sm"
                        : "border-brand-creamDark hover:border-brand-brown/40 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "parcel"}
                      onChange={() => handleDeliveryChange("parcel")}
                      className="mt-1 accent-brand-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${deliveryMethod === "parcel" ? "bg-brand-gold/10" : "bg-brand-cream"}`}>
                          <Package className="w-5 h-5 text-brand-brown" />
                        </div>
                        <span className="font-medium text-brand-brown">Paczkomat InPost</span>
                        <span className="ml-auto text-sm font-semibold text-brand-brown tabular-nums">14 zł</span>
                      </div>
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">Odbiór 24/7 • Najwygodniejsza opcja</p>
                    </div>
                  </label>

                  {/* Personal pickup - free */}
                  <label
                    className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      deliveryMethod === "pickup"
                        ? "border-brand-gold bg-brand-cream/50 shadow-sm"
                        : "border-brand-creamDark hover:border-brand-brown/40 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "pickup"}
                      onChange={() => handleDeliveryChange("pickup")}
                      className="mt-1 accent-brand-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${deliveryMethod === "pickup" ? "bg-brand-gold/10" : "bg-brand-cream"}`}>
                          <Package className="w-5 h-5 text-brand-brown" />
                        </div>
                        <span className="font-medium text-brand-brown">Odbiór osobisty</span>
                        <span className="ml-auto text-sm font-semibold text-brand-brown tabular-nums">0 zł</span>
                      </div>
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">W pasiece Topolno nad Wisłą • uzgodnij termin</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Customer form - animated on method change */}
              <div className="bg-white rounded-2xl border border-brand-creamDark p-7">
                <h3 className="font-medium text-xl text-brand-brown mb-5">Dane do dostawy</h3>

                <motion.div
                  key={deliveryMethod}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Common fields */}
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1.5">Imię i nazwisko *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                      placeholder="Jan Kowalski"
                    />
                    {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-brown mb-1.5">Telefon *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                        placeholder="+48 512 345 678"
                      />
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-brown mb-1.5">E-mail *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                        placeholder="jan@kowalski.pl"
                      />
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Conditional fields */}
                  {deliveryMethod === "address" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-brand-brown mb-1.5">Ulica i nr domu/mieszkania *</label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => updateField("street", e.target.value)}
                          className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                          placeholder="ul. Leśna 12/3"
                        />
                        {errors.street && <p className="text-red-600 text-xs mt-1">{errors.street}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-brand-brown mb-1.5">Kod pocztowy *</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => updateField("postalCode", e.target.value)}
                            className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="62-800"
                          />
                          {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-brand-brown mb-1.5">Miasto *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            className="w-full rounded-xl border border-brand-creamDark bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="Kalisz"
                          />
                          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                        </div>
                      </div>
                    </>
                  ) : deliveryMethod === "parcel" ? (
                    /* InPost Paczkomat Search Widget - professional & functional */
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-brand-brown mb-1.5">
                          Wyszukaj paczkomat InPost *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={parcelSearch}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParcelSearch(val);
                              // Immediate update for responsiveness (>=3 chars)
                              if (val.trim().length >= 3 && deliveryMethod === "parcel") {
                                const nq = normalize(val.trim());
                                const results = SAMPLE_PACZKOMATS.filter((p) =>
                                  normalize(p.code).includes(nq) ||
                                  normalize(p.city).includes(nq) ||
                                  normalize(p.address).includes(nq)
                                );
                                const sorted = [...results].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
                                setSearchResults(sorted.slice(0, 10));
                              }
                            }}
                            onFocus={() => {
                              // Show local starters on focus for parcel
                              const local = SAMPLE_PACZKOMATS.filter(p => 
                                ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz"].includes(p.city)
                              );
                              setSearchResults(local.length > 0 ? local.slice(0, 8) : SAMPLE_PACZKOMATS.slice(0, 8));
                            }}
                            className="w-full rounded-xl border border-brand-creamDark bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="Wpisz min. 3 znaki (np. Świecie, Toruń, Bydgoszcz, Chełmno)"
                          />
                          <Search className="absolute left-3.5 top-3 h-4 w-4 text-brand-brown/50" />
                        </div>
                        <p className="text-xs text-brand-brown/60 mt-1">
                          Wpisz min. 3 znaki (miasto/kod). Pinezki na mapie i lista poniżej — kliknij aby wybrać.
                        </p>
                      </div>

                      {/* Search results */}
                      <AnimatePresence>
                        {searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border border-brand-creamDark rounded-xl overflow-hidden bg-white max-h-48 overflow-y-auto"
                          >
                            {searchResults.map((p, idx) => {
                              const isSelected = selectedPaczkomat?.code === p.code;
                              const dist = p.distanceKm != null ? `${p.distanceKm} km` : '';
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => selectPaczkomat(p)}
                                  className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-brand-creamDark last:border-b-0 transition-all ${
                                    isSelected 
                                      ? "bg-emerald-50 border-emerald-500 border-2" 
                                      : "hover:bg-brand-cream/60"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                    <MapPin className={`h-4 w-4 ${isSelected ? "text-emerald-600" : "text-brand-gold"}`} />
                                    {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-semibold ${isSelected ? "text-emerald-700" : "text-brand-brown"}`}>
                                      {p.code}
                                    </div>
                                    <div className="text-sm text-brand-brown/70">
                                      {p.address}, {p.city}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Selected paczkomat display - prominent green selection */}
                      <AnimatePresence>
                        {selectedPaczkomat && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                  <Check className="h-4 w-4" />
                                  Wybrany paczkomat
                                </div>
                                <div className="font-bold text-xl text-emerald-800 mt-1 tabular-nums">
                                  {selectedPaczkomat.code}
                                </div>
                                <div className="text-sm text-emerald-700 mt-0.5">
                                  {selectedPaczkomat.address}
                                </div>
                                <div className="text-sm text-emerald-600">
                                  {selectedPaczkomat.city}
                                  {selectedPaczkomat.distanceKm != null && ` • ${selectedPaczkomat.distanceKm} km`}
                                </div>
                                <div className="inline-flex items-center mt-2 text-[11px] bg-white px-2 py-0.5 rounded-full text-emerald-600 border border-emerald-200">
                                  Godziny otwarcia: {selectedPaczkomat.hours}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={clearSelectedPaczkomat}
                                className="text-xs text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap"
                              >
                                Zmień wybór
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Enhanced interactive map placeholder (clickable pins, green-beige style) */}
                      <div className="mt-2 rounded-2xl border border-brand-creamDark bg-[#F5EDE4] p-3 shadow-inner">
                        <div 
                          className="h-48 rounded-xl relative overflow-hidden border border-emerald-200"
                          style={{
                            background: 'linear-gradient(135deg, #d1fae5 0%, #a3e635 20%, #fef3c7 50%, #d1fae5 80%, #a3e635 100%)',
                            backgroundSize: 'cover'
                          }}
                        >
                          {/* Subtle map texture / fields */}
                          <div className="absolute inset-0 opacity-30" 
                               style={{
                                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 16px), repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(139,69,19,0.1) 8px, rgba(139,69,19,0.1) 16px)'
                               }} />

                          {/* Fake roads */}
                          <div className="absolute inset-0" style={{
                            background: 'linear-gradient(90deg, transparent 48%, rgba(139,69,19,0.15) 49%, rgba(139,69,19,0.15) 51%, transparent 52%), linear-gradient(0deg, transparent 48%, rgba(139,69,19,0.12) 49%, rgba(139,69,19,0.12) 51%, transparent 52%)'
                          }} />

                          {/* Clickable pins from search results or default local */}
                          {(searchResults.length > 0 ? searchResults : SAMPLE_PACZKOMATS.filter(p => ["Świecie","Toruń","Bydgoszcz","Chełmno","Grudziądz"].includes(p.city)).slice(0,6) ).map((p, i) => {
                            const isSel = selectedPaczkomat?.code === p.code;
                            // Position based on lat/lng if available, else grid
                            let left = 20 + (i * 12) % 60;
                            let top = 25 + ((i * 18) % 50);
                            if (p.lat && p.lng) {
                              // Simple projection relative to local area bounds ~53.0-53.5 , 18.0-18.8
                              const minLat = 53.0, maxLat = 53.5, minLng = 18.0, maxLng = 18.8;
                              left = 10 + ((p.lng - minLng) / (maxLng - minLng)) * 80;
                              top = 15 + ((maxLat - p.lat) / (maxLat - minLat)) * 70;
                            }
                            return (
                              <button
                                key={i}
                                onClick={() => selectPaczkomat(p)}
                                className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group transition-all ${isSel ? 'z-20 scale-110' : 'z-10 hover:scale-105'}`}
                                style={{ left: `${Math.max(5, Math.min(95, left))}%`, top: `${Math.max(5, Math.min(95, top))}%` }}
                                title={`Wybierz ${p.code} - ${p.address}`}
                              >
                                <div className={`relative ${isSel ? 'animate-bounce' : ''}`}>
                                  <MapPin 
                                    className={`h-6 w-6 drop-shadow-md transition-colors ${isSel ? 'text-emerald-700' : 'text-brand-brown group-hover:text-brand-gold'}`} 
                                  />
                                  {isSel && (
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 border border-emerald-500">
                                      <Check className="h-2.5 w-2.5 text-emerald-700" />
                                    </div>
                                  )}
                                </div>
                                <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium shadow-sm whitespace-nowrap transition-all ${isSel ? 'bg-emerald-700 text-white' : 'bg-white/90 text-brand-brown group-hover:bg-brand-cream'}`}>
                                  {p.code}
                                </div>
                              </button>
                            );
                          })}

                          {/* Center info / zoom simulation */}
                          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-brand-brown font-medium shadow flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {searchResults.length > 0 ? `${searchResults.length} paczkomatów` : 'Kujawy'}
                          </div>

                          {/* Fake zoom controls */}
                          <div className="absolute bottom-2 right-2 flex flex-col bg-white/80 backdrop-blur rounded shadow text-brand-brown text-xs">
                            <button onClick={() => { /* visual only */ }} className="px-1.5 hover:bg-brand-cream active:bg-brand-cream/70 border-b border-white/50 rounded-t">+</button>
                            <button onClick={() => { /* visual only */ }} className="px-1.5 hover:bg-brand-cream active:bg-brand-cream/70 rounded-b">-</button>
                          </div>

                          {/* Selected info overlay */}
                          {selectedPaczkomat && (
                            <div className="absolute top-2 right-2 bg-emerald-700/90 text-white text-[9px] px-2 py-0.5 rounded shadow">
                              Wybrano: {selectedPaczkomat.code}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-brand-brown/60 mt-1.5 text-center flex items-center justify-center gap-1">
                          {searchResults.length > 0 
                            ? `Kliknij pinezkę na mapie lub w liście aby wybrać paczkomat` 
                            : "Wpisz min. 3 znaki (miasto np. Świecie) — pinezki pojawią się tutaj"}
                          <span className="text-[8px] opacity-50">(styl OpenStreetMap)</span>
                        </p>
                      </div>

                      {errors.parcelLocker && (
                        <p className="text-red-600 text-xs mt-1">{errors.parcelLocker}</p>
                      )}

                      {/* Hidden input for parcelLocker value (used in form) */}
                      <input type="hidden" value={formData.parcelLocker} />
                    </div>
                  ) : (
                    /* Pickup info */
                    <div className="p-4 bg-brand-cream/40 rounded-xl text-sm text-brand-brown/80">
                      Odbiór osobisty w pasiece w Topolnie nad Wisłą (gm. Pruszcz, pow. świecki).<br />
                      Po złożeniu zamówienia skontaktujemy się w celu ustalenia terminu odbioru.
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Live summary */}
              <div className="bg-white rounded-2xl border border-brand-creamDark p-7">
                <h3 className="font-medium text-xl text-brand-brown mb-5">Podsumowanie</h3>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between">
                    <span className="text-brand-brown/70">Wartość produktów</span>
                    <span className="tabular-nums font-medium">{productsTotal} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-brown/70">
                      Koszt wysyłki {deliveryMethod === "address" ? "(kurier)" : deliveryMethod === "parcel" ? "(paczkomat)" : "(odbiór osobisty)"}
                    </span>
                    <span className="tabular-nums font-medium">{shippingCost} zł</span>
                  </div>
                </div>

                <div className="border-t border-brand-creamDark pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg text-brand-brown">Razem do zapłaty</span>
                    <span className="text-4xl font-semibold tabular-nums text-brand-brown">
                      {grandTotal} <span className="text-xl font-normal">zł</span>
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 py-3.5 text-base gap-2"
                  disabled={isCheckingOut}
                >
                  <CreditCard className="w-4 h-4" />
                  {isCheckingOut ? "Przekierowanie do płatności..." : "Przejdź do płatności"}
                </Button>

                <div className="mt-4 text-center text-[10px] leading-snug text-brand-brown/60">
                  Bezpieczna płatność kartą, BLIK lub Przelewy24
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={clearCart} className="text-xs text-red-600/70 hover:text-red-600">
            Wyczyść koszyk
          </button>
        </div>
      </div>
    </div>
  );
}
