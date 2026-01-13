import { Card, CardContent } from '@/components/ui/card';
import { Invoice } from '@/types/invoice';
import { FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface DashboardStatsProps {
  invoices: Invoice[];
}

export const DashboardStats = ({ invoices }: DashboardStatsProps) => {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = invoices.filter(i => i.status !== 'paid').length;
  
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => {
      return sum + (inv.currency === 'PKR' ? inv.amount : inv.convertedAmount);
    }, 0);

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Invoices',
      value: totalInvoices,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Revenue (PKR)',
      value: formatPKR(totalRevenue),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Paid',
      value: paidInvoices,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Pending',
      value: pendingInvoices,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
