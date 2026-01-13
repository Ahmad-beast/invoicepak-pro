import { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, CheckCircle, Send, FileText, Download, Loader2 } from 'lucide-react';
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
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
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
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      generateInvoicePDF(invoice);
    } finally {
      setDownloadingId(null);
    }
  };

  if (invoices.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No invoices yet</h3>
          <p className="text-muted-foreground">Create your first invoice to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-foreground">{invoice.clientName}</CardTitle>
                <p className="text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
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
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {invoice.serviceDescription}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </p>
                </div>
                <div className="hidden sm:block w-px h-8 bg-border" />
                <div>
                  <span className="text-xs text-muted-foreground">
                    Converted ({invoice.currency === 'USD' ? 'PKR' : 'USD'})
                  </span>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(invoice.convertedAmount, invoice.currency === 'USD' ? 'PKR' : 'USD')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPDF(invoice)}
                  disabled={downloadingId === invoice.id}
                  className="text-xs"
                >
                  {downloadingId === invoice.id ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 mr-1" />
                  )}
                  Download PDF
                </Button>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
