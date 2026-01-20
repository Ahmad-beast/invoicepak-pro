import { useState, useRef } from 'react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInvoices } from '@/hooks/useInvoices';
import { useNoteTemplates } from '@/hooks/useNoteTemplates';
import { useInvoiceTemplates } from '@/hooks/useInvoiceTemplates';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, RefreshCw, FileText, CalendarIcon, Loader2, Plus, Trash2, BookOpen, Crown, AlertCircle, Lock, Upload, X, Building2 } from 'lucide-react';
import { InvoicePreview } from './InvoicePreview';
import { InvoiceTemplateManager } from './InvoiceTemplateManager';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { InvoiceItem, InvoiceTemplate } from '@/types/invoice';

export const CreateInvoiceForm = () => {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid'>('draft');
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Line items state
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  
  // New state for custom exchange rate
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState('');
  
  // New state for invoice prefix
  const [invoicePrefix, setInvoicePrefix] = useState('');
  
  // Company branding state (Pro feature)
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Note templates state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const { createInvoice, getConversionRate } = useInvoices();
  const { templates: noteTemplates, addTemplate: addNoteTemplate, deleteTemplate: deleteNoteTemplate } = useNoteTemplates();
  const { canCreateInvoice, getRemainingInvoices, incrementInvoiceCount, canUseFeature, subscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  
  const defaultRate = getConversionRate();
  const activeRate = useCustomRate && customRate ? parseFloat(customRate) : defaultRate;
  
  const senderName = user?.displayName || user?.email?.split('@')[0] || 'Your Name';
  const canCreate = canCreateInvoice();
  const remainingInvoices = getRemainingInvoices();
  const canUseCustomRate = canUseFeature('customExchangeRate');
  const isPro = subscription?.plan === 'pro';

  // Payment terms state for template functionality
  const [paymentTermsDays, setPaymentTermsDays] = useState<number | undefined>(undefined);

  // Handle applying an invoice template
  const handleApplyInvoiceTemplate = (template: InvoiceTemplate) => {
    if (template.companyName) setCompanyName(template.companyName);
    if (template.companyLogo) setCompanyLogo(template.companyLogo);
    if (template.invoicePrefix) setInvoicePrefix(template.invoicePrefix);
    if (template.currency) setCurrency(template.currency);
    if (template.notes) setNotes(template.notes);
    if (template.paymentTermsDays) {
      setPaymentTermsDays(template.paymentTermsDays);
      // Also set the due date based on payment terms
      setDueDate(addDays(invoiceDate, template.paymentTermsDays));
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast.error('Logo must be less than 500KB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setCompanyLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // Calculate total amount from items
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const calculateConversion = () => {
    if (currency === 'USD') {
      return (totalAmount * activeRate).toFixed(2);
    }
    return (totalAmount / activeRate).toFixed(2);
  };

  // Item management functions
  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast.error('At least one item is required');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      // Auto-calculate amount when quantity or rate changes
      if (field === 'quantity' || field === 'rate') {
        const qty = field === 'quantity' ? Number(value) : item.quantity;
        const rate = field === 'rate' ? Number(value) : item.rate;
        updatedItem.amount = qty * rate;
      }
      
      return updatedItem;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreate) {
      toast.error('You\'ve reached your monthly invoice limit. Upgrade to Pro for unlimited invoices.');
      return;
    }
    
    if (!clientName) {
      toast.error('Please enter a client name');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    // Validate items
    const validItems = items.filter(item => item.description.trim() && item.amount > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item with a description and valid amount');
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
      amount: totalAmount,
      currency,
      status,
      invoiceDate: invoiceDate.toISOString(),
      dueDate: dueDate.toISOString(),
      senderName,
      notes: notes || undefined,
      customExchangeRate: useCustomRate && canUseCustomRate ? parseFloat(customRate) : undefined,
      invoicePrefix: invoicePrefix.trim() || undefined,
      items: validItems,
      companyName: isPro && companyName.trim() ? companyName.trim() : undefined,
      companyLogo: isPro && companyLogo ? companyLogo : undefined,
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

  const handleSaveNoteTemplate = () => {
    if (!newTemplateName.trim() || !notes.trim()) {
      toast.error('Please enter a template name and notes content');
      return;
    }
    addNoteTemplate(newTemplateName.trim(), notes);
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
            {/* Invoice Templates (Pro Feature) */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Invoice Templates</span>
                {!isPro && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Pro
                  </span>
                )}
              </div>
              <InvoiceTemplateManager
                isPro={isPro}
                onApplyTemplate={handleApplyInvoiceTemplate}
                currentValues={{
                  companyName,
                  companyLogo,
                  invoicePrefix,
                  currency,
                  notes,
                  paymentTermsDays,
                }}
              />
            </div>

            {/* Company Branding Section (Pro Feature) */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Company Branding</Label>
                  {!isPro && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </div>
              </div>
              
              <TooltipProvider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-xs text-muted-foreground">
                      Company Name
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Your Company Name"
                            disabled={!isPro}
                            className={cn(
                              "bg-background border-border",
                              !isPro && "opacity-50 cursor-not-allowed"
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      {!isPro && (
                        <TooltipContent>
                          <p>Upgrade to Pro to add custom branding</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                  
                  {/* Company Logo */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Company Logo
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          {companyLogo && isPro ? (
                            <div className="relative w-full h-10 border border-border rounded-md bg-background flex items-center px-3 gap-2">
                              <img 
                                src={companyLogo} 
                                alt="Logo preview" 
                                className="h-6 w-6 object-contain"
                              />
                              <span className="text-xs text-muted-foreground truncate flex-1">Logo uploaded</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={removeLogo}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full h-10 gap-2",
                                !isPro && "opacity-50 cursor-not-allowed"
                              )}
                              disabled={!isPro}
                              onClick={() => logoInputRef.current?.click()}
                            >
                              <Upload className="w-4 h-4" />
                              Upload Logo
                            </Button>
                          )}
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </div>
                      </TooltipTrigger>
                      {!isPro && (
                        <TooltipContent>
                          <p>Upgrade to Pro to add custom branding</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>
              
              {!isPro && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Upgrade to Pro to add your company name and logo to invoices
                </p>
              )}
            </div>
            
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

            {/* Project Title / Summary */}
            <div className="space-y-2">
              <Label htmlFor="serviceDescription" className="text-sm font-medium">
                Project Title / Summary <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="serviceDescription"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="e.g., Website Development Project - Phase 1"
                rows={2}
                className="bg-background border-border resize-none"
              />
              <p className="text-xs text-muted-foreground">A brief description or title for this invoice</p>
            </div>

            {/* Currency Selector */}
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

            {/* Line Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Line Items <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="h-8 gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Description (e.g., Website Design)"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="bg-background border-border h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Rate ({currency === 'USD' ? '$' : '₨'})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="bg-background border-border h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Amount ({currency === 'USD' ? '$' : '₨'})</Label>
                        <Input
                          type="text"
                          value={`${currency === 'USD' ? '$' : '₨'} ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          disabled
                          className="bg-muted/50 border-border h-9 text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">Add items with description, quantity, and rate. Amount is calculated automatically.</p>
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

            {/* Total Amount Display - Simple currency-based display */}
            {totalAmount > 0 && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {currency === 'USD' ? '$' : '₨'}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
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
                  {noteTemplates.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                          <BookOpen className="w-3.5 h-3.5" />
                          Templates
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="end">
                        <div className="space-y-1">
                          {noteTemplates.map((template) => (
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
                                onClick={() => deleteNoteTemplate(template.id)}
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
                        <Button onClick={handleSaveNoteTemplate} disabled={!notes.trim()}>
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
          amount={totalAmount}
          currency={currency}
          conversionRate={activeRate}
          status={status}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          senderName={senderName}
          notes={notes}
          invoicePrefix={invoicePrefix}
          items={items}
          companyName={isPro ? companyName : undefined}
          companyLogo={isPro ? companyLogo : undefined}
        />
      </div>
    </div>
  );
};
