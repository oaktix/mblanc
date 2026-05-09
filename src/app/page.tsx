import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "MBlanc Bespoke | Luxury Menswear & Custom Tailoring",
  description: "Nigeria's premier destination for custom-tailored luxury menswear. From regal Agbadas to sophisticated corporate suits, we craft garments for the gentleman who commands presence.",
};

export default function Home() {
  return <HomeClient />;
}
