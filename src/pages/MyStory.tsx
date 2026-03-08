import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { SEO } from '@/components/SEO';
import { ArrowRight, User, Heart, Code, Rocket, Quote, Sparkles } from 'lucide-react';

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
          {/* Hero Section */}
          <section className="container mx-auto px-4 max-w-3xl text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30 flex items-center justify-center mx-auto">
                <User className="w-14 h-14 md:w-18 md:h-18 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg glow-primary">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>

            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Built with Love from Pakistan
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Why I Built{' '}
              <span className="text-gradient-primary">InvoicePak</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              The real story behind a tool made by a Pakistani developer, for Pakistani freelancers.
            </p>
          </section>

          {/* Story Content */}
          <article className="container mx-auto px-4 max-w-2xl space-y-8">
            {/* Opening */}
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Quote className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-lg md:text-xl leading-relaxed text-foreground italic">
                    "Hi, I'm a developer from Pakistan, just like many of you."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Domain Story */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                When I started building this tool, I had a choice: spend money on a fancy{' '}
                <code className="bg-secondary px-2 py-0.5 rounded text-xs text-foreground font-mono">.com</code>{' '}
                domain or spend time making the product better. To be honest, I didn't have the budget for a custom domain yet. That's why you see{' '}
                <code className="bg-secondary px-2 py-0.5 rounded text-xs text-foreground font-mono">.vercel.app</code>{' '}
                in the address bar.
              </p>

              <p>
                But I didn't let that stop me. I realized that freelancers in Pakistan don't need a fancy URL; they need{' '}
                <span className="text-foreground font-semibold">a tool that actually works</span>. They need a way to create professional invoices without paying monthly fees or struggling with complex software.
              </p>
            </div>

            {/* Values Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Heart, title: 'Made with Love', desc: 'Every feature designed for Pakistani freelancers' },
                { icon: Code, title: 'Built from Scratch', desc: 'Late nights, chai, and determination' },
                { icon: Rocket, title: 'Always Improving', desc: 'Every rupee reinvested back into the platform' },
              ].map((item, i) => (
                <Card key={i} className="border-border/50 group hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-3 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Closing */}
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <span className="text-foreground font-semibold">InvoicePak</span> is my attempt to solve a problem I faced myself. It's built with love, hard work, and a lot of late nights.
              </p>

              <p>
                This is just the beginning. As we grow together, I promise to reinvest every rupee back into making this platform world-class.
              </p>
            </div>

            {/* Thank You Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
              <CardContent className="p-6 md:p-8 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Thank you for trusting a fellow freelancer 🙏
                </p>
                <p className="text-sm text-muted-foreground">
                  Your support means everything. Together, we'll build something amazing.
                </p>
              </CardContent>
            </Card>

            {/* Signature */}
            <div className="pt-4 border-t border-border/50 text-center">
              <p className="text-muted-foreground italic text-sm">
                — The InvoicePak Team
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-4 pb-8">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 glow-primary font-semibold">
                  <Sparkles className="w-5 h-5" />
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
