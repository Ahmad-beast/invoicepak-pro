import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInvoices } from '@/hooks/useInvoices';
import { useNoteTemplates } from '@/hooks/useNoteTemplates';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, RefreshCw, FileText, CalendarIcon, Loader2, Plus, Trash2, BookOpen, Crown, AlertCircle, Lock } from 'lucide-react';
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
  
  // New state for custom exchange rate
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState('');
  
  // New state for invoice prefix
  const [invoicePrefix, setInvoicePrefix] = useState('');
  
  // Note templates state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const { createInvoice, getConversionRate } = useInvoices();
  const { templates, addTemplate, deleteTemplate } = useNoteTemplates();
  const { canCreateInvoice, getRemainingInvoices, incrementInvoiceCount, canUseFeature, subscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  
  const defaultRate = getConversionRate();
  const activeRate = useCustomRate && customRate ? parseFloat(customRate) : defaultRate;
  
  const senderName = user?.displayName || user?.email?.split('@')[0] || 'Your Name';
  const canCreate = canCreateInvoice();
  const remainingInvoices = getRemainingInvoices();
  const canUseCustomRate = canUseFeature('customExchangeRate');

  const calculateConversion = () => {
    const numAmount = parseFloat(amount) || 0;
    if (currency === 'USD') {
      return (numAmount * activeRate).toFixed(2);
    }
    return (numAmount / activeRate).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreate) {
      toast.error('You\'ve reached your monthly invoice limit. Upgrade to Pro for unlimited invoices.');
      return;
    }
    
    if (!clientName || !serviceDescription || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    if (useCustomRate && (!customRate || parseFloat(customRate) <= 0)) {
      toast.error('Please enter a valid exchange rate');
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
      customExchangeRate: useCustomRate && canUseCustomRate ? parseFloat(customRate) : undefined,
      invoicePrefix: invoicePrefix.trim() || undefined,
    });

    if (invoice) {
      await incrementInvoiceCount();
      toast.success('Invoice created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Failed to create invoice');
    }
    
    setIsSubmitting(false);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !notes.trim()) {
      toast.error('Please enter a template name and notes content');
      return;
    }
    addTemplate(newTemplateName.trim(), notes);
    toast.success('Template saved!');
    setNewTemplateName('');
    setTemplateDialogOpen(false);
  };

  const handleSelectTemplate = (content: string) => {
    setNotes(content);
    toast.success('Template applied');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Limit Warning */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">Create New Invoice</CardTitle>
              <CardDescription>Fill in the details below to generate a professional invoice</CardDescription>
            </div>
            {subscription && remainingInvoices !== Infinity && (
              <div className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full",
                remainingInvoices > 2 ? "bg-muted text-muted-foreground" : 
                remainingInvoices > 0 ? "bg-amber-500/15 text-amber-500" : 
                "bg-destructive/15 text-destructive"
              )}>
                {remainingInvoices} invoice{remainingInvoices !== 1 ? 's' : ''} left
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!canCreate && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-destructive">You've reached your monthly limit of 5 invoices.</span>
                <Link to="/dashboard/subscription">
                  <Button size="sm" variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                    <Crown className="w-3.5 h-3.5" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
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

            {/* Invoice Number Prefix */}
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix" className="text-sm font-medium">
                Invoice Prefix <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="invoicePrefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                placeholder="e.g., ACME, PRJ-2026"
                maxLength={15}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Custom prefix for invoice number (e.g., {invoicePrefix || 'INV'}-2601-001)
              </p>
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

            {/* Custom Exchange Rate Toggle */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Custom Exchange Rate</Label>
                    {!canUseCustomRate && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Override the default rate</p>
                </div>
                <Switch
                  checked={useCustomRate && canUseCustomRate}
                  onCheckedChange={(checked) => {
                    if (!canUseCustomRate) {
                      toast.error('Custom exchange rate is a Pro feature. Upgrade to unlock.');
                      return;
                    }
                    setUseCustomRate(checked);
                  }}
                  disabled={!canUseCustomRate}
                />
              </div>
              
              {useCustomRate && canUseCustomRate && (
                <div className="space-y-2">
                  <Label htmlFor="customRate" className="text-sm font-medium">
                    Exchange Rate (1 USD = ? PKR)
                  </Label>
                  <Input
                    id="customRate"
                    type="number"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    placeholder={defaultRate.toString()}
                    min="0"
                    step="0.01"
                    className="bg-background border-border h-10"
                  />
                </div>
              )}
            </div>

            {amount && parseFloat(amount) > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {useCustomRate ? 'Custom Rate' : 'Auto Rate'}: 1 USD = {activeRate.toFixed(2)} PKR
                  </span>
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

            {/* Notes Field with Templates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes / Payment Instructions <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="flex items-center gap-2">
                  {templates.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          <BookOpen className="w-3.5 h-3.5" />
                          Templates
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="end">
                        <div className="space-y-1">
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group"
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectTemplate(template.content)}
                                className="text-sm text-foreground text-left flex-1 truncate"
                              >
                                {template.name}
                              </button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => deleteTemplate(template.id)}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        <Plus className="w-3.5 h-3.5" />
                        Save as Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Note Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            placeholder="e.g., Bank Transfer Details"
                          />
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-sm">
                          <p className="text-xs text-muted-foreground mb-1">Content to save:</p>
                          <p className="text-foreground whitespace-pre-wrap">
                            {notes || <span className="text-muted-foreground italic">Enter notes first...</span>}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveTemplate} disabled={!notes.trim()}>
                          Save Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Bank transfer details, payment terms..."
                rows={3}
                className="bg-background border-border resize-none"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full shadow-lg shadow-primary/20 h-12 text-base font-medium"
              disabled={isSubmitting || !canCreate}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Invoice...
                </>
              ) : !canCreate ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Limit Reached
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
          conversionRate={activeRate}
          status={status}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          senderName={senderName}
          notes={notes}
          invoicePrefix={invoicePrefix}
        />
      </div>
    </div>
  );
};
