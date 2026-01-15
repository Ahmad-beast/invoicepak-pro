import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText, AlertCircle } from 'lucide-react';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { format } from 'date-fns';

const SharedInvoice = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        // Fetch directly by document ID (shareId is the invoice document ID)
        const docRef = doc(db, 'invoices', shareId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Invoice not found or link has expired');
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        setInvoice({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Invoice);
      } catch (err) {
        console.error('Error fetching shared invoice:', err);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [shareId]);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      generateInvoicePDF(invoice);
    } finally {
      setDownloading(false);
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

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'sent':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      default:
        return 'bg-muted/30 text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">Invoice Not Found</h1>
          <p className="text-muted-foreground">
            {error || 'This invoice link may be invalid or has expired.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">InvoicePK</h1>
              <p className="text-xs text-muted-foreground">Shared Invoice</p>
            </div>
          </div>
          <Button onClick={handleDownload} disabled={downloading} className="gap-2">
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </Button>
        </div>

        {/* Invoice Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-primary/5 border-b border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                  invoice.status
                )}`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-6 space-y-6">
            {/* From / To */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-primary mb-1">FROM</p>
                <p className="font-semibold text-foreground">{invoice.senderName}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-primary mb-1">BILL TO</p>
                <p className="font-semibold text-foreground">{invoice.clientName}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Invoice Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="font-medium text-foreground">
                  {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Service Description */}
            <div>
              <p className="text-xs font-medium text-primary mb-2">SERVICE DESCRIPTION</p>
              <div className="h-px bg-border mb-3" />
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {invoice.serviceDescription}
              </p>
            </div>

            {/* Amount */}
            <div className="p-4 rounded-xl bg-muted/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount ({invoice.currency})</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="text-foreground">1 USD = {invoice.conversionRate.toFixed(2)} PKR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Converted ({invoice.currency === 'USD' ? 'PKR' : 'USD'})
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(
                    invoice.convertedAmount,
                    invoice.currency === 'USD' ? 'PKR' : 'USD'
                  )}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-primary text-primary-foreground rounded-xl p-4 flex justify-between items-center">
              <span className="font-bold">TOTAL AMOUNT</span>
              <span className="text-xl font-bold">
                {formatCurrency(invoice.amount, invoice.currency)}
              </span>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <p className="text-xs font-medium text-primary mb-2">NOTES</p>
                <div className="h-px bg-border mb-3" />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Paid Date */}
            {invoice.status === 'paid' && invoice.paidAt && (
              <div className="text-center py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <p className="text-sm text-emerald-400">
                  ✓ Paid on {format(new Date(invoice.paidAt), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Thank you for your business!</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Generated by InvoicePK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedInvoice;
