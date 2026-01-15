import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRO_FEATURES = [
  'Unlimited invoices',
  'Custom exchange rate',
  'Invoice sharing links',
  'No branding on PDF',
  'Priority support',
  'All future updates',
];

export const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            One plan, all features included. No hidden fees.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="p-8 rounded-xl border-2 border-amber-500/50 bg-card overflow-hidden relative">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            
            {/* Badge */}
            <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full mb-4">
              Recommended
            </span>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">InvoicePK Pro</h3>
                <p className="text-muted-foreground text-sm">Perfect for freelancers & small businesses</p>
              </div>
            </div>
            
            {/* Price */}
            <div className="mt-6 mb-8">
              <span className="text-4xl font-bold text-foreground">₨999</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            
            {/* Features */}
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* CTA Button */}
            <Link to="/signup">
              <Button className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 h-12 text-base font-medium">
                <Crown className="w-5 h-5" />
                Get Started
              </Button>
            </Link>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Cancel anytime • Secure payment via Lemon Squeezy
            </p>
          </div>
          
          {/* Benefits note */}
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Why Choose Pro?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create unlimited professional invoices, share with clients, and remove branding from your PDFs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
