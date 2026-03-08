import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useFeedback } from '@/hooks/useFeedback';
import { useReferrals } from '@/hooks/useReferrals';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BannerManager } from '@/components/admin/BannerManager';
import { UserDetailSheet } from '@/components/admin/UserDetailSheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Crown, 
  RefreshCw, 
  ShieldAlert, 
  Users, 
  Search,
  MessageSquare,
  Bug,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Eye,
  Zap,
  Activity,
  Mail,
  FileText,
  ChevronRight,
  Megaphone,
  Ban,
  UserCheck,
  Clock,
  Globe,
  ExternalLink,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import type { AdminUser } from '@/types/admin';

const getDisplayName = (displayName: string | null, email: string): string => {
  if (displayName) return displayName;
  return email.split('@')[0] || 'Unknown';
};

const getInitials = (displayName: string | null, email: string): string => {
  const name = displayName || email.split('@')[0] || 'U';
  return name.substring(0, 2).toUpperCase();
};

type PlanFilter = 'all' | 'pro' | 'free' | 'banned';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isRoleLoading: roleLoading } = useAuth();
  const { users, loading: usersLoading, refetch, grantProAccess, revokeProAccess, toggleBanStatus, deleteUser } = useAdminUsers();
  const { feedbacks, loading: feedbacksLoading, refetch: refetchFeedbacks, markAsRead } = useFeedback();
  const { sourceStats, totalVisits, todayCount: todayReferralsCount, weekCount: weekReferrals, dailyCounts, deviceBreakdown, browserBreakdown, hourlyToday, recentVisits, loading: referralsLoading } = useReferrals();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, roleLoading, navigate]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === '' ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.displayName?.toLowerCase().includes(searchLower));
      
      if (planFilter === 'banned') return matchesSearch && user.isBanned;
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [users, searchQuery, planFilter]);

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find(u => u.id === selectedUser.id);
      if (updated) setSelectedUser(updated);
    }
  }, [users]);

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const handleGrantPro = async (userId: string, days: number) => {
    const result = await grantProAccess(userId, days);
    if (result.success) toast.success(`Pro access granted for ${days} days`);
    else toast.error(result.error || 'Failed to grant pro access');
    return result;
  };

  const handleRevokePro = async (userId: string) => {
    const result = await revokeProAccess(userId);
    if (result.success) toast.success('Pro access revoked');
    else toast.error(result.error || 'Failed to revoke pro access');
    return result;
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    const result = await toggleBanStatus(userId, currentStatus);
    if (result.success) toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
    else toast.error(result.error || 'Failed to update user');
    return result;
  };

  const handleDeleteUser = (userId: string, email: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${email}? This action cannot be undone.`);
    if (!confirmed) return;
    deleteUser(userId).then((result) => {
      if (result.success) {
        toast.success('User deleted successfully');
        setSheetOpen(false);
        setSelectedUser(null);
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    });
  };

  const handleMarkAsRead = async (feedbackId: string) => {
    const result = await markAsRead(feedbackId);
    if (result.success) toast.success('Feedback marked as read');
    else toast.error(result.error || 'Failed to update feedback');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-3.5 h-3.5" />;
      case 'feature': return <Lightbulb className="w-3.5 h-3.5" />;
      default: return <MessageCircle className="w-3.5 h-3.5" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'bug': return 'destructive';
      case 'feature': return 'default';
      default: return 'secondary';
    }
  };

  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) return null;

  const proUsersCount = users.filter((u) => u.plan === 'pro').length;
  const freeUsersCount = users.filter((u) => u.plan === 'free').length;
  const newFeedbackCount = feedbacks.filter((f) => f.status === 'new').length;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;
  const totalInvoices = users.reduce((sum, u) => sum + (u.invoiceCount || 0), 0);
  const conversionRate = users.length > 0 ? Math.round((proUsersCount / users.length) * 100) : 0;

  const recentUsers = users.filter(u => {
    const diff = Date.now() - u.createdAt.getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });

  const todayReferrals = todayReferralsCount;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 glow-primary">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Platform overview & management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1.5 border-primary/30 text-primary bg-primary/5">
              <Activity className="w-3 h-3 mr-1.5" />
              Live
            </Badge>
            <Button variant="outline" size="sm" onClick={() => { refetch(); refetchFeedbacks(); }} className="gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsCard label="Total Users" value={users.length} icon={Users} loading={usersLoading} accent={false} />
          <StatsCard label="Pro Users" value={proUsersCount} icon={Crown} loading={usersLoading} accent={true} subtitle={`${conversionRate}% rate`} />
          <StatsCard label="Free Users" value={freeUsersCount} icon={UserCheck} loading={usersLoading} accent={false} />
          <StatsCard label="Banned" value={bannedUsersCount} icon={Ban} loading={usersLoading} accent={false} danger={bannedUsersCount > 0} />
          <StatsCard label="Invoices" value={totalInvoices} icon={FileText} loading={usersLoading} accent={false} />
          <StatsCard label="Traffic" value={totalVisits} icon={Globe} loading={referralsLoading} accent={false} warning={todayReferrals > 0} subtitle={`${todayReferrals} today`} />
        </div>

        {/* Conversion Progress */}
        {!usersLoading && users.length > 0 && (
          <Card className="border-border/50 bg-gradient-to-r from-card to-muted/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Pro Conversion Rate</span>
                </div>
                <span className="text-sm font-bold text-primary">{conversionRate}%</span>
              </div>
              <Progress value={conversionRate} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">{proUsersCount} Pro / {users.length} Total</span>
                <span className="text-xs text-muted-foreground">{recentUsers.length} new this week</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="h-11 p-1 bg-muted/30 border border-border/50 w-full sm:w-auto grid grid-cols-4 sm:flex">
            <TabsTrigger value="users" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
              <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px] bg-muted hidden sm:inline-flex">
                {users.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="traffic" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-5">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Traffic</span>
              {totalVisits > 0 && (
                <Badge variant="secondary" className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px] bg-muted hidden sm:inline-flex">
                  {totalVisits}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-5">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
              {newFeedbackCount > 0 && (
                <Badge variant="destructive" className="ml-0.5 h-5 min-w-5 px-1.5 text-[10px]">
                  {newFeedbackCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="banner" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm px-2 sm:px-5">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Banner</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== USERS TAB ===== */}
          <TabsContent value="users" className="space-y-4 mt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border/50"
                />
              </div>
              <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
                <SelectTrigger className="w-full sm:w-[140px] bg-card border-border/50">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="pro">
                    <span className="flex items-center gap-2"><Crown className="w-3 h-3 text-primary" /> Pro Only</span>
                  </SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="banned">
                    <span className="flex items-center gap-2"><Ban className="w-3 h-3 text-destructive" /> Banned</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-border/50">
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Plan</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Invoices</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="border-border/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-4 w-28" />
                              <Skeleton className="h-3 w-36" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 opacity-40" />
                          </div>
                          <p className="font-medium text-sm">{searchQuery || planFilter !== 'all' ? 'No matching users' : 'No users found'}</p>
                          <p className="text-xs mt-0.5">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className={`cursor-pointer transition-all duration-150 hover:bg-primary/5 border-border/30 ${user.isBanned ? 'bg-destructive/5 hover:bg-destructive/10' : ''}`}
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className={`h-9 w-9 ${user.isBanned ? 'opacity-40' : ''}`}>
                                <AvatarFallback className={`text-xs font-semibold ${user.plan === 'pro' ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                                  {getInitials(user.displayName, user.email)}
                                </AvatarFallback>
                              </Avatar>
                              {user.plan === 'pro' && !user.isBanned && (
                                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                                  <Crown className="w-2 h-2 text-primary-foreground" />
                                </div>
                              )}
                              {user.isBanned && (
                                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-destructive flex items-center justify-center ring-2 ring-card">
                                  <Ban className="w-2 h-2 text-destructive-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-medium text-sm text-foreground truncate ${user.isBanned ? 'line-through opacity-50' : ''}`}>
                                {getDisplayName(user.displayName, user.email)}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.plan === 'pro' ? 'default' : 'secondary'}
                            className={`text-[10px] px-2 py-0.5 ${user.plan === 'pro' ? 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/20' : 'bg-muted/30'}`}
                          >
                            {user.plan === 'pro' ? 'PRO' : 'FREE'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground font-mono">{user.invoiceCount ?? 0}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              user.isBanned ? 'bg-destructive' :
                              user.subscriptionStatus === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                            }`} />
                            <span className="text-xs text-muted-foreground capitalize">
                              {user.isBanned ? 'Banned' : user.subscriptionStatus || 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{format(user.createdAt, 'MMM d, yyyy')}</span>
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {!usersLoading && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
                {filteredUsers.length > 0 && (
                  <p className="text-xs text-muted-foreground">Click any row for details</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* ===== TRAFFIC / REFERRALS TAB ===== */}
          <TabsContent value="traffic" className="space-y-4 mt-0">
            {/* Header with live indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    Referral Traffic
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-normal text-emerald-500 uppercase tracking-wider">Real-time</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Auto-updates when new visits arrive via <code className="bg-muted/30 px-1.5 py-0.5 rounded text-[10px]">?ref=source</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4 text-center">
                  <Globe className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-primary">{referralsLoading ? '—' : totalVisits}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Visits</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{referralsLoading ? '—' : todayReferrals}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Today</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{referralsLoading ? '—' : weekReferrals}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">This Week</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <ExternalLink className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{referralsLoading ? '—' : sourceStats.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Sources</p>
                </CardContent>
              </Card>
            </div>

            {/* 14-Day Sparkline Chart */}
            {!referralsLoading && dailyCounts.length > 0 && (
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Last 14 Days
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Peak: {Math.max(...dailyCounts.map(d => d.count))} visits
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-20">
                    {dailyCounts.map((day) => {
                      const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
                      const height = Math.max((day.count / maxCount) * 100, 4);
                      const isToday = day.date === today;
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                            <div className="bg-popover border border-border rounded-md px-2 py-1 shadow-lg">
                              <p className="text-[10px] text-foreground font-semibold whitespace-nowrap">{day.count} visits</p>
                              <p className="text-[9px] text-muted-foreground">{day.date.slice(5)}</p>
                            </div>
                          </div>
                          <div
                            className={`w-full rounded-sm transition-all duration-300 ${
                              isToday ? 'bg-primary glow-primary' : day.count > 0 ? 'bg-primary/40 hover:bg-primary/60' : 'bg-muted/20'
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-muted-foreground">{dailyCounts[0]?.date.slice(5)}</span>
                    <span className="text-[9px] text-muted-foreground font-medium">Today</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Two Column: Sources + Recent Activity */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Sources Ranking */}
              {referralsLoading ? (
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-2 w-full" />
                        </div>
                        <Skeleton className="h-6 w-10" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : sourceStats.length === 0 ? (
                <Card className="border-border/50 border-dashed">
                  <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                      <Globe className="w-6 h-6 opacity-30" />
                    </div>
                    <p className="font-medium text-sm">No sources yet</p>
                    <p className="text-xs mt-1 text-center">Share a ref link to start tracking</p>
                    <div className="mt-3 p-2.5 rounded-lg bg-muted/10 border border-border/50">
                      <p className="text-[10px] text-muted-foreground font-mono break-all">
                        invoicepak-pro.vercel.app/?ref=trustmrr
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Top Sources
                    </h4>
                    <div className="space-y-3">
                      {sourceStats.map((source, index) => {
                        const percentage = totalVisits > 0 ? Math.round((source.count / totalVisits) * 100) : 0;
                        return (
                          <div key={source.source} className="group">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                  index === 0 ? 'bg-primary/15 text-primary' : index === 1 ? 'bg-primary/10 text-primary/70' : 'bg-muted/30 text-muted-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="text-sm font-medium text-foreground">{source.source}</span>
                                {source.todayCount > 0 && (
                                  <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 bg-primary/15 text-primary border-primary/30">
                                    +{source.todayCount} today
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm font-bold text-foreground">{source.count}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-8">
                              <div className="flex-1 h-1.5 rounded-full bg-muted/20">
                                <div 
                                  className="h-full rounded-full bg-primary/50 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground w-8 text-right">{percentage}%</span>
                            </div>
                            <div className="flex items-center gap-3 ml-8 mt-1">
                              <span className="text-[10px] text-muted-foreground">{source.weekCount} this week</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {formatDistanceToNow(source.lastVisit, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity Live Feed */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Live Feed
                    <span className="relative flex h-2 w-2 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h4>
                  {recentVisits.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <p className="text-xs">Waiting for visits...</p>
                    </div>
                  ) : (
                    <div className="space-y-0 max-h-[320px] overflow-y-auto pr-1">
                      {recentVisits.map((visit, i) => (
                        <div key={visit.id} className={`flex items-start gap-3 py-2.5 ${i > 0 ? 'border-t border-border/20' : ''}`}>
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Globe className="w-3 h-3 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                                {visit.source}
                              </Badge>
                              {visit.device && visit.device !== 'unknown' && (
                                <span className="text-[9px] text-muted-foreground capitalize">
                                  {visit.device === 'mobile' ? '📱' : visit.device === 'tablet' ? '📱' : '💻'} {visit.device}
                                </span>
                              )}
                              {visit.browser && visit.browser !== 'unknown' && (
                                <span className="text-[9px] text-muted-foreground">{visit.browser}</span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDistanceToNow(visit.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Device & Browser Breakdown */}
            {!referralsLoading && totalVisits > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Device Breakdown */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      📱 Devices
                    </h4>
                    <div className="space-y-2.5">
                      {deviceBreakdown.map((d) => (
                        <div key={d.device} className="flex items-center gap-3">
                          <span className="text-sm w-16 capitalize text-foreground font-medium">{d.device}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted/20">
                            <div className="h-full rounded-full bg-primary/50 transition-all" style={{ width: `${d.percentage}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right">{d.count} ({d.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Browser Breakdown */}
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      🌐 Browsers
                    </h4>
                    <div className="space-y-2.5">
                      {browserBreakdown.map((b) => (
                        <div key={b.browser} className="flex items-center gap-3">
                          <span className="text-sm w-16 text-foreground font-medium truncate">{b.browser}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted/20">
                            <div className="h-full rounded-full bg-primary/40 transition-all" style={{ width: `${b.percentage}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right">{b.count} ({b.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Hourly Heatmap for Today */}
            {!referralsLoading && todayReferrals > 0 && (
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    ⏰ Today's Hourly Activity
                  </h4>
                  <div className="grid grid-cols-12 gap-1">
                    {hourlyToday.map((h) => {
                      const maxH = Math.max(...hourlyToday.map(x => x.count), 1);
                      const intensity = h.count / maxH;
                      return (
                        <div key={h.hour} className="flex flex-col items-center gap-1 group relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                            <div className="bg-popover border border-border rounded px-1.5 py-0.5 shadow-lg">
                              <p className="text-[9px] text-foreground font-semibold whitespace-nowrap">{h.count} at {h.hour}:00</p>
                            </div>
                          </div>
                          <div
                            className="w-full h-6 rounded-sm transition-colors cursor-default"
                            style={{
                              backgroundColor: h.count > 0
                                ? `hsl(25 95% 53% / ${0.15 + intensity * 0.65})`
                                : 'hsl(var(--muted) / 0.1)'
                            }}
                          />
                          {h.hour % 3 === 0 && (
                            <span className="text-[8px] text-muted-foreground">{h.hour}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== FEEDBACK TAB ===== */}
          <TabsContent value="feedback" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">User Feedback</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{feedbacks.length} total • {newFeedbackCount} unread</p>
              </div>
              <Button variant="outline" size="sm" onClick={refetchFeedbacks} disabled={feedbacksLoading} className="gap-2 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${feedbacksLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {feedbacksLoading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-14 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : feedbacks.length === 0 ? (
              <Card className="border-border/50 border-dashed">
                <CardContent className="py-16 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-14 h-14 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <MessageSquare className="w-7 h-7 opacity-30" />
                  </div>
                  <p className="font-medium text-sm">No feedback yet</p>
                  <p className="text-xs mt-1">User submissions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {feedbacks.map((feedback) => (
                  <Card
                    key={feedback.id}
                    className={`border-border/50 transition-all duration-200 ${
                      feedback.status === 'read' 
                        ? 'opacity-50 hover:opacity-70' 
                        : 'hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={getTypeBadgeVariant(feedback.type) as any} 
                            className="gap-1 text-[10px] px-2 py-0.5"
                          >
                            {getTypeIcon(feedback.type)}
                            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                          </Badge>
                          {feedback.status === 'new' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                          )}
                        </div>
                        {feedback.status === 'new' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(feedback.id)}
                            className="gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Read
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-sm text-foreground mb-3 whitespace-pre-wrap leading-relaxed line-clamp-4">
                        {feedback.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border/30">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          {feedback.userEmail}
                        </span>
                        <span className="shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(feedback.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== BANNER TAB ===== */}
          <TabsContent value="banner" className="mt-0">
            <BannerManager />
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailSheet
        user={selectedUser}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onGrantPro={handleGrantPro}
        onRevokePro={handleRevokePro}
        onToggleBan={handleToggleBan}
        onDelete={handleDeleteUser}
      />
    </DashboardLayout>
  );
};

/* ===== Mini Stats Card Component ===== */
interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  accent?: boolean;
  danger?: boolean;
  warning?: boolean;
  subtitle?: string;
}

const StatsCard = ({ label, value, icon: Icon, loading, accent, danger, warning, subtitle }: StatsCardProps) => {
  const borderClass = accent ? 'border-primary/20' : danger ? 'border-destructive/20' : warning ? 'border-amber-500/20' : 'border-border/50';
  const iconBg = accent ? 'bg-primary/15' : danger ? 'bg-destructive/15' : warning ? 'bg-amber-500/15' : 'bg-muted/30';
  const iconColor = accent ? 'text-primary' : danger ? 'text-destructive' : warning ? 'text-amber-500' : 'text-muted-foreground';
  const valueColor = accent ? 'text-primary' : danger ? 'text-destructive' : warning ? 'text-amber-500' : 'text-foreground';

  return (
    <Card className={`${borderClass} bg-card/50 hover:bg-card/80 transition-colors`}>
      <CardContent className="p-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
            {loading ? (
              <Skeleton className="h-5 w-8 mt-0.5" />
            ) : (
              <p className={`text-lg font-bold ${valueColor} leading-tight`}>{value}</p>
            )}
            {subtitle && !loading && (
              <p className="text-[10px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
