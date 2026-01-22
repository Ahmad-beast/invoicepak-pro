import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Save, Trash2, Sparkles, AlertTriangle, Zap, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { useBanner } from '@/hooks/useBanner';
import type { Banner, BannerType } from '@/types/banner';
import { BANNER_TYPE_OPTIONS } from '@/types/banner';
import { cn } from '@/lib/utils';

const bannerPreviewStyles: Record<BannerType, { bg: string; text: string; icon: React.ElementType; pulse: boolean }> = {
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

export const BannerManager = () => {
  const { banner, loading, updateBanner, clearBanner } = useBanner();
  const [formData, setFormData] = useState<Banner>({
    text: '',
    isActive: false,
    link: '',
    ctaText: '',
    type: 'promotion',
  });
  const [saving, setSaving] = useState(false);

  // Sync form data with fetched banner
  useEffect(() => {
    if (banner) {
      setFormData({
        text: banner.text || '',
        isActive: banner.isActive || false,
        link: banner.link || '',
        ctaText: banner.ctaText || '',
        type: banner.type || 'promotion',
      });
    }
  }, [banner]);

  const handleSave = async () => {
    if (!formData.text.trim()) {
      toast.error('Please enter a banner message');
      return;
    }

    setSaving(true);
    const result = await updateBanner(formData);
    setSaving(false);

    if (result.success) {
      toast.success('Banner saved successfully');
    } else {
      toast.error(result.error || 'Failed to save banner');
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm('Are you sure you want to clear the banner?');
    if (!confirmed) return;

    setSaving(true);
    const result = await clearBanner();
    setSaving(false);

    if (result.success) {
      toast.success('Banner cleared');
      setFormData({
        text: '',
        isActive: false,
        link: '',
        ctaText: '',
        type: 'promotion',
      });
    } else {
      toast.error(result.error || 'Failed to clear banner');
    }
  };

  const previewStyle = bannerPreviewStyles[formData.type];
  const PreviewIcon = previewStyle.icon;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Global Banner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Global Banner
        </CardTitle>
        <CardDescription>
          Display a site-wide banner message to all users on the landing page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live Preview */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Live Preview</Label>
          <div
            className={cn(
              'w-full py-2.5 px-4 rounded-md flex items-center justify-center gap-3 text-sm',
              previewStyle.bg,
              previewStyle.text,
              previewStyle.pulse && 'animate-pulse'
            )}
          >
            <PreviewIcon className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              {formData.text || 'Your banner message will appear here...'}
            </span>
            {formData.ctaText && (
              <Button size="sm" variant="secondary" className="h-7 px-3 text-xs pointer-events-none">
                {formData.ctaText}
              </Button>
            )}
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="is-active" className="flex flex-col gap-1">
            <span>Active</span>
            <span className="text-xs text-muted-foreground font-normal">
              Toggle to show/hide the banner
            </span>
          </Label>
          <Switch
            id="is-active"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isActive: checked }))
            }
          />
        </div>

        {/* Banner Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Banner Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: BannerType) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select banner type" />
            </SelectTrigger>
            <SelectContent>
              {BANNER_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <Label htmlFor="text">Banner Text</Label>
          <Input
            id="text"
            placeholder="Enter your banner message..."
            value={formData.text}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, text: e.target.value }))
            }
          />
        </div>

        {/* Link & CTA Text */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="link">Action Link (optional)</Label>
            <Input
              id="link"
              placeholder="/subscription"
              value={formData.link}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, link: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaText">Button Text (optional)</Label>
            <Input
              id="ctaText"
              placeholder="Upgrade Now"
              value={formData.ctaText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ctaText: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Banner'}
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={saving}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};