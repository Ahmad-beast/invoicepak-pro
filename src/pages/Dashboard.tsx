import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { InvoiceList } from '@/components/dashboard/InvoiceList';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/hooks/useInvoices';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoices();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <DashboardStats invoices={invoices} />
      <h2 className="text-xl font-semibold text-foreground mb-4">Your Invoices</h2>
      <InvoiceList 
        invoices={invoices} 
        onUpdateStatus={updateInvoiceStatus}
        onDelete={deleteInvoice}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
