import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms of service regarding bespoke tailoring orders, alterations, and payments.",
};

export default function TermsPage() {
  return (
    <main className="pt-32 pb-24 min-h-screen bg-ivory dark:bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-charcoal dark:text-ivory mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none font-light leading-relaxed text-gray-700 dark:text-gray-300 space-y-8">
          <p className="italic">Last updated: May 2026</p>
          
          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing our website and utilizing our bespoke tailoring services, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">2. Bespoke Orders and Alterations</h2>
            <p>
              Our garments are custom-made to your specific measurements and design choices. As such, once fabric has been 
              cut for a bespoke order, the order cannot be cancelled or fully refunded. 
            </p>
            <p className="mt-4">
              We offer up to two complimentary alteration sessions within 30 days of the final fitting to ensure the 
              garment meets our exacting standards and your expectations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">3. Payments and Pricing</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or 
              discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
            <p className="mt-4">
              A deposit of at least 70% is required before the commencement of any bespoke tailoring work, with the 
              balance due upon completion and before final delivery or collection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">4. Shipping and Delivery</h2>
            <p>
              Estimated delivery times are provided as guidelines only. MBlanc Bespoke is not responsible for delays 
              caused by shipping carriers or customs clearance processes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">5. Intellectual Property</h2>
            <p>
              The content, design, and branding of the MBlanc Bespoke website, including but not limited to text, graphics, 
              logos, and images, are the property of MBlanc Bespoke and are protected by applicable intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria, 
              without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
