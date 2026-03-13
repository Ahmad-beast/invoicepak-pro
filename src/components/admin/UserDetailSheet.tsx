import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Crown, 
  Ban, 
  UserCheck, 
  Trash2, 
  Mail, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Clock,
  Timer,
  AlertTriangle,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { toast } from 'sonner';
import type { AdminUser } from '@/types/admin';
import { GiftProSection } from './GiftProSection';

interface UserDetailSheetProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGrantPro: (userId: string, days: number) => Promise<{ success: boolean; error?: string }>;
  onRevokePro: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onToggleBan: (userId: string, currentStatus: boolean) => Promise<{ success: boolean; error?: string }>;
  onDelete: (userId: string, email: string) => void;
}

const PRO_DURATION_OPTIONS = [
  { value: '7', label: '7 Days', emoji: '⚡' },
  { value: '14', label: '14 Days', emoji: '🔥' },
  { value: '30', label: '1 Month', emoji: '⭐' },
  { value: '90', label: '3 Months', emoji: '💎' },
  { value: '180', label: '6 Months', emoji: '🏆' },
  { value: '365', label: '1 Year', emoji: '👑' },
  { value: '36500', label: 'Lifetime', emoji: '♾️' },
];

const getInitials = (displayName: string | null, email: string): string => {
  const name = displayName || email.split('@')[0] || 'U';
  return name.substring(0, 2).toUpperCase();
};

const getDisplayName = (displayName: string | null, email: string): string => {
  if (displayName) return displayName;
  return email.split('@')[0] || 'Unknown';
};

export const UserDetailSheet = ({
  user,
  open,
  onOpenChange,
  onGrantPro,
  onRevokePro,
  onToggleBan,
  onDelete,
}: UserDetailSheetProps) => {
  const [proDuration, setProDuration] = useState('30');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const isExpired = user.proExpiresAt && isPast(user.proExpiresAt);
  const isPro = user.plan === 'pro' && !isExpired;

  const handleGrantPro = async () => {
    setActionLoading('grant');
    await onGrantPro(user.id, parseInt(proDuration));
    setActionLoading(null);
  };

  const handleRevokePro = async () => {
    setActionLoading('revoke');
    await onRevokePro(user.id);
    setActionLoading(null);
  };

  const handleToggleBan = async () => {
    setActionLoading('ban');
    await onToggleBan(user.id, user.isBanned || false);
    setActionLoading(null);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    toast.success('Email copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] overflow-y-auto border-border/50 p-0">
        {/* Profile Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-b from-primary/5 to-transparent">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xs uppercase tracking-wider text-muted-foreground font-medium">User Profile</SheetTitle>
          </SheetHeader>

          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className={`h-16 w-16 ring-2 ${isPro ? 'ring-primary/30' : user.isBanned ? 'ring-destructive/30' : 'ring-border/50'} ${user.isBanned ? 'opacity-50' : ''}`}>
                <AvatarFallback className={`text-lg font-bold ${isPro ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                  {getInitials(user.displayName, user.email)}
                </AvatarFallback>
              </Avatar>
              {isPro && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                  <Crown className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {user.isBanned && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center ring-2 ring-card">
                  <Ban className="w-3 h-3 text-destructive-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-lg font-bold text-foreground truncate ${user.isBanned ? 'line-through opacity-50' : ''}`}>
                {getDisplayName(user.displayName, user.email)}
              </h3>
              <button
                onClick={handleCopyEmail}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 mt-0.5 group"
              >
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.email}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Badge
                  variant={isPro ? 'default' : 'secondary'}
                  className={`text-[10px] px-2 py-0.5 ${isPro ? 'bg-primary/15 text-primary border-primary/30' : ''}`}
                >
                  {isPro && <Crown className="w-2.5 h-2.5 mr-1" />}
                  {isPro ? 'PRO' : 'FREE'}
                </Badge>
                {user.isBanned && (
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5">Banned</Badge>
                )}
                {user.role === 'admin' && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-primary border-primary/30">
                    <ShieldAlert className="w-2.5 h-2.5 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoTile icon={Calendar} label="Joined" value={format(user.createdAt, 'MMM d, yyyy')} sub={formatDistanceToNow(user.createdAt, { addSuffix: true })} />
            <InfoTile icon={FileText} label="Invoices" value={String(user.invoiceCount ?? 0)} sub="Total created" />
            <InfoTile 
              icon={Clock} 
              label="Status" 
              value={user.isBanned ? 'Banned' : (user.subscriptionStatus || 'Inactive')} 
              sub={user.isBanned ? 'Account suspended' : 'Subscription'}
              danger={user.isBanned}
            />
            <InfoTile 
              icon={Timer} 
              label="Pro Expires" 
              value={user.proExpiresAt ? format(user.proExpiresAt, 'MMM d, yy') : 'N/A'} 
              sub={user.proExpiresAt ? (isExpired ? 'Expired' : formatDistanceToNow(user.proExpiresAt, { addSuffix: true })) : 'No expiry set'}
              danger={!!isExpired}
              accent={!!user.proExpiresAt && !isExpired}
            />
          </div>

          <Separator className="bg-border/50" />

          {/* Pro Access Management */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Pro Access
            </h4>
            
            {isPro ? (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground font-medium">Active Pro Plan</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Active</Badge>
                  </div>
                  {user.proExpiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Expires {format(user.proExpiresAt, 'MMMM d, yyyy')}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full h-8 text-xs"
                    onClick={handleRevokePro}
                    disabled={actionLoading === 'revoke'}
                  >
                    {actionLoading === 'revoke' ? 'Revoking...' : 'Revoke Pro Access'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-3.5 space-y-3">
                  <Select value={proDuration} onValueChange={setProDuration}>
                    <SelectTrigger className="bg-background h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRO_DURATION_OPTIONS.map((opt) => (
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
                    className="w-full h-9 text-xs gap-2 font-semibold"
                    onClick={handleGrantPro}
                    disabled={actionLoading === 'grant'}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    {actionLoading === 'grant' ? 'Granting...' : 'Grant Pro Access'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Danger Zone */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-destructive flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Danger Zone
            </h4>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className={`w-full justify-start gap-2 h-9 text-xs ${
                  user.isBanned 
                    ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500' 
                    : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500'
                }`}
                onClick={handleToggleBan}
                disabled={actionLoading === 'ban'}
              >
                {user.isBanned ? (
                  <><UserCheck className="w-3.5 h-3.5" /> {actionLoading === 'ban' ? 'Unbanning...' : 'Unban User'}</>
                ) : (
                  <><Ban className="w-3.5 h-3.5" /> {actionLoading === 'ban' ? 'Banning...' : 'Ban User'}</>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 h-9 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(user.id, user.email)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete User Permanently
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/* ===== Info Tile Component ===== */
interface InfoTileProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  danger?: boolean;
  accent?: boolean;
}

const InfoTile = ({ icon: Icon, label, value, sub, danger, accent }: InfoTileProps) => (
  <div className="rounded-lg border border-border/40 bg-muted/10 p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className={`w-3 h-3 ${danger ? 'text-destructive' : accent ? 'text-primary' : 'text-muted-foreground'}`} />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
    </div>
    <p className={`text-sm font-semibold truncate ${danger ? 'text-destructive' : accent ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    <p className={`text-[10px] mt-0.5 truncate ${danger ? 'text-destructive/70' : 'text-muted-foreground'}`}>{sub}</p>
  </div>
);
