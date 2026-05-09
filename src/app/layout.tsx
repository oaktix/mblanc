import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";
import Providers from "@/components/Providers";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MBlanc Bespoke | Luxury Menswear & Custom Tailoring",
    template: "%s | MBlanc Bespoke"
  },
  description: "Nigeria's premier destination for custom-tailored luxury menswear. From regal Agbadas to sophisticated corporate suits, we craft garments for the gentleman who commands presence.",
  keywords: ["bespoke tailoring", "luxury menswear", "Agbada", "custom suits", "Nigerian fashion", "tailored garments", "MBlanc Bespoke"],
  authors: [{ name: "MBlanc Atelier" }],
  creator: "MBlanc Bespoke",
  publisher: "MBlanc Bespoke",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://mblancfits.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MBlanc Bespoke | Luxury Menswear",
    description: "Handcrafted sartorial excellence for the modern gentleman.",
    url: "https://mblancfits.com",
    siteName: "MBlanc Bespoke",
    images: [
      {
        url: "/images/hero-agbada.jpg",
        width: 1200,
        height: 630,
        alt: "MBlanc Bespoke Luxury Menswear",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBlanc Bespoke | Luxury Menswear",
    description: "Handcrafted sartorial excellence for the modern gentleman.",
    images: ["/images/hero-agbada.jpg"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-charcoal dark:bg-black dark:text-ivory">
        <Providers>
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <StoreShell>{children}</StoreShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
