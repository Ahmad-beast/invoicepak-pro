import { format } from 'date-fns';

interface InvoicePreviewProps {
  clientName: string;
  serviceDescription: string;
  amount: number;
  currency: 'USD' | 'PKR';
  conversionRate: number;
  invoiceNumber?: string;
  status?: 'draft' | 'sent' | 'paid';
  invoiceDate?: Date;
  dueDate?: Date;
  senderName?: string;
  notes?: string;
}

export const InvoicePreview = ({
  clientName,
  serviceDescription,
  amount,
  currency,
  conversionRate,
  invoiceNumber = 'INV-PREVIEW',
  status = 'draft',
  invoiceDate = new Date(),
  dueDate,
  senderName = 'Your Name',
  notes,
}: InvoicePreviewProps) => {
  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const convertedAmount = currency === 'USD' 
    ? amount * conversionRate 
    : amount / conversionRate;
  const convertedCurrency = currency === 'USD' ? 'PKR' : 'USD';

  const getStatusColor = () => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'sent': return 'text-blue-600';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white text-slate-900 p-6 rounded-lg shadow-lg border border-slate-200 min-h-[500px] text-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-xl font-bold text-orange-500">InvoicePK</h1>
          <p className="text-xs text-slate-500">Professional Invoice Management</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">INVOICE</h2>
      </div>
      
      {/* Accent Line */}
      <div className="h-0.5 bg-orange-500 mb-4" />
      
      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <span className="text-slate-500">Invoice #: </span>
          <span className="font-semibold">{invoiceNumber}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Invoice Date: </span>
          <span className="font-semibold">{format(invoiceDate, 'MMM dd, yyyy')}</span>
        </div>
        <div>
          <span className="text-slate-500">Status: </span>
          <span className={`font-semibold capitalize ${getStatusColor()}`}>{status}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Due Date: </span>
          <span className="font-semibold">{dueDate ? format(dueDate, 'MMM dd, yyyy') : '--'}</span>
        </div>
      </div>
      
      {/* From & Bill To Section */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-bold text-orange-500 mb-1">FROM</p>
          <p className="text-sm font-bold text-slate-900">
            {senderName || <span className="text-slate-400 italic">Sender name...</span>}
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs font-bold text-orange-500 mb-1">BILL TO</p>
          <p className="text-sm font-bold text-slate-900">
            {clientName || <span className="text-slate-400 italic">Client name...</span>}
          </p>
        </div>
      </div>
      
      {/* Service Description */}
      <div className="mb-4">
        <p className="text-xs font-bold text-orange-500 mb-1">SERVICE DESCRIPTION</p>
        <div className="h-px bg-slate-200 mb-2" />
        <p className="text-slate-700 whitespace-pre-wrap text-xs leading-relaxed">
          {serviceDescription || <span className="text-slate-400 italic">Service description...</span>}
        </p>
      </div>
      
      {/* Amount Section */}
      <div className="h-px bg-slate-200 mb-3" />
      
      <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500">Amount ({currency})</span>
          <span className="text-sm font-bold text-slate-900">
            {amount > 0 ? formatCurrency(amount, currency) : '--'}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500">Conversion Rate</span>
          <span className="text-slate-700">1 USD = {conversionRate.toFixed(2)} PKR</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Converted Amount ({convertedCurrency})</span>
          <span className="text-sm font-bold text-orange-500">
            {amount > 0 ? formatCurrency(convertedAmount, convertedCurrency) : '--'}
          </span>
        </div>
      </div>
      
      {/* Total */}
      <div className="bg-orange-500 text-white rounded-lg p-3 flex justify-between items-center mb-4">
        <span className="font-bold text-sm">TOTAL AMOUNT</span>
        <span className="text-lg font-bold">
          {amount > 0 ? formatCurrency(amount, currency) : '--'}
        </span>
      </div>
      
      {/* Notes Section */}
      {notes && (
        <div className="mb-4">
          <p className="text-xs font-bold text-orange-500 mb-1">NOTES</p>
          <div className="h-px bg-slate-200 mb-2" />
          <p className="text-xs text-slate-600 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="h-px bg-slate-200 mb-3" />
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-1">Thank you for your business!</p>
        <p className="text-xs text-slate-400">Generated by InvoicePK</p>
      </div>
    </div>
  );
};
