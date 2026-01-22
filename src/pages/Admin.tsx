import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useFeedback } from '@/hooks/useFeedback';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AnnouncementManager } from '@/components/admin/AnnouncementManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Helper to get display name or fallback to email prefix
const getDisplayName = (displayName: string | null, email: string): string => {
  if (displayName) return displayName;
  return email.split('@')[0] || 'Unknown';
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
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === '' ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.displayName?.toLowerCase().includes(searchLower));
      
      // Plan filter
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, subscriptions, and feedback</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {usersLoading ? <Skeleton className="h-8 w-12" /> : users.length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Pro Users</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {usersLoading ? <Skeleton className="h-8 w-12" /> : proUsersCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Active Subs</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              {usersLoading ? <Skeleton className="h-8 w-12" /> : activeSubsCount}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">New Feedback</p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {feedbacksLoading ? <Skeleton className="h-8 w-12" /> : newFeedbackCount}
            </p>
          </div>
        </div>

        {/* Global Announcement Manager */}
        <AnnouncementManager />

        {/* Tabs Section */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Feedback
              {newFeedbackCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                  {newFeedbackCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as PlanFilter)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="pro">Pro Only</SelectItem>
                    <SelectItem value="free">Free Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={refetch} disabled={usersLoading}>
                  <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery || planFilter !== 'all' ? 'No users match your filters' : 'No users found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className={user.isBanned ? 'bg-destructive/10 opacity-70' : ''}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {user.email}
                            {user.isBanned && (
                              <Badge variant="destructive" className="text-xs">
                                Banned
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getDisplayName(user.displayName, user.email)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.plan === 'pro' ? 'default' : 'secondary'}
                            className={user.plan === 'pro' ? 'bg-primary/20 text-primary border-primary/30' : ''}
                          >
                            {user.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                            {user.plan === 'pro' ? 'Pro' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm ${user.subscriptionStatus === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                            {user.subscriptionStatus || '—'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(user.createdAt, 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePro(user.id, user.plan)}
                            >
                              <Crown className="w-4 h-4 mr-1" />
                              {user.plan === 'pro' ? 'Make Free' : 'Make Pro'}
                            </Button>
                            <Button
                              variant={user.isBanned ? 'outline' : 'secondary'}
                              size="sm"
                              onClick={() => handleToggleBan(user.id, user.isBanned || false)}
                              className={user.isBanned ? 'border-primary text-primary hover:bg-primary/10' : ''}
                            >
                              {user.isBanned ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-1" />
                                  Block
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.email)}
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
            </div>

            {/* Results count */}
            {!usersLoading && (
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">User Feedback</h3>
              <Button variant="outline" size="sm" onClick={refetchFeedbacks} disabled={feedbacksLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${feedbacksLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {feedbacksLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-16 w-full mb-3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-lg">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No feedback received yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`bg-card border border-border rounded-lg p-4 transition-opacity ${
                      feedback.status === 'read' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getTypeBadgeVariant(feedback.type) as any} className="gap-1">
                          {getTypeIcon(feedback.type)}
                          {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                        </Badge>
                        {feedback.status === 'new' && (
                          <Badge variant="outline" className="text-primary border-primary">
                            New
                          </Badge>
                        )}
                      </div>
                      {feedback.status === 'new' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(feedback.id)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Mark Read
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-foreground mb-3 whitespace-pre-wrap">
                      {feedback.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{feedback.userEmail}</span>
                      <span>{format(feedback.createdAt, 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
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
