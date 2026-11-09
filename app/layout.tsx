// Fixed 404 - correct App Router structure
// Recreated layout, page, globals from scratch with full Jankesowa Pasieka content (hero, products, about, contact) + Navbar/Footer
import type { Metadata } from "next";
import { Inter, Playfair_Display, Satisfy } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleAdsScripts from "@/components/GoogleAdsScripts";
import CookieBanner from "@/components/CookieBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { organizationJsonLd } from "@/lib/structured-data";

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

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-satisfy",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jankesowapasieka.pl"),
  title: {
    default: "Jankesowa Pasieka – miód prosto z pasieki | Toruń, Bydgoszcz, Świecie",
    template: "%s | Jankesowa Pasieka",
  },
  description: "Naturalny miód prosto z pasieki w Topolnie (gm. Pruszcz) na Kujawach: miód akacjowy, wielokwiatowy, rzepakowo-mniszkowy i plastry miodu. Bez pasteryzacji. Wysyłka w całej Polsce, odbiór osobisty w Topolnie i w Bydgoszczy, blisko Torunia i Świecia.",
  alternates: { canonical: "/" },
  verification: { google: "xtNvLvCc66eNeXbXfqZvpFHdRVKvTArgEnvOWCqma-Q" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://jankesowapasieka.pl",
    siteName: "Jankesowa Pasieka",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Ule Jankesowej Pasieki w Topolnie" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable} ${satisfy.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {process.env.NEXT_PUBLIC_GADS_ID ? (
          <script
            id="google-consent-default"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied',
                  wait_for_update: 500
                });
                try {
                  var c = localStorage.getItem('${CONSENT_STORAGE_KEY}');
                  if (c === 'granted') {
                    gtag('consent', 'update', {
                      ad_storage: 'granted',
                      ad_user_data: 'granted',
                      ad_personalization: 'granted',
                      analytics_storage: 'granted'
                    });
                  }
                } catch (e) {}
              `,
            }}
          />
        ) : null}
      </head>
      <body className="min-h-screen bg-[#F5EDE4] text-[#1F2937] antialiased">
        <GoogleAdsScripts />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
