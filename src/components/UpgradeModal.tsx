import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Loader2, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const PRO_FEATURES = [
  'Unlimited invoices',
  'Custom exchange rates',
  'Invoice sharing links',
  'No branding on PDFs',
  'Priority support',
];

export const UpgradeModal = ({ open, onOpenChange, feature }: UpgradeModalProps) => {
  const { upgradeToPro } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await upgradeToPro();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
            <Crown className="w-7 h-7 text-amber-500" />
          </div>
          <DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            {feature ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-amber-500 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  {feature}
                </span>{' '}
                is a Pro feature. Upgrade to unlock it and more!
              </>
            ) : (
              'Unlock all premium features with a Pro subscription.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Price */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-foreground">₨999</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2.5">
            {PRO_FEATURES.map((feat, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-amber-500" />
                </div>
                <span className="text-foreground">{feat}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime • Secure payment via Lemon Squeezy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
