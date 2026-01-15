import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PLAN_LIMITS } from '@/types/subscription';
import { Crown, Zap, Check, Loader2, Sparkles, Link2, RefreshCw, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

const FREE_FEATURES = [
  { text: '5 invoices per month', included: true },
  { text: 'Basic invoice creation', included: true },
  { text: 'InvoicePK branding on PDF', included: true },
  { text: 'Custom exchange rate', included: false },
  { text: 'Invoice sharing links', included: false },
  { text: 'Remove branding', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited invoices', included: true },
  { text: 'Basic invoice creation', included: true },
  { text: 'Custom exchange rate', included: true },
  { text: 'Invoice sharing links', included: true },
  { text: 'No branding on PDF', included: true },
  { text: 'Priority support', included: true },
];

export const SubscriptionCard = () => {
  const { 
    subscription, 
    loading, 
    canCreateInvoice, 
    getRemainingInvoices, 
    upgradeToPro 
  } = useSubscription();

  const handleUpgrade = async () => {
    // Placeholder for payment integration - would redirect to Stripe/payment page
    toast.info('Payment integration coming soon! For now, upgrading directly.');
    await upgradeToPro();
    toast.success('Upgraded to Pro! Enjoy unlimited invoices.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading subscription...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Unable to load subscription. Please refresh.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPro = subscription.planType === 'pro';
  const limits = PLAN_LIMITS[subscription.planType];
  const usagePercent = isPro ? 0 : (subscription.invoiceCountThisMonth / limits.maxInvoicesPerMonth) * 100;
  const remaining = getRemainingInvoices();

  return (
    <div className="space-y-6">
      {/* Usage Overview for Free Users */}
      {!isPro && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Monthly Usage
              </CardTitle>
              <Badge variant="secondary">
                {subscription.invoiceCountThisMonth} / {limits.maxInvoicesPerMonth} invoices
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={usagePercent} className="h-3" />
            {!canCreateInvoice() ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <X className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">
                  Monthly limit reached. Upgrade to Pro for unlimited invoices.
                </p>
              </div>
            ) : remaining <= 2 ? (
              <p className="text-sm text-amber-500">
                ⚠️ Only {remaining} invoice{remaining !== 1 ? 's' : ''} remaining this month
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have {remaining} invoices remaining this month
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Free Plan Card */}
        <Card className={`bg-card border-2 transition-all ${!isPro ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/50'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">Free</CardTitle>
              </div>
              {!isPro && (
                <Badge className="bg-primary text-primary-foreground">
                  Current Plan
                </Badge>
              )}
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <CardDescription className="mt-1">
                Perfect for getting started
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            {!isPro && (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            )}
            {isPro && (
              <Button variant="outline" className="w-full" disabled>
                Downgrade not available
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pro Plan Card */}
        <Card className={`bg-card border-2 transition-all ${isPro ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-border hover:border-primary/50'}`}>
          <div className={`h-1 bg-gradient-to-r from-amber-500 to-orange-500 ${isPro ? '' : 'opacity-50'}`} />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Pro</CardTitle>
              </div>
              {isPro && (
                <Badge className="bg-amber-500 text-white border-amber-500">
                  Current Plan
                </Badge>
              )}
            </div>
            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">$5</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <CardDescription className="mt-1">
                For professionals & freelancers
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5">
              {PRO_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>
            {!isPro && (
              <Button onClick={handleUpgrade} className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            )}
            {isPro && (
              <Button variant="outline" className="w-full border-amber-500/30 text-amber-500" disabled>
                <Crown className="w-4 h-4 mr-2" />
                You're a Pro!
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pro Benefits Banner for Free Users */}
      {!isPro && (
        <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">Unlock Your Full Potential</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Upgrade to Pro and enjoy unlimited invoices, custom exchange rates, shareable links, and a clean PDF without branding.
                </p>
              </div>
              <Button onClick={handleUpgrade} className="shrink-0 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <Crown className="w-4 h-4" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro User Success Card */}
      {isPro && (
        <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">You're a Pro Member!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enjoy unlimited access to all premium features. Thank you for your support!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
