// Fixed 404 - correct App Router structure
// Logo added to Navbar and Footer (from public/logo.png)
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jankesowa Pasieka | Naturalne miody z Kujaw nad Wisłą",
  description: "Rodzinna pasieka w Topolnie (gmina Pruszcz). Najwyższej jakości miody niepasteryzowane z terenów nadwiślańskich Kujaw. Ręcznie zbierane, bez antybiotyków.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#F5EDE4] text-[#1F2937] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
