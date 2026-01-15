import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useInvoices } from '@/hooks/useInvoices';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, RefreshCw, FileText, CalendarIcon, Loader2 } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const CreateInvoiceForm = () => {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid'>('draft');
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createInvoice, getConversionRate } = useInvoices();
  const navigate = useNavigate();
  const conversionRate = getConversionRate();
  
  const senderName = user?.displayName || user?.email?.split('@')[0] || 'Your Name';

  const calculateConversion = () => {
    const numAmount = parseFloat(amount) || 0;
    if (currency === 'USD') {
      return (numAmount * conversionRate).toFixed(2);
    }
    return (numAmount / conversionRate).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !serviceDescription || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    setIsSubmitting(true);
    
    const invoice = await createInvoice({
      clientName,
      serviceDescription,
      amount: parseFloat(amount),
      currency,
      status,
      invoiceDate: invoiceDate.toISOString(),
      dueDate: dueDate.toISOString(),
      senderName,
      notes: notes || undefined,
    });

    if (invoice) {
      toast.success('Invoice created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Failed to create invoice');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Form Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-foreground">Create New Invoice</CardTitle>
          <CardDescription>Fill in the details below to generate a professional invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Name (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="senderName" className="text-sm font-medium">
                From (Sender)
              </Label>
              <Input
                id="senderName"
                value={senderName}
                disabled
                className="bg-muted/50 border-border text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">This is pulled from your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm font-medium">
                Client Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Acme Corporation"
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">The name of your client or their company</p>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Invoice Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-border h-10",
                        !invoiceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => date && setInvoiceDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background border-border h-10",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Select due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">When payment is expected</p>
              </div>
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'draft' | 'sent' | 'paid')}>
                <SelectTrigger className="bg-background border-border h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Set initial invoice status</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDescription" className="text-sm font-medium">
                Service Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="serviceDescription"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="e.g., Website development and design services..."
                rows={3}
                className="bg-background border-border resize-none"
              />
              <p className="text-xs text-muted-foreground">Describe the work or services provided</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-background border-border h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'PKR')}>
                  <SelectTrigger className="bg-background border-border h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="PKR">PKR (₨)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Live Conversion (1 USD = {conversionRate} PKR)</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span className="text-foreground">
                    {currency === 'USD' ? '$' : '₨'}{parseFloat(amount).toFixed(2)} {currency}
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                  <span className="text-primary">
                    {currency === 'USD' ? '₨' : '$'}{calculateConversion()} {currency === 'USD' ? 'PKR' : 'USD'}
                  </span>
                </div>
              </div>
            )}

            {/* Notes Field */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes / Payment Instructions <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Bank transfer details, payment terms..."
                rows={2}
                className="bg-background border-border resize-none"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full shadow-lg shadow-primary/20 h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                'Create Invoice'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="w-5 h-5" />
          <span className="font-medium">Live Preview</span>
        </div>
        <InvoicePreview
          clientName={clientName}
          serviceDescription={serviceDescription}
          amount={parseFloat(amount) || 0}
          currency={currency}
          conversionRate={conversionRate}
          status={status}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          senderName={senderName}
          notes={notes}
        />
      </div>
    </div>
  );
};
