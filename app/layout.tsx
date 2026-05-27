import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jankesowa Pasieka",
  description: "Naturalne miody z Kujaw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}