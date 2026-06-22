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

// Expanded realistic InPost paczkomats (50+ entries) - focused on województwo kujawsko-pomorskie
// Especially detailed for Świecie (Biedronka at Wojska Polskiego 12, Lidl at 76 and many more), Toruń, Bydgoszcz, Chełmno, Grudziądz etc.
const SAMPLE_PACZKOMATS: Paczkomat[] = [
  // Warszawa (for completeness)
  { code: "WAW123A", address: "ul. Marszałkowska 104/106", city: "Warszawa", hours: "24/7", distanceKm: 240, lat: 52.2297, lng: 21.0122 },
  { code: "WAW456B", address: "ul. Świętokrzyska 30", city: "Warszawa", hours: "24/7", distanceKm: 238, lat: 52.2319, lng: 21.0067 },
  { code: "WAW789C", address: "ul. Aleje Jerozolimskie 65", city: "Warszawa", hours: "24/7", distanceKm: 245, lat: 52.2285, lng: 21.0020 },
  // Kraków
  { code: "KRK789C", address: "ul. Floriańska 15", city: "Kraków", hours: "24/7", distanceKm: 380, lat: 50.0619, lng: 19.9373 },
  { code: "KRK012D", address: "ul. Długa 48", city: "Kraków", hours: "24/7", distanceKm: 382, lat: 50.0640, lng: 19.9390 },
  // Wrocław
  { code: "WRO345E", address: "ul. Rynek 5", city: "Wrocław", hours: "24/7", distanceKm: 290, lat: 51.1079, lng: 17.0385 },
  // Poznań
  { code: "POZ678F", address: "ul. Półwiejska 27", city: "Poznań", hours: "24/7", distanceKm: 150, lat: 52.4064, lng: 16.9252 },
  // Gdańsk
  { code: "GDA901G", address: "ul. Długa 41", city: "Gdańsk", hours: "24/7", distanceKm: 160, lat: 54.3520, lng: 18.6466 },
  // ŚWIECIE - realistic paczkomats (Biedronka ul. Wojska Polskiego 12, Lidl 76, Kaufland, Rynek, Dworcowa PKP, osiedla itd.)
  { code: "SWI001", address: "ul. Wojska Polskiego 12 (Biedronka)", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4128, lng: 18.4525 },
  { code: "SWI002", address: "ul. Wojska Polskiego 76 (Lidl)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4123, lng: 18.4521 },
  { code: "SWI017", address: "ul. Chełmińska 120 (żabka)", city: "Świecie", hours: "24/7", distanceKm: 5, lat: 53.4082, lng: 18.4350 },
  { code: "SWI003", address: "ul. Chełmińska 45 (Kaufland)", city: "Świecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4105, lng: 18.4480 },
  { code: "SWI004", address: "ul. Rynek 5 (centrum)", city: "Świecie", hours: "24/7", distanceKm: 1, lat: 53.4098, lng: 18.4472 },
  { code: "SWI005", address: "ul. Bydgoska 25", city: "Świecie", hours: "24/7", distanceKm: 5, lat: 53.4145, lng: 18.4530 },
  { code: "SWI006", address: "ul. 1 Maja 8", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4102, lng: 18.4495 },
  { code: "SWI007", address: "ul. Szkolna 12", city: "Świecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4085, lng: 18.4465 },
  { code: "SWI008", address: "ul. Kościuszki 22", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4110, lng: 18.4508 },
  { code: "SWI009", address: "ul. Mickiewicza 4", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4092, lng: 18.4458 },
  { code: "SWI010", address: "ul. 3 Maja 28", city: "Świecie", hours: "24/7", distanceKm: 1, lat: 53.4100, lng: 18.4478 },
  { code: "SWI011", address: "ul. Wojska Polskiego 150", city: "Świecie", hours: "24/7", distanceKm: 6, lat: 53.4140, lng: 18.4555 },
  { code: "SWI012", address: "ul. Chełmińska 80", city: "Świecie", hours: "06:00-22:00", distanceKm: 5, lat: 53.4088, lng: 18.4425 },
  { code: "SWI013", address: "ul. Dworcowa 3 (stacja PKP)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4115, lng: 18.4490 },
  { code: "SWI014", address: "ul. Poznańska 22", city: "Świecie", hours: "06:00-22:00", distanceKm: 7, lat: 53.4132, lng: 18.4405 },
  { code: "SWI015", address: "ul. Sportowa 10 (osiedle)", city: "Świecie", hours: "24/7", distanceKm: 4, lat: 53.4070, lng: 18.4535 },
  // Toruń
  { code: "TOR112", address: "ul. Kopernika 15", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0138, lng: 18.5984 },
  { code: "TOR113", address: "ul. Bydgoska 45", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0155, lng: 18.5900 },
  { code: "TOR114", address: "ul. Chełmińska 10", city: "Toruń", hours: "06:00-23:00", distanceKm: 36, lat: 53.0120, lng: 18.6050 },
  { code: "TOR115", address: "ul. Mickiewicza 22", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0145, lng: 18.5950 },
  { code: "TOR116", address: "ul. Żeglarska 8", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0100, lng: 18.6100 },
  { code: "TOR117", address: "ul. Szeroka 12", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0170, lng: 18.5850 },
  { code: "TOR118", address: "ul. Dąbrowskiego 5", city: "Toruń", hours: "06:00-22:00", distanceKm: 33, lat: 53.0090, lng: 18.6000 },
  { code: "TOR119", address: "ul. Gagarina 40 (Lidl)", city: "Toruń", hours: "24/7", distanceKm: 32, lat: 53.0185, lng: 18.5920 },
  { code: "TOR120", address: "ul. Leśna 15", city: "Toruń", hours: "24/7", distanceKm: 38, lat: 53.0080, lng: 18.6150 },
  // Bydgoszcz
  { code: "BYD001", address: "ul. Gdańska 50", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1235, lng: 18.0084 },
  { code: "BYD002", address: "ul. Jagiellońska 15", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1300, lng: 18.0150 },
  { code: "BYD003", address: "ul. Długa 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1200, lng: 18.0000 },
  { code: "BYD004", address: "ul. Pomorska 12", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1250, lng: 17.9950 },
  { code: "BYD005", address: "ul. Gdańska 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1280, lng: 18.0100 },
  { code: "BYD006", address: "ul. Focha 3", city: "Bydgoszcz", hours: "24/7", distanceKm: 41, lat: 53.1180, lng: 18.0050 },
  { code: "BYD007", address: "ul. Nakielska 55", city: "Bydgoszcz", hours: "24/7", distanceKm: 50, lat: 53.1350, lng: 17.9800 },
  { code: "BYD008", address: "ul. Marszałka Focha 10", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1220, lng: 18.0120 },
  { code: "BYD009", address: "ul. Dworcowa 25 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 42, lat: 53.1315, lng: 18.0025 },
  { code: "BYD010", address: "ul. Grunwaldzka 88", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1260, lng: 18.0200 },
  { code: "BYD011", address: "ul. Szubińska 40", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1150, lng: 17.9900 },
  { code: "BYD012", address: "ul. Kujawska 15", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 43, lat: 53.1190, lng: 18.0150 },
  // Chełmno
  { code: "CHE001", address: "ul. Rynek 8", city: "Chełmno", hours: "24/7", distanceKm: 18, lat: 53.3480, lng: 18.4250 },
  { code: "CHE002", address: "ul. Toruńska 18", city: "Chełmno", hours: "24/7", distanceKm: 16, lat: 53.3500, lng: 18.4300 },
  { code: "CHE003", address: "ul. Świecka 5", city: "Chełmno", hours: "06:00-22:00", distanceKm: 19, lat: 53.3450, lng: 18.4200 },
  { code: "CHE004", address: "ul. Rynek 25", city: "Chełmno", hours: "24/7", distanceKm: 17, lat: 53.3475, lng: 18.4280 },
  { code: "CHE005", address: "ul. Wodna 2", city: "Chełmno", hours: "24/7", distanceKm: 15, lat: 53.3490, lng: 18.4220 },
  { code: "CHE006", address: "ul. Szkolna 10", city: "Chełmno", hours: "06:00-22:00", distanceKm: 17, lat: 53.3465, lng: 18.4270 },
  // Grudziądz
  { code: "GRU112", address: "ul. Długa 25", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4840, lng: 18.7530 },
  { code: "GRU113", address: "ul. Chełmińska 42", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4800, lng: 18.7600 },
  { code: "GRU114", address: "ul. Tczewska 10", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4870, lng: 18.7450 },
  { code: "GRU115", address: "ul. Rzeźnicka 5", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4820, lng: 18.7550 },
  { code: "GRU116", address: "ul. Dworcowa 15 (Lidl)", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4855, lng: 18.7480 },
  // Inowrocław
  { code: "INO001", address: "ul. Królowej Jadwigi 15", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7980, lng: 18.2630 },
  { code: "INO002", address: "ul. Dworcowa 8", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 54, lat: 52.8005, lng: 18.2580 },
  { code: "INO003", address: "ul. Poznańska 45 (Lidl)", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.7950, lng: 18.2700 },
  // Nakło nad Notecią
  { code: "NAK001", address: "ul. Bydgoska 20", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 30, lat: 53.1400, lng: 17.6000 },
  { code: "NAK002", address: "ul. Kościuszki 5", city: "Nakło nad Notecią", hours: "06:00-22:00", distanceKm: 29, lat: 53.1420, lng: 17.5950 },
  { code: "NAK003", address: "ul. Notecka 12", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 31, lat: 53.1380, lng: 17.6050 },
  // Włocławek
  { code: "WLO001", address: "ul. Toruńska 30", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6480, lng: 19.0680 },
  { code: "WLO002", address: "ul. Brzeska 15 (Lidl)", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6505, lng: 19.0600 },
  // Other Kujawsko-Pomorskie
  { code: "KOR001", address: "ul. 3 Maja 8", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3200, lng: 17.9300 },
  { code: "SOL001", address: "ul. Główna 22", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0800, lng: 18.2300 },
  { code: "ZNI001", address: "ul. Rynek 3", city: "Żnin", hours: "24/7", distanceKm: 65, lat: 52.8500, lng: 17.7200 },
  // Dodatkowe realistyczne w regionie
  { code: "TOR121", address: "ul. Lecha i Marii Kaczyńskich 10", city: "Toruń", hours: "24/7", distanceKm: 31, lat: 53.0220, lng: 18.6100 },
  { code: "BYD013", address: "ul. Gdańska 180 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1320, lng: 18.0220 },
  { code: "SWI016", address: "ul. 1 Maja 45", city: "Świecie", hours: "06:00-22:00", distanceKm: 2, lat: 53.4095, lng: 18.4502 },
  { code: "GRU117", address: "ul. Długa 88", city: "Grudziądz", hours: "24/7", distanceKm: 22, lat: 53.4890, lng: 18.7620 },
  { code: "CHE007", address: "ul. Toruńska 55", city: "Chełmno", hours: "24/7", distanceKm: 14, lat: 53.3520, lng: 18.4350 },
  { code: "NAK004", address: "ul. Bydgoska 55", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 28, lat: 53.1435, lng: 17.5980 },
  { code: "INO004", address: "ul. Solankowa 20", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 53, lat: 52.8020, lng: 18.2680 },
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
          setSearchResults(searchPaczkomats(""));
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

  const searchPaczkomats = (query: string) => {
    const q = query.trim();
    if (q.length < 3) {
      // For empty/short, prefer Świecie and nearby kujawskie
      const localCities = ["Świecie", "Toruń", "Bydgoszcz", "Chełmno", "Grudziądz", "Nakło nad Notecią", "Inowrocław"];
      let local = SAMPLE_PACZKOMATS.filter(p => localCities.includes(p.city));
      // If searching partial, still use local but for <3 show Świecie heavy
      if (q.length > 0) {
        const nq = normalize(q);
        local = local.filter(p =>
          normalize(p.code).includes(nq) ||
          normalize(p.city).includes(nq) ||
          normalize(p.address).includes(nq)
        );
      }
      return local.length > 0 ? local.slice(0, 10) : SAMPLE_PACZKOMATS.slice(0, 8);
    }
    const nq = normalize(q);
    let results = SAMPLE_PACZKOMATS.filter((p) =>
      normalize(p.code).includes(nq) ||
      normalize(p.city).includes(nq) ||
      normalize(p.address).includes(nq)
    );
    // Prioritize city matches (esp. Świecie), then by distance
    results.sort((a, b) => {
      const aCity = normalize(a.city).includes(nq) ? 0 : 1;
      const bCity = normalize(b.city).includes(nq) ? 0 : 1;
      if (aCity !== bCity) return aCity - bCity;
      return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    });
    return results.slice(0, 10);
  };

  // Perform search using debounced value - min 3 chars, always results for parcel
  useEffect(() => {
    if (deliveryMethod !== "parcel") {
      setSearchResults([]);
      return;
    }
    const results = searchPaczkomats(debouncedSearch);
    setSearchResults(results);
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
      description: `${paczkomat.address}, ${paczkomat.city} — dziękujemy!`,
      duration: 1800,
    });
  };

  const clearSelectedPaczkomat = () => {
    setSelectedPaczkomat(null);
    updateField("parcelLocker", "");
    setParcelSearch("");
    // Show suggestions again so user can pick another easily (prefer local)
    setSearchResults(searchPaczkomats(""));
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
      setSearchResults(searchPaczkomats(""));
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
                ? `${selectedPaczkomat.code} – ${selectedPaczkomat.address}, ${selectedPaczkomat.city}` 
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
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">Wybierz dogodny punkt w Twojej okolicy • odbiór 24/7</p>
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
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">W naszej pasiece nad Wisłą w Topolnie • uzgodnimy termin</p>
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
                    /* InPost Paczkomat — elegancka, ciepła sekcja */
                    <div className="space-y-4">
                      {/* Search */}
                      <div>
                        <label className="block text-sm font-medium text-brand-brown mb-1.5">
                          Wybierz dogodny paczkomat w Twojej okolicy *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={parcelSearch}
                            onChange={(e) => {
                              const val = e.target.value;
                              setParcelSearch(val);
                              if (val.trim().length >= 3 && deliveryMethod === "parcel") {
                                const results = searchPaczkomats(val);
                                setSearchResults(results);
                              }
                            }}
                            onFocus={() => {
                              setSearchResults(searchPaczkomats(""));
                            }}
                            className="w-full rounded-xl border border-brand-creamDark bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                            placeholder="np. Świecie, Toruń, Bydgoszcz, Chełmno lub kod paczkomatu"
                          />
                          <Search className="absolute left-3.5 top-3 h-4 w-4 text-brand-brown/50" />
                        </div>
                        <p className="text-xs text-brand-brown/60 mt-1">
                          Wpisz nazwę miasta lub kod. Wybierz z listy lub kliknij pinezkę na mapie.
                        </p>
                      </div>

                      {/* Wyniki wyszukiwania — wyraźne oddzielenie */}
                      <AnimatePresence>
                        {searchResults.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5 px-0.5">
                              <span className="text-xs font-medium tracking-wide text-brand-brown/70 uppercase">Wyniki wyszukiwania</span>
                              <span className="text-[10px] text-brand-brown/50">{searchResults.length} paczkomatów</span>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border border-brand-creamDark rounded-2xl overflow-hidden bg-white max-h-[188px] overflow-y-auto shadow-sm"
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
                                        ? "bg-brand-cream border-brand-gold border-l-4" 
                                        : "hover:bg-brand-cream/50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                      <MapPin className={`h-4 w-4 ${isSelected ? "text-brand-gold" : "text-brand-brown/70"}`} />
                                      {isSelected && <Check className="h-4 w-4 text-brand-gold" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`font-semibold tabular-nums ${isSelected ? "text-brand-brown" : "text-brand-brown"}`}>
                                        {p.code}
                                      </div>
                                      <div className="text-sm text-brand-brown/75 leading-snug">
                                        {p.address}, {p.city}
                                      </div>
                                      {p.distanceKm != null && (
                                        <div className="text-[11px] text-brand-brown/50 mt-0.5">{p.distanceKm} km od pasieki</div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>

                      {/* Wybrany paczkomat — ciepła karta podsumowania (spójna z listą) */}
                      <AnimatePresence>
                        {selectedPaczkomat && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="rounded-2xl border-2 border-brand-gold bg-brand-cream/70 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm font-semibold text-brand-gold">
                                  <Check className="h-4 w-4" />
                                  Wybrany paczkomat
                                </div>
                                <div className="font-semibold text-xl text-brand-brown mt-1 tabular-nums tracking-tight">
                                  {selectedPaczkomat.code}
                                </div>
                                <div className="text-sm text-brand-brown/85 mt-0.5">
                                  {selectedPaczkomat.address}, {selectedPaczkomat.city}
                                </div>
                                <div className="text-sm text-brand-brown/70">
                                  {selectedPaczkomat.distanceKm != null && `${selectedPaczkomat.distanceKm} km od pasieki`}
                                </div>
                                <div className="inline-flex items-center mt-2 text-[11px] bg-white px-2.5 py-0.5 rounded-full text-brand-brown/70 border border-brand-creamDark">
                                  Godziny: {selectedPaczkomat.hours}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={clearSelectedPaczkomat}
                                className="text-xs text-brand-brown/70 hover:text-brand-brown underline whitespace-nowrap"
                              >
                                Zmień
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mapa — elegancka, stonowana, premium */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5 px-0.5">
                          <span className="text-xs font-medium tracking-wide text-brand-brown/70 uppercase">Mapa paczkomatów</span>
                          <span className="text-[10px] text-brand-brown/50">Kliknij pinezkę, by wybrać</span>
                        </div>

                        <div className="rounded-2xl border border-brand-creamDark bg-[#E8DFCF] p-2 shadow-sm">
                          <div 
                            className="h-48 rounded-xl relative overflow-hidden border border-[#7C664C]"
                            style={{
                              background: 'linear-gradient(148deg, #2f4233 0%, #3f5241 28%, #c9b79c 58%, #a68e6f 82%, #2f4233 100%)',
                              backgroundSize: 'cover'
                            }}
                          >
                            {/* Subtelna, ziemista tekstura pól i dróg — bardzo stonowana */}
                            <div className="absolute inset-0 opacity-[0.13]" 
                                 style={{
                                   backgroundImage: 'repeating-linear-gradient(28deg, transparent, transparent 7px, rgba(92,64,51,0.22) 7px, rgba(92,64,51,0.22) 11px), repeating-linear-gradient(-32deg, transparent, transparent 11px, rgba(92,64,51,0.13) 11px, rgba(92,64,51,0.13) 19px)'
                                 }} />

                            {/* Bardzo subtelna siatka dróg i podziałów */}
                            <div className="absolute inset-0 opacity-[0.11]" style={{
                              background: 'linear-gradient(90deg, transparent 48%, rgba(92,64,51,0.28) 49%, rgba(92,64,51,0.28) 51%, transparent 52%), linear-gradient(0deg, transparent 48%, rgba(92,64,51,0.22) 49%, rgba(92,64,51,0.22) 51%, transparent 52%)'
                            }} />

                            {/* Klikalne pinezki — więcej, lepsze pozycjonowanie */}
                            {(() => {
                              let mapPins = searchResults.length > 0 ? [...searchResults] : [];
                              // Zawsze dołącz wybrany, żeby był widoczny
                              if (selectedPaczkomat && !mapPins.some(m => m.code === selectedPaczkomat.code)) {
                                mapPins = [selectedPaczkomat, ...mapPins];
                              }
                              if (mapPins.length < 13) {
                                const localCities = ["Świecie","Toruń","Bydgoszcz","Chełmno","Grudziądz","Nakło nad Notecią"];
                                const extras = SAMPLE_PACZKOMATS.filter(p => 
                                  localCities.includes(p.city) && !mapPins.some(m => m.code === p.code)
                                );
                                mapPins = [...mapPins, ...extras].slice(0, 18);
                              }
                              return mapPins.slice(0, 18).map((p, i) => {
                                const isSel = selectedPaczkomat?.code === p.code;
                                let left = 18 + (i * 4.7) % 64;
                                let top = 24 + ((i * 6.3) % 52);
                                if (p.lat && p.lng) {
                                  // Lepsze pokrycie regionu Kujaw
                                  const minLat = 52.65, maxLat = 53.62, minLng = 17.48, maxLng = 19.05;
                                  left = 7 + ((p.lng - minLng) / (maxLng - minLng)) * 86;
                                  top = 11 + ((maxLat - p.lat) / (maxLat - minLat)) * 77;
                                }
                                // Delikatne przesunięcia dla lepszego rozłożenia
                                const jitter = ((i % 5) - 2) * 0.6;
                                left = Math.max(5, Math.min(94, left + jitter));
                                top = Math.max(7, Math.min(90, top - jitter * 0.5));

                                return (
                                  <button
                                    key={i}
                                    onClick={() => selectPaczkomat(p)}
                                    className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group transition-all duration-150 focus:outline-none ${isSel ? 'z-30 scale-[1.18]' : 'z-10 hover:scale-110'}`}
                                    style={{ left: `${left}%`, top: `${top}%` }}
                                    title={`Wybierz ${p.code} — ${p.address}, ${p.city}`}
                                  >
                                    <div className="relative">
                                      <MapPin 
                                        className={`h-[19px] w-[19px] drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,0.4)] transition-all ${isSel ? 'text-brand-gold' : 'text-[#463326] group-hover:text-[#6b523e]'}`} 
                                        style={{ filter: isSel ? 'drop-shadow(0 2.5px 3px rgba(217,119,6,0.35))' : 'drop-shadow(0 1.5px 2px rgba(0,0,0,0.32))' }}
                                      />
                                      {isSel && (
                                        <div className="absolute -top-[1px] -right-[1px] bg-white rounded-full p-[1px] border border-brand-gold shadow-sm">
                                          <Check className="h-[7px] w-[7px] text-brand-gold" />
                                        </div>
                                      )}
                                    </div>
                                    <div className={`mt-px px-1.5 py-px rounded-sm text-[8px] font-semibold shadow-sm whitespace-nowrap leading-none tracking-[0.2px] transition-all ${isSel ? 'bg-brand-brown text-[#F5EDE4]' : 'bg-[#F5EDE4]/95 text-[#463326] group-hover:bg-[#EDE4D6]'}`}>
                                      {p.code}
                                    </div>
                                  </button>
                                );
                              });
                            })()}

                            {/* Elegancka etykieta regionu */}
                            <div className="absolute top-2 left-2 bg-[#F5EDE4]/90 backdrop-blur-sm px-2 py-px rounded text-[9px] text-[#463326] font-medium shadow-sm border border-[#8B7355]/25 flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" /> Kujawy i okolice
                            </div>

                            {/* Subtelne kontrolki */}
                            <div className="absolute bottom-2 right-2 flex flex-col bg-[#F5EDE4]/85 backdrop-blur-sm rounded text-[#463326] text-[10px] shadow-sm border border-[#8B7355]/25 overflow-hidden">
                              <button onClick={() => {}} className="px-1 hover:bg-[#EDE4D6] active:bg-[#d4c5a9] leading-none border-b border-[#8B7355]/15">+</button>
                              <button onClick={() => {}} className="px-1 hover:bg-[#EDE4D6] active:bg-[#d4c5a9] leading-none">-</button>
                            </div>
                          </div>
                          <p className="text-[9px] text-[#5c4033]/65 mt-1.5 text-center">
                            {searchResults.length > 0 
                              ? `Pinezki odpowiadają wynikom • kliknij na mapie lub liście, by wybrać` 
                              : "Wpisz miasto (Świecie, Toruń, Bydgoszcz...) — pojawią się pinezki do kliknięcia"}
                          </p>
                        </div>
                      </div>

                      {errors.parcelLocker && (
                        <p className="text-red-600 text-xs mt-1">{errors.parcelLocker}</p>
                      )}

                      {/* Hidden */}
                      <input type="hidden" value={formData.parcelLocker} />
                    </div>
                  ) : (
                    /* Pickup info */
                    <div className="p-5 bg-brand-cream/60 rounded-2xl text-sm text-brand-brown/90 leading-relaxed border border-brand-creamDark">
                      Odbiór osobisty w naszej pasiece nad Wisłą w Topolnie (gm. Pruszcz).<br />
                      Po złożeniu zamówienia zadzwonimy lub napiszemy, by ustalić dogodny termin odbioru. Zapraszamy!
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
