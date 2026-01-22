import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, LogOut, Plus, LayoutDashboard, Menu, X, ChevronLeft, Crown, ShieldAlert, MessageCircle, Lightbulb, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeedbackDialog } from './FeedbackDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, role, isRoleLoading } = useAuth();
  const { isPro, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/create', label: 'Create Invoice', icon: Plus },
    { path: '/dashboard/subscription', label: 'Subscription', icon: Crown },
    { path: '/my-story', label: 'My Story', icon: Heart },
    // Admin link only shown to admins
    ...(!isRoleLoading && role === 'admin' ? [{ path: '/admin', label: 'Admin Panel', icon: ShieldAlert }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">InvoicePK</span>
                {!subscriptionLoading && isPro && (
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-xs px-1.5 py-0">
                    PRO
                  </Badge>
                )}
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex-shrink-0"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className={cn('flex items-center gap-3', sidebarOpen ? 'justify-between' : 'justify-center')}>
            {sidebarOpen && (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">InvoicePK</span>
          {!subscriptionLoading && isPro && (
            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-xs px-1.5 py-0">
              PRO
            </Badge>
          )}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'md:ml-20',
          'mt-16 md:mt-0'
        )}
      >
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Floating Support Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Request Feature Button */}
        <Button
          onClick={() => setFeedbackOpen(true)}
          variant="secondary"
          className="rounded-full shadow-lg h-12 px-5 gap-2 hover:shadow-xl transition-shadow"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="hidden sm:inline">Request Feature</span>
        </Button>

        {/* WhatsApp Support Button */}
        <Button
          asChild
          className="rounded-full shadow-lg h-12 px-5 gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white hover:shadow-xl transition-shadow"
        >
          <a
            href="https://wa.me/923064482383"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">WhatsApp Support</span>
          </a>
        </Button>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
};
