import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koszyk",
  description: "Twój koszyk w sklepie Jankesowa Pasieka.",
  alternates: { canonical: "/koszyk" },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
