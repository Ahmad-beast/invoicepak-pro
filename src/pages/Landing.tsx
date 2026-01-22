import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { SEO } from '@/components/SEO';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Free Invoice Generator for Pakistani Freelancers & Agencies"
        description="Create professional USD and PKR invoices instantly with InvoicePak Pro. The best free invoice maker designed specifically for freelancers, remote workers, and agencies in Pakistan. Download PDF invoices with auto-currency conversion."
        keywords="free invoice generator pakistan, invoice maker for freelancers, usd to pkr invoice, professional invoice template, freelance bill maker, invoicepak pro, digital munshi"
        canonical="/"
      />
      <Navbar />
      <main className="pt-16">
        <Hero />
      <Stats />
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Testimonials />
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <FAQ />
      </div>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
