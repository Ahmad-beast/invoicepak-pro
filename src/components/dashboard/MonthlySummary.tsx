import { useMemo } from 'react';
import { Invoice } from '@/types/invoice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, DollarSign, Clock, CheckCircle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface MonthlySummaryProps {
  invoices: Invoice[];
}

export const MonthlySummary = ({ invoices }: MonthlySummaryProps) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { thisMonth, lastMonth } = useMemo(() => {
    const thisMonthInvoices = invoices.filter((invoice) => {
      const d = new Date(invoice.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthNum = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthInvoices = invoices.filter((invoice) => {
      const d = new Date(invoice.createdAt);
      return d.getMonth() === lastMonthNum && d.getFullYear() === lastMonthYear;
    });

    return { thisMonth: thisMonthInvoices, lastMonth: lastMonthInvoices };
  }, [invoices, currentMonth, currentYear]);

  const calcPKR = (inv: Invoice) => inv.currency === 'PKR' ? inv.amount : inv.convertedAmount;

  const thisMonthPaid = thisMonth.filter(i => i.status === 'paid').reduce((s, i) => s + calcPKR(i), 0);
  const thisMonthPending = thisMonth.filter(i => i.status !== 'paid').reduce((s, i) => s + calcPKR(i), 0);
  const lastMonthTotal = lastMonth.reduce((s, i) => s + calcPKR(i), 0);
  const thisMonthTotal = thisMonth.reduce((s, i) => s + calcPKR(i), 0);

  const change = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : thisMonthTotal > 0 ? 100 : 0;

  const formatPKR = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthName = now.toLocaleDateString('en-US', { month: 'long' });

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 bg-muted/10">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{monthName} Summary</h3>
          </div>
          {change !== 0 && (
            <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 gap-1 ${change > 0 ? 'bg-chart-2/10 text-chart-2 border-chart-2/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
              {change > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
              {Math.abs(change)}% vs last month
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-3 divide-x divide-border/30">
          <div className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{thisMonth.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Invoices</p>
          </div>
          <div className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-chart-2" />
            </div>
            <p className="text-lg font-bold text-foreground">{formatPKR(thisMonthPaid)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Paid</p>
          </div>
          <div className="p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-4 h-4 text-chart-4" />
            </div>
            <p className="text-lg font-bold text-foreground">{formatPKR(thisMonthPending)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
