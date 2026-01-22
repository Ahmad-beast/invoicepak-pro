import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { SEO } from '@/components/SEO';
import { ArrowRight, User } from 'lucide-react';

const MyStory = () => {
  return (
    <>
      <SEO
        title="My Story - Why I Built InvoicePak"
        description="The real story behind InvoicePak - built by a Pakistani developer for Pakistani freelancers. No fancy domain, just a tool that works."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <article className="container mx-auto px-4 max-w-2xl">
            {/* Profile Picture Placeholder */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-muted border-4 border-primary/20 flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-4 leading-tight">
              Why I Built InvoicePak
              <span className="block text-primary mt-2">(The Real Story)</span>
            </h1>

            {/* Divider */}
            <div className="w-16 h-1 bg-primary mx-auto my-8 rounded-full" />

            {/* Body Content */}
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p className="text-xl leading-relaxed">
                Hi, I'm <span className="text-foreground font-semibold">a developer from Pakistan</span>, just like many of you.
              </p>

              <p className="leading-relaxed">
                When I started building this tool, I had a choice: spend money on a fancy <code className="bg-muted px-2 py-1 rounded text-sm">.com</code> domain or spend time making the product better. To be honest, I didn't have the budget for a custom domain yet. That's why you see <code className="bg-muted px-2 py-1 rounded text-sm">.vercel.app</code> in the address bar.
              </p>

              <p className="leading-relaxed">
                But I didn't let that stop me. I realized that freelancers in Pakistan don't need a fancy URL; they need <span className="text-foreground font-semibold">a tool that works</span>. They need a way to create professional invoices without paying monthly fees or struggling with complex software.
              </p>

              <p className="leading-relaxed">
                <span className="text-foreground font-semibold">InvoicePak</span> is my attempt to solve a problem I faced myself. It's built with love, hard work, and a lot of late nights.
              </p>

              <p className="leading-relaxed">
                This is just the beginning. As we grow together, I promise to reinvest every rupee back into making this platform world-class.
              </p>

              <p className="text-xl leading-relaxed text-foreground font-medium">
                Thank you for trusting a fellow freelancer. 🙏
              </p>
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground italic text-center">
                — The InvoicePak Team
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  Create Your First Invoice
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MyStory;