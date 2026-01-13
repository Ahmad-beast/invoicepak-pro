import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 invoices per month',
      'USD to PKR conversion',
      'PDF export',
      'Basic support',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: '999',
    description: 'For growing freelancers',
    features: [
      'Unlimited invoices',
      'USD to PKR conversion',
      'PDF export',
      'Priority support',
      'Invoice templates',
      'Payment reminders',
    ],
    popular: true,
  },
  {
    name: 'Business',
    price: '2,499',
    description: 'For agencies & teams',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom branding',
      'Analytics dashboard',
      'API access',
      'Dedicated support',
    ],
    popular: false,
  },
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
            Choose the plan that works best for you. All plans include core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border transition-colors ${
                plan.popular
                  ? 'bg-primary/5 border-primary'
                  : 'bg-card border-border hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-foreground">PKR {plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
