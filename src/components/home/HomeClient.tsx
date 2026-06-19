"use client";

import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import AboutExcerpt from "@/components/home/AboutExcerpt";
import Categories from "@/components/home/Categories";
import ProductCarousel from "@/components/home/ProductCarousel";
import InquiryForm from "@/components/home/InquiryForm";
import CtaBar from "@/components/home/CtaBar";

interface Props {
  latestProducts: any[];
  categories: any[];
}

export default function HomeClient({ latestProducts, categories }: Props) {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero categories={categories} />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <AboutExcerpt />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Categories categories={categories} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <ProductCarousel products={latestProducts} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <InquiryForm />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <CtaBar />
      </motion.div>
    </main>
  );
}
