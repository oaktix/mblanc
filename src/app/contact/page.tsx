import { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Book a Bespoke Fitting",
  description: "Begin your bespoke journey with MBlanc Bespoke. Book a private fitting at our Abuja atelier or inquire about our custom tailoring services.",
  openGraph: {
    title: "Contact MBlanc Bespoke | Sartorial Excellence",
    description: "Book your private fitting appointment at our Abuja atelier.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
