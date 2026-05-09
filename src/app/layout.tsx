import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MBlanc Bespoke | Luxury Menswear",
  description: "Nigeria's premier destination for custom-tailored menswear. From corporate suits to regal Agbadas.",
  icons: {
    icon: "/logo.jpg",
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
          <StoreShell>{children}</StoreShell>
        </Providers>
      </body>
    </html>
  );
}
