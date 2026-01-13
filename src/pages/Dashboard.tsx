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
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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
