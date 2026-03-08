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
    .reduce((sum, inv) => sum + (inv.currency === 'PKR' ? inv.amount : inv.convertedAmount), 0);

  const pendingRevenue = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.currency === 'PKR' ? inv.amount : inv.convertedAmount), 0);

  const formatPKR = (amount: number) => {
    if (amount >= 1000000) return `PKR ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 100000) return `PKR ${(amount / 1000).toFixed(0)}K`;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const paymentRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  const stats = [
    {
      label: 'Total Invoices',
      value: totalInvoices.toString(),
      sub: `${paidInvoices} paid, ${pendingInvoices} pending`,
      icon: FileText,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      border: 'border-primary/20',
    },
    {
      label: 'Revenue Earned',
      value: formatPKR(totalRevenue),
      sub: 'From paid invoices',
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      border: 'border-primary/20',
    },
    {
      label: 'Payment Rate',
      value: `${paymentRate}%`,
      sub: `${paidInvoices} of ${totalInvoices} invoices`,
      icon: CheckCircle,
      iconBg: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
      border: 'border-chart-2/20',
      progress: paymentRate,
    },
    {
      label: 'Pending Amount',
      value: formatPKR(pendingRevenue),
      sub: `${pendingInvoices} invoice${pendingInvoices !== 1 ? 's' : ''} unpaid`,
      icon: Clock,
      iconBg: 'bg-chart-4/10',
      iconColor: 'text-chart-4',
      border: 'border-chart-4/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={`${stat.border} bg-card/50 hover:bg-card/80 transition-all duration-200 group`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">{stat.label}</p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{stat.value}</p>
            {stat.progress !== undefined && (
              <div className="mt-2 h-1.5 rounded-full bg-muted/20">
                <div className="h-full rounded-full bg-chart-2/60 transition-all duration-500" style={{ width: `${stat.progress}%` }} />
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-1.5">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
