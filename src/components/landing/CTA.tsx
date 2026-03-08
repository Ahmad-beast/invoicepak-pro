import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

export const CTA = React.forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="py-28 px-4">
      <div className="container mx-auto">
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-chart-4/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(47_96%_53%_/_0.2),_transparent_60%)]" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="absolute top-8 left-8 opacity-30">
            <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <div className="absolute bottom-8 right-8 opacity-30">
            <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative z-10 text-center p-10 md:p-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Zap className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground/90 font-semibold">Limited Time: Free Pro Trial</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-5 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-10">
              Join thousands of Pakistani freelancers who are getting paid faster with professional invoices.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mb-10">
              {['Free forever plan', 'No credit card required', 'Setup in 30 seconds'].map((text) => (
                <span key={text} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <CheckCircle className="w-4 h-4" />
                  {text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-10 py-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl font-bold group"
                >
                  Start Creating Invoices
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-primary-foreground/40 mt-8">
              No commitments. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
