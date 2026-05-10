import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "Our Story | The Art of Bespoke Tailoring",
  description: "Discover the heritage of MBlanc Bespoke. From traditional African aesthetics to modern sartorial excellence, learn about our process and passion for precision tailoring.",
  openGraph: {
    title: "About MBlanc Bespoke | Luxury Tailoring Abuja",
    description: "Handcrafting excellence for the modern gentleman since inception.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
