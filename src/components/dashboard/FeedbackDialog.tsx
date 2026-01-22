import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFeedback } from '@/hooks/useFeedback';
import { toast } from 'sonner';
import { Loader2, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import type { FeedbackType } from '@/types/feedback';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackDialog = ({ open, onOpenChange }: FeedbackDialogProps) => {
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitFeedback } = useFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setIsSubmitting(true);
    const result = await submitFeedback(message, type);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Thank you for your feedback!');
      setMessage('');
      setType('general');
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to submit feedback');
    }
  };

  const getTypeIcon = (t: FeedbackType) => {
    switch (t) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Help us improve InvoicePak</DialogTitle>
          <DialogDescription>
            We value your feedback! Let us know about bugs, feature requests, or any other thoughts.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-type">Feedback Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
              <SelectTrigger id="feedback-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-destructive" />
                    Bug Report
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Feature Request
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    General Feedback
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your Message</Label>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/1000
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !message.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
