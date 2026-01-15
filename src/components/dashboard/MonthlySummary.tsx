import { Invoice } from '@/types/invoice';
import { CalendarDays, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface MonthlySummaryProps {
  invoices: Invoice[];
}

export const MonthlySummary = ({ invoices }: MonthlySummaryProps) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter invoices for current month
  const thisMonthInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    return (
      invoiceDate.getMonth() === currentMonth &&
      invoiceDate.getFullYear() === currentYear
    );
  });

  // Calculate totals
  const totalInvoices = thisMonthInvoices.length;
  
  const paidInvoices = thisMonthInvoices.filter((i) => i.status === 'paid');
  const pendingInvoices = thisMonthInvoices.filter((i) => i.status !== 'paid');

  // Calculate amounts in PKR for consistency
  const calculatePKR = (invoice: Invoice) => {
    if (invoice.currency === 'PKR') {
      return invoice.amount;
    }
    return invoice.convertedAmount;
  };

  const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + calculatePKR(inv), 0);
  const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + calculatePKR(inv), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const stats = [
    {
      label: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: CalendarDays,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Paid Amount',
      value: formatCurrency(totalPaidAmount),
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Pending Amount',
      value: formatCurrency(totalPendingAmount),
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Summary</h3>
          <p className="text-sm text-muted-foreground">{monthName}</p>
        </div>
        <div className="p-2 rounded-xl bg-primary/10">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
