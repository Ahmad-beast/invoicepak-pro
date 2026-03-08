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
import { GlobalBanner } from '@/components/GlobalBanner';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReferralTracker } from '@/hooks/useReferralTracker';

const Landing = () => {
  useReferralTracker();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        title="Free Invoice Generator for Pakistani Freelancers & Agencies"
        description="Create professional USD and PKR invoices instantly with InvoicePak Pro. The best free invoice maker designed specifically for freelancers, remote workers, and agencies in Pakistan. Download PDF invoices with auto-currency conversion."
        keywords="free invoice generator pakistan, invoice maker for freelancers, usd to pkr invoice, professional invoice template, freelance bill maker, invoicepak pro, digital munshi"
        canonical="/"
      />
      <GlobalBanner />
      <Navbar />
      <main className="flex-grow">
        <ScrollReveal direction="none">
          <Hero />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Stats />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div id="features">
            <Features />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div id="how-it-works">
            <HowItWorks />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div id="pricing">
            <Pricing />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div id="faq">
            <FAQ />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <CTA />
        </ScrollReveal>
      </main>
      <ScrollReveal delay={50} direction="none">
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Landing;
