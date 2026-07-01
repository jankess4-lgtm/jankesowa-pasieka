"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  Package,
  User,
  CreditCard,
  Plus,
  Minus,
  X,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/useCart";
import { startStripeCheckout } from "@/lib/stripeCheckout";
import { loadPaczkomaty, normalizeText, Paczkomat } from "@/lib/paczkomaty";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  deliveryMethod: "address" | "parcel" | "pickup";
  street?: string;
  postalCode?: string;
  city?: string;
  parcelLocker?: string;
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

const STORAGE_KEY = "jankesowa_checkout_form";
const SEARCH_DEBOUNCE_MS = 200;
const SEARCH_RESULTS_LIMIT = 80;

const COPY = {
  paczkomatFallback:
    "Nie znalazłeś swojego paczkomatu? Napisz do nas po zamówieniu – wyślemy na dowolny paczkomat w Polsce.",
  parcelManualHint: "Możesz wpisać dowolny kod paczkomatu – nie musi być na liście.",
  emptyPaczkomatList: "Brak paczkomatów na liście. Wpisz kod ręcznie poniżej.",
  loadingPaczkomaty: "Ładowanie bazy paczkomatów...",
  loadingPaczkomatyList: "Wczytywanie listy paczkomatów...",
  contactRequiredHint:
    "Uzupełnij dane kontaktowe i wybierz sposób dostawy, aby przejść do płatności.",
  pickupHint:
    "Wybierz odbiór osobisty i przejdź do płatności – dane kontaktowe nie są wymagane.",
} as const;

function getNoSearchResultsMessage(term: string): string {
  return `Brak wyników dla: ${term}. Wpisz kod paczkomatu ręcznie poniżej.`;
}

function getSearchResultsHint(
  hasQuery: boolean,
  resultCount: number,
  totalCount: number
): string {
  if (hasQuery) {
    const suffix = resultCount === SEARCH_RESULTS_LIMIT ? "+" : "";
    return `Znaleziono: ${resultCount}${suffix} wyników`;
  }
  return `Pokazujemy pierwsze ${SEARCH_RESULTS_LIMIT} z ${totalCount} paczkomatów – wpisz miasto lub kod, aby zawęzić`;
}

function getLockerCode(locker: Paczkomat): string {
  return locker.name || locker.id;
}

function getLockerCity(locker: Paczkomat): string {
  return locker.address_details?.city || "";
}

function getLockerAddress(locker: Paczkomat): string {
  if (locker.address?.line1) return locker.address.line1;
  if (locker.address_details?.street) return locker.address_details.street;
  return "";
}

function getLockerHours(locker: Paczkomat): string {
  return locker.opening_hours || "24/7";
}

function getLockerSearchBlob(locker: Paczkomat): string {
  return [
    locker.id,
    locker.name,
    locker.display_name,
    locker.address?.line1,
    locker.address?.line2,
    locker.address_details?.city,
    locker.address_details?.street,
    locker.address_details?.post_code,
  ]
    .filter(Boolean)
    .join(" ");
}

function filterPaczkomaty(list: Paczkomat[], search: string): Paczkomat[] {
  const queryParts = normalizeText(search).trim().split(/\s+/).filter(Boolean);
  if (queryParts.length === 0) return list.slice(0, SEARCH_RESULTS_LIMIT);

  return list
    .filter((locker) => {
      const blob = normalizeText(getLockerSearchBlob(locker));
      return queryParts.every((part) => blob.includes(part));
    })
    .slice(0, SEARCH_RESULTS_LIMIT);
}

function needsContactValidation(method: FormData["deliveryMethod"]): boolean {
  return method === "parcel" || method === "address";
}

function validateContactFields(customer: FormData, errors: FormErrors): void {
  if (!needsContactValidation(customer.deliveryMethod)) return;

  if (!customer.fullName.trim()) {
    errors.fullName = "Imię i nazwisko jest wymagane";
  } else if (customer.fullName.trim().length < 3) {
    errors.fullName = "Podaj pełne imię i nazwisko";
  }

  if (!customer.phone.trim()) {
    errors.phone = "Telefon jest wymagany";
  } else if (customer.phone.replace(/\D/g, "").length < 9) {
    errors.phone = "Podaj poprawny numer telefonu (min. 9 cyfr)";
  }

  if (!customer.email.trim()) {
    errors.email = "Email jest wymagany";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    errors.email = "Podaj poprawny adres email";
  }
}

function validateAddressFields(customer: FormData, errors: FormErrors): void {
  if (customer.deliveryMethod !== "address") return;

  if (!customer.street?.trim()) {
    errors.street = "Ulica i numer są wymagane";
  }
  if (!customer.postalCode?.trim()) {
    errors.postalCode = "Kod pocztowy jest wymagany";
  } else if (!/^\d{2}-\d{3}$/.test(customer.postalCode.trim())) {
    errors.postalCode = "Kod pocztowy w formacie XX-XXX";
  }
  if (!customer.city?.trim()) {
    errors.city = "Miasto jest wymagane";
  }
}

function validateParcelFields(customer: FormData, errors: FormErrors): void {
  if (customer.deliveryMethod !== "parcel") return;

  const locker = customer.parcelLocker?.trim() || "";
  if (!locker) {
    errors.parcelLocker = "Wybierz paczkomat z listy lub wpisz kod ręcznie";
  } else if (locker.length < 3) {
    errors.parcelLocker = "Kod paczkomatu jest za krótki";
  }
}

function getShippingCost(method: FormData["deliveryMethod"]): number {
  if (method === "address") return 16;
  if (method === "parcel") return 14;
  return 0;
}

function inputClass(hasError?: boolean): string {
  return `w-full px-4 py-3 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/30 ${
    hasError ? "border-red-400 bg-red-50/50" : "border-gray-300 bg-white"
  }`;
}

export default function KoszykPage() {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [customer, setCustomer] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    deliveryMethod: "parcel",
    street: "",
    postalCode: "",
    city: "",
    parcelLocker: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<Paczkomat | null>(null);
  const [paczkomatyList, setPaczkomatyList] = useState<Paczkomat[]>([]);
  const [paczkomatyLoading, setPaczkomatyLoading] = useState(true);
  const [paczkomatyError, setPaczkomatyError] = useState<string | null>(null);

  const fetchPaczkomaty = useCallback(() => {
    setPaczkomatyLoading(true);
    setPaczkomatyError(null);

    loadPaczkomaty()
      .then((loadedItems) => {
        setPaczkomatyList(loadedItems);
        if (loadedItems.length === 0) {
          setPaczkomatyError(
            "Nie udało się wczytać listy paczkomatów. Możesz wpisać kod ręcznie poniżej."
          );
        }
      })
      .catch(() => {
        setPaczkomatyList([]);
        setPaczkomatyError(
          "Błąd ładowania bazy paczkomatów. Możesz wpisać kod ręcznie poniżej."
        );
      })
      .finally(() => {
        setPaczkomatyLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPaczkomaty();
  }, [fetchPaczkomaty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomer(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
  }, [customer]);

  const requiresContact = needsContactValidation(customer.deliveryMethod);
  const shippingCost = getShippingCost(customer.deliveryMethod);
  const grandTotal = totalPrice + shippingCost;

  const filteredPaczkomaty = useMemo(
    () => filterPaczkomaty(paczkomatyList, debouncedSearch),
    [paczkomatyList, debouncedSearch]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDeliveryChange = (method: FormData["deliveryMethod"]) => {
    setCustomer((prev) => ({ ...prev, deliveryMethod: method }));
    setErrors((prev) => ({
      ...prev,
      fullName: undefined,
      phone: undefined,
      email: undefined,
      street: undefined,
      postalCode: undefined,
      city: undefined,
      parcelLocker: undefined,
    }));
  };

  const handleSelectLocker = (locker: Paczkomat) => {
    setSelectedLocker(locker);
    const code = getLockerCode(locker);
    const address = getLockerAddress(locker);
    const city = getLockerCity(locker);
    setCustomer((prev) => ({
      ...prev,
      parcelLocker: `${code} – ${address}, ${city}`,
    }));
    setErrors((prev) => ({ ...prev, parcelLocker: undefined }));
  };

  const handleParcelLockerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedLocker(null);
    setCustomer((prev) => ({ ...prev, parcelLocker: value }));
    if (errors.parcelLocker) {
      setErrors((prev) => ({ ...prev, parcelLocker: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    validateContactFields(customer, newErrors);
    validateAddressFields(customer, newErrors);
    validateParcelFields(customer, newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Proszę uzupełnić wymagane pola");
      return;
    }

    setIsSubmitting(true);

    try {
      const isPickup = customer.deliveryMethod === "pickup";
      await startStripeCheckout(items, {
        ...customer,
        fullName: isPickup ? "" : customer.fullName.trim(),
        phone: isPickup ? "" : customer.phone.trim(),
        email: isPickup ? "" : customer.email.trim(),
        parcelLocker: customer.parcelLocker?.trim(),
        street: customer.street?.trim(),
        postalCode: customer.postalCode?.trim(),
        city: customer.city?.trim(),
      });
      toast.success("Przekierowanie do płatności...");
    } catch {
      toast.error("Błąd podczas inicjowania płatności");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif text-brand-brown mb-4">Twój koszyk jest pusty</h2>
          <p className="text-brand-brown/70 mb-8">
            Dodaj produkty z oferty, aby przejść do finalizacji zamówienia.
          </p>
          <Button onClick={() => (window.location.href = "/produkty")}>Przejdź do oferty</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE4] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link
            href="/produkty"
            className="text-sm text-brand-gold hover:underline mb-3 inline-block"
          >
            ← Wróć do oferty
          </Link>
          <h1 className="text-4xl font-serif text-brand-brown">Koszyk i dostawa</h1>
          <p className="text-brand-brown/70 mt-2">
            {requiresContact ? COPY.contactRequiredHint : COPY.pickupHint}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-medium text-brand-brown mb-6">Sposób dostawy</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { id: "parcel" as const, label: "Paczkomat", icon: Package, cost: "14 zł" },
                  { id: "address" as const, label: "Kurier", icon: Truck, cost: "16 zł" },
                  { id: "pickup" as const, label: "Odbiór osobisty", icon: User, cost: "0 zł" },
                ].map(({ id, label, icon: Icon, cost }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleDeliveryChange(id)}
                    className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                      customer.deliveryMethod === id
                        ? "border-brand-gold bg-brand-gold/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-7 h-7 text-brand-brown" />
                    <span className="font-medium text-brand-brown">{label}</span>
                    <span className="text-xs text-brand-brown/60">{cost}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {customer.deliveryMethod === "parcel" && (
                  <motion.div
                    key="parcel"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-medium text-brand-brown mb-3">Wybierz paczkomat InPost</h3>
                    <p className="text-sm text-brand-brown/70 mb-4">
                      Wyszukaj po mieście, adresie lub kodzie paczkomatu.
                    </p>

                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/40" />
                      <input
                        type="text"
                        placeholder="Np. Toruń, Bydgoszcz, TOR01M, ul. Mickiewicza..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                      />
                    </div>

                    <p className="text-xs text-brand-brown/50 mb-2">
                      {paczkomatyLoading
                        ? COPY.loadingPaczkomaty
                        : getSearchResultsHint(
                            !!debouncedSearch.trim(),
                            filteredPaczkomaty.length,
                            paczkomatyList.length
                          )}
                    </p>

                    {paczkomatyError && !paczkomatyLoading && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span>{paczkomatyError}</span>
                        <button
                          type="button"
                          onClick={fetchPaczkomaty}
                          className="text-xs font-medium text-brand-gold hover:underline whitespace-nowrap"
                        >
                          Spróbuj ponownie
                        </button>
                      </div>
                    )}

                    <div className="max-h-80 overflow-auto border border-brand-creamDark rounded-xl mb-4 bg-white">
                      {paczkomatyLoading ? (
                        <div className="px-4 py-8 text-center text-sm text-brand-brown/60">
                          {COPY.loadingPaczkomatyList}
                        </div>
                      ) : filteredPaczkomaty.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-brand-brown/60">
                          {debouncedSearch.trim()
                            ? getNoSearchResultsMessage(debouncedSearch)
                            : COPY.emptyPaczkomatList}
                        </div>
                      ) : (
                        filteredPaczkomaty.map((locker, index) => {
                          const code = getLockerCode(locker);
                          const address = getLockerAddress(locker);
                          const city = getLockerCity(locker);
                          const isSelected =
                            selectedLocker !== null &&
                            getLockerCode(selectedLocker) === code &&
                            getLockerCity(selectedLocker) === city &&
                            getLockerAddress(selectedLocker) === address;

                          return (
                            <button
                              key={`${code}-${city}-${index}`}
                              type="button"
                              onClick={() => handleSelectLocker(locker)}
                              className={`w-full text-left px-4 py-3 border-b border-brand-creamDark last:border-b-0 hover:bg-brand-cream/60 transition-colors flex justify-between items-start gap-3 ${
                                isSelected ? "bg-brand-gold/10 border-l-4 border-l-brand-gold" : ""
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="font-mono text-sm font-semibold text-brand-brown">
                                  {code}
                                </div>
                                <div className="text-sm text-brand-brown/80">{address}</div>
                                <div className="text-xs text-brand-brown/50 mt-0.5">{city}</div>
                              </div>
                              <div className="text-xs text-brand-brown/50 whitespace-nowrap flex-shrink-0">
                                {getLockerHours(locker)}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="parcelLocker"
                        className="block text-sm font-medium text-brand-brown mb-2"
                      >
                        Lub wpisz kod paczkomatu ręcznie <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parcelLocker"
                        type="text"
                        name="parcelLocker"
                        value={customer.parcelLocker || ""}
                        onChange={handleParcelLockerChange}
                        placeholder="Np. TOR01M, BYD01M lub kod z aplikacji InPost"
                        className={inputClass(!!errors.parcelLocker)}
                      />
                      {errors.parcelLocker && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.parcelLocker}</p>
                      )}
                      <p className="text-xs text-brand-brown/60 mt-2">{COPY.parcelManualHint}</p>
                    </div>

                    <div className="mt-5 p-4 bg-brand-cream/80 border border-brand-creamDark rounded-xl text-sm text-brand-brown/80 leading-relaxed">
                      {COPY.paczkomatFallback}
                    </div>
                  </motion.div>
                )}

                {customer.deliveryMethod === "address" && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-brand-brown mb-1">Adres dostawy kurierem</h3>
                    <p className="text-sm text-brand-brown/70 mb-4">
                      Podaj pełny adres, na który dostarczymy zamówienie.
                    </p>

                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-brand-brown mb-2"
                      >
                        Ulica i numer <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        value={customer.street || ""}
                        onChange={handleChange}
                        placeholder="ul. Przykładowa 12/3"
                        className={inputClass(!!errors.street)}
                        autoComplete="street-address"
                      />
                      {errors.street && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.street}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-brand-brown mb-2"
                        >
                          Kod pocztowy <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          name="postalCode"
                          value={customer.postalCode || ""}
                          onChange={handleChange}
                          placeholder="87-100"
                          className={inputClass(!!errors.postalCode)}
                          autoComplete="postal-code"
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.postalCode}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-brand-brown mb-2"
                        >
                          Miasto <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={customer.city || ""}
                          onChange={handleChange}
                          placeholder="Toruń"
                          className={inputClass(!!errors.city)}
                          autoComplete="address-level2"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {customer.deliveryMethod === "pickup" && (
                  <motion.div
                    key="pickup"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-brand-cream/60 border border-brand-creamDark rounded-2xl p-6 space-y-5">
                      <h3 className="font-medium text-lg text-brand-brown">Odbiór w pasiece</h3>

                      <div className="flex gap-4">
                        <MapPin className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-brand-brown">Jankesowa Pasieka</div>
                          <div className="text-brand-brown/80">Topolno 45</div>
                          <div className="text-brand-brown/70">86-120 Pruszcz</div>
                          <div className="text-brand-brown/70">Kujawy nadwiślańskie</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Clock className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-brand-brown">Godziny odbioru</div>
                          <div className="text-brand-brown/80">Poniedziałek – Sobota: 8:00 – 20:00</div>
                          <div className="text-sm text-brand-brown/60 mt-1">
                            Wizyta w pasiece tylko po wcześniejszym uzgodnieniu terminu.
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Phone className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                        <a
                          href="tel:+48514070298"
                          className="text-brand-brown hover:text-brand-gold transition-colors"
                        >
                          +48 514 070 298
                        </a>
                      </div>

                      <div className="flex gap-4">
                        <Mail className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
                        <a
                          href="mailto:jankesowa.pasieka@gmail.com"
                          className="text-brand-brown hover:text-brand-gold transition-colors"
                        >
                          jankesowa.pasieka@gmail.com
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {requiresContact && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-medium text-brand-brown mb-6">Dane kontaktowe</h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-brand-brown mb-2"
                      >
                        Imię i nazwisko <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={customer.fullName}
                        onChange={handleChange}
                        placeholder="Jan Kowalski"
                        className={inputClass(!!errors.fullName)}
                        autoComplete="name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-brand-brown mb-2"
                        >
                          Telefon <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={customer.phone}
                          onChange={handleChange}
                          placeholder="+48 500 000 000"
                          className={inputClass(!!errors.phone)}
                          autoComplete="tel"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-brand-brown mb-2"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={customer.email}
                          onChange={handleChange}
                          placeholder="jan@example.com"
                          className={inputClass(!!errors.email)}
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-6">
              <h2 className="text-2xl font-medium text-brand-brown mb-6">Podsumowanie</h2>

              <div className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-brand-creamDark last:border-b-0 last:pb-0"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-brand-brown text-sm leading-tight">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-brown/40 hover:text-red-600 transition p-0.5 flex-shrink-0"
                          aria-label="Usuń produkt"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-brand-brown/20 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-brand-brown hover:bg-brand-cream rounded-l-md transition"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-brand-brown hover:bg-brand-cream rounded-r-md transition"
                            disabled={item.quantity >= item.inStock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-semibold text-brand-brown tabular-nums text-sm">
                          {item.price * item.quantity} zł
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-brand-creamDark pt-5">
                <div className="flex justify-between text-brand-brown/70">
                  <span>Wartość produktów</span>
                  <span className="tabular-nums">{totalPrice} zł</span>
                </div>
                <div className="flex justify-between text-brand-brown/70">
                  <span>
                    Dostawa (
                    {customer.deliveryMethod === "parcel"
                      ? "paczkomat"
                      : customer.deliveryMethod === "address"
                        ? "kurier"
                        : "odbiór"}
                    )
                  </span>
                  <span className="tabular-nums">
                    {shippingCost === 0 ? "0 zł" : `${shippingCost} zł`}
                  </span>
                </div>
                <div className="h-px bg-brand-creamDark my-2" />
                <div className="flex justify-between text-lg font-semibold text-brand-brown">
                  <span>Do zapłaty</span>
                  <span className="tabular-nums">{grandTotal} zł</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full py-3.5 text-base gap-2 mt-6"
                disabled={isSubmitting}
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? "Przekierowanie do płatności..." : `Zapłać ${grandTotal} zł`}
              </Button>

              <p className="text-[10px] text-center text-brand-brown/50 leading-snug mt-4">
                Bezpieczna płatność online kartą, BLIK lub Przelewy24.
                <br />
                Po opłaceniu skontaktujemy się w sprawie dostawy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}