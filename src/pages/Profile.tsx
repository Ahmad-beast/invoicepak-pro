import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, Mail, Lock, Shield, Calendar, Key, Camera, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const isPasswordProvider = user?.providerData?.some(p => p.providerId === 'password');
  const isGoogleProvider = user?.providerData?.some(p => p.providerId === 'google.com');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;
    
    setIsUpdatingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success('Display name updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update display name');
    }
    setIsUpdatingName(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isPasswordProvider) return;

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in before changing your password');
      } else {
        toast.error(error.message || 'Failed to update password');
      }
    }
    setIsUpdatingPassword(false);
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  if (!user) return null;

  const createdAt = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';
  const lastSignIn = user.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Unknown';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account information and security</p>
        </div>

        {/* Account Info Card */}
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-foreground">{user.displayName || 'No name set'}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  {isGoogleProvider && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">Google Account</Badge>
                  )}
                  {isPasswordProvider && (
                    <Badge variant="outline" className="text-xs border-chart-5/30 text-chart-5">Email/Password</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined: {createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Key className="w-4 h-4" />
                <span>Last login: {lastSignIn}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Display Name */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <User className="w-5 h-5 text-primary" />
              Display Name
            </CardTitle>
            <CardDescription>Change how your name appears on invoices and the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateName} className="flex gap-3">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="flex-1"
                maxLength={50}
              />
              <Button type="submit" disabled={isUpdatingName || !displayName.trim()}>
                {isUpdatingName ? 'Saving...' : 'Save'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Lock className="w-5 h-5 text-primary" />
              Password
            </CardTitle>
            <CardDescription>
              {isPasswordProvider 
                ? 'Update your password to keep your account secure' 
                : 'You signed in with Google. Use the reset option to set a password.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPasswordProvider ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            ) : (
              <Button variant="outline" onClick={handleSendPasswordReset}>
                Send Password Reset Email
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Your account security overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="text-sm font-medium text-foreground">Email Verified</p>
                <p className="text-xs text-muted-foreground">Your email verification status</p>
              </div>
              <Badge variant={user.emailVerified ? 'default' : 'destructive'} className="text-xs">
                {user.emailVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="text-sm font-medium text-foreground">Sign-in Method</p>
                <p className="text-xs text-muted-foreground">How you access your account</p>
              </div>
              <span className="text-sm text-foreground font-medium">
                {isGoogleProvider ? 'Google' : 'Email/Password'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Account UID</p>
                <p className="text-xs text-muted-foreground">Your unique account identifier</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{user.uid.slice(0, 12)}...</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
