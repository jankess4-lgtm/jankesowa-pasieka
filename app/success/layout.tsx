import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dziękujemy za zamówienie",
  description: "Potwierdzenie zamówienia w Jankesowej Pasiece.",
  alternates: { canonical: "/success" },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
