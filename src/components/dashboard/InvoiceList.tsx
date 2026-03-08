import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreVertical, Trash2, CheckCircle, Send, FileText, Download, Loader2, Calendar, DollarSign, Link2, Crown, Pencil, Search, Filter } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { formatCurrency } from '@/lib/currency';
import { Input } from '@/components/ui/input';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: Invoice['status']) => void;
  onDelete: (id: string) => void;
}

export const InvoiceList = ({ invoices, onUpdateStatus, onDelete }: InvoiceListProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
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

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = searchQuery === '' || 
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusFilters: { label: string; value: 'all' | Invoice['status'] }[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Sent', value: 'sent' },
    { label: 'Paid', value: 'paid' },
  ];

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
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by client or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background border-border"
          />
        </div>
        <div className="flex gap-1">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Empty filter state */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-10 px-4">
          <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {statusFilter !== 'all' 
              ? `No ${statusFilter} invoices found` 
              : 'No matching invoices'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery ? 'Try a different search term' : 'Try changing the filter'}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-3 text-xs"
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Invoice Items */}
      {filteredInvoices.map((invoice) => {
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
                  <DropdownMenuItem asChild className="gap-2 text-xs">
                    <Link to={`/dashboard/create?edit=${invoice.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                      Edit Invoice
                    </Link>
                  </DropdownMenuItem>
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
                    onClick={() => setDeleteTarget(invoice.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
