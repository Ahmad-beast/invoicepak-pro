import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useInvoices } from '@/hooks/useInvoices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';

export const CreateInvoiceForm = () => {
  const [clientName, setClientName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createInvoice, getConversionRate } = useInvoices();
  const navigate = useNavigate();
  const conversionRate = getConversionRate();

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
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    const invoice = createInvoice({
      clientName,
      serviceDescription,
      amount: parseFloat(amount),
      currency,
      status: 'draft',
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
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Create New Invoice</CardTitle>
          <CardDescription>Fill in the details to generate a professional invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client or company name"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Service Description</Label>
              <Textarea
                id="serviceDescription"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Describe the services provided..."
                rows={4}
                className="bg-background border-border resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'PKR')}>
                  <SelectTrigger className="bg-background border-border">
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
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Live Conversion (Rate: 1 USD = {conversionRate} PKR)</span>
                </div>
                <div className="flex items-center gap-3 text-lg font-semibold">
                  <span className="text-foreground">
                    {currency === 'USD' ? '$' : '₨'}{parseFloat(amount).toFixed(2)} {currency}
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary" />
                  <span className="text-primary">
                    {currency === 'USD' ? '₨' : '$'}{calculateConversion()} {currency === 'USD' ? 'PKR' : 'USD'}
                  </span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full shadow-lg shadow-primary/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <div className="space-y-4">
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
        />
      </div>
    </div>
  );
};
