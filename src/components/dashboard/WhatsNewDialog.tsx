import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Pencil, FileText, Eye, EyeOff, Bug, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const CHANGELOG = [
  {
    version: '1.5.0',
    date: 'March 9, 2026',
    items: [
      {
        type: 'new' as const,
        icon: Pencil,
        title: 'Edit Invoices',
        description: 'You can now edit existing invoices directly from the dashboard. All fields are pre-filled for quick updates.',
      },
      {
        type: 'new' as const,
        icon: EyeOff,
        title: 'Toggle Exchange Rate on PDF',
        description: 'Choose whether to show or hide the exchange rate and currency conversion on your invoice PDF.',
      },
      {
        type: 'fix' as const,
        icon: Bug,
        title: 'PKR Currency Fix',
        description: 'Fixed an issue where PKR invoices incorrectly showed USD totals in the PDF. Now displays the correct converted amount.',
      },
      {
        type: 'fix' as const,
        icon: Bug,
        title: 'PDF Currency Labels',
        description: 'Exchange rate labels now correctly reflect the actual currency pair (e.g., "1 GBP = 352 PKR") instead of always showing USD.',
      },
      {
        type: 'improved' as const,
        icon: Zap,
        title: 'Enhanced Dashboard',
        description: 'Redesigned dashboard with better stats cards, cleaner invoice list, hover actions, and improved loading states.',
      },
      {
        type: 'improved' as const,
        icon: FileText,
        title: 'Smarter Invoice List',
        description: 'Invoice list now shows relative timestamps, status indicators, and quick actions like download PDF and copy share link.',
      },
    ],
  },
];

const typeBadge = {
  new: { label: 'New', className: 'bg-primary/10 text-primary border-primary/20' },
  fix: { label: 'Fix', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  improved: { label: 'Improved', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
};

export const WhatsNewDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">What's New</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            What's New
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {CHANGELOG.map((release) => (
              <div key={release.version}>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs font-mono">
                    v{release.version}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{release.date}</span>
                </div>
                <div className="space-y-3">
                  {release.items.map((item, idx) => {
                    const badge = typeBadge[item.type];
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">{item.title}</span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${badge.className}`}>
                              {badge.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
