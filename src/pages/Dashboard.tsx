import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardStatsSkeleton } from '@/components/dashboard/DashboardStatsSkeleton';
import { MonthlySummary } from '@/components/dashboard/MonthlySummary';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { InvoiceListSkeleton } from '@/components/dashboard/InvoiceListSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/button';
import { Plus, FileText, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { invoices, loading, updateInvoiceStatus, deleteInvoice } = useInvoices();

  // Should never happen because /dashboard is wrapped in <AuthGate />
  if (!user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const pendingCount = invoices.filter((i) => i.status !== 'paid').length;

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Welcome back, <span className="text-primary">{displayName}</span>! 👋
            </h1>
            <p className="text-muted-foreground">Here's an overview of your invoicing activity</p>
          </div>
          <Link to="/dashboard/create">
            <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading ? null : invoices.length === 0 ? (
          /* Empty State */
          <div className="bg-card border border-border rounded-2xl p-10 text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No invoices yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Create your first invoice to get started with professional invoicing and automatic USD to PKR conversion.
            </p>
            <Link to="/dashboard/create">
              <Button size="lg" className="gap-2 px-8">
                <Plus className="w-5 h-5" />
                Create Invoice
              </Button>
            </Link>
          </div>
        ) : (
          pendingCount > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  You have {pendingCount} pending invoice{pendingCount > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground">Send reminders to get paid faster</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          )
        )}
      </div>

      {/* Monthly Summary */}
      {!loading && invoices.length > 0 && <MonthlySummary invoices={invoices} />}

      {/* Stats Cards */}
      {loading ? <DashboardStatsSkeleton /> : <DashboardStats invoices={invoices} />}

      {/* Invoice List Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent Invoices</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${invoices.length} total invoice${invoices.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {invoices.length > 5 && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>
        {loading ? (
          <InvoiceListSkeleton />
        ) : (
          <InvoiceList invoices={invoices} onUpdateStatus={updateInvoiceStatus} onDelete={deleteInvoice} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
