import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const title = category ? `${category} Collection` : "Our Shop";
  const description = category 
    ? `Explore our exclusive ${category} collection at MBlanc Bespoke. Handcrafted luxury garments for the discerning gentleman.` 
    : "Browse the full MBlanc Bespoke collection. Luxury Agbadas, corporate suits, and traditional kaftans tailored to perfection.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | MBlanc Bespoke`,
      description,
      images: ["/images/shop.jpg"],
    },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: category ? { category: category } : {},
    orderBy: { createdAt: "desc" },
  });

  const categories = ["Agbada", "Suits", "Kaftans", "Corporate"];

  return (
    <main className="min-h-screen bg-cream dark:bg-black pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-black overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/shop.jpg" 
            alt="MBlanc Bespoke Shop" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent mix-blend-multiply"></div>
        </div>
        <div className="relative z-20 text-center px-4 mt-16">
          <span className="text-gold uppercase tracking-[0.4em] text-xs mb-4 block">The Collection</span>
          <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-6">Our Shop</h1>
          <div className="h-1 w-20 bg-gold mx-auto" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-charcoal dark:text-ivory mb-4">Refined Garments</h2>
            <p className="text-gray-500 font-light italic">For the modern gentleman.</p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/shop"
              className={`px-6 py-2 border rounded-full text-sm uppercase tracking-widest transition-colors ${!category ? "bg-gold border-gold text-black" : "border-gray-300 text-gray-500 hover:border-gold hover:text-gold"}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link 
                key={cat}
                href={`/shop?category=${cat}`}
                className={`px-6 py-2 border rounded-full text-sm uppercase tracking-widest transition-colors ${category === cat ? "bg-gold border-gold text-black" : "border-gray-300 text-gray-500 hover:border-gold hover:text-gold"}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className="group">
                <div className="relative h-[400px] bg-warm-gray dark:bg-charcoal mb-4 overflow-hidden border border-gold/10">
                   {product.images && product.images.length > 0 ? (
                     <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   ) : (
                     <img src="/logo.png" alt={product.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50" />
                   )}
                   <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 backdrop-blur-sm">
                      <button className="w-full py-3 bg-gold text-black font-semibold uppercase tracking-wider text-xs">
                        View Details
                      </button>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{product.category}</p>
                   <h3 className="text-lg font-serif text-charcoal dark:text-ivory group-hover:text-gold transition-colors">{product.name}</h3>
                   <p className="text-gold font-medium">₦{product.basePrice.toLocaleString()}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
               <p className="text-gray-500 font-light italic">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
