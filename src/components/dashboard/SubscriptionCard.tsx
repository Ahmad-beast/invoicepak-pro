import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles, Settings, Loader2, AlertCircle, Zap, Shield, FileText, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { PLAN_LIMITS } from '@/lib/subscription';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  'Up to 5 invoices per month',
  'Standard templates',
  'Basic PDF export',
  'Email support',
];

const PRO_FEATURES = [
  'Unlimited invoices & clients',
  'Custom exchange rates',
  'Invoice sharing links',
  'No InvoicePK branding',
  'Priority WhatsApp support',
  'All future PRO updates',
];

export const SubscriptionCard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    subscription, 
    loading, 
    upgradeToPro, 
    manageSubscription, 
    isPro,
    getRemainingInvoices,
  } = useSubscription();

  // Handle success/cancel from checkout
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Welcome to Pro! Your subscription is now active.');
      setSearchParams({});
    } else if (searchParams.get('cancelled') === 'true') {
      toast.info('Checkout cancelled. Feel free to upgrade anytime!');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-card border-2 border-muted h-[500px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-12 w-12 rounded-full mb-4" />
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full mb-8" />
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const remainingInvoices = getRemainingInvoices();
  const usedInvoices = subscription?.invoiceCountThisMonth || 0;
  const maxInvoices = PLAN_LIMITS.free.maxInvoicesPerMonth;
  const usagePercent = isPro ? 0 : (usedInvoices / maxInvoices) * 100;

  return (
    <div className="space-y-12">
      {/* Current Usage Banner for Free Users */}
      {!isPro && (
        <Card className="bg-card border-border overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-primary h-full" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Current Usage (Free Plan)
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your limits will reset on {subscription?.monthResetDate ? new Date(subscription.monthResetDate).toLocaleDateString() : 'the start of next month'}.
                </p>
              </div>
              
              <div className="flex-1 max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {usedInvoices} / {maxInvoices} Invoices Used
                  </span>
                  <span className={cn("font-medium", remainingInvoices === 0 ? "text-destructive" : remainingInvoices <= 2 ? "text-amber-500" : "text-primary")}>
                    {remainingInvoices} remaining
                  </span>
                </div>
                <Progress value={usagePercent} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* Free Plan Card */}
        <Card className={cn(
          "relative flex flex-col border-2 transition-all duration-300",
          !isPro ? "border-primary/50 shadow-xl shadow-primary/5" : "border-border/50 opacity-80"
        )}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs">
                CURRENT PLAN
              </Badge>
            </div>
          )}
          <CardHeader className="pt-8 pb-6">
            <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Free</CardTitle>
            <CardDescription className="text-base mt-2">
              Essential features for starters
            </CardDescription>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">₨0</span>
              <span className="text-muted-foreground">/ forever</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-4 flex-1">
              {FREE_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground line-through">Custom exchange rates</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <X className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground line-through">InvoicePK branding removal</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full mt-8 h-12 font-semibold"
              disabled={!isPro}
              onClick={manageSubscription}
            >
              {!isPro ? 'Currently Active' : 'Downgrade to Free'}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan Card */}
        <Card className={cn(
          "relative flex flex-col border-2 transition-all duration-300 transform md:-translate-y-4",
          isPro ? "border-amber-500 shadow-2xl shadow-amber-500/10" : "border-amber-500/50 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10"
        )}>
          {/* Pro Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none rounded-xl" />
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-4 py-1 text-xs shadow-lg">
              {isPro ? 'ACTIVE SUBSCRIPTION' : 'RECOMMENDED'}
            </Badge>
          </div>
          
          <CardHeader className="pt-8 pb-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 opacity-50 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Pro</CardTitle>
            <CardDescription className="text-base mt-2">
              For serious freelancers scaling up
            </CardDescription>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">₨999</span>
              <span className="text-muted-foreground font-medium">/ month</span>
            </div>
            {isPro && subscription?.currentPeriodEnd && (
              <p className="text-xs text-amber-500 mt-2 font-medium">
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col relative z-10">
            <ul className="space-y-4 flex-1">
              {PRO_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            {isPro ? (
              <Button 
                onClick={manageSubscription}
                variant="outline"
                className="w-full mt-8 h-12 font-semibold border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            ) : (
              <Button 
                onClick={upgradeToPro}
                className="w-full mt-8 h-12 font-bold text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Pro
              </Button>
            )}
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              Secure payments via Lemon Squeezy
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ / Trust Section */}
      <div className="pt-8 border-t border-border/50">
        <h3 className="text-xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your billing dashboard. You'll keep Pro access until the end of your billing cycle." },
            { q: "What happens if I reach the free limit?", a: "You won't be able to create new invoices until the 1st of next month, or until you upgrade to Pro." },
            { q: "Are my invoices private?", a: "Absolutely. All your data is securely stored and we never share your financial information with third parties." },
            { q: "How do sharing links work?", a: "Pro users get a unique, unguessable link for each invoice that they can send directly to clients on WhatsApp or Email." }
          ].map((faq, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                {faq.q}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
