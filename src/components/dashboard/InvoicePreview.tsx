import { format } from 'date-fns';
import { InvoiceItem } from '@/types/invoice';

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
  invoicePrefix?: string;
  items?: InvoiceItem[];
}

export const InvoicePreview = ({
  clientName,
  serviceDescription,
  amount,
  currency,
  conversionRate,
  invoiceNumber,
  status = 'draft',
  invoiceDate = new Date(),
  dueDate,
  senderName = 'Your Name',
  notes,
  invoicePrefix,
  items = [],
}: InvoicePreviewProps) => {
  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate total from items if available, otherwise use amount prop
  const totalAmount = items.length > 0 
    ? items.reduce((sum, item) => sum + item.amount, 0) 
    : amount;

  const convertedAmount = currency === 'USD' 
    ? totalAmount * conversionRate 
    : totalAmount / conversionRate;
  const convertedCurrency = currency === 'USD' ? 'PKR' : 'USD';

  const getStatusColor = () => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'sent': return 'text-blue-600';
      default: return 'text-slate-500';
    }
  };

  // Generate preview invoice number with prefix
  const previewInvoiceNumber = invoiceNumber || `${invoicePrefix || 'INV'}-PREVIEW`;

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
          <span className="font-semibold">{previewInvoiceNumber}</span>
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
      
      {/* Project Description / Subject */}
      {serviceDescription && (
        <div className="mb-4">
          <p className="text-xs font-bold text-orange-500 mb-1">PROJECT DESCRIPTION</p>
          <div className="h-px bg-slate-200 mb-2" />
          <p className="text-slate-700 whitespace-pre-wrap text-xs leading-relaxed">
            {serviceDescription}
          </p>
        </div>
      )}
      
      {/* Items Table */}
      <div className="mb-4">
        <p className="text-xs font-bold text-orange-500 mb-1">ITEMS</p>
        <div className="h-px bg-slate-200 mb-2" />
        
        {items.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2 font-semibold text-slate-600">Description</th>
                  <th className="text-center p-2 font-semibold text-slate-600 w-16">Qty</th>
                  <th className="text-right p-2 font-semibold text-slate-600 w-20">Rate</th>
                  <th className="text-right p-2 font-semibold text-slate-600 w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2 text-slate-700">
                      {item.description || <span className="text-slate-400 italic">No description</span>}
                    </td>
                    <td className="p-2 text-center text-slate-700">{item.quantity}</td>
                    <td className="p-2 text-right text-slate-700">
                      {formatCurrency(item.rate, currency)}
                    </td>
                    <td className="p-2 text-right font-medium text-slate-900">
                      {formatCurrency(item.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 italic text-xs">No items added yet...</p>
        )}
      </div>
      
      {/* Amount Section */}
      <div className="h-px bg-slate-200 mb-3" />
      
      <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500">Subtotal ({currency})</span>
          <span className="text-sm font-bold text-slate-900">
            {totalAmount > 0 ? formatCurrency(totalAmount, currency) : '--'}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500">Conversion Rate</span>
          <span className="text-slate-700">1 USD = {conversionRate.toFixed(2)} PKR</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Converted Amount ({convertedCurrency})</span>
          <span className="text-sm font-bold text-orange-500">
            {totalAmount > 0 ? formatCurrency(convertedAmount, convertedCurrency) : '--'}
          </span>
        </div>
      </div>
      
      {/* Total */}
      <div className="bg-orange-500 text-white rounded-lg p-3 flex justify-between items-center mb-4">
        <span className="font-bold text-sm">TOTAL AMOUNT</span>
        <span className="text-lg font-bold">
          {totalAmount > 0 ? formatCurrency(totalAmount, currency) : '--'}
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
