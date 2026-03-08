import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, CheckCircle, Send, FileText, Download, Loader2, Calendar, DollarSign, Link2, Crown } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { formatCurrency } from '@/lib/currency';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
  onDelete: (id: string) => void;
}

export const InvoiceList = ({ invoices, onUpdateStatus, onDelete }: InvoiceListProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { canUseFeature } = useSubscription();
  const canShareInvoice = canUseFeature('invoiceSharing');
  const canRemoveBranding = canUseFeature('removeBranding');

  const getStatusConfig = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': 
        return { label: 'Paid', dotClass: 'bg-chart-2', badgeClass: 'bg-chart-2/10 text-chart-2 border-chart-2/20' };
      case 'sent': 
        return { label: 'Sent', dotClass: 'bg-chart-5', badgeClass: 'bg-chart-5/10 text-chart-5 border-chart-5/20' };
      default: 
        return { label: 'Draft', dotClass: 'bg-muted-foreground/40', badgeClass: 'bg-muted/20 text-muted-foreground border-border' };
    }
  };

  const handleDownloadPDF = async (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(invoice.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      generateInvoicePDF(invoice, canRemoveBranding);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyShareLink = (invoice: Invoice) => {
    if (!canShareInvoice) {
      toast.error('Invoice sharing is a Pro feature. Upgrade to unlock.');
      return;
    }
    const shareUrl = `${window.location.origin}/invoice/${invoice.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-medium text-foreground">No invoices yet</p>
        <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first invoice to get started</p>
        <Link to="/dashboard/create">
          <Button size="sm" className="gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5" />
            Create Invoice
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {invoices.map((invoice) => {
        const status = getStatusConfig(invoice.status);
        const createdDate = new Date(invoice.createdAt);
        
        return (
          <div 
            key={invoice.id} 
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-150 cursor-default"
          >
            {/* Status Dot + Icon */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-lg bg-muted/20 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${status.dotClass} ring-2 ring-card`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {invoice.clientName}
                </h4>
                <Badge variant="outline" className={`${status.badgeClass} text-[9px] px-1.5 py-0 h-4 shrink-0`}>
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground font-mono">{invoice.invoiceNumber}</span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(createdDate, { addSuffix: true })}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{formatCurrency(invoice.amount, invoice.currency)}</p>
              {invoice.currency === 'USD' && (
                <p className="text-[10px] text-primary font-medium">{formatCurrency(invoice.convertedAmount, 'PKR')}</p>
              )}
            </div>

            {/* Mobile Amount */}
            <div className="text-right shrink-0 sm:hidden">
              <p className="text-xs font-semibold text-foreground">{formatCurrency(invoice.amount, invoice.currency)}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDownloadPDF(invoice, e)}
                disabled={downloadingId === invoice.id}
              >
                {downloadingId === invoice.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem 
                    onClick={(e) => handleDownloadPDF(invoice, e as unknown as React.MouseEvent)}
                    className="gap-2 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCopyShareLink(invoice)} className="gap-2 text-xs">
                    <Link2 className="w-3.5 h-3.5" />
                    Copy Share Link
                    {!canShareInvoice && <Crown className="w-3 h-3 ml-auto text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {invoice.status !== 'sent' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'sent')} className="gap-2 text-xs">
                      <Send className="w-3.5 h-3.5" />
                      Mark as Sent
                    </DropdownMenuItem>
                  )}
                  {invoice.status !== 'paid' && (
                    <DropdownMenuItem onClick={() => onUpdateStatus(invoice.id, 'paid')} className="gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark as Paid
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(invoice.id)}
                    className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
};
