"use client";

import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck, Package, Search, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { startStripeCheckout, CheckoutCustomerData } from "@/lib/stripeCheckout";

type DeliveryMethod = "address" | "parcel";

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
}

const STORAGE_KEY = "jankesowa_checkout_form";

// Expanded realistic InPost paczkomats (12+ for good search results)
const SAMPLE_PACZKOMATS: Paczkomat[] = [
  { code: "WAW123A", address: "ul. Marszałkowska 104/106", city: "Warszawa", hours: "24/7" },
  { code: "WAW456B", address: "ul. Świętokrzyska 30", city: "Warszawa", hours: "24/7" },
  { code: "WAW789C", address: "ul. Aleje Jerozolimskie 65", city: "Warszawa", hours: "06:00-22:00" },
  { code: "KRK789C", address: "ul. Floriańska 15", city: "Kraków", hours: "24/7" },
  { code: "KRK012D", address: "ul. Długa 48", city: "Kraków", hours: "24/7" },
  { code: "KRK345E", address: "ul. Podwale 3", city: "Kraków", hours: "06:00-23:00" },
  { code: "WRO345E", address: "ul. Rynek 5", city: "Wrocław", hours: "24/7" },
  { code: "WRO678F", address: "ul. Świdnicka 22", city: "Wrocław", hours: "24/7" },
  { code: "POZ678F", address: "ul. Półwiejska 27", city: "Poznań", hours: "24/7" },
  { code: "POZ901G", address: "ul. Święty Marcin 68", city: "Poznań", hours: "06:00-22:00" },
  { code: "GDA901G", address: "ul. Długa 41", city: "Gdańsk", hours: "24/7" },
  { code: "GDA234H", address: "ul. Grunwaldzka 98", city: "Gdańsk", hours: "24/7" },
  { code: "LUB234H", address: "ul. Krakowskie Przedmieście 15", city: "Lublin", hours: "24/7" },
  { code: "KAT567I", address: "ul. 3 Maja 12", city: "Katowice", hours: "24/7" },
  { code: "BIA890J", address: "ul. Sienkiewicza 7", city: "Białystok", hours: "06:00-22:00" },
  { code: "LOD112K", address: "ul. Piotrkowska 45", city: "Łódź", hours: "24/7" },
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
  const shippingCost = deliveryMethod === "address" ? 16 : 14;
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

        // Ensure suggestions are visible for parcel method after restore
        if (parsed.deliveryMethod === "parcel") {
          setSearchResults(SAMPLE_PACZKOMATS.slice(0, 8));
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

  // Perform search using debounced value - always show good number of realistic results
  useEffect(() => {
    const q = debouncedSearch.trim().toLowerCase();
    let results: Paczkomat[];
    if (q) {
      results = SAMPLE_PACZKOMATS.filter((p) =>
        p.code.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    } else {
      // Show popular suggestions when no search term (intuitive for users)
      results = SAMPLE_PACZKOMATS.slice(0, 8);
    }
    setSearchResults(results.slice(0, 10)); // ensure min 8-10 visible
  }, [debouncedSearch]);

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
    // Show suggestions again so user can pick another easily
    setSearchResults(SAMPLE_PACZKOMATS.slice(0, 8));
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
    } else {
      if (!formData.parcelLocker.trim() && !selectedPaczkomat) {
        newErrors.parcelLocker = "Wybierz paczkomat z wyszukiwarki";
      }
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

    // Reset parcel search state when leaving parcel method
    if (method !== "parcel") {
      clearSelectedPaczkomat();
    } else {
      // When switching to parcel, show suggestions immediately
      setSearchResults(SAMPLE_PACZKOMATS.slice(0, 8));
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
          : {
              parcelLocker: selectedPaczkomat 
                ? `${selectedPaczkomat.code} - ${selectedPaczkomat.address}, ${selectedPaczkomat.city}` 
                : formData.parcelLocker.trim(),
            }),
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
                  ) : (
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
                              setParcelSearch(e.target.value);
                            }}
                            onFocus={() => {
                              // Show suggestions immediately on focus if no query
                              if (!debouncedSearch) {
                                setSearchResults(SAMPLE_PACZKOMATS.slice(0, 8));
                              }
                            }}
                            className="w-full rounded-xl border border-brand-creamDark bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="Wpisz miasto lub kod (np. Warszawa lub WAW)"
                          />
                          <Search className="absolute left-3.5 top-3 h-4 w-4 text-brand-brown/50" />
                        </div>
                        <p className="text-xs text-brand-brown/60 mt-1">
                          Wpisz miasto lub kod paczkomatu. Wybierz z listy poniżej.
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
                                    <div className="text-[11px] text-brand-brown/50 mt-0.5">
                                      Godziny: {p.hours}
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

                      {/* Interactive map placeholder (professional demo with pins) */}
                      <div className="mt-2 rounded-xl border border-brand-creamDark bg-[#E8F5E9] p-3 overflow-hidden">
                        <div className="h-24 rounded-lg relative overflow-hidden bg-[linear-gradient(135deg,#a5d6a7_0%,#81c784_25%,#a5d6a7_50%,#66bb6a_75%,#a5d6a7_100%)] border border-emerald-200">
                          {/* Fake map grid / roads */}
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_12px,rgba(255,255,255,0.25)_12px,rgba(255,255,255,0.25)_14px)]" />
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(255,255,255,0.2)_12px,rgba(255,255,255,0.2)_14px)]" />

                          {/* Location pins */}
                          {SAMPLE_PACZKOMATS.slice(0, 5).map((p, i) => {
                            const isThisSelected = selectedPaczkomat?.code === p.code;
                            return (
                              <div
                                key={i}
                                className={`absolute flex items-center justify-center transition-all ${isThisSelected ? 'z-10 scale-125' : 'opacity-70'}`}
                                style={{
                                  left: `${20 + (i % 3) * 25}%`,
                                  top: `${25 + Math.floor(i / 3) * 35}%`,
                                }}
                              >
                                <MapPin 
                                  className={`h-4 w-4 drop-shadow ${isThisSelected ? 'text-emerald-700' : 'text-emerald-600'}`} 
                                />
                                {isThisSelected && (
                                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-[9px] px-1.5 py-0 rounded shadow text-emerald-700 font-medium whitespace-nowrap">
                                    {selectedPaczkomat?.code}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Center label */}
                          <div className="absolute bottom-1 right-2 bg-white/80 text-[9px] px-1.5 py-px rounded text-emerald-700 font-medium">
                            {selectedPaczkomat ? selectedPaczkomat.city : "Polska"}
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-700/70 mt-1.5 text-center">
                          {selectedPaczkomat 
                            ? `Paczkomat ${selectedPaczkomat.code} zaznaczony na mapie` 
                            : "Wybierz paczkomat powyżej, aby zobaczyć jego lokalizację"}
                        </p>
                      </div>

                      {errors.parcelLocker && (
                        <p className="text-red-600 text-xs mt-1">{errors.parcelLocker}</p>
                      )}

                      {/* Hidden input for parcelLocker value (used in form) */}
                      <input type="hidden" value={formData.parcelLocker} />
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
                      Koszt wysyłki {deliveryMethod === "address" ? "(kurier)" : "(paczkomat)"}
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
