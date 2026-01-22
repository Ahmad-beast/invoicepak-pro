import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import { cn } from '@/lib/utils';

const DISMISSED_KEY = 'announcement_dismissed';

export const AnnouncementBanner = () => {
  const { announcement, loading } = useAnnouncement();
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user has dismissed this specific announcement
  useEffect(() => {
    if (announcement?.message) {
      const dismissedMessage = localStorage.getItem(DISMISSED_KEY);
      if (dismissedMessage === announcement.message) {
        setDismissed(true);
      } else {
        setDismissed(false);
        // Trigger entrance animation after a brief delay
        setTimeout(() => setIsVisible(true), 50);
      }
    }
  }, [announcement?.message]);

  const handleDismiss = () => {
    if (announcement?.message) {
      localStorage.setItem(DISMISSED_KEY, announcement.message);
    }
    setIsVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  // Don't show if loading, not active, dismissed, or no message
  if (loading || !announcement?.isActive || dismissed || !announcement?.message) {
    return null;
  }

  const typeStyles = {
    info: 'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    promo: 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/40 text-primary',
  };

  const typeIcons = {
    info: Info,
    warning: AlertTriangle,
    promo: Sparkles,
  };

  const Icon = typeIcons[announcement.type] || Info;

  return (
    <div
      className={cn(
        'relative w-full py-2.5 px-4 border-b flex items-center justify-center gap-3 text-sm transition-all duration-300 ease-out',
        typeStyles[announcement.type],
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{announcement.message}</span>
      
      {announcement.actionLink && announcement.actionText && (
        <Link to={announcement.actionLink}>
          <Button
            size="sm"
            variant={announcement.type === 'promo' ? 'default' : 'outline'}
            className="h-7 px-3 text-xs"
          >
            {announcement.actionText}
          </Button>
        </Link>
      )}

      <button
        onClick={handleDismiss}
        className="absolute right-3 p-1 rounded-md hover:bg-foreground/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
