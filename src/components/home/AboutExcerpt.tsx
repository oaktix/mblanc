import Link from "next/link";
import Image from "next/image";

export default function AboutExcerpt() {
  return (
    <section className="py-24 bg-cream dark:bg-black text-charcoal dark:text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative h-[600px]">
            <div className="absolute inset-0 bg-gold/20 translate-x-4 translate-y-4"></div>
            {/* Placeholder for actual image */}
            <div className="absolute inset-0 bg-warm-gray dark:bg-charcoal">
              <img 
                src="/atelier_portrait_image_1778044902370.png" 
                alt="Atelier Portrait" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <div className="w-16 h-1 bg-gold mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              A Legacy of Precision & Pride
            </h2>
            <div className="space-y-6 text-lg font-light leading-relaxed mb-10 text-gray-700 dark:text-gray-300">
              <p>
                At MBlanc Bespoke, we don't just make clothes — we craft legacies. Born from a deep respect for African heritage and a passion for impeccable tailoring, our atelier in Abuja has become the trusted destination for gentlemen who refuse to compromise.
              </p>
              <p>
                From boardrooms to traditional ceremonies, we ensure you arrive not just dressed, but distinguished.
              </p>
            </div>
            <Link 
              href="/about" 
              className="inline-block border-b-2 border-gold text-gold font-semibold tracking-wider uppercase text-sm pb-1 hover:text-black dark:hover:text-white transition-colors"
            >
              Read Our Story
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
