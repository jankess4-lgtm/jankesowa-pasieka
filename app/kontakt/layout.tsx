import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt i dojazd – Topolno, gmina Pruszcz",
  description: "Skontaktuj się z Jankesową Pasieką: Topolno 45, gmina Pruszcz (powiat świecki). Tel. +48 514 070 298. Odbiór osobisty w pasiece w Topolnie, w Bydgoszczy (ul. Jagiellońska, koło hotelu City) i w Świeciu – po wcześniejszym umówieniu.",
  alternates: { canonical: "/kontakt" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
