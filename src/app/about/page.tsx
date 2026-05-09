import Image from "next/image";

const PROCESS_STEPS = [
  {
    title: "Consultation",
    description: "We listen. Your style, your occasion, your vision.",
  },
  {
    title: "Precision Measurement",
    description: "Over 30 measurements to ensure a flawless fit.",
  },
  {
    title: "Artisan Crafting",
    description: "Hand-cut, hand-sewn, and meticulously finished.",
  },
  {
    title: "Delivery & Fitting",
    description: "Your piece, perfected and ready to command attention.",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/Craftmanship.jpg" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
        </div>
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-gold mb-4">The Art of Dressing Well</h1>
          <p className="text-cream font-light tracking-widest uppercase text-sm">Where heritage craftsmanship meets contemporary elegance</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-cream dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="w-16 h-1 bg-gold mb-8"></div>
              <h2 className="text-4xl font-serif mb-8 leading-tight text-charcoal dark:text-ivory">Our Story</h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-gray-700 dark:text-gray-300">
                <p>
                  MBlanc Bespoke was born from a simple belief: every gentleman deserves to feel extraordinary. What started as a passion for precision tailoring has grown into a destination for men who understand that clothing is more than fabric — it's identity, confidence, and legacy.
                </p>
                <p>
                  Located in the heart of Abuja, our flagship store at 460 Yusuf Abubakar Yusuf Street is more than a showroom; it's an experience. From the moment you step in, you are welcomed into a world where your measurements are sacred, your preferences are honored, and your garment is crafted to tell your unique story.
                </p>
                <p>
                  We specialize in bespoke suits, regal Agbadas, elegant Kaftans, and sharp corporate fits — each piece meticulously handcrafted by artisans who have mastered the balance between traditional African aesthetics and modern sartorial excellence.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-[500px] w-full">
               <div className="absolute inset-0 border border-gold/20 translate-x-4 translate-y-4"></div>
               <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src="/images/about-portrait.jpg" 
                    alt="Atelier Craftsmanship" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 z-10"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 bg-white dark:bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-charcoal dark:text-ivory mb-4">Our Process</h2>
            <p className="text-gray-500 font-light">Meticulous attention to every detail, from the first stitch to the final fitting.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-cream dark:bg-black border border-gold/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold transition-colors duration-500">
                  <span className="text-gold font-serif text-2xl group-hover:text-black transition-colors duration-500">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-serif mb-4 text-charcoal dark:text-ivory">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-24 bg-cream dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto bg-white dark:bg-charcoal p-12 border border-gold/20 shadow-2xl">
             <h2 className="text-3xl font-serif mb-8 text-gold uppercase tracking-widest">Visit the Atelier</h2>
             <div className="space-y-4 text-charcoal dark:text-ivory mb-10">
               <p className="font-medium text-lg">460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja, Nigeria</p>
               <p className="text-gray-500">Monday – Saturday: 10:00 AM – 7:00 PM</p>
               <p className="text-gray-500 font-medium">+234 904 757 6899</p>
               <p className="text-gray-500">hello@mblancfits.com</p>
             </div>
             <button className="px-10 py-4 bg-burgundy text-white font-semibold tracking-wider uppercase text-sm hover:bg-black transition-colors">
                Get Directions
             </button>
          </div>
        </div>
      </section>
    </main>
  );
}
