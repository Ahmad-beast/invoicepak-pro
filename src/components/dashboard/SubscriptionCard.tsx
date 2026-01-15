import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { PLAN_LIMITS } from '@/types/subscription';

const PRO_FEATURES = [
  'Unlimited invoices',
  'Custom exchange rate',
  'Invoice sharing links',
  'No branding on PDF',
  'Priority support',
  'All future updates',
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
      <div className="space-y-6">
        <Card className="bg-card border-2 border-muted">
          <CardHeader className="pb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-48 mt-4" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const remainingInvoices = getRemainingInvoices();
  const usedInvoices = subscription?.invoiceCountThisMonth || 0;
  const maxInvoices = PLAN_LIMITS.free.maxInvoicesPerMonth;
  const usagePercent = isPro ? 0 : (usedInvoices / maxInvoices) * 100;

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      {!isPro && subscription && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Usage</CardTitle>
              <Badge variant="outline" className="text-muted-foreground">
                Free Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoices this month</span>
                <span className="font-medium text-foreground">
                  {usedInvoices} / {maxInvoices}
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
            
            {remainingInvoices <= 2 && remainingInvoices > 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <AlertCircle className="w-4 h-4" />
                <span>Only {remainingInvoices} invoice{remainingInvoices > 1 ? 's' : ''} remaining</span>
              </div>
            )}
            
            {remainingInvoices === 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>Monthly limit reached. Upgrade to continue!</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pro Plan Card or Active Subscription */}
      {isPro ? (
        <Card className="bg-card border-2 border-amber-500/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">InvoicePK Pro</CardTitle>
                  <CardDescription>You're on the Pro plan</CardDescription>
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                Active
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRO_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription?.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Renews on {subscription.currentPeriodEnd.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            
            <Button 
              onClick={manageSubscription}
              variant="outline"
              className="w-full gap-2"
            >
              <Settings className="w-4 h-4" />
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-2 border-amber-500/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">InvoicePK Pro</CardTitle>
                  <CardDescription>Unlock all premium features</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                Recommended
              </Badge>
            </div>
            
            <div className="pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">₨999</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Perfect for freelancers & small businesses
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRO_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={upgradeToPro}
              className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 h-12 text-base font-medium"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Pro
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Cancel anytime • Secure payment via Lemon Squeezy
            </p>
          </CardContent>
        </Card>
      )}

      {/* Benefits Banner */}
      {!isPro && (
        <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Why Upgrade?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create unlimited professional invoices, share with clients, and remove InvoicePK branding from your PDFs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
