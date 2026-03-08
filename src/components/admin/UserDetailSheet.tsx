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
  AlertTriangle
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import type { AdminUser } from '@/types/admin';

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
  { value: '7', label: '7 Days' },
  { value: '14', label: '14 Days' },
  { value: '30', label: '1 Month' },
  { value: '90', label: '3 Months' },
  { value: '180', label: '6 Months' },
  { value: '365', label: '1 Year' },
  { value: '36500', label: 'Lifetime' },
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-border">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-foreground">User Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* User Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className={`h-16 w-16 ${user.isBanned ? 'opacity-50' : ''}`}>
              <AvatarFallback className={`text-lg font-bold ${isPro ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {getInitials(user.displayName, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-lg font-semibold text-foreground truncate ${user.isBanned ? 'line-through opacity-60' : ''}`}>
                  {getDisplayName(user.displayName, user.email)}
                </h3>
                {user.isBanned && (
                  <Badge variant="destructive" className="text-xs">Banned</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant={isPro ? 'default' : 'secondary'}
                  className={isPro ? 'bg-primary/20 text-primary border-primary/30' : ''}
                >
                  {isPro && <Crown className="w-3 h-3 mr-1" />}
                  {isPro ? 'Pro' : 'Free'}
                </Badge>
                {user.role === 'admin' && (
                  <Badge variant="outline" className="text-destructive border-destructive/30">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/50 bg-muted/10">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Joined</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {format(user.createdAt, 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/10">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Invoices</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {user.invoiceCount ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Total created</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/10">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Status</span>
                </div>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {user.subscriptionStatus || 'Inactive'}
                </p>
                <div className={`w-2 h-2 rounded-full mt-1 ${user.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/10">
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Pro Expires</span>
                </div>
                {user.proExpiresAt ? (
                  <>
                    <p className={`text-sm font-semibold ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                      {format(user.proExpiresAt, 'MMM d, yyyy')}
                    </p>
                    <p className={`text-xs mt-0.5 ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {isExpired ? 'Expired' : formatDistanceToNow(user.proExpiresAt, { addSuffix: true })}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">N/A</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-border" />

          {/* Pro Access Management */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              Pro Access
            </h4>
            
            {isPro ? (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Currently on Pro plan</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                  </div>
                  {user.proExpiresAt && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {format(user.proExpiresAt, 'MMMM d, yyyy')}
                    </p>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleRevokePro}
                    disabled={actionLoading === 'revoke'}
                  >
                    Revoke Pro Access
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Grant Pro access for a specific duration:
                  </p>
                  <Select value={proDuration} onValueChange={setProDuration}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRO_DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                    onClick={handleGrantPro}
                    disabled={actionLoading === 'grant'}
                  >
                    <Crown className="w-4 h-4" />
                    Grant Pro Access
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator className="bg-border" />

          {/* Danger Zone */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h4>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 ${
                  user.isBanned 
                    ? 'border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-500' 
                    : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500'
                }`}
                onClick={handleToggleBan}
                disabled={actionLoading === 'ban'}
              >
                {user.isBanned ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Unban User
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    Ban User
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(user.id, user.email)}
              >
                <Trash2 className="w-4 h-4" />
                Delete User Permanently
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
