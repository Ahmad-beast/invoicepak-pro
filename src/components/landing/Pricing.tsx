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
    <section className="py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-primary text-sm font-bold uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4 tracking-tight">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto text-lg">
            Start free, upgrade when you need more power.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl glass">
            <h3 className="text-xl font-bold text-foreground mb-1">Free</h3>
            <p className="text-sm text-muted-foreground mb-6">Perfect to get started</p>
            
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-foreground">$0</span>
              <span className="text-muted-foreground"> / forever</span>
            </div>
            
            <ul className="space-y-3.5 mb-8">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup">
              <Button variant="outline" className="w-full h-12 text-base font-semibold hover:bg-primary/5 hover:border-primary/40">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 rounded-2xl glass border-primary/30 glow-primary overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-chart-4 to-primary" />
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/15 text-primary border border-primary/25 rounded-full mb-4 uppercase tracking-wider">
              <Crown className="w-3 h-3" />
              Recommended
            </span>
            
            <h3 className="text-xl font-bold text-foreground mb-1">Pro</h3>
            <p className="text-sm text-muted-foreground mb-6">For serious freelancers</p>
            
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-foreground">Rs 999</span>
              <span className="text-muted-foreground"> / month</span>
            </div>
            
            <ul className="space-y-3.5 mb-8">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/signup">
              <Button className="w-full h-12 text-base font-semibold gap-2 glow-primary-strong">
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
          <div className="p-6 rounded-2xl glass border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Why Choose Pro?</h4>
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
