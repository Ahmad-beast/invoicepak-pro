import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const PRO_FEATURES = [
  'Unlimited invoices',
  'Custom exchange rate',
  'Invoice sharing links',
  'No branding on PDF',
  'Priority support',
  'All future updates',
];

export const SubscriptionCard = () => {
  const handleUpgrade = () => {
    toast.info('Payment integration coming soon!');
    // Placeholder - would redirect to payment page
  };

  return (
    <div className="space-y-6">
      {/* Pro Plan Card */}
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
            onClick={handleUpgrade} 
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 h-12 text-base font-medium"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime • Secure payment
          </p>
        </CardContent>
      </Card>

      {/* Benefits Banner */}
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
    </div>
  );
};
