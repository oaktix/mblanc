import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how MBlanc Bespoke protects and manages your personal data and bespoke measurements.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24 min-h-screen bg-ivory dark:bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-charcoal dark:text-ivory mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none font-light leading-relaxed text-gray-700 dark:text-gray-300 space-y-8">
          <p className="italic">Last updated: May 2026</p>
          
          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">1. Introduction</h2>
            <p>
              At MBlanc Bespoke, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy informs you about how we look after your personal data when you visit our 
              website or visit our atelier, and tells you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">2. The Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and title.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data:</strong> includes payment card details (processed securely via TransactPay, we do not store your raw card details).</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
              <li><strong>Measurement Data:</strong> includes your bespoke physical measurements required for tailoring your garments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling your bespoke order).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
              used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
              to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-4">5. Contact Details</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
            <ul className="list-none space-y-2 mt-4">
              <li>Email address: hello@mblancfits.com</li>
              <li>Postal address: 460 Yusuf Abubakar Yusuf Street, beside Purple Heart, Abuja, Nigeria</li>
              <li>Telephone number: +234 904 757 6899</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
