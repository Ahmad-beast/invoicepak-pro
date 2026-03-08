import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FREE_FEATURES = [
  '5 invoices per month',
  'USD to PKR conversion',
  'PDF download',
  'Payment tracking',
];

const PRO_FEATURES = [
  'Unlimited invoices',
  'Custom exchange rate',
  'Invoice sharing links',
  'No branding on PDF',
  'Custom company branding',
  'Invoice templates',
  'Priority support',
  'All future updates',
];

export const Pricing = () => {
  return (
    <section className="py-24 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Start free, upgrade when you need more power.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl border border-border bg-card">
            <h3 className="text-xl font-bold text-foreground mb-1">Free</h3>
            <p className="text-sm text-muted-foreground mb-6">Perfect to get started</p>
            
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground"> / forever</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup">
              <Button variant="outline" className="w-full h-12 text-base font-medium">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 rounded-2xl border-2 border-primary/50 bg-card overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
            
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
              <Crown className="w-3 h-3" />
              Recommended
            </span>
            
            <h3 className="text-xl font-bold text-foreground mb-1">Pro</h3>
            <p className="text-sm text-muted-foreground mb-6">For serious freelancers</p>
            
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">Rs 999</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup">
              <Button className="w-full h-12 text-base font-medium gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </Link>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Cancel anytime · Secure payment via Lemon Squeezy
            </p>
          </div>
        </div>
          
        {/* Benefits note */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Why Choose Pro?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Create unlimited professional invoices, share with clients via secure links, add your own branding, and remove InvoicePK watermark from PDFs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
