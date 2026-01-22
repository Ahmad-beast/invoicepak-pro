import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useFeedback } from '@/hooks/useFeedback';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BannerManager } from '@/components/admin/BannerManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Ban, 
  UserCheck, 
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
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Helper to get display name or fallback to email prefix
const getDisplayName = (displayName: string | null, email: string): string => {
  if (displayName) return displayName;
  return email.split('@')[0] || 'Unknown';
};

// Helper to get initials
const getInitials = (displayName: string | null, email: string): string => {
  const name = displayName || email.split('@')[0] || 'U';
  return name.substring(0, 2).toUpperCase();
};

type PlanFilter = 'all' | 'pro' | 'free';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isRoleLoading: roleLoading } = useAuth();
  const { users, loading: usersLoading, refetch, toggleProStatus, toggleBanStatus, deleteUser } = useAdminUsers();
  const { feedbacks, loading: feedbacksLoading, refetch: refetchFeedbacks, markAsRead } = useFeedback();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');

  // Redirect non-admins to dashboard
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, roleLoading, navigate]);

  // Filtered users based on search and plan filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === '' ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.displayName?.toLowerCase().includes(searchLower));
      
      const matchesPlan = 
        planFilter === 'all' ||
        user.plan === planFilter;
      
      return matchesSearch && matchesPlan;
    });
  }, [users, searchQuery, planFilter]);

  const handleTogglePro = async (userId: string, currentPlan: 'free' | 'pro') => {
    const result = await toggleProStatus(userId, currentPlan);
    if (result.success) {
      toast.success(`User plan updated to ${currentPlan === 'pro' ? 'Free' : 'Pro'}`);
    } else {
      toast.error(result.error || 'Failed to update user');
    }
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    const result = await toggleBanStatus(userId, currentStatus);
    if (result.success) {
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
    } else {
      toast.error(result.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${email}? This action cannot be undone.`);
    if (!confirmed) return;
    
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success('User deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
  };

  const handleMarkAsRead = async (feedbackId: string) => {
    const result = await markAsRead(feedbackId);
    if (result.success) {
      toast.success('Feedback marked as read');
    } else {
      toast.error(result.error || 'Failed to update feedback');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'bug': return 'destructive';
      case 'feature': return 'default';
      default: return 'secondary';
    }
  };

  // Show loading while checking role
  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if not admin (redirect will happen)
  if (!isAdmin) {
    return null;
  }

  const proUsersCount = users.filter((u) => u.plan === 'pro').length;
  const freeUsersCount = users.filter((u) => u.plan === 'free').length;
  const activeSubsCount = users.filter((u) => u.subscriptionStatus === 'active').length;
  const newFeedbackCount = feedbacks.filter((f) => f.status === 'new').length;
  const bannedUsersCount = users.filter((u) => u.isBanned).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center border border-destructive/20">
              <ShieldAlert className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, subscriptions & feedback</p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit text-xs px-3 py-1 border-destructive/30 text-destructive">
            <Activity className="w-3 h-3 mr-1.5" />
            Admin Access
          </Badge>
        </div>

        {/* Stats Cards - Enhanced Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users Card */}
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">
                    {usersLoading ? <Skeleton className="h-9 w-16" /> : users.length}
                  </p>
                  {!usersLoading && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      {bannedUsersCount} banned
                    </p>
                  )}
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Users Card */}
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pro Users</p>
                  <p className="text-3xl font-bold text-primary">
                    {usersLoading ? <Skeleton className="h-9 w-16" /> : proUsersCount}
                  </p>
                  {!usersLoading && users.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round((proUsersCount / users.length) * 100)}% conversion
                    </p>
                  )}
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscriptions Card */}
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-muted/20">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Subs</p>
                  <p className="text-3xl font-bold text-foreground">
                    {usersLoading ? <Skeleton className="h-9 w-16" /> : activeSubsCount}
                  </p>
                  {!usersLoading && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3 text-primary" />
                      {freeUsersCount} free tier
                    </p>
                  )}
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className={`relative overflow-hidden border-border/50 ${newFeedbackCount > 0 ? 'bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20' : 'bg-gradient-to-br from-card to-muted/20'}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">New Feedback</p>
                  <p className={`text-3xl font-bold ${newFeedbackCount > 0 ? 'text-amber-500' : 'text-foreground'}`}>
                    {feedbacksLoading ? <Skeleton className="h-9 w-16" /> : newFeedbackCount}
                  </p>
                  {!feedbacksLoading && (
                    <p className="text-xs text-muted-foreground">
                      {feedbacks.length} total received
                    </p>
                  )}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${newFeedbackCount > 0 ? 'bg-amber-500/20' : 'bg-muted'}`}>
                  <MessageSquare className={`w-5 h-5 ${newFeedbackCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Banner Manager */}
        <BannerManager />

        {/* Tabs Section */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="h-12 p-1 bg-muted/50 border border-border">
            <TabsTrigger value="users" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">User Management</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
              <span className="sm:hidden">Feedback</span>
              {newFeedbackCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                  {newFeedbackCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4 mt-0">
            {/* Search and Filter Bar */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
                      <SelectTrigger className="w-[130px] bg-background">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="pro">
                          <div className="flex items-center gap-2">
                            <Crown className="w-3 h-3 text-primary" />
                            Pro Only
                          </div>
                        </SelectItem>
                        <SelectItem value="free">Free Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={refetch} disabled={usersLoading}>
                      <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Plan</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Status</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="w-10 h-10 mb-2 opacity-40" />
                          <p>{searchQuery || planFilter !== 'all' ? 'No users match your filters' : 'No users found'}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className={user.isBanned ? 'bg-destructive/5' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-10 w-10 ${user.isBanned ? 'opacity-50' : ''}`}>
                              <AvatarFallback className={`text-sm font-medium ${user.plan === 'pro' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                {getInitials(user.displayName, user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`font-medium text-foreground truncate ${user.isBanned ? 'line-through opacity-60' : ''}`}>
                                  {getDisplayName(user.displayName, user.email)}
                                </p>
                                {user.isBanned && (
                                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                    Banned
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.plan === 'pro' ? 'default' : 'secondary'}
                            className={user.plan === 'pro' ? 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30' : ''}
                          >
                            {user.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                            {user.plan === 'pro' ? 'Pro' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                            <span className="text-sm text-muted-foreground">
                              {user.subscriptionStatus || 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {format(user.createdAt, 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePro(user.id, user.plan)}
                              className="h-8 px-2.5"
                            >
                              <Crown className="w-4 h-4 mr-1" />
                              <span className="hidden xl:inline">{user.plan === 'pro' ? 'Remove Pro' : 'Make Pro'}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                              className={`h-8 px-2.5 ${user.isBanned ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              {user.isBanned ? (
                                <UserCheck className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="h-8 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Results count */}
            {!usersLoading && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4 mt-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">User Feedback</h3>
                <p className="text-sm text-muted-foreground">Review and manage user submissions</p>
              </div>
              <Button variant="outline" size="sm" onClick={refetchFeedbacks} disabled={feedbacksLoading} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${feedbacksLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {feedbacksLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-16 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : feedbacks.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-16 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium">No feedback received yet</p>
                  <p className="text-sm">User feedback will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {feedbacks.map((feedback) => (
                  <Card
                    key={feedback.id}
                    className={`border-border/50 transition-all ${
                      feedback.status === 'read' 
                        ? 'opacity-60 bg-muted/20' 
                        : 'bg-card hover:border-primary/30 hover:shadow-sm'
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={getTypeBadgeVariant(feedback.type) as any} 
                            className="gap-1.5"
                          >
                            {getTypeIcon(feedback.type)}
                            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                          </Badge>
                          {feedback.status === 'new' && (
                            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/5">
                              New
                            </Badge>
                          )}
                        </div>
                        {feedback.status === 'new' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(feedback.id)}
                            className="gap-1.5 h-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Mark Read</span>
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-foreground mb-4 whitespace-pre-wrap leading-relaxed">
                        {feedback.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          {feedback.userEmail}
                        </span>
                        <span>{format(feedback.createdAt, 'MMM d, yyyy • h:mm a')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
