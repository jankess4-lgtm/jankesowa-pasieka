import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Płatność anulowana",
  description: "Płatność została anulowana.",
  alternates: { canonical: "/cancel" },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
