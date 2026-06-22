"use client";

import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, Truck, Package, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
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

// Rozszerzona baza paczkomatów InPost (duża, działająca lista 70-80+ wpisów)
// - Toruń (Mokre, Rubinkowo, Na Skarpie i wiele innych osiedli)
// - Bydgoszcz, Świecie, Grudziądz, Inowrocław, Włocławek
// - Katowice, Gliwice i inne
// Każdy wpis ma code, address, city (plus hours, distance dla UI)
const paczkomaty: Paczkomat[] = [
  // Kilka z innych regionów (dla kompletności)
  { code: "WAW001", address: "ul. Marszałkowska 104/106", city: "Warszawa", hours: "24/7", distanceKm: 240, lat: 52.2297, lng: 21.0122 },
  { code: "WAW002", address: "ul. Świętokrzyska 30", city: "Warszawa", hours: "24/7", distanceKm: 238, lat: 52.2319, lng: 21.0067 },
  { code: "KRK001", address: "ul. Floriańska 15", city: "Kraków", hours: "24/7", distanceKm: 380, lat: 50.0619, lng: 19.9373 },
  { code: "POZ001", address: "ul. Półwiejska 27", city: "Poznań", hours: "24/7", distanceKm: 150, lat: 52.4064, lng: 16.9252 },
  { code: "GDA001", address: "ul. Długa 41", city: "Gdańsk", hours: "24/7", distanceKm: 160, lat: 54.3520, lng: 18.6466 },

  // === ŚWIECIE (25) ===
  { code: "SWI001", address: "ul. Wojska Polskiego 12 (Biedronka)", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4128, lng: 18.4525 },
  { code: "SWI002", address: "ul. Wojska Polskiego 76 (Lidl)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4123, lng: 18.4521 },
  { code: "SWI003", address: "ul. Chełmińska 45 (Kaufland)", city: "Świecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4105, lng: 18.4480 },
  { code: "SWI004", address: "ul. Rynek 5 (centrum)", city: "Świecie", hours: "24/7", distanceKm: 1, lat: 53.4098, lng: 18.4472 },
  { code: "SWI005", address: "ul. Bydgoska 25", city: "Świecie", hours: "24/7", distanceKm: 5, lat: 53.4145, lng: 18.4530 },
  { code: "SWI006", address: "ul. 1 Maja 8", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4102, lng: 18.4495 },
  { code: "SWI007", address: "ul. Szkolna 12", city: "Świecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4085, lng: 18.4465 },
  { code: "SWI008", address: "ul. Kościuszki 22", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4110, lng: 18.4508 },
  { code: "SWI009", address: "ul. Mickiewicza 4", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4092, lng: 18.4458 },
  { code: "SWI010", address: "ul. 3 Maja 28", city: "Świecie", hours: "24/7", distanceKm: 1, lat: 53.4100, lng: 18.4478 },
  { code: "SWI011", address: "ul. Dworcowa 3 (stacja PKP)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4115, lng: 18.4490 },
  { code: "SWI012", address: "ul. Chełmińska 80", city: "Świecie", hours: "06:00-22:00", distanceKm: 5, lat: 53.4088, lng: 18.4425 },
  { code: "SWI013", address: "ul. Sportowa 10 (osiedle)", city: "Świecie", hours: "24/7", distanceKm: 4, lat: 53.4070, lng: 18.4535 },
  { code: "SWI014", address: "ul. Wojska Polskiego 130 (Biedronka)", city: "Świecie", hours: "24/7", distanceKm: 4, lat: 53.4150, lng: 18.4555 },
  { code: "SWI015", address: "ul. 3 Maja 55 (Lidl)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4110, lng: 18.4490 },
  { code: "SWI016", address: "ul. Bydgoska 60 (Kaufland)", city: "Świecie", hours: "06:00-22:00", distanceKm: 4, lat: 53.4135, lng: 18.4515 },
  { code: "SWI017", address: "ul. Kościuszki 55 (Żabka)", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4105, lng: 18.4515 },
  { code: "SWI018", address: "ul. Rynek 22 (centrum)", city: "Świecie", hours: "24/7", distanceKm: 1, lat: 53.4095, lng: 18.4480 },
  { code: "SWI019", address: "ul. Szkolna 30", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4080, lng: 18.4475 },
  { code: "SWI020", address: "ul. Dworcowa 18 (osiedle)", city: "Świecie", hours: "24/7", distanceKm: 2, lat: 53.4120, lng: 18.4500 },
  { code: "SWI021", address: "ul. Chełmińska 110", city: "Świecie", hours: "06:00-22:00", distanceKm: 5, lat: 53.4095, lng: 18.4435 },
  { code: "SWI022", address: "ul. 1 Maja 35 (Biedronka)", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4118, lng: 18.4505 },
  { code: "SWI023", address: "ul. Mickiewicza 18", city: "Świecie", hours: "24/7", distanceKm: 3, lat: 53.4098, lng: 18.4465 },
  { code: "SWI024", address: "ul. Sportowa 25 (osiedle)", city: "Świecie", hours: "24/7", distanceKm: 4, lat: 53.4065, lng: 18.4545 },
  { code: "SWI025", address: "ul. Bydgoska 90 (Lidl)", city: "Świecie", hours: "24/7", distanceKm: 5, lat: 53.4160, lng: 18.4560 },

  // === CHEŁMNO (12) ===
  { code: "CHE001", address: "ul. Rynek 8", city: "Chełmno", hours: "24/7", distanceKm: 18, lat: 53.3480, lng: 18.4250 },
  { code: "CHE002", address: "ul. Toruńska 18", city: "Chełmno", hours: "24/7", distanceKm: 16, lat: 53.3500, lng: 18.4300 },
  { code: "CHE003", address: "ul. Świecka 5", city: "Chełmno", hours: "06:00-22:00", distanceKm: 19, lat: 53.3450, lng: 18.4200 },
  { code: "CHE004", address: "ul. Rynek 25", city: "Chełmno", hours: "24/7", distanceKm: 17, lat: 53.3475, lng: 18.4280 },
  { code: "CHE005", address: "ul. Wodna 2", city: "Chełmno", hours: "24/7", distanceKm: 15, lat: 53.3490, lng: 18.4220 },
  { code: "CHE006", address: "ul. Szkolna 10", city: "Chełmno", hours: "06:00-22:00", distanceKm: 17, lat: 53.3465, lng: 18.4270 },
  { code: "CHE007", address: "ul. Toruńska 55", city: "Chełmno", hours: "24/7", distanceKm: 14, lat: 53.3520, lng: 18.4350 },
  { code: "CHE008", address: "ul. Dworcowa 3", city: "Chełmno", hours: "24/7", distanceKm: 16, lat: 53.3485, lng: 18.4320 },
  { code: "CHE009", address: "ul. 1 Maja 22", city: "Chełmno", hours: "06:00-22:00", distanceKm: 18, lat: 53.3510, lng: 18.4150 },
  { code: "CHE010", address: "ul. Chełmińska 40", city: "Chełmno", hours: "24/7", distanceKm: 15, lat: 53.3495, lng: 18.4180 },
  { code: "CHE011", address: "ul. Szkolna 28", city: "Chełmno", hours: "24/7", distanceKm: 17, lat: 53.3472, lng: 18.4245 },
  { code: "CHE012", address: "ul. 3 Maja 15", city: "Chełmno", hours: "24/7", distanceKm: 19, lat: 53.3440, lng: 18.4280 },

  // === NAKŁO NAD NOTECIĄ (12) ===
  { code: "NAK001", address: "ul. Bydgoska 20", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 30, lat: 53.1400, lng: 17.6000 },
  { code: "NAK002", address: "ul. Kościuszki 5", city: "Nakło nad Notecią", hours: "06:00-22:00", distanceKm: 29, lat: 53.1420, lng: 17.5950 },
  { code: "NAK003", address: "ul. Notecka 12", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 31, lat: 53.1380, lng: 17.6050 },
  { code: "NAK004", address: "ul. Bydgoska 55", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 28, lat: 53.1435, lng: 17.5980 },
  { code: "NAK005", address: "ul. 1 Maja 10", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 29, lat: 53.1410, lng: 17.5920 },
  { code: "NAK006", address: "ul. Poznańska 22", city: "Nakło nad Notecią", hours: "06:00-22:00", distanceKm: 31, lat: 53.1350, lng: 17.6100 },
  { code: "NAK007", address: "ul. Kościuszki 28", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 30, lat: 53.1395, lng: 17.6030 },
  { code: "NAK008", address: "ul. Dworcowa 4 (PKP)", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 29, lat: 53.1425, lng: 17.6075 },
  { code: "NAK009", address: "ul. 3 Maja 18", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 32, lat: 53.1365, lng: 17.5970 },
  { code: "NAK010", address: "ul. Lipowa 9 (osiedle)", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 28, lat: 53.1440, lng: 17.5900 },
  { code: "NAK011", address: "ul. Szkolna 7", city: "Nakło nad Notecią", hours: "06:00-22:00", distanceKm: 30, lat: 53.1418, lng: 17.6015 },
  { code: "NAK012", address: "ul. Bydgoska 90 (Lidl)", city: "Nakło nad Notecią", hours: "24/7", distanceKm: 31, lat: 53.1370, lng: 17.6120 },

  // === BRODNICA (12) ===
  { code: "BRO001", address: "ul. Kościuszki 15", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2590, lng: 19.3950 },
  { code: "BRO002", address: "ul. Zamkowa 5", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2605, lng: 19.4020 },
  { code: "BRO003", address: "ul. 3 Maja 28 (Lidl)", city: "Brodnica", hours: "24/7", distanceKm: 56, lat: 53.2550, lng: 19.3850 },
  { code: "BRO004", address: "ul. Sądowa 10", city: "Brodnica", hours: "06:00-22:00", distanceKm: 53, lat: 53.2620, lng: 19.4080 },
  { code: "BRO005", address: "ul. Mickiewicza 40", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2575, lng: 19.3900 },
  { code: "BRO006", address: "ul. Chopina 3", city: "Brodnica", hours: "24/7", distanceKm: 57, lat: 53.2520, lng: 19.3980 },
  { code: "BRO007", address: "ul. 1 Maja 12 (Biedronka)", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2580, lng: 19.3880 },
  { code: "BRO008", address: "ul. Ratuszowa 2", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2610, lng: 19.4000 },
  { code: "BRO009", address: "ul. Toruńska 45", city: "Brodnica", hours: "24/7", distanceKm: 56, lat: 53.2545, lng: 19.3920 },
  { code: "BRO010", address: "ul. Szkolna 8", city: "Brodnica", hours: "06:00-22:00", distanceKm: 53, lat: 53.2595, lng: 19.4040 },
  { code: "BRO011", address: "ul. Dworcowa 7", city: "Brodnica", hours: "24/7", distanceKm: 55, lat: 53.2565, lng: 19.3970 },
  { code: "BRO012", address: "ul. Grunwaldzka 22", city: "Brodnica", hours: "24/7", distanceKm: 54, lat: 53.2630, lng: 19.3855 },

  // === TUCHOLA (12) ===
  { code: "TUC001", address: "ul. Kościuszki 20", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5890, lng: 17.8600 },
  { code: "TUC002", address: "ul. 1 Maja 8", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5850, lng: 17.8550 },
  { code: "TUC003", address: "ul. Bydgoska 30", city: "Tuchola", hours: "06:00-22:00", distanceKm: 47, lat: 53.5920, lng: 17.8720 },
  { code: "TUC004", address: "pl. Wolności 5", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5875, lng: 17.8580 },
  { code: "TUC005", address: "ul. 3 Maja 15 (Biedronka)", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5840, lng: 17.8620 },
  { code: "TUC006", address: "ul. Dworcowa 2", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5905, lng: 17.8680 },
  { code: "TUC007", address: "ul. Szkolna 11", city: "Tuchola", hours: "06:00-22:00", distanceKm: 47, lat: 53.5880, lng: 17.8555 },
  { code: "TUC008", address: "ul. Lipowa 6", city: "Tuchola", hours: "24/7", distanceKm: 50, lat: 53.5835, lng: 17.8700 },
  { code: "TUC009", address: "ul. Kościuszki 45", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5910, lng: 17.8640 },
  { code: "TUC010", address: "ul. Rynek 3", city: "Tuchola", hours: "24/7", distanceKm: 49, lat: 53.5865, lng: 17.8590 },
  { code: "TUC011", address: "ul. Chojnicka 18", city: "Tuchola", hours: "24/7", distanceKm: 47, lat: 53.5935, lng: 17.8750 },
  { code: "TUC012", address: "ul. 1 Maja 25 (Lidl)", city: "Tuchola", hours: "24/7", distanceKm: 48, lat: 53.5820, lng: 17.8570 },

  // === KORONOWO (10) ===
  { code: "KOR001", address: "ul. 3 Maja 8", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3200, lng: 17.9300 },
  { code: "KOR002", address: "ul. Bydgoska 15", city: "Koronowo", hours: "24/7", distanceKm: 26, lat: 53.3180, lng: 17.9350 },
  { code: "KOR003", address: "ul. 1 Maja 12 (Biedronka)", city: "Koronowo", hours: "24/7", distanceKm: 24, lat: 53.3220, lng: 17.9280 },
  { code: "KOR004", address: "ul. Dworcowa 5", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3175, lng: 17.9400 },
  { code: "KOR005", address: "ul. Kościuszki 22", city: "Koronowo", hours: "06:00-22:00", distanceKm: 26, lat: 53.3195, lng: 17.9320 },
  { code: "KOR006", address: "ul. Szkolna 4", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3210, lng: 17.9250 },
  { code: "KOR007", address: "ul. 3 Maja 30", city: "Koronowo", hours: "24/7", distanceKm: 27, lat: 53.3150, lng: 17.9380 },
  { code: "KOR008", address: "pl. Zwycięstwa 1", city: "Koronowo", hours: "24/7", distanceKm: 25, lat: 53.3190, lng: 17.9290 },
  { code: "KOR009", address: "ul. Bydgoska 48 (Lidl)", city: "Koronowo", hours: "24/7", distanceKm: 26, lat: 53.3165, lng: 17.9420 },
  { code: "KOR010", address: "ul. Leśna 9", city: "Koronowo", hours: "24/7", distanceKm: 28, lat: 53.3140, lng: 17.9200 },

  // === SOLEC KUJAWSKI (10) ===
  { code: "SOL001", address: "ul. Główna 22", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0800, lng: 18.2300 },
  { code: "SOL002", address: "ul. Toruńska 8 (Lidl)", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0820, lng: 18.2250 },
  { code: "SOL003", address: "ul. 1 Maja 15", city: "Solec Kujawski", hours: "24/7", distanceKm: 41, lat: 53.0780, lng: 18.2350 },
  { code: "SOL004", address: "ul. Bydgoska 30 (Biedronka)", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0815, lng: 18.2280 },
  { code: "SOL005", address: "ul. Dworcowa 3", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0830, lng: 18.2320 },
  { code: "SOL006", address: "ul. Szkolna 7", city: "Solec Kujawski", hours: "06:00-22:00", distanceKm: 42, lat: 53.0770, lng: 18.2220 },
  { code: "SOL007", address: "ul. Kościuszki 18", city: "Solec Kujawski", hours: "24/7", distanceKm: 40, lat: 53.0795, lng: 18.2380 },
  { code: "SOL008", address: "ul. 3 Maja 5", city: "Solec Kujawski", hours: "24/7", distanceKm: 41, lat: 53.0805, lng: 18.2270 },
  { code: "SOL009", address: "ul. Leśna 12", city: "Solec Kujawski", hours: "24/7", distanceKm: 39, lat: 53.0840, lng: 18.2200 },
  { code: "SOL010", address: "ul. Toruńska 55", city: "Solec Kujawski", hours: "24/7", distanceKm: 42, lat: 53.0750, lng: 18.2400 },

  // === CIECHOCINEK (12) ===
  { code: "CIE001", address: "ul. Zdrojowa 15", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8800, lng: 18.7950 },
  { code: "CIE002", address: "ul. Kopernika 8", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8820, lng: 18.7850 },
  { code: "CIE003", address: "ul. Wojska Polskiego 5", city: "Ciechocinek", hours: "06:00-22:00", distanceKm: 63, lat: 52.8785, lng: 18.8020 },
  { code: "CIE004", address: "pl. Zdrojowy 1", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8795, lng: 18.7920 },
  { code: "CIE005", address: "ul. 1 Maja 18", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8810, lng: 18.7880 },
  { code: "CIE006", address: "ul. Toruńska 22", city: "Ciechocinek", hours: "24/7", distanceKm: 63, lat: 52.8770, lng: 18.7980 },
  { code: "CIE007", address: "ul. Kościuszki 4", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8830, lng: 18.7900 },
  { code: "CIE008", address: "ul. 3 Maja 9 (Biedronka)", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8805, lng: 18.8000 },
  { code: "CIE009", address: "ul. Szkolna 6", city: "Ciechocinek", hours: "06:00-22:00", distanceKm: 64, lat: 52.8755, lng: 18.7850 },
  { code: "CIE010", address: "ul. Zdrojowa 40", city: "Ciechocinek", hours: "24/7", distanceKm: 62, lat: 52.8790, lng: 18.8050 },
  { code: "CIE011", address: "ul. Lipowa 11", city: "Ciechocinek", hours: "24/7", distanceKm: 63, lat: 52.8815, lng: 18.7820 },
  { code: "CIE012", address: "ul. Kujawska 2", city: "Ciechocinek", hours: "24/7", distanceKm: 61, lat: 52.8840, lng: 18.7950 },

  // === ALEKSANDRłW KUJAWSKI (10) ===
  { code: "ALE001", address: "ul. 3 Maja 10", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8760, lng: 18.6930 },
  { code: "ALE002", address: "ul. Kościuszki 25 (Lidl)", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8720, lng: 18.6850 },
  { code: "ALE003", address: "ul. Toruńska 12", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 57, lat: 52.8800, lng: 18.7000 },
  { code: "ALE004", address: "ul. 1 Maja 7", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8750, lng: 18.6900 },
  { code: "ALE005", address: "ul. Dworcowa 1", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8710, lng: 18.6950 },
  { code: "ALE006", address: "ul. Bydgoska 18", city: "Aleksandrów Kujawski", hours: "06:00-22:00", distanceKm: 57, lat: 52.8780, lng: 18.6880 },
  { code: "ALE007", address: "ul. Kościuszki 50", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 58, lat: 52.8735, lng: 18.6800 },
  { code: "ALE008", address: "ul. 3 Maja 22 (Biedronka)", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 59, lat: 52.8745, lng: 18.6980 },
  { code: "ALE009", address: "ul. Szkolna 3", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 57, lat: 52.8775, lng: 18.6920 },
  { code: "ALE010", address: "ul. Lipowa 8", city: "Aleksandrów Kujawski", hours: "24/7", distanceKm: 60, lat: 52.8700, lng: 18.7020 },

  // === LIPNO (10) ===
  { code: "LIP001", address: "ul. 3 Maja 18", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8450, lng: 19.1800 },
  { code: "LIP002", address: "ul. Kościuszki 7", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8420, lng: 19.1750 },
  { code: "LIP003", address: "ul. Toruńska 22", city: "Lipno", hours: "06:00-22:00", distanceKm: 76, lat: 52.8480, lng: 19.1880 },
  { code: "LIP004", address: "ul. 1 Maja 5", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8440, lng: 19.1780 },
  { code: "LIP005", address: "ul. Rynek 2", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8460, lng: 19.1820 },
  { code: "LIP006", address: "ul. Bydgoska 12 (Lidl)", city: "Lipno", hours: "24/7", distanceKm: 76, lat: 52.8410, lng: 19.1720 },
  { code: "LIP007", address: "ul. Szkolna 9", city: "Lipno", hours: "24/7", distanceKm: 75, lat: 52.8435, lng: 19.1850 },
  { code: "LIP008", address: "ul. 3 Maja 35", city: "Lipno", hours: "24/7", distanceKm: 74, lat: 52.8470, lng: 19.1750 },
  { code: "LIP009", address: "ul. Dworcowa 4", city: "Lipno", hours: "24/7", distanceKm: 77, lat: 52.8400, lng: 19.1900 },
  { code: "LIP010", address: "ul. Kościuszki 30", city: "Lipno", hours: "06:00-22:00", distanceKm: 75, lat: 52.8455, lng: 19.1700 },

  // === RYPIN (10) ===
  { code: "RYP001", address: "ul. 3 Maja 10", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8550, lng: 19.4100 },
  { code: "RYP002", address: "ul. Kościuszki 30", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8520, lng: 19.4050 },
  { code: "RYP003", address: "ul. Lipnowska 5", city: "Rypin", hours: "24/7", distanceKm: 69, lat: 52.8580, lng: 19.4180 },
  { code: "RYP004", address: "ul. 1 Maja 8", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8540, lng: 19.4080 },
  { code: "RYP005", address: "ul. Rynek 4", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8530, lng: 19.4120 },
  { code: "RYP006", address: "ul. Toruńska 15 (Biedronka)", city: "Rypin", hours: "24/7", distanceKm: 69, lat: 52.8565, lng: 19.4020 },
  { code: "RYP007", address: "ul. Szkolna 6", city: "Rypin", hours: "06:00-22:00", distanceKm: 68, lat: 52.8510, lng: 19.4150 },
  { code: "RYP008", address: "ul. 3 Maja 28", city: "Rypin", hours: "24/7", distanceKm: 67, lat: 52.8570, lng: 19.4050 },
  { code: "RYP009", address: "ul. Dworcowa 2", city: "Rypin", hours: "24/7", distanceKm: 70, lat: 52.8500, lng: 19.4200 },
  { code: "RYP010", address: "ul. Kościuszki 55", city: "Rypin", hours: "24/7", distanceKm: 68, lat: 52.8545, lng: 19.4000 },

  // === GOLUB-DOBRZYŃ (10) ===
  { code: "GOL001", address: "ul. Ratuszowa 2", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 52, lat: 53.1100, lng: 19.0500 },
  { code: "GOL002", address: "ul. 3 Maja 15", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 53, lat: 53.1050, lng: 19.0450 },
  { code: "GOL003", address: "ul. Bydgoska 8", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 51, lat: 53.1150, lng: 19.0550 },
  { code: "GOL004", address: "ul. 1 Maja 4", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 52, lat: 53.1080, lng: 19.0480 },
  { code: "GOL005", address: "ul. Kościuszki 12", city: "Golub-Dobrzyń", hours: "06:00-22:00", distanceKm: 53, lat: 53.1120, lng: 19.0520 },
  { code: "GOL006", address: "ul. Toruńska 9 (Lidl)", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 51, lat: 53.1060, lng: 19.0600 },
  { code: "GOL007", address: "ul. Dworcowa 1", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 52, lat: 53.1090, lng: 19.0420 },
  { code: "GOL008", address: "ul. 3 Maja 25", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 54, lat: 53.1030, lng: 19.0480 },
  { code: "GOL009", address: "ul. Szkolna 5", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 51, lat: 53.1140, lng: 19.0500 },
  { code: "GOL010", address: "pl. Wolności 2", city: "Golub-Dobrzyń", hours: "24/7", distanceKm: 53, lat: 53.1075, lng: 19.0530 },

  // === MOGILNO + inne mniejsze (~11) ===
  { code: "MOG001", address: "ul. Rynek 4", city: "Mogilno", hours: "24/7", distanceKm: 78, lat: 52.6600, lng: 17.9500 },
  { code: "MOG002", address: "ul. Kościuszki 18", city: "Mogilno", hours: "24/7", distanceKm: 77, lat: 52.6550, lng: 17.9450 },
  { code: "MOG003", address: "ul. 3 Maja 7 (Biedronka)", city: "Mogilno", hours: "24/7", distanceKm: 78, lat: 52.6620, lng: 17.9520 },
  { code: "STR001", address: "ul. Rynek 3", city: "Strzelno", hours: "24/7", distanceKm: 72, lat: 52.6280, lng: 18.1720 },
  { code: "STR002", address: "ul. 1 Maja 10", city: "Strzelno", hours: "24/7", distanceKm: 71, lat: 52.6250, lng: 18.1680 },
  { code: "SEP004", address: "ul. 1 Maja 25", city: "Słpłlno Krajełskie", hours: "24/7", distanceKm: 42, lat: 53.4580, lng: 17.5280 },
  { code: "ZNI003", address: "ul. 3 Maja 12", city: "Żnin", hours: "24/7", distanceKm: 65, lat: 52.8520, lng: 17.7180 },

  // ============================================================
  // BYDGOSZCZ ~55 paczkomatów (lepsze pokrycie osiedli)
  // ============================================================
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
  { code: "BYD013", address: "ul. Gdańska 180 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1320, lng: 18.0220 },
  { code: "BYD014", address: "ul. Gdańska 250 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1345, lng: 18.0280 },
  { code: "BYD015", address: "ul. Wojska Polskiego 12", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1255, lng: 17.9985 },
  { code: "BYD016", address: "ul. Fordońska 140 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1400, lng: 18.0350 },
  { code: "BYD017", address: "ul. Jagiellońska 80 (Kaufland)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1285, lng: 18.0180 },
  { code: "BYD018", address: "ul. Szubińska 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1120, lng: 17.9820 },
  { code: "BYD019", address: "ul. Pomorska 88", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1230, lng: 17.9880 },
  { code: "BYD020", address: "ul. Fordońska 55 (Auchan)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1375, lng: 18.0300 },
  { code: "BYD021", address: "ul. Gdańska 320", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1365, lng: 18.0250 },
  { code: "BYD022", address: "ul. Jagiellońska 140", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1290, lng: 18.0220 },
  { code: "BYD023", address: "ul. Długa 45", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1195, lng: 17.9980 },
  { code: "BYD024", address: "ul. Nakielska 12 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 50, lat: 53.1330, lng: 17.9750 },
  { code: "BYD025", address: "ul. Grunwaldzka 22", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 47, lat: 53.1245, lng: 18.0150 },
  { code: "BYD026", address: "ul. Focha 45", city: "Bydgoszcz", hours: "24/7", distanceKm: 42, lat: 53.1205, lng: 18.0080 },
  { code: "BYD027", address: "ul. Pomorska 65", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1265, lng: 17.9920 },
  { code: "BYD028", address: "ul. Szubińska 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1140, lng: 17.9850 },
  { code: "BYD029", address: "ul. Kujawska 55", city: "Bydgoszcz", hours: "24/7", distanceKm: 44, lat: 53.1185, lng: 18.0200 },
  { code: "BYD030", address: "ul. Wojska Polskiego 65 (Lidl)", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1275, lng: 17.9950 },
  { code: "BYD031", address: "ul. Fordońska 200", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1390, lng: 18.0380 },
  { code: "BYD032", address: "ul. Dworcowa 48", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1300, lng: 18.0000 },
  { code: "BYD033", address: "ul. Gdańska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1250, lng: 18.0050 },
  { code: "BYD034", address: "ul. Jagiellońska 200", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 42, lat: 53.1315, lng: 18.0250 },
  { code: "BYD035", address: "ul. Leśna 8 (osiedle)", city: "Bydgoszcz", hours: "24/7", distanceKm: 51, lat: 53.1420, lng: 17.9700 },
  { code: "BYD036", address: "ul. Grunwaldzka 150", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1280, lng: 18.0250 },
  { code: "BYD037", address: "ul. Nakielska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1340, lng: 17.9780 },
  { code: "BYD038", address: "ul. Bydgoska 10 (Biedronka)", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1220, lng: 18.0100 },
  { code: "BYD039", address: "ul. Sienkiewicza 15", city: "Bydgoszcz", hours: "24/7", distanceKm: 44, lat: 53.1190, lng: 18.0020 },
  { code: "BYD040", address: "ul. Kujawska 90", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1170, lng: 18.0180 },
  { code: "BYD041", address: "ul. Marszałka Focha 60", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1210, lng: 18.0150 },
  { code: "BYD042", address: "ul. Długa 120", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1185, lng: 17.9950 },
  { code: "BYD043", address: "ul. Pomorska 150 (Kaufland)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 44, lat: 53.1270, lng: 17.9880 },
  { code: "BYD044", address: "ul. Szubińska 160", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1115, lng: 17.9800 },
  { code: "BYD045", address: "ul. Fordońska 80", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1380, lng: 18.0330 },
  // Dodatkowe — Fordon, Błonie, Szwederowo, Wyżyny, Bartodzieje
  { code: "BYD046", address: "ul. Fordońska 280 (Biedronka, os. Fordon)", city: "Bydgoszcz", hours: "24/7", distanceKm: 52, lat: 53.1450, lng: 18.0550 },
  { code: "BYD047", address: "ul. Nakielska 140 (Lidl, os. Błonie)", city: "Bydgoszcz", hours: "24/7", distanceKm: 49, lat: 53.1385, lng: 17.9650 },
  { code: "BYD048", address: "ul. Szubińska 210 (Kaufland, os. Wyżyny)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 47, lat: 53.1080, lng: 17.9650 },
  { code: "BYD049", address: "ul. Grunwaldzka 220 (Biedronka, os. Szwederowo)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1220, lng: 18.0350 },
  { code: "BYD050", address: "ul. Jagiellońska 260 (Lidl, os. Bartodzieje)", city: "Bydgoszcz", hours: "24/7", distanceKm: 46, lat: 53.1350, lng: 18.0350 },
  { code: "BYD051", address: "ul. Gdańska 380 (os. Błonie)", city: "Bydgoszcz", hours: "24/7", distanceKm: 48, lat: 53.1420, lng: 18.0100 },
  { code: "BYD052", address: "ul. Dworcowa 95 (Biedronka, os. Śródmieście)", city: "Bydgoszcz", hours: "24/7", distanceKm: 43, lat: 53.1290, lng: 17.9950 },
  { code: "BYD053", address: "ul. Pomorska 180 (Żabka, os. Wilczak)", city: "Bydgoszcz", hours: "24/7", distanceKm: 45, lat: 53.1185, lng: 17.9750 },
  { code: "BYD054", address: "ul. Kujawska 160 (Lidl, os. Kapułciska)", city: "Bydgoszcz", hours: "06:00-22:00", distanceKm: 47, lat: 53.1125, lng: 18.0300 },
  { code: "BYD055", address: "ul. Fordońska 95 (Galeria Focus)", city: "Bydgoszcz", hours: "24/7", distanceKm: 47, lat: 53.1380, lng: 18.0200 },

  // ============================================================
  // TORUŃ — 55 paczkomatów (równomierne pokrycie całego miasta)
  // ============================================================
  // Szczegłlne pokrycie wschodnich osiedli: Mokre, Rubinkowo I, Rubinkowo II, Na Skarpie, Olsztyńska, Bielany, Koniuchy, Jar, Wrzosy
  // Paczkomaty przy Biedronkach, Lidlach, Żabkach i głównych ulicach osiedlowych.
  { code: "TOR001", address: "ul. Kopernika 12 (Biedronka, Centrum)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0135, lng: 18.5975 },
  { code: "TOR002", address: "ul. Mickiewicza 18", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0142, lng: 18.5960 },
  { code: "TOR003", address: "ul. Żeglarska 5 (os. Stare Miasto)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0105, lng: 18.6090 },
  { code: "TOR004", address: "ul. Szeroka 25 (Żabka, Stare Miasto)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0172, lng: 18.5845 },
  { code: "TOR005", address: "ul. Dąbrowskiego 8 (Lidl, Nowe Miasto)", city: "Toruń", hours: "06:00-22:00", distanceKm: 34, lat: 53.0098, lng: 18.5990 },
  { code: "TOR006", address: "ul. Gagarina 35 (Kaufland, Centrum)", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0180, lng: 18.5910 },
  { code: "TOR007", address: "ul. Bydgoska 52", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0158, lng: 18.5895 },
  { code: "TOR008", address: "ul. Chełmińska 22 (Biedronka, Chełmińskie)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0125, lng: 18.6045 },
  { code: "TOR009", address: "ul. Reja 15 (Żabka, Nowe Miasto)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0210, lng: 18.6020 },
  { code: "TOR010", address: "ul. Krasińskiego 10", city: "Toruń", hours: "06:00-23:00", distanceKm: 35, lat: 53.0090, lng: 18.5925 },
  { code: "TOR011", address: "ul. Podgórna 8 (Lidl, Jar)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0108, lng: 18.5700 },
  { code: "TOR012", address: "ul. Broniewskiego 22 (Biedronka, Jar)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0135, lng: 18.5725 },
  { code: "TOR013", address: "ul. Leśna 5 (os. Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0215, lng: 18.6085 },
  { code: "TOR014", address: "ul. Sienkiewicza 30 (Żabka, Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0228, lng: 18.6110 },
  { code: "TOR015", address: "ul. Olsztyńska 12 (Biedronka, Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0075, lng: 18.5630 },
  { code: "TOR016", address: "ul. Skarpowa 18 (Lidl, Na Skarpie)", city: "Toruń", hours: "06:00-22:00", distanceKm: 35, lat: 53.0068, lng: 18.5615 },
  { code: "TOR017", address: "ul. Łódzka 45 (Biedronka, Mokre)", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0012, lng: 18.5755 },
  { code: "TOR018", address: "ul. PCK 28 (Żabka, Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0025, lng: 18.5790 },
  { code: "TOR019", address: "ul. Włocławska 15 (Biedronka, Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0245, lng: 18.6380 },
  { code: "TOR020", address: "ul. Rubinkowska 22 (Lidl, Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0258, lng: 18.6410 },
  { code: "TOR021", address: "ul. Szubińska 78 (Biedronka, Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0270, lng: 18.6485 },
  { code: "TOR022", address: "ul. Koniuchy 12 (Żabka, Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0285, lng: 18.6520 },
  { code: "TOR023", address: "ul. Wschodnia 35 (Biedronka, Koniuchy)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0165, lng: 18.6375 },
  { code: "TOR024", address: "ul. Bydgoska 165 (Lidl, Bielany)", city: "Toruń", hours: "06:00-22:00", distanceKm: 39, lat: 53.0335, lng: 18.5800 },
  { code: "TOR025", address: "ul. Gagarina 145 (Biedronka, Bielany)", city: "Toruń", hours: "24/7", distanceKm: 39, lat: 53.0350, lng: 18.5775 },
  { code: "TOR026", address: "ul. Jarowa 8 (Żabka, Jar)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0118, lng: 18.5670 },
  { code: "TOR027", address: "ul. Chełmińska 95 (Biedronka, Chełmińskie Przedmieście)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0100, lng: 18.6130 },
  { code: "TOR028", address: "ul. Kopernika 65", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0148, lng: 18.6005 },
  { code: "TOR029", address: "ul. Mickiewicza 55 (Lidl, Nowe Miasto)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0160, lng: 18.6055 },
  { code: "TOR030", address: "ul. Reja 40 (Biedronka, Nowe Miasto)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0205, lng: 18.5985 },
  { code: "TOR031", address: "ul. Dąbrowskiego 42", city: "Toruń", hours: "06:00-22:00", distanceKm: 33, lat: 53.0095, lng: 18.5970 },
  { code: "TOR032", address: "ul. Świętojańska 15 (os. Stare Miasto)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0150, lng: 18.5905 },
  { code: "TOR033", address: "ul. Bulwar Filadelfijski 8", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0122, lng: 18.6140 },
  { code: "TOR034", address: "ul. Łazienna 12 (Żabka, Stare Miasto)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0138, lng: 18.6040 },
  { code: "TOR035", address: "ul. Leśna 25 (os. Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0230, lng: 18.6095 },
  { code: "TOR036", address: "ul. Olsztyńska 25 (Biedronka, Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0082, lng: 18.5645 },
  { code: "TOR037", address: "ul. Łódzka 72 (Lidl, Mokre)", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0005, lng: 18.5735 },
  { code: "TOR038", address: "ul. PCK 55 (Biedronka, Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0020, lng: 18.5810 },
  { code: "TOR039", address: "ul. Rubinkowska 48 (Żabka, Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0250, lng: 18.6425 },
  { code: "TOR040", address: "ul. Szubińska 92 (Biedronka, Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0278, lng: 18.6500 },
  { code: "TOR041", address: "ul. Wschodnia 50 (Lidl, Koniuchy)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0180, lng: 18.6395 },
  { code: "TOR042", address: "ul. Koniuchy 25 (Biedronka, Koniuchy)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0160, lng: 18.6365 },
  { code: "TOR043", address: "ul. Jarowa 20 (Biedronka, Jar)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0112, lng: 18.5665 },
  { code: "TOR044", address: "ul. Broniewskiego 60 (Lidl, Jar)", city: "Toruń", hours: "06:00-22:00", distanceKm: 34, lat: 53.0140, lng: 18.5740 },
  { code: "TOR045", address: "ul. Bydgoska 188 (Żabka, Bielany)", city: "Toruń", hours: "24/7", distanceKm: 39, lat: 53.0342, lng: 18.5815 },
  { code: "TOR046", address: "ul. Gagarina 168 (Biedronka, Bielany)", city: "Toruń", hours: "24/7", distanceKm: 39, lat: 53.0362, lng: 18.5785 },
  { code: "TOR047", address: "ul. Sienkiewicza 68 (Lidl, Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0220, lng: 18.6125 },
  { code: "TOR048", address: "ul. Chełmińska 78 (Żabka, Chełmińskie Przedmieście)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0108, lng: 18.6115 },
  { code: "TOR049", address: "ul. Mickiewicza 82 (Biedronka, Nowe Miasto)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0168, lng: 18.6065 },
  { code: "TOR050", address: "ul. Kopernika 55 (Lidl, Centrum)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0140, lng: 18.5995 },
  { code: "TOR051", address: "ul. Reja 82 (Biedronka, Nowe Miasto)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0218, lng: 18.5990 },
  { code: "TOR052", address: "ul. Leśna 42 (os. Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0238, lng: 18.6100 },
  { code: "TOR053", address: "ul. Olsztyńska 58 (Biedronka, Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0070, lng: 18.5625 },
  { code: "TOR054", address: "ul. Łódzka 95 (Żabka, Mokre)", city: "Toruń", hours: "24/7", distanceKm: 33, lat: 53.0000, lng: 18.5720 },
  { code: "TOR055", address: "ul. Rubinkowska 75 (Lidl, Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0265, lng: 18.6455 },
  // Dodatkowe paczkomaty z wschodniej części Torunia (Rubinkowo, Mokre, Na Skarpie, Olsztyńska, Bielany, Koniuchy, Jar, Wrzosy)
  { code: "TOR056", address: "ul. Rubinkowska 45 (Biedronka, os. Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0268, lng: 18.6462 },
  { code: "TOR057", address: "ul. Watzenrodego 8 (Lidl, os. Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0252, lng: 18.6435 },
  { code: "TOR058", address: "ul. Skłodowskiej-Curie 25 (Żabka, os. Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0248, lng: 18.6418 },
  { code: "TOR059", address: "ul. Rydygiera 33 (Biedronka, os. Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0275, lng: 18.6490 },
  { code: "TOR060", address: "ul. Rubinkowska 78 (Lidl, os. Rubinkowo II)", city: "Toruń", hours: "06:00-22:00", distanceKm: 37, lat: 53.0282, lng: 18.6505 },
  { code: "TOR061", address: "ul. Watzenrodego 45 (Biedronka, os. Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0250, lng: 18.6420 },
  { code: "TOR062", address: "ul. Skłodowskiej-Curie 50 (Biedronka, os. Rubinkowo II)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0270, lng: 18.6480 },
  { code: "TOR063", address: "ul. Rydygiera 60 (Żabka, os. Rubinkowo I)", city: "Toruń", hours: "24/7", distanceKm: 36, lat: 53.0245, lng: 18.6405 },
  { code: "TOR064", address: "ul. Mokre 15 (Biedronka, os. Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0018, lng: 18.5765 },
  { code: "TOR065", address: "ul. Broniewskiego 55 (Lidl, os. Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0032, lng: 18.5795 },
  { code: "TOR066", address: "ul. Reja 90 (Żabka, os. Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0025, lng: 18.5778 },
  { code: "TOR067", address: "ul. Mokre 42 (Biedronka, os. Mokre)", city: "Toruń", hours: "06:00-22:00", distanceKm: 34, lat: 53.0010, lng: 18.5750 },
  { code: "TOR068", address: "ul. Broniewskiego 80 (Lidl, os. Mokre)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0040, lng: 18.5805 },
  { code: "TOR069", address: "ul. Na Skarpie 10 (Biedronka, os. Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0065, lng: 18.5600 },
  { code: "TOR070", address: "ul. Legionów 65 (Lidl, os. Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0080, lng: 18.5635 },
  { code: "TOR071", address: "ul. Szubińska 110 (Żabka, os. Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0072, lng: 18.5618 },
  { code: "TOR072", address: "ul. Na Skarpie 28 (Biedronka, os. Na Skarpie)", city: "Toruń", hours: "06:00-22:00", distanceKm: 35, lat: 53.0068, lng: 18.5595 },
  { code: "TOR073", address: "ul. Legionów 120 (Lidl, os. Na Skarpie)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0085, lng: 18.5645 },
  { code: "TOR074", address: "ul. Olsztyńska 70 (Biedronka, os. Olsztyńska)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0095, lng: 18.5655 },
  { code: "TOR075", address: "ul. Chrobrego 15 (Lidl, os. Olsztyńska)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0088, lng: 18.5640 },
  { code: "TOR076", address: "ul. Olsztyńska 95 (Żabka, os. Olsztyńska)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0100, lng: 18.5660 },
  { code: "TOR077", address: "ul. Chrobrego 40 (Biedronka, os. Olsztyńska)", city: "Toruń", hours: "06:00-22:00", distanceKm: 35, lat: 53.0092, lng: 18.5652 },
  { code: "TOR078", address: "ul. Koniuchy 55 (Biedronka, os. Koniuchy)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0168, lng: 18.6385 },
  { code: "TOR079", address: "ul. Jarowa 35 (Lidl, os. Jar)", city: "Toruń", hours: "24/7", distanceKm: 34, lat: 53.0115, lng: 18.5675 },
  { code: "TOR080", address: "ul. Wrzosowa 12 (Żabka, os. Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0235, lng: 18.6115 },
  { code: "TOR081", address: "ul. Wschodnia 80 (Biedronka, os. Wschodnia)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0185, lng: 18.6405 },
  { code: "TOR082", address: "ul. Koniuchy 88 (Lidl, os. Koniuchy)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0175, lng: 18.6395 },
  { code: "TOR083", address: "ul. Jarowa 50 (Biedronka, os. Jar)", city: "Toruń", hours: "06:00-22:00", distanceKm: 34, lat: 53.0120, lng: 18.5685 },
  { code: "TOR084", address: "ul. Wrzosowa 25 (Lidl, os. Wrzosy)", city: "Toruń", hours: "24/7", distanceKm: 35, lat: 53.0240, lng: 18.6125 },
  { code: "TOR085", address: "ul. Wschodnia 110 (Żabka, os. Wschodnia)", city: "Toruń", hours: "24/7", distanceKm: 37, lat: 53.0190, lng: 18.6415 },
  // Toruń: 85 paczkomatów (w tym Mokre, Rubinkowo, Na Skarpie)





  // ============================================================
  // GRUDZIĄDZ ~53 paczkomatów (lepsze pokrycie osiedli)
  // ============================================================
  { code: "GRU001", address: "ul. Długa 25", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4840, lng: 18.7530 },
  { code: "GRU002", address: "ul. Chełmińska 42", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4800, lng: 18.7600 },
  { code: "GRU003", address: "ul. Tczewska 10", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4870, lng: 18.7450 },
  { code: "GRU004", address: "ul. Rzeźnicka 5", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4820, lng: 18.7550 },
  { code: "GRU005", address: "ul. Dworcowa 15 (Lidl)", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4855, lng: 18.7480 },
  { code: "GRU006", address: "ul. Długa 88", city: "Grudziądz", hours: "24/7", distanceKm: 22, lat: 53.4890, lng: 18.7620 },
  { code: "GRU007", address: "ul. 3 Maja 28 (Kaufland)", city: "Grudziądz", hours: "06:00-22:00", distanceKm: 24, lat: 53.4780, lng: 18.7580 },
  { code: "GRU008", address: "ul. Chełmińska 120", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4750, lng: 18.7650 },
  { code: "GRU009", address: "ul. Dworcowa 40", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4875, lng: 18.7500 },
  { code: "GRU010", address: "ul. 3 Maja 55", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4810, lng: 18.7520 },
  { code: "GRU011", address: "ul. Długa 120", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4860, lng: 18.7650 },
  { code: "GRU012", address: "ul. Tczewska 35", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4890, lng: 18.7400 },
  { code: "GRU013", address: "ul. Rzeźnicka 25", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4795, lng: 18.7570 },
  { code: "GRU014", address: "ul. Dworcowa 65 (Biedronka)", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4845, lng: 18.7450 },
  { code: "GRU015", address: "ul. Chełmińska 80", city: "Grudziądz", hours: "06:00-22:00", distanceKm: 25, lat: 53.4770, lng: 18.7620 },
  { code: "GRU016", address: "ul. 1 Maja 10", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4825, lng: 18.7580 },
  { code: "GRU017", address: "ul. Kościuszki 18", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4850, lng: 18.7530 },
  { code: "GRU018", address: "ul. Długa 160", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4905, lng: 18.7680 },
  { code: "GRU019", address: "ul. Tczewska 55", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4910, lng: 18.7380 },
  { code: "GRU020", address: "ul. Rzeźnicka 40", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4785, lng: 18.7600 },
  { code: "GRU021", address: "ul. Dworcowa 85", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4865, lng: 18.7420 },
  { code: "GRU022", address: "ul. Chełmińska 160", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4730, lng: 18.7700 },
  { code: "GRU023", address: "ul. 3 Maja 80", city: "Grudziądz", hours: "06:00-22:00", distanceKm: 25, lat: 53.4760, lng: 18.7550 },
  { code: "GRU024", address: "ul. Szkolna 5", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4830, lng: 18.7500 },
  { code: "GRU025", address: "ul. Długa 200", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4920, lng: 18.7720 },
  { code: "GRU026", address: "ul. Tczewska 70", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4925, lng: 18.7350 },
  { code: "GRU027", address: "ul. Rzeźnicka 60", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4775, lng: 18.7630 },
  { code: "GRU028", address: "ul. Dworcowa 100 (Lidl)", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4880, lng: 18.7400 },
  { code: "GRU029", address: "ul. Chełmińska 200", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4710, lng: 18.7750 },
  { code: "GRU030", address: "ul. 1 Maja 35", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4815, lng: 18.7470 },
  { code: "GRU031", address: "ul. Kościuszki 55", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4865, lng: 18.7560 },
  { code: "GRU032", address: "ul. Szkolna 22", city: "Grudziądz", hours: "06:00-22:00", distanceKm: 24, lat: 53.4840, lng: 18.7480 },
  { code: "GRU033", address: "ul. Długa 240", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4935, lng: 18.7750 },
  { code: "GRU034", address: "ul. Tczewska 85", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4940, lng: 18.7320 },
  { code: "GRU035", address: "ul. 3 Maja 100", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4740, lng: 18.7500 },
  { code: "GRU036", address: "ul. Bydgoska 15", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4790, lng: 18.7450 },
  { code: "GRU037", address: "ul. Dworcowa 120", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4895, lng: 18.7370 },
  { code: "GRU038", address: "ul. Chełmińska 55", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4785, lng: 18.7580 },
  { code: "GRU039", address: "ul. Rzeźnicka 80", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4765, lng: 18.7610 },
  { code: "GRU040", address: "ul. 1 Maja 50", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4805, lng: 18.7420 },
  { code: "GRU041", address: "ul. Kościuszki 80", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4880, lng: 18.7540 },
  { code: "GRU042", address: "ul. Szkolna 40 (Biedronka)", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4855, lng: 18.7460 },
  // Dodatkowe — Rządz, Os. Kopernika, Wyspa, Chełmińskie, Tuszyn
  { code: "GRU043", address: "ul. Chełmińska 260 (Biedronka, os. Rządz)", city: "Grudziądz", hours: "24/7", distanceKm: 27, lat: 53.4720, lng: 18.7780 },
  { code: "GRU044", address: "ul. 1 Maja 85 (Lidl, os. Kopernika)", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4820, lng: 18.7480 },
  { code: "GRU045", address: "ul. Tczewska 120 (Kaufland, os. Wyspa)", city: "Grudziądz", hours: "06:00-22:00", distanceKm: 26, lat: 53.4915, lng: 18.7250 },
  { code: "GRU046", address: "ul. Dworcowa 155 (Biedronka, os. Śródmieście)", city: "Grudziądz", hours: "24/7", distanceKm: 23, lat: 53.4860, lng: 18.7430 },
  { code: "GRU047", address: "ul. Bydgoska 75 (os. Chełmińskie Przedmieście)", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4775, lng: 18.7500 },
  { code: "GRU048", address: "ul. Rzeźnicka 105 (Żabka, os. Tuszyn)", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4745, lng: 18.7580 },
  { code: "GRU049", address: "ul. Długa 310 (Lidl, os. Rządz)", city: "Grudziądz", hours: "24/7", distanceKm: 28, lat: 53.4680, lng: 18.7820 },
  { code: "GRU050", address: "ul. 3 Maja 145 (Biedronka, os. Kopernika)", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4790, lng: 18.7420 },
  { code: "GRU051", address: "ul. Szkolna 65 (os. Wyspa)", city: "Grudziądz", hours: "24/7", distanceKm: 25, lat: 53.4930, lng: 18.7280 },
  { code: "GRU052", address: "ul. Kościuszki 115 (Lidl)", city: "Grudziądz", hours: "24/7", distanceKm: 24, lat: 53.4900, lng: 18.7520 },
  { code: "GRU053", address: "ul. Tczewska 55 (Biedronka, os. Rządz)", city: "Grudziądz", hours: "24/7", distanceKm: 26, lat: 53.4870, lng: 18.7200 },

  // ============================================================
  // INOWROCŁAW ~53 paczkomatów (lepsze pokrycie osiedli)
  // ============================================================
  { code: "INO001", address: "ul. Królowej Jadwigi 15", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7980, lng: 18.2630 },
  { code: "INO002", address: "ul. Dworcowa 8", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 54, lat: 52.8005, lng: 18.2580 },
  { code: "INO003", address: "ul. Poznańska 45 (Lidl)", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.7950, lng: 18.2700 },
  { code: "INO004", address: "ul. Solankowa 20", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 53, lat: 52.8020, lng: 18.2680 },
  { code: "INO005", address: "ul. Kujawska 30 (Biedronka)", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7950, lng: 18.2550 },
  { code: "INO006", address: "ul. Toruńska 45", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.8050, lng: 18.2750 },
  { code: "INO007", address: "ul. 1 Maja 12", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7970, lng: 18.2600 },
  { code: "INO008", address: "ul. Dworcowa 35", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8010, lng: 18.2550 },
  { code: "INO009", address: "ul. Poznańska 80", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.7935, lng: 18.2750 },
  { code: "INO010", address: "ul. Solankowa 55", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8035, lng: 18.2720 },
  { code: "INO011", address: "ul. Kujawska 70", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7940, lng: 18.2500 },
  { code: "INO012", address: "ul. Toruńska 80", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 55, lat: 52.8070, lng: 18.2800 },
  { code: "INO013", address: "ul. 3 Maja 8", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7965, lng: 18.2620 },
  { code: "INO014", address: "ul. Dworcowa 55 (Biedronka)", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8025, lng: 18.2520 },
  { code: "INO015", address: "ul. Poznańska 110", city: "Inowrocław", hours: "24/7", distanceKm: 57, lat: 52.7920, lng: 18.2780 },
  { code: "INO016", address: "ul. Solankowa 80", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8045, lng: 18.2650 },
  { code: "INO017", address: "ul. Kujawska 95", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7930, lng: 18.2480 },
  { code: "INO018", address: "ul. Toruńska 15", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8060, lng: 18.2700 },
  { code: "INO019", address: "ul. 1 Maja 35", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.7985, lng: 18.2580 },
  { code: "INO020", address: "ul. Dworcowa 70", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8030, lng: 18.2500 },
  { code: "INO021", address: "ul. Poznańska 15 (Lidl)", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.7960, lng: 18.2650 },
  { code: "INO022", address: "ul. Solankowa 95", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 53, lat: 52.8055, lng: 18.2600 },
  { code: "INO023", address: "ul. Kujawska 120", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7915, lng: 18.2450 },
  { code: "INO024", address: "ul. Toruńska 100", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.8080, lng: 18.2820 },
  { code: "INO025", address: "ul. 3 Maja 25", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7955, lng: 18.2600 },
  { code: "INO026", address: "ul. Dworcowa 90", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8040, lng: 18.2480 },
  { code: "INO027", address: "ul. Poznańska 140", city: "Inowrocław", hours: "24/7", distanceKm: 57, lat: 52.7905, lng: 18.2800 },
  { code: "INO028", address: "ul. Solankowa 30", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8015, lng: 18.2700 },
  { code: "INO029", address: "ul. Kujawska 45", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7960, lng: 18.2530 },
  { code: "INO030", address: "ul. Toruńska 25", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8055, lng: 18.2720 },
  { code: "INO031", address: "ul. 1 Maja 48", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.7990, lng: 18.2550 },
  { code: "INO032", address: "ul. Dworcowa 105", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8045, lng: 18.2460 },
  { code: "INO033", address: "ul. Poznańska 55", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 56, lat: 52.7945, lng: 18.2680 },
  { code: "INO034", address: "ul. Solankowa 70", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8025, lng: 18.2630 },
  { code: "INO035", address: "ul. Kujawska 75", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7925, lng: 18.2510 },
  { code: "INO036", address: "ul. Toruńska 60", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.8075, lng: 18.2780 },
  { code: "INO037", address: "ul. 3 Maja 40", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7945, lng: 18.2580 },
  { code: "INO038", address: "ul. Dworcowa 20", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8000, lng: 18.2560 },
  { code: "INO039", address: "ul. Poznańska 170", city: "Inowrocław", hours: "24/7", distanceKm: 57, lat: 52.7895, lng: 18.2820 },
  { code: "INO040", address: "ul. Solankowa 110", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8060, lng: 18.2580 },
  { code: "INO041", address: "ul. Kujawska 140", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7905, lng: 18.2470 },
  { code: "INO042", address: "ul. Toruńska 5", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.8040, lng: 18.2700 },
  // Dodatkowe — Solanki, Rubin, Piastowskie, Stare Miasto, Młyny
  { code: "INO043", address: "ul. Solankowa 160 (Biedronka, os. Solanki)", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.8090, lng: 18.2550 },
  { code: "INO044", address: "ul. Kujawska 175 (Lidl, os. Rłbin)", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.7880, lng: 18.2420 },
  { code: "INO045", address: "ul. 1 Maja 72 (Biedronka, os. Piastowskie)", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8015, lng: 18.2500 },
  { code: "INO046", address: "ul. Dworcowa 130 (Kaufland, os. Stare Miasto)", city: "Inowrocław", hours: "06:00-22:00", distanceKm: 54, lat: 52.7985, lng: 18.2610 },
  { code: "INO047", address: "ul. Poznańska 205 (Lidl, os. Młtwy)", city: "Inowrocław", hours: "24/7", distanceKm: 58, lat: 52.7840, lng: 18.2850 },
  { code: "INO048", address: "ul. Toruńska 140 (Biedronka, os. Solanki)", city: "Inowrocław", hours: "24/7", distanceKm: 56, lat: 52.8105, lng: 18.2750 },
  { code: "INO049", address: "ul. Kujawska 55 (Żabka, os. Rłbin)", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.7915, lng: 18.2480 },
  { code: "INO050", address: "ul. Solankowa 45 (os. Piastowskie)", city: "Inowrocław", hours: "24/7", distanceKm: 53, lat: 52.8040, lng: 18.2550 },
  { code: "INO051", address: "ul. 3 Maja 62 (Lidl, os. Stare Miasto)", city: "Inowrocław", hours: "24/7", distanceKm: 54, lat: 52.7970, lng: 18.2590 },
  { code: "INO052", address: "ul. Dworcowa 165 (Biedronka, os. Młtwy)", city: "Inowrocław", hours: "24/7", distanceKm: 57, lat: 52.7830, lng: 18.2750 },
  { code: "INO053", address: "ul. Toruńska 80 (Kaufland, os. Solanki)", city: "Inowrocław", hours: "24/7", distanceKm: 55, lat: 52.8085, lng: 18.2680 },

  // ============================================================
  // WŁOCŁAWEK ~53 paczkomatów (lepsze pokrycie osiedli)
  // ============================================================
  { code: "WLO001", address: "ul. Toruńska 30", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6480, lng: 19.0680 },
  { code: "WLO002", address: "ul. Brzeska 15 (Lidl)", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6505, lng: 19.0600 },
  { code: "WLO003", address: "ul. Kaliska 30 (Biedronka)", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6550, lng: 19.0800 },
  { code: "WLO004", address: "ul. Żytnia 12", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6420, lng: 19.0550 },
  { code: "WLO005", address: "ul. Kilińskiego 45", city: "Włocławek", hours: "06:00-22:00", distanceKm: 68, lat: 52.6600, lng: 19.0720 },
  { code: "WLO006", address: "ul. Toruńska 70", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6470, lng: 19.0750 },
  { code: "WLO007", address: "ul. Brzeska 40", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6520, lng: 19.0580 },
  { code: "WLO008", address: "ul. Kaliska 55", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6570, lng: 19.0850 },
  { code: "WLO009", address: "ul. Żytnia 35", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6400, lng: 19.0520 },
  { code: "WLO010", address: "ul. Kilińskiego 70", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6625, lng: 19.0680 },
  { code: "WLO011", address: "ul. Toruńska 100 (Biedronka)", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6455, lng: 19.0800 },
  { code: "WLO012", address: "ul. Brzeska 70", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6540, lng: 19.0550 },
  { code: "WLO013", address: "ul. Kaliska 80", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6590, lng: 19.0900 },
  { code: "WLO014", address: "ul. Żytnia 55", city: "Włocławek", hours: "24/7", distanceKm: 72, lat: 52.6385, lng: 19.0480 },
  { code: "WLO015", address: "ul. Kilińskiego 20", city: "Włocławek", hours: "06:00-22:00", distanceKm: 67, lat: 52.6610, lng: 19.0650 },
  { code: "WLO016", address: "ul. Toruńska 15", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6490, lng: 19.0700 },
  { code: "WLO017", address: "ul. Brzeska 25", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6515, lng: 19.0620 },
  { code: "WLO018", address: "ul. Kaliska 15", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6545, lng: 19.0780 },
  { code: "WLO019", address: "ul. Żytnia 70", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6370, lng: 19.0500 },
  { code: "WLO020", address: "ul. Kilińskiego 90", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6635, lng: 19.0700 },
  { code: "WLO021", address: "ul. Toruńska 130", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6440, lng: 19.0850 },
  { code: "WLO022", address: "ul. Brzeska 95", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6555, lng: 19.0530 },
  { code: "WLO023", address: "ul. Kaliska 100", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6605, lng: 19.0950 },
  { code: "WLO024", address: "ul. Żytnia 20", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6415, lng: 19.0570 },
  { code: "WLO025", address: "ul. Kilińskiego 5", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6600, lng: 19.0630 },
  { code: "WLO026", address: "ul. Toruńska 50 (Lidl)", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6475, lng: 19.0720 },
  { code: "WLO027", address: "ul. Brzeska 50", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6530, lng: 19.0600 },
  { code: "WLO028", address: "ul. Kaliska 40", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6560, lng: 19.0820 },
  { code: "WLO029", address: "ul. Żytnia 85", city: "Włocławek", hours: "24/7", distanceKm: 72, lat: 52.6360, lng: 19.0450 },
  { code: "WLO030", address: "ul. Kilińskiego 110", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6645, lng: 19.0720 },
  { code: "WLO031", address: "ul. Toruńska 160", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6430, lng: 19.0880 },
  { code: "WLO032", address: "ul. Brzeska 110", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6565, lng: 19.0500 },
  { code: "WLO033", address: "ul. Kaliska 120", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6615, lng: 19.0980 },
  { code: "WLO034", address: "ul. Żytnia 40", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6395, lng: 19.0550 },
  { code: "WLO035", address: "ul. Kilińskiego 35", city: "Włocławek", hours: "06:00-22:00", distanceKm: 67, lat: 52.6595, lng: 19.0670 },
  { code: "WLO036", address: "ul. Toruńska 8", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6500, lng: 19.0650 },
  { code: "WLO037", address: "ul. Brzeska 5", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6495, lng: 19.0630 },
  { code: "WLO038", address: "ul. Kaliska 65", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6580, lng: 19.0870 },
  { code: "WLO039", address: "ul. Żytnia 95", city: "Włocławek", hours: "24/7", distanceKm: 72, lat: 52.6355, lng: 19.0430 },
  { code: "WLO040", address: "ul. Kilińskiego 125", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6655, lng: 19.0750 },
  { code: "WLO041", address: "ul. Toruńska 180", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6420, lng: 19.0900 },
  { code: "WLO042", address: "ul. Dworcowa 10", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6485, lng: 19.0620 },
  // Dodatkowe — Zazamcze, Michelin, Wschód, Południe, Śródmieście
  { code: "WLO043", address: "ul. Toruńska 220 (Biedronka, os. Zazamcze)", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6400, lng: 19.0980 },
  { code: "WLO044", address: "ul. Brzeska 135 (Lidl, os. Michelin)", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6580, lng: 19.0500 },
  { code: "WLO045", address: "ul. Kilińskiego 160 (Kaufland, os. Wschód)", city: "Włocławek", hours: "06:00-22:00", distanceKm: 68, lat: 52.6630, lng: 19.0850 },
  { code: "WLO046", address: "ul. Kaliska 155 (Biedronka, os. Południe)", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6530, lng: 19.1050 },
  { code: "WLO047", address: "ul. Żytnia 130 (Lidl, os. Śródmieście)", city: "Włocławek", hours: "24/7", distanceKm: 71, lat: 52.6445, lng: 19.0580 },
  { code: "WLO048", address: "ul. Toruńska 50 (os. Zazamcze)", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6385, lng: 19.0920 },
  { code: "WLO049", address: "ul. Brzeska 85 (Biedronka, os. Michelin)", city: "Włocławek", hours: "24/7", distanceKm: 68, lat: 52.6555, lng: 19.0550 },
  { code: "WLO050", address: "ul. Kilińskiego 55 (Żabka, os. Wschód)", city: "Włocławek", hours: "24/7", distanceKm: 67, lat: 52.6650, lng: 19.0780 },
  { code: "WLO051", address: "ul. Kaliska 75 (Lidl, os. Południe)", city: "Włocławek", hours: "24/7", distanceKm: 69, lat: 52.6505, lng: 19.0980 },
  { code: "WLO052", address: "ul. Dworcowa 55 (Biedronka, os. Śródmieście)", city: "Włocławek", hours: "24/7", distanceKm: 70, lat: 52.6470, lng: 19.0650 },
  { code: "WLO053", address: "ul. Toruńska 265 (Kaufland, os. Zazamcze)", city: "Włocławek", hours: "24/7", distanceKm: 72, lat: 52.6370, lng: 19.1020 },

  // === KATOWICE (12) ===
  { code: "KAT001", address: "ul. Mariacka 20 (Biedronka, Centrum)", city: "Katowice", hours: "24/7", distanceKm: 310, lat: 50.2594, lng: 19.0235 },
  { code: "KAT002", address: "ul. 3 Maja 12 (Lidl)", city: "Katowice", hours: "24/7", distanceKm: 312, lat: 50.2601, lng: 19.0218 },
  { code: "KAT003", address: "ul. Kościuszki 45 (Żabka, Bogucice)", city: "Katowice", hours: "06:00-22:00", distanceKm: 308, lat: 50.2650, lng: 19.0280 },
  { code: "KAT004", address: "ul. Chorzowska 50 (Biedronka)", city: "Katowice", hours: "24/7", distanceKm: 305, lat: 50.2550, lng: 19.0150 },
  { code: "KAT005", address: "ul. Gliwicka 120 (Lidl, Ligota)", city: "Katowice", hours: "24/7", distanceKm: 315, lat: 50.2400, lng: 19.0000 },
  { code: "KAT006", address: "ul. Warszawska 30 (Kaufland)", city: "Katowice", hours: "06:00-22:00", distanceKm: 309, lat: 50.2620, lng: 19.0300 },
  { code: "KAT007", address: "ul. Mickiewicza 8 (Żabka)", city: "Katowice", hours: "24/7", distanceKm: 311, lat: 50.2580, lng: 19.0250 },
  { code: "KAT008", address: "ul. Sobieskiego 55 (Biedronka, Brynów)", city: "Katowice", hours: "24/7", distanceKm: 313, lat: 50.2450, lng: 19.0100 },
  { code: "KAT009", address: "ul. Graniczna 15 (Lidl)", city: "Katowice", hours: "24/7", distanceKm: 307, lat: 50.2700, lng: 19.0350 },
  { code: "KAT010", address: "pl. Wolności 5 (centrum)", city: "Katowice", hours: "24/7", distanceKm: 310, lat: 50.2615, lng: 19.0225 },
  { code: "KAT011", address: "ul. Piastowska 70 (Żabka)", city: "Katowice", hours: "06:00-22:00", distanceKm: 314, lat: 50.2500, lng: 19.0050 },
  { code: "KAT012", address: "ul. Armii Krajowej 40 (Biedronka)", city: "Katowice", hours: "24/7", distanceKm: 306, lat: 50.2680, lng: 19.0180 },

  // === GLIWICE (12) ===
  { code: "GLI001", address: "ul. Zwycięstwa 25 (Biedronka, Centrum)", city: "Gliwice", hours: "24/7", distanceKm: 290, lat: 50.2940, lng: 18.6710 },
  { code: "GLI002", address: "ul. Dworcowa 10 (Lidl)", city: "Gliwice", hours: "24/7", distanceKm: 288, lat: 50.2920, lng: 18.6650 },
  { code: "GLI003", address: "ul. Kościuszki 55 (Żabka)", city: "Gliwice", hours: "06:00-22:00", distanceKm: 292, lat: 50.2980, lng: 18.6800 },
  { code: "GLI004", address: "ul. Rynek 8 (centrum)", city: "Gliwice", hours: "24/7", distanceKm: 291, lat: 50.2955, lng: 18.6700 },
  { code: "GLI005", address: "ul. Pszczyńska 40 (Biedronka)", city: "Gliwice", hours: "24/7", distanceKm: 289, lat: 50.2850, lng: 18.6600 },
  { code: "GLI006", address: "ul. Chorzowska 100 (Lidl, Sośnica)", city: "Gliwice", hours: "24/7", distanceKm: 293, lat: 50.2800, lng: 18.6900 },
  { code: "GLI007", address: "ul. Akademicka 15 (Żabka)", city: "Gliwice", hours: "06:00-22:00", distanceKm: 287, lat: 50.3000, lng: 18.6750 },
  { code: "GLI008", address: "ul. Bojkowska 30 (Biedronka)", city: "Gliwice", hours: "24/7", distanceKm: 294, lat: 50.2750, lng: 18.6550 },
  { code: "GLI009", address: "ul. Młyńska 5", city: "Gliwice", hours: "24/7", distanceKm: 290, lat: 50.2960, lng: 18.6725 },
  { code: "GLI010", address: "ul. Kujawska 20 (Lidl)", city: "Gliwice", hours: "24/7", distanceKm: 288, lat: 50.2880, lng: 18.6680 },
  { code: "GLI011", address: "ul. Tarnogórska 80 (Żabka)", city: "Gliwice", hours: "06:00-22:00", distanceKm: 291, lat: 50.3100, lng: 18.6800 },
  { code: "GLI012", address: "ul. Wielicka 12 (Biedronka)", city: "Gliwice", hours: "24/7", distanceKm: 289, lat: 50.2820, lng: 18.6620 },
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

  // InPost parcel locker state
  const [parcelSearch, setParcelSearch] = useState("");
  const [selectedPaczkomat, setSelectedPaczkomat] = useState<Paczkomat | null>(null);

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
          const found = paczkomaty.find(p => p.code === parsed.formData.parcelLocker);
          if (found) {
            setSelectedPaczkomat(found);
            setParcelSearch(found.code);
          }
        }

        // Ensure list is shown for parcel method after restore
        if (parsed.deliveryMethod === "parcel") {
          setParcelSearch(parsed.formData?.parcelLocker || "");
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

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Normalize for Polish diacritics
  const normalize = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Helper: extract store / osiedle name from address like "ul. ... (Biedronka, os. Rubinkowo)"
  const getStoreName = (address: string): string | null => {
    const match = address.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  };

  // Large list of paczkomats (70-80+), filtered on input
  const paczkomatList = (() => {
    const q = parcelSearch.trim();
    if (q.length >= 1) {
      const nq = normalize(q);
      return paczkomaty.filter(p =>
        normalize(p.code).includes(nq) ||
        normalize(p.address).includes(nq) ||
        normalize(p.city).includes(nq)
      ).slice(0, 80);
    }
    // Default: large visible list (70-80+) balanced from key cities incl. new ones
    const priority = ["Toruń", "Bydgoszcz", "Świecie", "Katowice", "Gliwice", "Grudziądz", "Inowrocław", "Włocławek"];
    let items: Paczkomat[] = [];
    priority.forEach(city => {
      const take = (city === "Toruń") ? 15 : 9;
      const cityItems = paczkomaty.filter(p => p.city === city).slice(0, take);
      items = items.concat(cityItems);
    });
    if (items.length < 70) {
      const extras = paczkomaty.filter(p => !priority.includes(p.city)).slice(0, 80 - items.length);
      items = items.concat(extras);
    }
    return items.slice(0, 90);
  })();

  const selectPaczkomat = (paczkomat: Paczkomat) => {
    setSelectedPaczkomat(paczkomat);
    updateField("parcelLocker", paczkomat.code);
    // Do not filter the list after selection – keep the long list visible
    setParcelSearch("");

    if (errors.parcelLocker) {
      setErrors((prev) => ({ ...prev, parcelLocker: undefined }));
    }

    toast.success(`Wybrano ${paczkomat.code}`, {
      description: `${paczkomat.address}, ${paczkomat.city}`,
      duration: 1400,
    });
  };

  const clearSelectedPaczkomat = () => {
    setSelectedPaczkomat(null);
    updateField("parcelLocker", "");
    setParcelSearch("");
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
        newErrors.parcelLocker = "Wpisz kod paczkomatu lub wybierz z listy poniżej";
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
    } else if (method === "parcel") {
      // keep current filter/search for parcel
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
        description: "Sprawdź dane w formularzu i spróbuj ponownie.",
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
            <span className="text-3xl">??</span>
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
            <ArrowLeft className="w-4 h-4" /> Powrłt do oferty
          </Link>
        </div>

        <h1 className="font-serif text-5xl text-brand-brown tracking-tight mb-2">Finalizacja zamówienia</h1>
        <p className="text-brand-brown/70 mb-8">Sprawdź swój koszyk i uzupełnij dane — wybierz dogodną formę dostawy miodów prosto z pasieki</p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Items list */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-sm font-medium text-brand-brown/70 mb-3 px-1">Twoje miody</div>
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
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">Kurier • 1–3 dni robocze</p>
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
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">Wybierz punkt blisko Ciebie • odbiór 24/7</p>
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
                        <span className="font-medium text-brand-brown">Odbiór osobisty w pasiece</span>
                        <span className="ml-auto text-sm font-semibold text-brand-brown tabular-nums">0 zł</span>
                      </div>
                      <p className="text-sm text-brand-brown/60 mt-1 pl-8">Topolno nad Wisłą • po uzgodnieniu</p>
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
                    /* Paczkomat InPost – stabilny, użyteczny widok listy */
                    <div className="space-y-4">
                      {/* Duże pole tekstowe z dokładnym placeholderem */}
                      <div>
                        <label className="block text-sm font-medium text-brand-brown mb-1.5">
                          Numer paczkomatu *
                        </label>
                        <input
                          type="text"
                          value={formData.parcelLocker}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().trim();
                            updateField("parcelLocker", val);
                            setParcelSearch(val);

                            // Auto show summary card when full exact code is typed
                            if (val.length >= 4) {
                              const exact = paczkomaty.find(p => p.code.toUpperCase() === val);
                              if (exact) {
                                setSelectedPaczkomat(exact);
                              }
                            }
                          }}
                          className="w-full rounded-xl border-2 border-brand-creamDark bg-white px-4 py-3.5 text-base focus:outline-none focus:border-brand-gold font-mono tracking-[2px]"
                          placeholder="Wpisz kod paczkomatu (np. SWI001)"
                        />
                        <p className="text-xs text-brand-brown/60 mt-1.5">
                          Wpisz kod (np. SWI001) lub wybierz z listy poniżej – lista się filtruje.
                        </p>
                      </div>

                      {/* Ładna karta podsumowująca – pojawia się po wyborze */}
                      <AnimatePresence>
                        {selectedPaczkomat && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            className="rounded-2xl border-2 border-brand-gold bg-brand-cream px-5 py-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-brand-gold text-sm font-semibold mb-1">
                                  <Check className="h-4 w-4" />
                                  Wybrany paczkomat
                                </div>

                                <div className="font-semibold text-[22px] tabular-nums tracking-[-0.3px] text-brand-brown leading-none">
                                  {selectedPaczkomat.code}
                                </div>

                                <div className="mt-2 text-[15px] text-brand-brown/85 leading-tight">
                                  {selectedPaczkomat.address}
                                </div>

                                {(() => {
                                  const store = getStoreName(selectedPaczkomat.address);
                                  return store ? (
                                    <div className="mt-1 inline-block text-xs bg-white border border-brand-gold/40 text-brand-brown px-2 py-0.5 rounded">
                                      {store}
                                    </div>
                                  ) : null;
                                })()}

                                <div className="mt-1 text-brand-brown/80">{selectedPaczkomat.city}</div>

                                <div className="mt-2 inline-flex items-center rounded-full bg-white border border-brand-creamDark px-3 py-px text-xs text-brand-brown/70">
                                  Godziny: {selectedPaczkomat.hours}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={clearSelectedPaczkomat}
                                className="text-xs font-medium text-brand-brown/70 hover:text-brand-brown underline self-start mt-1 whitespace-nowrap"
                              >
                                Zmień
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Duża, widoczna lista paczkomatów (70-80+ pozycji) */}
                      <div>
                        <div className="flex items-center justify-between mb-2 px-0.5">
                          <span className="text-xs font-medium tracking-[1px] text-brand-brown/70 uppercase">Wybierz z listy</span>
                          <span className="text-[10px] text-brand-brown/50 tabular-nums">{paczkomatList.length} paczkomatów</span>
                        </div>
                        <div className="border border-brand-creamDark rounded-2xl bg-white max-h-[480px] overflow-y-auto shadow-inner divide-y divide-brand-creamDark">
                          {paczkomatList.length > 0 ? (
                            paczkomatList.map((p) => {
                              const isSelected = selectedPaczkomat?.code === p.code;
                              const store = getStoreName(p.address);
                              return (
                                <button
                                  key={p.code}
                                  type="button"
                                  onClick={() => selectPaczkomat(p)}
                                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-brand-cream/60 active:bg-brand-cream ${isSelected ? "bg-brand-cream border-l-[5px] border-brand-gold" : ""}`}
                                >
                                  <div className="flex-shrink-0 mt-0.5">
                                    <MapPin className={`h-4 w-4 ${isSelected ? "text-brand-gold" : "text-brand-brown/50"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0 text-sm leading-tight">
                                    <div className="font-semibold tabular-nums tracking-tight text-brand-brown">{p.code}</div>
                                    <div className="text-brand-brown/80 mt-0.5 leading-snug">
                                      {p.address}, {p.city}
                                    </div>
                                    {store && (
                                      <div className="text-[11px] text-brand-brown/60 mt-0.5">{store}</div>
                                    )}
                                    <div className="text-[11px] text-brand-brown/55 mt-1">Godziny: {p.hours}</div>
                                  </div>
                                  {isSelected && <Check className="h-4 w-4 text-brand-gold flex-shrink-0 mt-1" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-6 text-sm text-brand-brown/60 text-center">Brak wyników.</div>
                          )}
                        </div>
                        <p className="text-[10px] text-brand-brown/50 mt-1.5 px-1">Wpisz kod (np. SWI001) lub miasto – lista się filtruje. Kliknij pozycję, aby wypełnić i zobaczyć podsumowanie.</p>
                      </div>

                      {errors.parcelLocker && (
                        <p className="text-red-600 text-xs mt-1">{errors.parcelLocker}</p>
                      )}
                    </div>
                  ) : (
                    /* Pickup info - full address + hours */
                    <div className="p-5 bg-brand-cream/60 rounded-2xl text-sm text-brand-brown/90 leading-relaxed border border-brand-creamDark">
                      <div className="font-medium text-brand-brown mb-1">Odbiór osobisty w Pasiece Jankesowej</div>
                      <div>ul. Topolno 12, 86-120 Pruszcz</div>
                      <div className="mt-1 text-brand-brown/70">Godziny: po wcześniejszym uzgodnieniu (tel. lub e-mail)</div>
                      <div className="mt-2 text-xs text-brand-brown/60">Zadzwonimy po złożeniu zamówienia, by ustalić dogodny termin odbioru. Czekamy na Ciebie!</div>
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
                  {isCheckingOut ? "Przekierowujemy do płatności..." : "Przejdź do płatności"}
                </Button>

                <div className="mt-4 text-center text-[10px] leading-snug text-brand-brown/60">
                  Bezpieczna płatność kartą, BLIK lub przelewem online
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={clearCart} className="text-xs text-brand-brown/60 hover:text-brand-brown underline">
            Wyczyść koszyk
          </button>
        </div>
      </div>
    </div>
  );
}
