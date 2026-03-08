import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WhatsNewDialog } from '@/components/dashboard/WhatsNewDialog';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardStatsSkeleton } from '@/components/dashboard/DashboardStatsSkeleton';
import { MonthlySummary } from '@/components/dashboard/MonthlySummary';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { InvoiceListSkeleton } from '@/components/dashboard/InvoiceListSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/hooks/useInvoices';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Zap,
  Crown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { invoices, loading, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const { isPro, loading: subLoading } = useSubscription();

  // Keyboard shortcut: Ctrl+N for new invoice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        navigate('/dashboard/create');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const pendingCount = invoices.filter((i) => i.status !== 'paid').length;
  const paidCount = invoices.filter((i) => i.status === 'paid').length;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {greeting}, <span className="text-primary">{displayName}</span>
              </h1>
              {!subLoading && isPro && (
                <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] px-2 py-0.5">
                  <Crown className="w-2.5 h-2.5 mr-1" />
                  PRO
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading your dashboard...' : 
                invoices.length === 0 ? 'Create your first invoice to get started' :
                `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} • ${paidCount} paid • ${pendingCount} pending`
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WhatsNewDialog />
            <Link to="/dashboard/create">
              <Button className="gap-2 glow-primary font-semibold h-10">
                <Plus className="w-4 h-4" />
                New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {!loading && invoices.length === 0 && (
          <Card className="border-border/50 border-dashed">
            <CardContent className="py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Create your first invoice</h3>
              <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
                Professional invoices with automatic USD to PKR conversion. Takes less than 2 minutes.
              </p>
              <Link to="/dashboard/create">
                <Button size="lg" className="gap-2 glow-primary font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Create Invoice
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {loading ? <DashboardStatsSkeleton /> : invoices.length > 0 && <DashboardStats invoices={invoices} />}

        {/* Invoice List */}
        {(loading || invoices.length > 0) && (
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Recent Invoices</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {loading ? 'Loading...' : `${invoices.length} total`}
                  </p>
                </div>
                <Link to="/dashboard/create">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                    <Plus className="w-3.5 h-3.5" />
                    New
                  </Button>
                </Link>
              </div>
              <div className="p-3">
                {loading ? (
                  <InvoiceListSkeleton />
                ) : (
                  <InvoiceList invoices={invoices} onUpdateStatus={updateInvoiceStatus} onDelete={deleteInvoice} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Upgrade CTA (for free users) */}
        {!subLoading && !isPro && !loading && invoices.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground">Remove branding, share invoices, unlimited templates & more</p>
              </div>
              <Link to="/dashboard/subscription">
                <Button size="sm" className="gap-1.5 font-semibold glow-primary">
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
