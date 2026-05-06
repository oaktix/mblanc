import Link from "next/link";

export default function CtaBar() {
  return (
    <section className="bg-burgundy text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gold">Step Into the MBlanc Experience</h2>
        <p className="text-lg font-light mb-8 max-w-2xl text-white/90">
          Visit our flagship store at 460 Yusuf Abubakar Yusuf Street, Abuja, or book a private consultation to begin your journey.
        </p>
        <Link 
          href="/contact" 
          className="inline-block px-8 py-4 bg-transparent border-2 border-gold text-gold font-semibold tracking-wider uppercase text-sm hover:bg-gold hover:text-black transition-colors"
        >
          Book an Appointment
        </Link>
      </div>
    </section>
  );
}
