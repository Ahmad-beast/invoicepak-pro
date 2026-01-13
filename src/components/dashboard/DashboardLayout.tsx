import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, LogOut, Plus, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InvoicePK</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user?.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 mb-8">
            <Link to="/dashboard">
              <Button 
                variant={location.pathname === '/dashboard' ? 'default' : 'outline'}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/dashboard/create">
              <Button 
                variant={location.pathname === '/dashboard/create' ? 'default' : 'outline'}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </Button>
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};
