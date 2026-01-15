import { Card, CardContent } from '@/components/ui/card';
import { Invoice } from '@/types/invoice';
import { FileText, DollarSign, CheckCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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

  const pendingRevenue = invoices
    .filter(i => i.status !== 'paid')
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
      subValue: `${paidInvoices} paid`,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-chart-1',
      bg: 'bg-chart-1/10',
      borderColor: 'border-chart-1/20',
      trend: totalInvoices > 0 ? 'up' : null,
      trendValue: '+12%',
    },
    {
      label: 'Revenue (PKR)',
      value: formatPKR(totalRevenue),
      subValue: 'Total earned',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      borderColor: 'border-primary/20',
      trend: totalRevenue > 0 ? 'up' : null,
      trendValue: '+8%',
    },
    {
      label: 'Paid Invoices',
      value: paidInvoices,
      subValue: `${totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}% rate`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-chart-2',
      bg: 'bg-chart-2/10',
      borderColor: 'border-chart-2/20',
      trend: paidInvoices > 0 ? 'up' : null,
      trendValue: '+5%',
    },
    {
      label: 'Pending',
      value: pendingInvoices,
      subValue: formatPKR(pendingRevenue),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
      borderColor: 'border-chart-4/20',
      trend: pendingInvoices > 0 ? 'neutral' : null,
      trendValue: 'Awaiting',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={`bg-card border ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-chart-2' : 
                  stat.trend === 'down' ? 'text-destructive' : 
                  'text-muted-foreground'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend === 'neutral' && <TrendingUp className="w-3 h-3" />}
                  <span>{stat.trendValue}</span>
                </div>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{stat.subValue}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
