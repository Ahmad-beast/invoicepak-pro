import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanner } from '@/hooks/useBanner';

const DISMISSED_KEY = 'global_banner_dismissed';

export const GlobalBanner = () => {
  const { banner, loading } = useBanner();
  const [dismissed, setDismissed] = useState(false);

  // Check if user has dismissed this specific banner
  useEffect(() => {
    if (banner?.text) {
      const dismissedText = localStorage.getItem(DISMISSED_KEY);
      if (dismissedText === banner.text) {
        setDismissed(true);
      } else {
        setDismissed(false);
      }
    }
  }, [banner?.text]);

  const handleDismiss = () => {
    if (banner?.text) {
      localStorage.setItem(DISMISSED_KEY, banner.text);
    }
    setDismissed(true);
  };

  // Don't render while loading
  if (loading) return null;

  // Don't render if not active, dismissed, or no text
  if (!banner?.isActive || dismissed || !banner?.text) {
    return null;
  }

  return (
    <div className="relative w-full bg-primary text-primary-foreground py-2.5 px-4 flex items-center justify-center gap-3 text-sm">
      <span className="font-medium">{banner.text}</span>
      
      {banner.link && banner.ctaText && (
        <Link to={banner.link}>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-3 text-xs"
          >
            {banner.ctaText}
          </Button>
        </Link>
      )}

      <button
        onClick={handleDismiss}
        className="absolute right-3 p-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
