import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, CheckCircle, Send, FileText, Download, Loader2, Calendar, DollarSign, Link2, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
  onDelete: (id: string) => void;
}

export const InvoiceList = ({ invoices, onUpdateStatus, onDelete }: InvoiceListProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': 
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
      case 'sent': 
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/20';
      default: 
        return 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/40';
    }
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'sent': return 'Sent';
      default: return 'Draft';
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

  const handleDownloadPDF = async (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(invoice.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      generateInvoicePDF(invoice);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyShareLink = (invoice: Invoice) => {
    if (!invoice.shareId) {
      toast.error('Share link not available');
      return;
    }
    const shareUrl = `${window.location.origin}/invoice/${invoice.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No invoices yet</h3>
        <p className="text-muted-foreground text-sm mb-6">Create your first invoice to get started</p>
        <Link to="/dashboard/create">
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Create Invoice
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div 
          key={invoice.id} 
          className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:bg-accent/5 transition-all duration-200"
        >
          {/* Invoice Icon & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {invoice.clientName}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="font-mono">{invoice.invoiceNumber}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 sm:min-w-[150px]">
            <DollarSign className="w-4 h-4 text-muted-foreground/60" />
            <div className="text-right">
              <p className="font-semibold text-foreground">{formatCurrency(invoice.amount, invoice.currency)}</p>
              {invoice.currency === 'USD' && (
                <p className="text-xs text-primary font-medium">{formatCurrency(invoice.convertedAmount, 'PKR')}</p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className={`${getStatusStyle(invoice.status)} border px-3 py-1 font-medium text-xs transition-colors`}
          >
            {getStatusLabel(invoice.status)}
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleDownloadPDF(invoice, e)}
              disabled={downloadingId === invoice.id}
              className="gap-2 h-9"
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
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => handleDownloadPDF(invoice, { stopPropagation: () => {} } as React.MouseEvent)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </DropdownMenuItem>
                {invoice.shareId && (
                  <DropdownMenuItem onClick={() => handleCopyShareLink(invoice)} className="gap-2">
                    <Link2 className="w-4 h-4" />
                    Copy Share Link
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {invoice.status !== 'sent' && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'sent')} className="gap-2">
                    <Send className="w-4 h-4" />
                    Mark as Sent
                  </DropdownMenuItem>
                )}
                {invoice.status !== 'paid' && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'paid')} className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(invoice.id)}
                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
