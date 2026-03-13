import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gift, Copy, Check, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface GiftProSectionProps {
  userId: string;
  userEmail: string;
}

const GIFT_DURATION_OPTIONS = [
  { value: '7days', label: '7 Days', emoji: '⚡', days: 7 },
  { value: '14days', label: '14 Days', emoji: '🔥', days: 14 },
  { value: '1month', label: '1 Month', emoji: '⭐', days: 30 },
  { value: '3months', label: '3 Months', emoji: '💎', days: 90 },
  { value: '6months', label: '6 Months', emoji: '🏆', days: 180 },
  { value: '1year', label: '1 Year', emoji: '👑', days: 365 },
  { value: 'lifetime', label: 'Lifetime', emoji: '♾️', days: 36500 },
];

export const GiftProSection = ({ userId, userEmail }: GiftProSectionProps) => {
  const [duration, setDuration] = useState('1month');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = crypto.randomUUID();
      const selected = GIFT_DURATION_OPTIONS.find((o) => o.value === duration)!;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + selected.days);

      await setDoc(doc(db, 'giftLinks', token), {
        token,
        targetEmail: userEmail,
        targetUid: userId,
        plan: 'pro',
        duration,
        expiresAt: Timestamp.fromDate(expiresAt),
        used: false,
        createdAt: Timestamp.now(),
        createdBy: auth.currentUser?.uid || '',
      });

      const link = `https://invoicepak-pro.vercel.app/activate?token=${token}`;
      setGeneratedLink(link);
      toast.success('Magic link generated!');
    } catch (err) {
      console.error('Error generating gift link:', err);
      toast.error('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Gift className="w-3.5 h-3.5 text-amber-500" />
        Gift Pro Access
      </h4>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-3.5 space-y-3">
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-background h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GIFT_DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full h-9 text-xs gap-2 font-semibold bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
            ) : (
              <><Link2 className="w-3.5 h-3.5" /> Generate Magic Link</>
            )}
          </Button>

          {generatedLink && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                One-Time Activation Link
              </p>
              <div className="flex gap-1.5">
                <Input
                  readOnly
                  value={generatedLink}
                  className="text-xs h-8 bg-background font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                This link can only be used once and expires based on the selected duration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
