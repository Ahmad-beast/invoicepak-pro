import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PLAN_LIMITS } from '@/types/subscription';
import { Crown, Zap, Check, Loader2, Sparkles, Link2, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const SubscriptionCard = () => {
  const { 
    subscription, 
    loading, 
    canCreateInvoice, 
    getRemainingInvoices, 
    upgradeToPro 
  } = useSubscription();

  const handleUpgrade = async () => {
    // In a real app, this would open a payment modal/redirect to Stripe
    await upgradeToPro();
    toast.success('Upgraded to Pro! Enjoy unlimited invoices.');
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) return null;

  const isPro = subscription.planType === 'pro';
  const limits = PLAN_LIMITS[subscription.planType];
  const usagePercent = isPro ? 0 : (subscription.invoiceCountThisMonth / limits.maxInvoicesPerMonth) * 100;
  const remaining = getRemainingInvoices();

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className={`h-1 ${isPro ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-muted'}`} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPro ? (
                <Crown className="w-5 h-5 text-amber-500" />
              ) : (
                <Zap className="w-5 h-5 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">{isPro ? 'Pro Plan' : 'Free Plan'}</CardTitle>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'} className={isPro ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : ''}>
              {isPro ? 'Active' : 'Current'}
            </Badge>
          </div>
          <CardDescription>
            {isPro 
              ? 'You have unlimited access to all features'
              : 'Basic invoice creation with limited features'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          {!isPro && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Usage</span>
                <span className="font-medium text-foreground">
                  {subscription.invoiceCountThisMonth} / {limits.maxInvoicesPerMonth} invoices
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
              {!canCreateInvoice() && (
                <p className="text-xs text-destructive">
                  You've reached your monthly limit. Upgrade to Pro for unlimited invoices.
                </p>
              )}
              {canCreateInvoice() && remaining <= 2 && (
                <p className="text-xs text-amber-500">
                  {remaining} invoice{remaining !== 1 ? 's' : ''} remaining this month
                </p>
              )}
            </div>
          )}

          {/* Plan Features */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span>{isPro ? 'Unlimited' : '5/month'} invoices</span>
            </div>
            <div className={`flex items-center gap-2 ${limits.customExchangeRate ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Custom rates</span>
              {limits.customExchangeRate && <Check className="w-3 h-3 text-emerald-500" />}
            </div>
            <div className={`flex items-center gap-2 ${limits.invoiceSharing ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              <Link2 className="w-3.5 h-3.5" />
              <span>Share links</span>
              {limits.invoiceSharing && <Check className="w-3 h-3 text-emerald-500" />}
            </div>
            <div className={`flex items-center gap-2 ${limits.removeBranding ? 'text-foreground' : 'text-muted-foreground/50'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>No branding</span>
              {limits.removeBranding && <Check className="w-3 h-3 text-emerald-500" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA (only for free users) */}
      {!isPro && (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlimited invoices, custom rates, sharing & more
                </p>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-foreground">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button onClick={handleUpgrade} className="w-full gap-2">
                <Crown className="w-4 h-4" />
                Upgrade Now
              </Button>
              <p className="text-xs text-muted-foreground">
                Cancel anytime • 7-day money back guarantee
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro user card */}
      {isPro && (
        <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">You're a Pro!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enjoy unlimited access to all premium features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
