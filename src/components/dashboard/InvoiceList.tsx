import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, CheckCircle, Send, FileText, Download, Loader2, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
  onDelete: (id: string) => void;
}

export const InvoiceList = ({ invoices, onUpdateStatus, onDelete }: InvoiceListProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
      case 'sent': return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      default: return 'bg-muted/20 text-muted-foreground border-border';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const completeInvoice: Invoice = {
        ...invoice,
        invoiceDate: invoice.invoiceDate || invoice.createdAt,
        dueDate: invoice.dueDate || invoice.createdAt,
        senderName: invoice.senderName || 'InvoicePK User',
        notes: invoice.notes || '',
      };
      generateInvoicePDF(completeInvoice);
    } finally {
      setDownloadingId(null);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No invoices yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div 
          key={invoice.id} 
          className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
        >
          {/* Invoice Icon & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate">{invoice.clientName}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{invoice.invoiceNumber}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 sm:min-w-[140px]">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div className="text-right">
              <p className="font-semibold text-foreground">{formatCurrency(invoice.amount, invoice.currency)}</p>
              {invoice.currency === 'USD' && (
                <p className="text-xs text-primary">{formatCurrency(invoice.convertedAmount, 'PKR')}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge className={`${getStatusColor(invoice.status)} border font-medium`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadPDF(invoice)}
              disabled={downloadingId === invoice.id}
              className="gap-2"
            >
              {downloadingId === invoice.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'sent')}>
                  <Send className="w-4 h-4 mr-2" />
                  Mark as Sent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'paid')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(invoice.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
