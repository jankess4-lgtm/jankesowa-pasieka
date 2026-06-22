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

// Rozszerzona baza paczkomatĂłw InPost (~370+ wpisĂłw)
// - ToruĹ„, Bydgoszcz, GrudziÄ…dz, InowrocĹ‚aw, WĹ‚ocĹ‚awek: 42-45 kaĹĽdy
// - PozostaĹ‚e miasta kujawsko-pomorskie (Ĺšwiecie, CheĹ‚mno, NakĹ‚o, Brodnica, Tuchola itp.): 10-15 kaĹĽdy
// KaĹĽdy wpis ma realistyczny kod, peĹ‚ny adres i wspĂłĹ‚rzÄ™dne do mapy.
const SAMPLE_PACZKOMATS: Paczkomat[] = [
  // Kilka z innych regionĂłw (dla kompletnoĹ›ci)
  { code: "WAW001", address: "ul. MarszaĹ‚kowska 104/106", city: "Warszawa", hours: "24/7", distanceKm: 240, lat: 52.2297, lng: 21.0122 },
  { code: "WAW002", address: "ul. ĹšwiÄ™tokrzyska 30", city: "Warszawa", hours: "24/7", distanceKm: 238, lat: 52.2319, lng: 21.0067 },
  { code: "KRK001", address: "ul. FloriaĹ„ska 15", city: "KrakĂłw", hours: "24/7", distanceKm: 380, lat: 50.0619, lng: 19.9373 },
  { code: "POZ001", address: "ul. PĂłĹ‚wiejska 27", city: "PoznaĹ„", hours: "24/7", distanceKm: 150, lat: 52.4064, lng: 16.9252 },
  { code: "GDA001", address: "ul. DĹ‚uga 41", city: "GdaĹ„sk", hours: "24/7", distanceKm: 160, lat: 54.3520, lng: 18.6466 },

  // === ĹšWIECIE (13) ===
  { code: "SWI001", address: "ul. Wojska Polskiego 12 (Biedronka)", city: "Ĺšwiecie", hours: "24/7", distanceKm: 3, lat: 53.4128, lng: 18.4525 },
  { code: "SWI002", address: "ul. Wojska Polskiego 76 (Lidl)", city: "Ĺšwiecie", hours: "24/7", distanceKm: 2, lat: 53.4123, lng: 18.4521 },
  { code: "SWI003", address: "ul. CheĹ‚miĹ„ska 45 (Kaufland)", city: "Ĺšwiecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4105, lng: 18.4480 },
  { code: "SWI004", address: "ul. Rynek 5 (centrum)", city: "Ĺšwiecie", hours: "24/7", distanceKm: 1, lat: 53.4098, lng: 18.4472 },
  { code: "SWI005", address: "ul. Bydgoska 25", city: "Ĺšwiecie", hours: "24/7", distanceKm: 5, lat: 53.4145, lng: 18.4530 },
  { code: "SWI006", address: "ul. 1 Maja 8", city: "Ĺšwiecie", hours: "24/7", distanceKm: 3, lat: 53.4102, lng: 18.4495 },
  { code: "SWI007", address: "ul. Szkolna 12", city: "Ĺšwiecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4085, lng: 18.4465 },
  { code: "SWI008", address: "ul. KoĹ›ciuszki 22", city: "Ĺšwiecie", hours: "24/7", distanceKm: 2, lat: 53.4110, lng: 18.4508 },
  { code: "SWI009", address: "ul. Mickiewicza 4", city: "Ĺšwiecie", hours: "24/7", distanceKm: 3, lat: 53.4092, lng: 18.4458 },
  { code: "SWI010", address: "ul. 3 Maja 28", city: "Ĺšwiecie", hours: "24/7", distanceKm: 1, lat: 53.4100, lng: 18.4478 },
  { code: "SWI011", address: "ul. Dworcowa 3 (stacja PKP)", city: "Ĺšwiecie", hours: "24/7", distanceKm: 2, lat: 53.4115, lng: 18.4490 },
  { code: "SWI012", address: "ul. CheĹ‚miĹ„ska 80", city: "Ĺšwiecie", hours: "06:00-22:00", distanceKm: 5, lat: 53.4088, lng: 18.4425 },
  { code: "SWI013", address: "ul. Sportowa 10 (osiedle)", city: "Ĺšwiecie", hours: "24/7", distanceKm: 4, lat: 53.4070, lng: 18.4535 },

  // === CHEĹMNO (12) ===
  { code: "CHE001", address: "ul. Rynek 8", city: "CheĹ‚mno", hours: "24/7", distanceKm: 18, lat: 53.3480, lng: 18.4250 },
  { code: "CHE002", address: "ul. ToruĹ„ska 18", city: "CheĹ‚mno", hours: "24/7", distanceKm: 16, lat: 53.3500, lng: 18.4300 },
  { code: "CHE003", address: "ul. Ĺšwiecka 5", city: "CheĹ‚mno", hours: "06:00-22:00", distanceKm: 19, lat: 53.3450, lng: 18.4200 },
  { code: "CHE004", address: "ul. Rynek 25", city: "CheĹ‚mno", hours: "24/7", distanceKm: 17, lat: 53.3475, lng: 18.4280 },
  { code: "CHE005", address: "ul. Wodna 2", city: "CheĹ‚mno", hours: "24/7", distanceKm: 15, lat: 53.3490, lng: 18.4220 },
  { code: "CHE006", address: "ul. Szkolna 10", city: "CheĹ‚mno", hours: "06:00-22:00", distanceKm: 17, lat: 53.3465, lng: 18.4270 },
  { code: "CHE007", address: "ul. ToruĹ„ska 55", city: "CheĹ‚mno", hours: "24/7", distanceKm: 14, lat: 53.3520, lng: 18.4350 },
  { code: "CHE008", address: "ul. Dworcowa 3", city: "CheĹ‚mno", hours: "24/7", distanceKm: 16, lat: 53.3485, lng: 18.4320 },
  { code: "CHE009", address: "ul. 1 Maja 22", city: "CheĹ‚mno", hours: "06:00-22:00", distanceKm: 18, lat: 53.3510, lng: 18.4150 },
  { code: "CHE010", address: "ul. CheĹ‚miĹ„ska 40", city: "CheĹ‚mno", hours: "24/7", distanceKm: 15, lat: 53.3495, lng: 18.4180 },
  { code: "CHE011", address: "ul. Szkolna 28", city: "CheĹ‚mno", hours: "24/7", distanceKm: 17, lat: 53.3472, lng: 18.4245 },
  { code: "CHE012", address: "ul. 3 Maja 15", city: "CheĹ‚mno", hours: "24/7", distanceKm: 19, lat: 53.3440, lng: 18.4280 },

  // === NAKĹO NAD NOTECIÄ„ (12) ===
  { code: "NAK001", address: "ul. Bydgoska 20", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 30, lat: 53.1400, lng: 17.6000 },
  { code: "NAK002", address: "ul. KoĹ›ciuszki 5", city: "NakĹ‚o nad NoteciÄ…", hours: "06:00-22:00", distanceKm: 29, lat: 53.1420, lng: 17.5950 },
  { code: "NAK003", address: "ul. Notecka 12", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 31, lat: 53.1380, lng: 17.6050 },
  { code: "NAK004", address: "ul. Bydgoska 55", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 28, lat: 53.1435, lng: 17.5980 },
  { code: "NAK005", address: "ul. 1 Maja 10", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 29, lat: 53.1410, lng: 17.5920 },
  { code: "NAK006", address: "ul. PoznaĹ„ska 22", city: "NakĹ‚o nad NoteciÄ…", hours: "06:00-22:00", distanceKm: 31, lat: 53.1350, lng: 17.6100 },
  { code: "NAK007", address: "ul. KoĹ›ciuszki 28", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 30, lat: 53.1395, lng: 17.6030 },
  { code: "NAK008", address: "ul. Dworcowa 4 (PKP)", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 29, lat: 53.1425, lng: 17.6075 },
  { code: "NAK009", address: "ul. 3 Maja 18", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 32, lat: 53.1365, lng: 17.5970 },
  { code: "NAK010", address: "ul. Lipowa 9 (osiedle)", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 28, lat: 53.1440, lng: 17.5900 },
  { code: "NAK011", address: "ul. Szkolna 7", city: "NakĹ‚o nad NoteciÄ…", hours: "06:00-22:00", distanceKm: 30, lat: 53.1418, lng: 17.6015 },
  { code: "NAK012", address: "ul. Bydgoska 90 (Lidl)", city: "NakĹ‚o nad NoteciÄ…", hours: "24/7", distanceKm: 31, lat: 53.1370, lng: 17.6120 },

  // === BRODNICA (12) ===
  { code: "BRO001", address: "ul. KoĹ›ciuszki 15", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2590, lng: 19.3950 },
  { code: "BRO002", address: "ul. Zamkowa 5", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2605, lng: 19.4020 },
  { code: "BRO003", address: "ul. 3 Maja 28 (Lidl)", city: "Brodnica", hours: "24/7", distanceKm: 56, lat: 53.2550, lng: 19.3850 },
  { code: "BRO004", address: "ul. SÄ…dowa 10", city: "Brodnica", hours: "06:00-22:00", distanceKm: 53, lat: 53.2620, lng: 19.4080 },
  { code: "BRO005", address: "ul. Mickiewicza 40", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2575, lng: 19.3900 },
  { code: "BRO006", address: "ul. Chopina 3", city: "Brodnica", hours: "24/7", distanceKm: 57, lat: 53.2520, lng: 19.3980 },
  { code: "BRO007", address: "ul. 1 Maja 12 (Biedronka)", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2580, lng: 19.3880 },
  { code: "BRO008", address: "ul. Ratuszowa 2", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2610, lng: 19.4000 },
  { code: "BRO009", address: "ul. ToruĹ„ska 45", city: "Brodnica", hours: "24/7", distanceKm: 56, lat: 53.2545, lng: 19.3920 },
  { code: "BRO010", address: "ul. Szkolna 8", city: "Brodnica", hours: "06:00-22:00", distanceKm: 53, lat: 53.2595, lng: 19.4040 },
  { code: "BRO011", address: "ul. Dworcowa 7", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2565, lng: 19.3970 },
  { code: "BRO012", address: "ul. Grunwaldzka 22", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2630, lng: 19.3855 },

  // === TUCHOLA (12) ===
  { code: "TUC001", address: "ul. KoĹ›ciuszki 20", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5890, lng: 17.8600 },
  { code: "TUC002", address: "ul. 1 Maja 8", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5850, lng: 17.8550 },
  { code: "TUC003", address: "ul. Bydgoska 30", city: "Tuchola", hours: "06:00-22:00", distanceKm: 47, lat: 53.5920, lng: 17.8720 },
  { code: "TUC004", address: "pl. WolnoĹ›ci 5", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5875, lng: 17.8580 },
  { code: "TUC005", address: "ul. 3 Maja 15 (Biedronka)", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5840, lng: 17.8620 },
  { code: "TUC006", address: "ul. Dworcowa 2", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5905, lng: 17.8680 },
  { code: "TUC007", address: "ul. Szkolna 11", city: "Tuchola", hours: "06:00-22:00", distanceKm: 47, lat: 53.5880, lng: 17.8555 },
  { code: "TUC008", address: "ul. Lipowa 6", city: "Tuchola", hours: "24/7", distanceKm: 50, lat: 53.5835, lng: 17.8700 },
  { code: "TUC009", address: "ul. KoĹ›ciuszki 45", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5910, lng: 17.8640 },
  { code: "TUC010", address: "ul. Rynek 3", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5865, lng: 17.8590 },
  { code: "TUC011", address: "ul. Chojnicka 18", city: "Tuchola", hours: "24/7", distanceKm: 47, lat: 53.5935, lng: 17.8750 },
  { code: "TUC012", address: "ul. 1 Maja 25 (Lidl)", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5820, lng: 17.8570 },

  // === KORONOWO (10) ===
  { code: "KOR001", address: "ul. 3 Maja 8", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3200, lng: 17.9300 },
  { code: "KOR002", address: "ul. Bydgoska 15", city: "Koronowo", hours: "24/7", distanceKm: 26, lat: 53.3180, lng: 17.9350 },
  { code: "KOR003", address: "ul. 1 Maja 12 (Biedronka)", city: "Koronowo", hours: "24/7", distanceKm: 24, lat: 53.3220, lng: 17.9280 },
  { code: "KOR004", address: "ul. Dworcowa 5", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3175, lng: 17.9400 },
  { code: "KOR005", address: "ul. KoĹ›ciuszki 22", city: "Koronowo", hours: "06:00-22:00", distanceKm: 26, lat: 53.3195, lng: 17.9320 },
  { code: "KOR006", address: "ul. Szkolna 4", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3210, lng: 17.9250 },
  { code: "KOR007", address: "ul. 3 Maja 30", city: "Koronowo", hours: "24/7", distanceKm: 27, lat: 53.3150, lng: 17.9380 },
  { code: "KOR008", address: "pl. ZwyciÄ™stwa 1", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3190, lng: 17.9290 },
  { code: "KOR009", address: "ul. Bydgoska 48 (Lidl)", city: "Koronowo", hours: "24/7", distanceKm: 26, lat: 53.3165, lng: 17.9420 },
  { code: "KOR010", address: "ul. LeĹ›na 9", city: "Koronowo", hours: "24/7", distanceKm: 28, lat: 53.3140, lng: 17.9200 },

  // === SOLEC KUJAWSKI (10) ===
  { code: "SOL001", address: "ul. GĹ‚Ăłwna 22", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0800, lng: 18.2300 },
  { code: "SOL002", address: "ul. ToruĹ„ska 8 (Lidl)", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0820, lng: 18.2250 },
  { code: "SOL003", address: "ul. 1 Maja 15", city: "Solec Kujawski", hours: "24/7", distanceKm: 41, lat: 53.0780, lng: 18.2350 },
  { code: "SOL004", address: "ul. Bydgoska 30 (Biedronka)", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0815, lng: 18.2280 },
  { code: "SOL005", address: "ul. Dworcowa 3", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0830, lng: 18.2320 },
  { code: "SOL006", address: "ul. Szkolna 7", city: "Solec Kujawski", hours: "06:00-22:00", distanceKm: 42, lat: 53.0770, lng: 18.2220 },
  { code: "SOL007", address: "ul. KoĹ›ciuszki 18", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0795, lng: 18.2380 },
  { code: "SOL008", address: "ul. 3 Maja 5", city: "Solec Kujawski", hours: "24/7", distanceKm: 41, lat: 53.0805, lng: 18.2270 },
  { code: "SOL009", address: "ul. LeĹ›na 12", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0840, lng: 18.2200 },
  { code: "SOL010", address: "ul. ToruĹ„ska 55", city: "Solec Kujawski", hours: "24/7", distanceKm: 42, lat: 53.0750, lng: 18.2400 },

  // === CIECHOCINEK (12) ===
  { code: "CIE001", address: "ul. Zdrojowa 15", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8800, lng: 18.7950 },
  { code: "CIE002", address: "ul. Kopernika 8", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8820, lng: 18.7850 },
  { code: "CIE003", address: "ul. Wojska Polskiego 5", city: "Ciechocinek", hours: "06:00-22:00", distanceKm: 63, lat: 52.8785, lng: 18.8020 },
  { code: "CIE004", address: "pl. Zdrojowy 1", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8795, lng: 18.7920 },
  { code: "CIE005", address: "ul. 1 Maja 18", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8810, lng: 18.7880 },
  { code: "CIE006", address: "ul. ToruĹ„ska 22", city: "Ciechocinek", hours: "24/7", distanceKm: 63, lat: 52.8770, lng: 18.7980 },
  { code: "CIE007", address: "ul. KoĹ›ciuszki 4", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8830, lng: 18.7900 },
  { code: "CIE008", address: "ul. 3 Maja 9 (Biedronka)", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8805, lng: 18.8000 },
  { code: "CIE009", address: "ul. Szkolna 6", city: "Ciechocinek", hours: "06:00-22:00", distanceKm: 64, lat: 52.8755, lng: 18.7850 },
  { code: "CIE010", address: "ul. Zdrojowa 40", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8790, lng: 18.8050 },
  { code: "CIE011", address: "ul. Lipowa 11", city: "Ciechocinek", hours: "24/7", distanceKm: 63, lat: 52.8815, lng: 18.7820 },
  { code: "CIE012", address: "ul. Kujawska 2", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8840, lng: 18.7950 },

  // === ALEKSANDRĂ“W KUJAWSKI (10) ===
  { code: "ALE001", address: "ul. 3 Maja 10", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8760, lng: 18.6930 },
  { code: "ALE002", address: "ul. KoĹ›ciuszki 25 (Lidl)", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8720, lng: 18.6850 },
  { code: "ALE003", address: "ul. ToruĹ„ska 12", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 57, lat: 52.8800, lng: 18.7000 },
  { code: "ALE004", address: "ul. 1 Maja 7", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8750, lng: 18.6900 },
  { code: "ALE005", address: "ul. Dworcowa 1", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8710, lng: 18.6950 },
  { code: "ALE006", address: "ul. Bydgoska 18", city: "AleksandrĂłw Kujawski", hours: "06:00-22:00", distanceKm: 57, lat: 52.8780, lng: 18.6880 },
  { code: "ALE007", address: "ul. KoĹ›ciuszki 50", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8735, lng: 18.6800 },
  { code: "ALE008", address: "ul. 3 Maja 22 (Biedronka)", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8745, lng: 18.6980 },
  { code: "ALE009", address: "ul. Szkolna 3", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 57, lat: 52.8775, lng: 18.6920 },
  { code: "ALE010", address: "ul. Lipowa 8", city: "AleksandrĂłw Kujawski", hours: "24/7", distanceKm: 60, lat: 52.8700, lng: 18.7020 },

  // === LIPNO (10) ===
  { code: "LIP001", address: "ul. 3 Maja 18", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8450, lng: 19.1800 },
  { code: "LIP002", address: "ul. KoĹ›ciuszki 7", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8420, lng: 19.1750 },
  { code: "LIP003", address: "ul. ToruĹ„ska 22", city: "Lipno", hours: "06:00-22:00", distanceKm: 76, lat: 52.8480, lng: 19.1880 },
  { code: "LIP004", address: "ul. 1 Maja 5", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8440, lng: 19.1780 },
  { code: "LIP005", address: "ul. Rynek 2", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8460, lng: 19.1820 },
  { code: "LIP006", address: "ul. Bydgoska 12 (Lidl)", city: "Lipno", hours: "24/7", distanceKm: 76, lat: 52.8410, lng: 19.1720 },
  { code: "LIP007", address: "ul. Szkolna 9", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8435, lng: 19.1850 },
  { code: "LIP008", address: "ul. 3 Maja 35", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8470, lng: 19.1750 },
  { code: "LIP009", address: "ul. Dworcowa 4", city: "Lipno", hours: "24/7", distanceKm: 77, lat: 52.8400, lng: 19.1900 },
  { code: "LIP010", address: "ul. KoĹ›ciuszki 30", city: "Lipno", hours: "06:00-22:00", distanceKm: 75, lat: 52.8455, lng: 19.1700 },

  // === RYPIN (10) ===
  { code: "RYP001", address: "ul. 3 Maja 10", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8550, lng: 19.4100 },
  { code: "RYP002", address: "ul. KoĹ›ciuszki 30", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8520, lng: 19.4050 },
  { code: "RYP003", address: "ul. Lipnowska 5", city: "Rypin", hours: "24/7", distanceKm: 69, lat: 52.8580, lng: 19.4180 },
  { code: "RYP004", address: "ul. 1 Maja 8", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8540, lng: 19.4080 },
  { code: "RYP005", address: "ul. Rynek 4", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8530, lng: 19.4120 },
  { code: "RYP006", address: "ul. ToruĹ„ska 15 (Biedronka)", city: "Rypin", hours: "24/7", distanceKm: 69, lat: 52.8565, lng: 19.4020 },
  { code: "RYP007", address: "ul. Szkolna 6", city: "Rypin", hours: "06:00-22:00", distanceKm: 68, lat: 52.8510, lng: 19.4150 },
  { code: "RYP008", address: "ul. 3 Maja 28", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8570, lng: 19.4050 },
  { code: "RYP009", address: "ul. Dworcowa 2", city: "Rypin", hours: "24/7", distanceKm: 70, lat: 52.8500, lng: 19.4200 },
  { code: "RYP010", address: "ul. KoĹ›ciuszki 55", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8545, lng: 19.4000 },

  // === GOLUB-DOBRZYĹ (10) ===
  { code: "GOL001", address: "ul. Ratuszowa 2", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 52, lat: 53.1100, lng: 19.0500 },
  { code: "GOL002", address: "ul. 3 Maja 15", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 53, lat: 53.1050, lng: 19.0450 },
  { code: "GOL003", address: "ul. Bydgoska 8", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 51, lat: 53.1150, lng: 19.0550 },
  { code: "GOL004", address: "ul. 1 Maja 4", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 52, lat: 53.1080, lng: 19.0480 },
  { code: "GOL005", address: "ul. KoĹ›ciuszki 12", city: "Golub-DobrzyĹ„", hours: "06:00-22:00", distanceKm: 53, lat: 53.1120, lng: 19.0520 },
  { code: "GOL006", address: "ul. ToruĹ„ska 9 (Lidl)", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 51, lat: 53.1060, lng: 19.0600 },
  { code: "GOL007", address: "ul. Dworcowa 1", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 52, lat: 53.1090, lng: 19.0420 },
  { code: "GOL008", address: "ul. 3 Maja 25", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 54, lat: 53.1030, lng: 19.0480 },
  { code: "GOL009", address: "ul. Szkolna 5", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 51, lat: 53.1140, lng: 19.0500 },
  { code: "GOL010", address: "pl. WolnoĹ›ci 2", city: "Golub-DobrzyĹ„", hours: "24/7", distanceKm: 53, lat: 53.1075, lng: 19.0530 },

  // === MOGILNO + inne mniejsze (~11) ===
  { code: "MOG001", address: "ul. Rynek 4", city: "Mogilno", hours: "24/7", distanceKm: 78, lat: 52.6600, lng: 17.9500 },
  { code: "MOG002", address: "ul. KoĹ›ciuszki 18", city: "Mogilno", hours: "24/7", distanceKm: 77, lat: 52.6550, lng: 17.9450 },
  { code: "MOG003", address: "ul. 3 Maja 7 (Biedronka)", city: "Mogilno", hours: "24/7", distanceKm: 78, lat: 52.6620, lng: 17.9520 },
  { code: "STR001", address: "ul. Rynek 3", city: "Strzelno", hours: "24/7", distanceKm: 72, lat: 52.6280, lng: 18.1720 },
  { code: "STR002", address: "ul. 1 Maja 10", city: "Strzelno", hours: "24/7", distanceKm: 71, lat: 52.6250, lng: 18.1680 },
  { code: "SEP004", address: "ul. 1 Maja 25", city: "SÄ™pĂłlno KrajeĹ„skie", hours: "24/7", distanceKm: 42, lat: 53.4580, lng: 17.5280 },
  { code: "ZNI003", address: "ul. 3 Maja 12", city: "Ĺ»nin", hours: "24/7", distanceKm: 65, lat: 52.8520, lng: 17.7180 },

  // ============================================================
  // BYDGOSZCZ â€” ~45 paczkomatĂłw
  // ============================================================
  { code: "BYD001", address: "ul. GdaĹ„ska 50", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1235, lng: 18.0084 },
  { code: "BYD002", address: "ul. JagielloĹ„ska 15", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1300, lng: 18.0150 },
  { code: "BYD003", address: "ul. DĹ‚uga 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1200, lng: 18.0000 },
  { code: "BYD004", address: "ul. Pomorska 12", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1250, lng: 17.9950 },
  { code: "BYD005", address: "ul. GdaĹ„ska 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1280, lng: 18.0100 },
  { code: "BYD006", address: "ul. Focha 3", city: "Bydgoszcz", hours: "24/7", distanceKm: 41, lat: 53.1180, lng: 18.0050 },
  { code: "BYD007", address: "ul. Nakielska 55", city: "Bydgoszcz", hours: "24/7", distanceKm: 50, lat: 53.1350, lng: 17.9800 },
  { code: "BYD008", address: "ul. MarszaĹ‚ka Focha 10", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1220, lng: 18.0120 },
  { code: "BYD009", address: "ul. Dworcowa 25 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 42, lat: 53.1315, lng: 18.0025 },
  { code: "BYD010", address: "ul. Grunwaldzka 88", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1260, lng: 18.0200 },
  { code: "BYD011", address: "ul. SzubiĹ„ska 40", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1150, lng: 17.9900 },
  { code: "BYD012", address: "ul. Kujawska 15", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 43, lat: 53.1190, lng: 18.0150 },
  { code: "BYD013", address: "ul. GdaĹ„ska 180 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1320, lng: 18.0220 },
  { code: "BYD014", address: "ul. GdaĹ„ska 250 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1345, lng: 18.0280 },
  { code: "BYD015", address: "ul. Wojska Polskiego 12", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1255, lng: 17.9985 },
  { code: "BYD016", address: "ul. FordoĹ„ska 140 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1400, lng: 18.0350 },
  { code: "BYD017", address: "ul. JagielloĹ„ska 80 (Kaufland)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1285, lng: 18.0180 },
  { code: "BYD018", address: "ul. SzubiĹ„ska 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1120, lng: 17.9820 },
  { code: "BYD019", address: "ul. Pomorska 88", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1230, lng: 17.9880 },
  { code: "BYD020", address: "ul. FordoĹ„ska 55 (Auchan)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1375, lng: 18.0300 },
  { code: "BYD021", address: "ul. GdaĹ„ska 320", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1365, lng: 18.0250 },
  { code: "BYD022", address: "ul. JagielloĹ„ska 140", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1290, lng: 18.0220 },
  { code: "BYD023", address: "ul. DĹ‚uga 45", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1195, lng: 17.9980 },
  { code: "BYD024", address: "ul. Nakielska 12 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 50, lat: 53.1330, lng: 17.9750 },
  { code: "BYD025", address: "ul. Grunwaldzka 22", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 47, lat: 53.1245, lng: 18.0150 },
  { code: "BYD026", address: "ul. Focha 45", city: "Bydgoszcz", hours: "24/7", distanceKm: 42, lat: 53.1205, lng: 18.0080 },
  { code: "BYD027", address: "ul. Pomorska 65", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1265, lng: 17.9920 },
  { code: "BYD028", address: "ul. SzubiĹ„ska 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1140, lng: 17.9850 },
  { code: "BYD029", address: "ul. Kujawska 55", city: "Bydgoszcz", hours: "24/7", distanceKm: 44, lat: 53.1185, lng: 18.0200 },
  { code: "BYD030", address: "ul. Wojska Polskiego 65 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1275, lng: 17.9950 },
  { code: "BYD031", address: "ul. FordoĹ„ska 200", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1390, lng: 18.0380 },
  { code: "BYD032", address: "ul. Dworcowa 48", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1300, lng: 18.0000 },
  { code: "BYD033", address: "ul. GdaĹ„ska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1250, lng: 18.0050 },
  { code: "BYD034", address: "ul. JagielloĹ„ska 200", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 42, lat: 53.1315, lng: 18.0250 },
  { code: "BYD035", address: "ul. LeĹ›na 8 (osiedle)", city: "Bydgoszcz", hours: "24/7", distanceKm: 51, lat: 53.1420, lng: 17.9700 },
  { code: "BYD036", address: "ul. Grunwaldzka 150", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1280, lng: 18.0250 },
  { code: "BYD037", address: "ul. Nakielska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1340, lng: 17.9780 },
  { code: "BYD038", address: "ul. Bydgoska 10 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1220, lng: 18.0100 },
  { code: "BYD039", address: "ul. Sienkiewicza 15", city: "Bydgoszcz", hours: "24/7", distanceKm: 44, lat: 53.1190, lng: 18.0020 },
  { code: "BYD040", address: "ul. Kujawska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1170, lng: 18.0180 },
  { code: "BYD041", address: "ul. MarszaĹ‚ka Focha 60", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1210, lng: 18.0150 },
  { code: "BYD042", address: "ul. DĹ‚uga 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1185, lng: 17.9950 },
  { code: "BYD043", address: "ul. Pomorska 150 (Kaufland)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1270, lng: 17.9880 },
  { code: "BYD044", address: "ul. SzubiĹ„ska 160", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1115, lng: 17.9800 },
  { code: "BYD045", address: "ul. FordoĹ„ska 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1380, lng: 18.0330 },

  // ============================================================
  // TORUĹ â€” ~45 paczkomatĂłw
  // ============================================================
  { code: "TOR001", address: "ul. Kopernika 15", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0138, lng: 18.5984 },
  { code: "TOR002", address: "ul. Bydgoska 45", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0155, lng: 18.5900 },
  { code: "TOR003", address: "ul. CheĹ‚miĹ„ska 10", city: "ToruĹ„", hours: "06:00-23:00", distanceKm: 36, lat: 53.0120, lng: 18.6050 },
  { code: "TOR004", address: "ul. Mickiewicza 22", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0145, lng: 18.5950 },
  { code: "TOR005", address: "ul. Ĺ»eglarska 8", city: "ToruĹ„", hours: "24/7", distanceKm: 37, lat: 53.0100, lng: 18.6100 },
  { code: "TOR006", address: "ul. Szeroka 12", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0170, lng: 18.5850 },
  { code: "TOR007", address: "ul. DÄ…browskiego 5", city: "ToruĹ„", hours: "06:00-22:00", distanceKm: 33, lat: 53.0090, lng: 18.6000 },
  { code: "TOR008", address: "ul. Gagarina 40 (Lidl)", city: "ToruĹ„", hours: "24/7", distanceKm: 32, lat: 53.0185, lng: 18.5920 },
  { code: "TOR009", address: "ul. LeĹ›na 15", city: "ToruĹ„", hours: "24/7", distanceKm: 38, lat: 53.0080, lng: 18.6150 },
  { code: "TOR010", address: "ul. Lecha i Marii KaczyĹ„skich 10", city: "ToruĹ„", hours: "24/7", distanceKm: 31, lat: 53.0220, lng: 18.6100 },
  { code: "TOR011", address: "ul. Broniewskiego 15", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0150, lng: 18.5750 },
  { code: "TOR012", address: "ul. Reja 22 (Biedronka)", city: "ToruĹ„", hours: "24/7", distanceKm: 36, lat: 53.0205, lng: 18.6050 },
  { code: "TOR013", address: "ul. KrasiĹ„skiego 8", city: "ToruĹ„", hours: "06:00-23:00", distanceKm: 35, lat: 53.0095, lng: 18.5920 },
  { code: "TOR014", address: "pl. Rapackiego 1", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0125, lng: 18.5980 },
  { code: "TOR015", address: "ul. Kopernika 45", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0140, lng: 18.6020 },
  { code: "TOR016", address: "ul. Bydgoska 90", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0165, lng: 18.5880 },
  { code: "TOR017", address: "ul. CheĹ‚miĹ„ska 55", city: "ToruĹ„", hours: "24/7", distanceKm: 36, lat: 53.0115, lng: 18.6080 },
  { code: "TOR018", address: "ul. Mickiewicza 60", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0130, lng: 18.5820 },
  { code: "TOR019", address: "ul. Ĺ»eglarska 25", city: "ToruĹ„", hours: "24/7", distanceKm: 37, lat: 53.0095, lng: 18.6120 },
  { code: "TOR020", address: "ul. Szeroka 40", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0180, lng: 18.5800 },
  { code: "TOR021", address: "ul. DÄ…browskiego 28", city: "ToruĹ„", hours: "06:00-22:00", distanceKm: 32, lat: 53.0105, lng: 18.5950 },
  { code: "TOR022", address: "ul. Gagarina 80 (Kaufland)", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0195, lng: 18.5850 },
  { code: "TOR023", address: "ul. LeĹ›na 40", city: "ToruĹ„", hours: "24/7", distanceKm: 38, lat: 53.0070, lng: 18.6200 },
  { code: "TOR024", address: "ul. Broniewskiego 45", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0140, lng: 18.5700 },
  { code: "TOR025", address: "ul. Reja 55", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0215, lng: 18.6000 },
  { code: "TOR026", address: "ul. KrasiĹ„skiego 30", city: "ToruĹ„", hours: "24/7", distanceKm: 36, lat: 53.0085, lng: 18.5880 },
  { code: "TOR027", address: "ul. Bulwar Filadelfijski 12", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0120, lng: 18.6150 },
  { code: "TOR028", address: "ul. ĹšwiÄ™tojaĹ„ska 8", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0150, lng: 18.5930 },
  { code: "TOR029", address: "ul. PodgĂłrna 18", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0110, lng: 18.5800 },
  { code: "TOR030", address: "ul. Ĺazienna 5", city: "ToruĹ„", hours: "24/7", distanceKm: 36, lat: 53.0135, lng: 18.6050 },
  { code: "TOR031", address: "ul. Kopernika 80", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0155, lng: 18.5950 },
  { code: "TOR032", address: "ul. Bydgoska 130 (Biedronka)", city: "ToruĹ„", hours: "24/7", distanceKm: 32, lat: 53.0175, lng: 18.5750 },
  { code: "TOR033", address: "ul. CheĹ‚miĹ„ska 80", city: "ToruĹ„", hours: "24/7", distanceKm: 37, lat: 53.0100, lng: 18.6100 },
  { code: "TOR034", address: "ul. Mickiewicza 80", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0120, lng: 18.5780 },
  { code: "TOR035", address: "pl. Ĺšw. Katarzyny 3", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0140, lng: 18.5880 },
  { code: "TOR036", address: "ul. Gagarina 15", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0190, lng: 18.5900 },
  { code: "TOR037", address: "ul. LeĹ›na 55", city: "ToruĹ„", hours: "24/7", distanceKm: 38, lat: 53.0065, lng: 18.6220 },
  { code: "TOR038", address: "ul. Broniewskiego 70", city: "ToruĹ„", hours: "24/7", distanceKm: 32, lat: 53.0160, lng: 18.5650 },
  { code: "TOR039", address: "ul. Reja 70", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0225, lng: 18.5980 },
  { code: "TOR040", address: "ul. KrasiĹ„skiego 55", city: "ToruĹ„", hours: "06:00-23:00", distanceKm: 36, lat: 53.0075, lng: 18.5850 },
  { code: "TOR041", address: "ul. DÄ…browskiego 55", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0080, lng: 18.6030 },
  { code: "TOR042", address: "ul. Ĺ»eglarska 40", city: "ToruĹ„", hours: "24/7", distanceKm: 37, lat: 53.0090, lng: 18.6080 },
  { code: "TOR043", address: "ul. Szeroka 55", city: "ToruĹ„", hours: "24/7", distanceKm: 34, lat: 53.0190, lng: 18.5820 },
  { code: "TOR044", address: "ul. Sienkiewicza 12", city: "ToruĹ„", hours: "24/7", distanceKm: 35, lat: 53.0130, lng: 18.5900 },
  { code: "TOR045", address: "ul. PodgĂłrna 35 (Lidl)", city: "ToruĹ„", hours: "24/7", distanceKm: 33, lat: 53.0105, lng: 18.5750 },

  // ============================================================
  // GRUDZIÄ„DZ â€” ~42 paczkomatĂłw
  // ============================================================
  { code: "GRU001", address: "ul. DĹ‚uga 25", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4840, lng: 18.7530 },
  { code: "GRU002", address: "ul. CheĹ‚miĹ„ska 42", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 27, lat: 53.4800, lng: 18.7600 },
  { code: "GRU003", address: "ul. Tczewska 10", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4870, lng: 18.7450 },
  { code: "GRU004", address: "ul. RzeĹşnicka 5", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4820, lng: 18.7550 },
  { code: "GRU005", address: "ul. Dworcowa 15 (Lidl)", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4855, lng: 18.7480 },
  { code: "GRU006", address: "ul. DĹ‚uga 88", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 22, lat: 53.4890, lng: 18.7620 },
  { code: "GRU007", address: "ul. 3 Maja 28 (Kaufland)", city: "GrudziÄ…dz", hours: "06:00-22:00", distanceKm: 24, lat: 53.4780, lng: 18.7580 },
  { code: "GRU008", address: "ul. CheĹ‚miĹ„ska 120", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4750, lng: 18.7650 },
  { code: "GRU009", address: "ul. Dworcowa 40", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4875, lng: 18.7500 },
  { code: "GRU010", address: "ul. 3 Maja 55", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4810, lng: 18.7520 },
  { code: "GRU011", address: "ul. DĹ‚uga 120", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4860, lng: 18.7650 },
  { code: "GRU012", address: "ul. Tczewska 35", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 27, lat: 53.4890, lng: 18.7400 },
  { code: "GRU013", address: "ul. RzeĹşnicka 25", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4795, lng: 18.7570 },
  { code: "GRU014", address: "ul. Dworcowa 65 (Biedronka)", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4845, lng: 18.7450 },
  { code: "GRU015", address: "ul. CheĹ‚miĹ„ska 80", city: "GrudziÄ…dz", hours: "06:00-22:00", distanceKm: 25, lat: 53.4770, lng: 18.7620 },
  { code: "GRU016", address: "ul. 1 Maja 10", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4825, lng: 18.7580 },
  { code: "GRU017", address: "ul. KoĹ›ciuszki 18", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4850, lng: 18.7530 },
  { code: "GRU018", address: "ul. DĹ‚uga 160", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4905, lng: 18.7680 },
  { code: "GRU019", address: "ul. Tczewska 55", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4910, lng: 18.7380 },
  { code: "GRU020", address: "ul. RzeĹşnicka 40", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4785, lng: 18.7600 },
  { code: "GRU021", address: "ul. Dworcowa 85", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4865, lng: 18.7420 },
  { code: "GRU022", address: "ul. CheĹ‚miĹ„ska 160", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 27, lat: 53.4730, lng: 18.7700 },
  { code: "GRU023", address: "ul. 3 Maja 80", city: "GrudziÄ…dz", hours: "06:00-22:00", distanceKm: 25, lat: 53.4760, lng: 18.7550 },
  { code: "GRU024", address: "ul. Szkolna 5", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4830, lng: 18.7500 },
  { code: "GRU025", address: "ul. DĹ‚uga 200", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4920, lng: 18.7720 },
  { code: "GRU026", address: "ul. Tczewska 70", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4925, lng: 18.7350 },
  { code: "GRU027", address: "ul. RzeĹşnicka 60", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4775, lng: 18.7630 },
  { code: "GRU028", address: "ul. Dworcowa 100 (Lidl)", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4880, lng: 18.7400 },
  { code: "GRU029", address: "ul. CheĹ‚miĹ„ska 200", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 27, lat: 53.4710, lng: 18.7750 },
  { code: "GRU030", address: "ul. 1 Maja 35", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4815, lng: 18.7470 },
  { code: "GRU031", address: "ul. KoĹ›ciuszki 55", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4865, lng: 18.7560 },
  { code: "GRU032", address: "ul. Szkolna 22", city: "GrudziÄ…dz", hours: "06:00-22:00", distanceKm: 24, lat: 53.4840, lng: 18.7480 },
  { code: "GRU033", address: "ul. DĹ‚uga 240", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4935, lng: 18.7750 },
  { code: "GRU034", address: "ul. Tczewska 85", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4940, lng: 18.7320 },
  { code: "GRU035", address: "ul. 3 Maja 100", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4740, lng: 18.7500 },
  { code: "GRU036", address: "ul. Bydgoska 15", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 26, lat: 53.4790, lng: 18.7450 },
  { code: "GRU037", address: "ul. Dworcowa 120", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4895, lng: 18.7370 },
  { code: "GRU038", address: "ul. CheĹ‚miĹ„ska 55", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4785, lng: 18.7580 },
  { code: "GRU039", address: "ul. RzeĹşnicka 80", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4765, lng: 18.7610 },
  { code: "GRU040", address: "ul. 1 Maja 50", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 25, lat: 53.4805, lng: 18.7420 },
  { code: "GRU041", address: "ul. KoĹ›ciuszki 80", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 23, lat: 53.4880, lng: 18.7540 },
  { code: "GRU042", address: "ul. Szkolna 40 (Biedronka)", city: "GrudziÄ…dz", hours: "24/7", distanceKm: 24, lat: 53.4855, lng: 18.7460 },

  // ============================================================
  // INOWROCĹAW â€” ~42 paczkomatĂłw
  // ============================================================
  { code: "INO001", address: "ul. KrĂłlowej Jadwigi 15", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7980, lng: 18.2630 },
  { code: "INO002", address: "ul. Dworcowa 8", city: "InowrocĹ‚aw", hours: "06:00-22:00", distanceKm: 54, lat: 52.8005, lng: 18.2580 },
  { code: "INO003", address: "ul. PoznaĹ„ska 45 (Lidl)", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.7950, lng: 18.2700 },
  { code: "INO004", address: "ul. Solankowa 20", city: "InowrocĹ‚aw", hours: "06:00-22:00", distanceKm: 53, lat: 52.8020, lng: 18.2680 },
  { code: "INO005", address: "ul. Kujawska 30 (Biedronka)", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7950, lng: 18.2550 },
  { code: "INO006", address: "ul. ToruĹ„ska 45", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.8050, lng: 18.2750 },
  { code: "INO007", address: "ul. 1 Maja 12", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7970, lng: 18.2600 },
  { code: "INO008", address: "ul. Dworcowa 35", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8010, lng: 18.2550 },
  { code: "INO009", address: "ul. PoznaĹ„ska 80", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.7935, lng: 18.2750 },
  { code: "INO010", address: "ul. Solankowa 55", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8035, lng: 18.2720 },
  { code: "INO011", address: "ul. Kujawska 70", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7940, lng: 18.2500 },
  { code: "INO012", address: "ul. ToruĹ„ska 80", city: "InowrocĹ‚aw", hours: "06:00-22:00", distanceKm: 55, lat: 52.8070, lng: 18.2800 },
  { code: "INO013", address: "ul. 3 Maja 8", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7965, lng: 18.2620 },
  { code: "INO014", address: "ul. Dworcowa 55 (Biedronka)", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8025, lng: 18.2520 },
  { code: "INO015", address: "ul. PoznaĹ„ska 110", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 57, lat: 52.7920, lng: 18.2780 },
  { code: "INO016", address: "ul. Solankowa 80", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8045, lng: 18.2650 },
  { code: "INO017", address: "ul. Kujawska 95", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7930, lng: 18.2480 },
  { code: "INO018", address: "ul. ToruĹ„ska 15", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8060, lng: 18.2700 },
  { code: "INO019", address: "ul. 1 Maja 35", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.7985, lng: 18.2580 },
  { code: "INO020", address: "ul. Dworcowa 70", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8030, lng: 18.2500 },
  { code: "INO021", address: "ul. PoznaĹ„ska 15 (Lidl)", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.7960, lng: 18.2650 },
  { code: "INO022", address: "ul. Solankowa 95", city: "InowrocĹ‚aw", hours: "06:00-22:00", distanceKm: 53, lat: 52.8055, lng: 18.2600 },
  { code: "INO023", address: "ul. Kujawska 120", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7915, lng: 18.2450 },
  { code: "INO024", address: "ul. ToruĹ„ska 100", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.8080, lng: 18.2820 },
  { code: "INO025", address: "ul. 3 Maja 25", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7955, lng: 18.2600 },
  { code: "INO026", address: "ul. Dworcowa 90", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8040, lng: 18.2480 },
  { code: "INO027", address: "ul. PoznaĹ„ska 140", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 57, lat: 52.7905, lng: 18.2800 },
  { code: "INO028", address: "ul. Solankowa 30", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8015, lng: 18.2700 },
  { code: "INO029", address: "ul. Kujawska 45", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7960, lng: 18.2530 },
  { code: "INO030", address: "ul. ToruĹ„ska 25", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8055, lng: 18.2720 },
  { code: "INO031", address: "ul. 1 Maja 48", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.7990, lng: 18.2550 },
  { code: "INO032", address: "ul. Dworcowa 105", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8045, lng: 18.2460 },
  { code: "INO033", address: "ul. PoznaĹ„ska 55", city: "InowrocĹ‚aw", hours: "06:00-22:00", distanceKm: 56, lat: 52.7945, lng: 18.2680 },
  { code: "INO034", address: "ul. Solankowa 70", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8025, lng: 18.2630 },
  { code: "INO035", address: "ul. Kujawska 75", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7925, lng: 18.2510 },
  { code: "INO036", address: "ul. ToruĹ„ska 60", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.8075, lng: 18.2780 },
  { code: "INO037", address: "ul. 3 Maja 40", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.7945, lng: 18.2580 },
  { code: "INO038", address: "ul. Dworcowa 20", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 53, lat: 52.8000, lng: 18.2560 },
  { code: "INO039", address: "ul. PoznaĹ„ska 170", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 57, lat: 52.7895, lng: 18.2820 },
  { code: "INO040", address: "ul. Solankowa 110", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 54, lat: 52.8060, lng: 18.2580 },
  { code: "INO041", address: "ul. Kujawska 140", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 55, lat: 52.7905, lng: 18.2470 },
  { code: "INO042", address: "ul. ToruĹ„ska 5", city: "InowrocĹ‚aw", hours: "24/7", distanceKm: 56, lat: 52.8040, lng: 18.2700 },

  // ============================================================
  // WĹOCĹAWEK â€” ~42 paczkomatĂłw
  // ============================================================
  { code: "WLO001", address: "ul. ToruĹ„ska 30", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6480, lng: 19.0680 },
  { code: "WLO002", address: "ul. Brzeska 15 (Lidl)", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6505, lng: 19.0600 },
  { code: "WLO003", address: "ul. Kaliska 30 (Biedronka)", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6550, lng: 19.0800 },
  { code: "WLO004", address: "ul. Ĺ»ytnia 12", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 71, lat: 52.6420, lng: 19.0550 },
  { code: "WLO005", address: "ul. KiliĹ„skiego 45", city: "WĹ‚ocĹ‚awek", hours: "06:00-22:00", distanceKm: 68, lat: 52.6600, lng: 19.0720 },
  { code: "WLO006", address: "ul. ToruĹ„ska 70", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6470, lng: 19.0750 },
  { code: "WLO007", address: "ul. Brzeska 40", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6520, lng: 19.0580 },
  { code: "WLO008", address: "ul. Kaliska 55", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6570, lng: 19.0850 },
  { code: "WLO009", address: "ul. Ĺ»ytnia 35", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 71, lat: 52.6400, lng: 19.0520 },
  { code: "WLO010", address: "ul. KiliĹ„skiego 70", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 67, lat: 52.6625, lng: 19.0680 },
  { code: "WLO011", address: "ul. ToruĹ„ska 100 (Biedronka)", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6455, lng: 19.0800 },
  { code: "WLO012", address: "ul. Brzeska 70", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6540, lng: 19.0550 },
  { code: "WLO013", address: "ul. Kaliska 80", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6590, lng: 19.0900 },
  { code: "WLO014", address: "ul. Ĺ»ytnia 55", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 72, lat: 52.6385, lng: 19.0480 },
  { code: "WLO015", address: "ul. KiliĹ„skiego 20", city: "WĹ‚ocĹ‚awek", hours: "06:00-22:00", distanceKm: 67, lat: 52.6610, lng: 19.0650 },
  { code: "WLO016", address: "ul. ToruĹ„ska 15", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6490, lng: 19.0700 },
  { code: "WLO017", address: "ul. Brzeska 25", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6515, lng: 19.0620 },
  { code: "WLO018", address: "ul. Kaliska 15", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6545, lng: 19.0780 },
  { code: "WLO019", address: "ul. Ĺ»ytnia 70", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 71, lat: 52.6370, lng: 19.0500 },
  { code: "WLO020", address: "ul. KiliĹ„skiego 90", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 67, lat: 52.6635, lng: 19.0700 },
  { code: "WLO021", address: "ul. ToruĹ„ska 130", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6440, lng: 19.0850 },
  { code: "WLO022", address: "ul. Brzeska 95", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6555, lng: 19.0530 },
  { code: "WLO023", address: "ul. Kaliska 100", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6605, lng: 19.0950 },
  { code: "WLO024", address: "ul. Ĺ»ytnia 20", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 71, lat: 52.6415, lng: 19.0570 },
  { code: "WLO025", address: "ul. KiliĹ„skiego 5", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 67, lat: 52.6600, lng: 19.0630 },
  { code: "WLO026", address: "ul. ToruĹ„ska 50 (Lidl)", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6475, lng: 19.0720 },
  { code: "WLO027", address: "ul. Brzeska 50", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6530, lng: 19.0600 },
  { code: "WLO028", address: "ul. Kaliska 40", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6560, lng: 19.0820 },
  { code: "WLO029", address: "ul. Ĺ»ytnia 85", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 72, lat: 52.6360, lng: 19.0450 },
  { code: "WLO030", address: "ul. KiliĹ„skiego 110", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 67, lat: 52.6645, lng: 19.0720 },
  { code: "WLO031", address: "ul. ToruĹ„ska 160", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6430, lng: 19.0880 },
  { code: "WLO032", address: "ul. Brzeska 110", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6565, lng: 19.0500 },
  { code: "WLO033", address: "ul. Kaliska 120", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6615, lng: 19.0980 },
  { code: "WLO034", address: "ul. Ĺ»ytnia 40", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 71, lat: 52.6395, lng: 19.0550 },
  { code: "WLO035", address: "ul. KiliĹ„skiego 35", city: "WĹ‚ocĹ‚awek", hours: "06:00-22:00", distanceKm: 67, lat: 52.6595, lng: 19.0670 },
  { code: "WLO036", address: "ul. ToruĹ„ska 8", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6500, lng: 19.0650 },
  { code: "WLO037", address: "ul. Brzeska 5", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 68, lat: 52.6495, lng: 19.0630 },
  { code: "WLO038", address: "ul. Kaliska 65", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6580, lng: 19.0870 },
  { code: "WLO039", address: "ul. Ĺ»ytnia 95", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 72, lat: 52.6355, lng: 19.0430 },
  { code: "WLO040", address: "ul. KiliĹ„skiego 125", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 67, lat: 52.6655, lng: 19.0750 },
  { code: "WLO041", address: "ul. ToruĹ„ska 180", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 70, lat: 52.6420, lng: 19.0900 },
  { code: "WLO042", address: "ul. Dworcowa 10", city: "WĹ‚ocĹ‚awek", hours: "24/7", distanceKm: 69, lat: 52.6485, lng: 19.0620 },
];
export default function KoszykPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, isLoaded } = useCart();

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

  // Map zoom state (for interactive placeholder map)
  const [mapZoom, setMapZoom] = useState(1);

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

  // Normalize for Polish diacritics (so "swiecie" matches "Ĺšwiecie")
  const normalize = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const searchPaczkomats = (query: string) => {
    const q = query.trim();
    if (q.length < 3) {
      // For empty/short, prefer Ĺšwiecie and nearby kujawskie
      const localCities = ["Ĺšwiecie", "ToruĹ„", "Bydgoszcz", "GrudziÄ…dz", "InowrocĹ‚aw", "WĹ‚ocĹ‚awek", "CheĹ‚mno", "NakĹ‚o nad NoteciÄ…", "Brodnica", "Tuchola"];
      let local = SAMPLE_PACZKOMATS.filter(p => localCities.includes(p.city));
      // If searching partial, still use local but for <3 show Ĺšwiecie heavy
      if (q.length > 0) {
        const nq = normalize(q);
        local = local.filter(p =>
          normalize(p.code).includes(nq) ||
          normalize(p.city).includes(nq) ||
          normalize(p.address).includes(nq)
        );
      }
      return local.length > 0 ? local.slice(0, 25) : SAMPLE_PACZKOMATS.slice(0, 15);
    }
    const nq = normalize(q);
    let results = SAMPLE_PACZKOMATS.filter((p) =>
      normalize(p.code).includes(nq) ||
      normalize(p.city).includes(nq) ||
      normalize(p.address).includes(nq)
    );
    // Prioritize city matches (esp. Ĺšwiecie), then by distance
    results.sort((a, b) => {
      const aCity = normalize(a.city).includes(nq) ? 0 : 1;
      const bCity = normalize(b.city).includes(nq) ? 0 : 1;
      if (aCity !== bCity) return aCity - bCity;
      return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
    });
    return results.slice(0, 25);
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

  // Interactive map zoom controls
  const zoomIn = () => setMapZoom((z) => Math.min(2.6, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setMapZoom((z) => Math.max(0.55, +(z - 0.25).toFixed(2)));
  const resetMapZoom = () => setMapZoom(1);

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
    // Always read the freshest cart state directly from localStorage to avoid any stale React state issues
    // and ensure the correct items are sent to Stripe checkout
    let currentItems = items;
    try {
      const saved = localStorage.getItem("jankesowa-pasieka-cart");
      if (saved) {
        currentItems = JSON.parse(saved);
        // apply same filter as useCart for consistency
        currentItems = currentItems.filter((item: any) => !item.name?.toLowerCase().includes("pyłek"));
      }
    } catch (e) {
      console.error("Błąd odczytu koszyka z localStorage:", e);
    }

    if (!currentItems || currentItems.length === 0) {
      toast.error("Twój koszyk jest pusty");
      return;
    }

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

      await startStripeCheckout(currentItems, customerData);
      // Stripe will redirect
    } catch (err: any) {
      toast.error("Błąd płatności", {
        description: err.message || "Nie udało się rozpocząć płatności.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoaded && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F5EDE4] px-6">
        <div className="text-center max-w-xs">
          <div className="mx-auto w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">đźŞ´</span>
          </div>
          <h1 className="font-serif text-3xl text-brand-brown mb-3">Twój koszyk jest pusty</h1>
          <p className="text-brand-brown/70 mb-8">Nie masz jeszcze produktów w koszyku. Dodaj wybrane miody ze strony oferty.</p>
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
                          Wpisz nazwę miasta (Świecie, Bydgoszcz, Toruń...) lub kod paczkomatu. Wybierz z listy lub kliknij pinezkę.
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
                              className="border border-brand-creamDark rounded-2xl overflow-hidden bg-white max-h-[260px] overflow-y-auto shadow-sm"
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
                          {/* Responsywny kontener mapy z zoomem */}
                          <div className="relative w-full overflow-hidden rounded-xl border border-[#7C664C] bg-[#E8DFCF]"
                               style={{ height: 'clamp(190px, 26vh, 280px)' }}>
                            {/* Warstwa skalowana (zoom) */}
                            <div
                              className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
                              style={{ 
                                transform: `scale(${mapZoom})`,
                                background: 'linear-gradient(148deg, #2f4233 0%, #3f5241 28%, #c9b79c 58%, #a68e6f 82%, #2f4233 100%)',
                                backgroundSize: 'cover'
                              }}
                            >
                              {/* Subtelna, ziemista tekstura pól i dróg */}
                              <div className="absolute inset-0 opacity-[0.12]" 
                                   style={{
                                     backgroundImage: 'repeating-linear-gradient(28deg, transparent, transparent 7px, rgba(92,64,51,0.22) 7px, rgba(92,64,51,0.22) 11px), repeating-linear-gradient(-32deg, transparent, transparent 11px, rgba(92,64,51,0.13) 11px, rgba(92,64,51,0.13) 19px)'
                                   }} />

                              {/* Bardzo subtelna siatka dróg i podziałów */}
                              <div className="absolute inset-0 opacity-[0.10]" style={{
                                background: 'linear-gradient(90deg, transparent 48%, rgba(92,64,51,0.28) 49%, rgba(92,64,51,0.28) 51%, transparent 52%), linear-gradient(0deg, transparent 48%, rgba(92,64,51,0.22) 49%, rgba(92,64,51,0.22) 51%, transparent 52%)'
                              }} />

                              {/* Klikalne pinezki */}
                              {(() => {
                                let mapPins = searchResults.length > 0 ? [...searchResults] : [];
                                if (selectedPaczkomat && !mapPins.some(m => m.code === selectedPaczkomat.code)) {
                                  mapPins = [selectedPaczkomat, ...mapPins];
                                }
                                if (mapPins.length < 18) {
                                  const localCities = ["Ĺšwiecie","ToruĹ„","Bydgoszcz","GrudziÄ…dz","InowrocĹ‚aw","WĹ‚ocĹ‚awek","CheĹ‚mno","NakĹ‚o nad NoteciÄ…","Brodnica","Tuchola"];
                                  const extras = SAMPLE_PACZKOMATS.filter(p => 
                                    localCities.includes(p.city) && !mapPins.some(m => m.code === p.code)
                                  );
                                  mapPins = [...mapPins, ...extras].slice(0, 30);
                                }
                                return mapPins.slice(0, 30).map((p, i) => {
                                  const isSel = selectedPaczkomat?.code === p.code;
                                  let left = 18 + (i * 4.7) % 64;
                                  let top = 24 + ((i * 6.3) % 52);
                                  if (p.lat && p.lng) {
                                    const minLat = 52.65, maxLat = 53.62, minLng = 17.48, maxLng = 19.05;
                                    left = 7 + ((p.lng - minLng) / (maxLng - minLng)) * 86;
                                    top = 11 + ((maxLat - p.lat) / (maxLat - minLat)) * 77;
                                  }
                                  const jitter = ((i % 5) - 2) * 0.6;
                                  left = Math.max(5, Math.min(94, left + jitter));
                                  top = Math.max(7, Math.min(90, top - jitter * 0.5));

                                  return (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => selectPaczkomat(p)}
                                      className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 group transition-all duration-150 focus:outline-none ${isSel ? 'z-30 scale-[1.22]' : 'z-10 hover:scale-110'}`}
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
                            </div>

                            {/* Elegancka etykieta regionu (nie skalowana) */}
                            <div className="absolute top-2 left-2 bg-[#F5EDE4]/90 backdrop-blur-sm px-2 py-px rounded text-[9px] text-[#463326] font-medium shadow-sm border border-[#8B7355]/25 flex items-center gap-1 pointer-events-none">
                              <MapPin className="h-2.5 w-2.5" /> Kujawy i okolice
                            </div>

                            {/* DziaĹ‚ajÄ…ce przyciski zoom + i - (nie skalowane) */}
                            <div className="absolute bottom-2 right-2 flex flex-col bg-[#F5EDE4]/90 backdrop-blur-sm rounded text-[#463326] text-[11px] shadow-sm border border-[#8B7355]/30 overflow-hidden">
                              <button 
                                type="button"
                                onClick={zoomIn} 
                                className="px-1.5 py-0.5 hover:bg-[#EDE4D6] active:bg-[#d4c5a9] leading-none border-b border-[#8B7355]/20 font-medium"
                                aria-label="Przybliż mapę"
                              >
                                +
                              </button>
                              <button 
                                type="button"
                                onClick={zoomOut} 
                                className="px-1.5 py-0.5 hover:bg-[#EDE4D6] active:bg-[#d4c5a9] leading-none border-b border-[#8B7355]/20 font-medium"
                                aria-label="Oddal mapę"
                              >
                                −
                              </button>
                              <button 
                                type="button"
                                onClick={resetMapZoom} 
                                className="px-1 py-px text-[9px] hover:bg-[#EDE4D6] active:bg-[#d4c5a9] leading-none"
                                title="Reset zoom"
                              >
                                â†ş
                              </button>
                            </div>

                            {/* WskaĹşnik zoomu */}
                            <div className="absolute bottom-2 left-2 text-[9px] text-[#463326]/70 bg-[#F5EDE4]/70 px-1.5 py-px rounded pointer-events-none tabular-nums">
                              {mapZoom.toFixed(1)}Ă—
                            </div>
                          </div>

                          <p className="text-[9px] text-[#5c4033]/65 mt-1.5 text-center">
                            {searchResults.length > 0 
                              ? `Pinezki odpowiadają wynikom • kliknij na mapie lub liście, by wybrać` 
                              : "Wpisz miasto (Świecie, Toruń, Bydgoszcz...) — liczne pinezki do kliknięcia"}
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
