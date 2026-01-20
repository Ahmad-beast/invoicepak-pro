import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Crown, Trash2, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { users, loading: usersLoading, refetch, toggleProStatus, deleteUser } = useAdminUsers();

  // Redirect non-admins to dashboard
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, roleLoading, navigate]);

  const handleTogglePro = async (userId: string, currentPlan: 'free' | 'pro') => {
    const result = await toggleProStatus(userId, currentPlan);
    if (result.success) {
      toast.success(`User plan updated to ${currentPlan === 'pro' ? 'Free' : 'Pro'}`);
    } else {
      toast.error(result.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success('User deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete user');
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
              <p className="text-muted-foreground">Manage users and subscriptions</p>
            </div>
          </div>
          <Button variant="outline" onClick={refetch} disabled={usersLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Security Note:</strong> For production use, implement Firestore Security Rules 
            to restrict admin actions to server-side functions only. Client-side admin operations 
            should be replaced with Cloud Functions.
          </p>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.displayName || '—'}</TableCell>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.email}? This action cannot be undone.
                                This will remove their user document but not their Firebase Auth account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        {!usersLoading && users.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Pro Users</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((u) => u.plan === 'pro').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Free Users</p>
              <p className="text-2xl font-bold text-foreground">
                {users.filter((u) => u.plan === 'free').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <p className="text-2xl font-bold text-primary">
                {users.filter((u) => u.subscriptionStatus === 'active').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Admin;
