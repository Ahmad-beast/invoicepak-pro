import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, AlertTriangle, Zap, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBanner } from '@/hooks/useBanner';
import type { BannerType } from '@/types/banner';
import { cn } from '@/lib/utils';

const DISMISSED_KEY = 'global_banner_dismissed';

const bannerStyles: Record<BannerType, { bg: string; text: string; icon: React.ElementType; pulse: boolean }> = {
  promotion: {
    bg: 'bg-blue-600',
    text: 'text-white',
    icon: Sparkles,
    pulse: true,
  },
  warning: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-950',
    icon: AlertTriangle,
    pulse: false,
  },
  new: {
    bg: 'bg-emerald-600',
    text: 'text-white',
    icon: Zap,
    pulse: false,
  },
  urgent: {
    bg: 'bg-red-600',
    text: 'text-white',
    icon: AlertOctagon,
    pulse: true,
  },
};

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

  const bannerType = banner.type || 'promotion';
  const style = bannerStyles[bannerType];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'relative w-full py-2.5 px-4 flex items-center justify-center gap-3 text-sm',
        style.bg,
        style.text,
        style.pulse && 'animate-pulse'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
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
        className={cn(
          'absolute right-3 p-1 rounded-md transition-colors',
          bannerType === 'warning' ? 'hover:bg-yellow-950/10' : 'hover:bg-white/10'
        )}
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};