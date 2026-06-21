"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/useCart";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/produkty", label: "Oferta" },
  { href: "/o-nas", label: "O nas" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Listen for global open-cart events (from toast action)
  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#F5EDE4]/95 backdrop-blur-md border-b border-brand-brown/10">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          {/* Logo + Brand Name */}
          <Link href="/" className="flex items-center gap-4 group" aria-label="Jankesowa Pasieka - Strona główna">
            <Image 
              src="/logo.png" 
              alt="Jankesowa Pasieka" 
              width={270} 
              height={80} 
              className="h-16 md:h-20 w-auto object-contain" 
              priority 
            />
            <span 
              className="text-[#78350F] text-2xl md:text-3xl tracking-[0.5px] font-normal leading-none"
              style={{ fontFamily: "'Kristen ITC', cursive" }}
            >
              JANKESOWA PASIEKA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-brand-gold ${
                  isActive(link.href) ? "text-brand-gold" : "text-brand-brown"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-brand-brown/30 hover:border-brand-gold/70 hover:bg-white transition group"
              aria-label="Otwórz koszyk"
            >
              <ShoppingCart className="w-4 h-4 text-brand-brown group-hover:text-brand-gold transition" />
              <span className="hidden sm:inline text-sm text-brand-brown">Koszyk</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-gold px-1.5 text-[10px] font-semibold text-white tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-brand-cream transition"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-brown/10 bg-[#F5EDE4]">
            <div className="px-6 py-6 flex flex-col gap-4 text-base font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-1 transition ${isActive(link.href) ? "text-brand-gold" : "text-brand-brown"}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-brand-brown/10 my-1" />
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                className="flex items-center gap-2 text-left py-1 text-brand-brown"
              >
                <ShoppingCart className="w-4 h-4" /> Koszyk {totalItems > 0 && `(${totalItems})`}
              </button>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
