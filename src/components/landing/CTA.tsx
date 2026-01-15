import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
          
          {/* Floating sparkles */}
          <div className="absolute top-8 left-8 opacity-50">
            <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <div className="absolute bottom-8 right-8 opacity-50">
            <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
              <Zap className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground/90">Limited Time: Free Pro Trial</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
              Join thousands of Pakistani freelancers who are getting paid faster with professional invoices.
            </p>

            {/* Features list */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <CheckCircle className="w-4 h-4" />
                Free forever plan
              </span>
              <span className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <CheckCircle className="w-4 h-4" />
                No credit card required
              </span>
              <span className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <CheckCircle className="w-4 h-4" />
                Setup in 30 seconds
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg group"
                >
                  Start Creating Invoices
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-primary-foreground/60 mt-6">
              No commitments. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
