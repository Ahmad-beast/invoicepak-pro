import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAnnouncement } from '@/hooks/useAnnouncement';
import type { Announcement } from '@/types/announcement';

export const AnnouncementManager = () => {
  const { announcement, loading, updateAnnouncement, clearAnnouncement } = useAnnouncement();
  const [formData, setFormData] = useState<Announcement>({
    message: '',
    isActive: false,
    type: 'info',
    actionLink: '',
    actionText: '',
  });
  const [saving, setSaving] = useState(false);

  // Sync form data with fetched announcement
  useEffect(() => {
    if (announcement) {
      setFormData({
        message: announcement.message || '',
        isActive: announcement.isActive || false,
        type: announcement.type || 'info',
        actionLink: announcement.actionLink || '',
        actionText: announcement.actionText || '',
      });
    }
  }, [announcement]);

  const handleSave = async () => {
    if (!formData.message.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }

    setSaving(true);
    const result = await updateAnnouncement(formData);
    setSaving(false);

    if (result.success) {
      toast.success('Announcement saved successfully');
    } else {
      toast.error(result.error || 'Failed to save announcement');
    }
  };

  const handleClear = async () => {
    const confirmed = window.confirm('Are you sure you want to clear the announcement?');
    if (!confirmed) return;

    setSaving(true);
    const result = await clearAnnouncement();
    setSaving(false);

    if (result.success) {
      toast.success('Announcement cleared');
      setFormData({
        message: '',
        isActive: false,
        type: 'info',
        actionLink: '',
        actionText: '',
      });
    } else {
      toast.error(result.error || 'Failed to clear announcement');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Global Announcement
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
          Global Announcement
        </CardTitle>
        <CardDescription>
          Display a site-wide banner message to all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="is-active" className="flex flex-col gap-1">
            <span>Active</span>
            <span className="text-xs text-muted-foreground font-normal">
              Toggle to show/hide the announcement
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

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter your announcement message..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'info' | 'warning' | 'promo') =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info (Blue)</SelectItem>
              <SelectItem value="warning">Warning (Amber)</SelectItem>
              <SelectItem value="promo">Promo (Gradient)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Link & Text */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="actionLink">Action Link (optional)</Label>
            <Input
              id="actionLink"
              placeholder="/subscription"
              value={formData.actionLink}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actionLink: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actionText">Button Text (optional)</Label>
            <Input
              id="actionText"
              placeholder="Upgrade Now"
              value={formData.actionText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actionText: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Announcement'}
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
