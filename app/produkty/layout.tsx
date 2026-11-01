import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Miody naturalne – sklep z miodem prosto z pasieki",
  description: "Kup miód akacjowy, wielokwiatowy, rzepakowo-mniszkowy, plastry miodu i świece z wosku pszczelego prosto z pasieki w Topolnie. Wysyłka InPost i kurierem, odbiór osobisty – okolice Świecia, Torunia i Bydgoszczy.",
  alternates: { canonical: "/produkty" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
