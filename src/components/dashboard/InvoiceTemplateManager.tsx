import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useInvoiceTemplates } from '@/hooks/useInvoiceTemplates';
import { InvoiceTemplate } from '@/types/invoice';
import { toast } from 'sonner';
import { Save, FileText, Trash2, Upload, X, Building2, Crown, Edit2 } from 'lucide-react';
import { useRef } from 'react';

interface InvoiceTemplateManagerProps {
  isPro: boolean;
  onApplyTemplate: (template: InvoiceTemplate) => void;
  currentValues: {
    companyName: string;
    companyLogo: string | null;
    invoicePrefix: string;
    currency: 'USD' | 'PKR';
    notes: string;
    paymentTermsDays?: number;
  };
}

export const InvoiceTemplateManager = ({ 
  isPro, 
  onApplyTemplate,
  currentValues 
}: InvoiceTemplateManagerProps) => {
  const { templates, addTemplate, deleteTemplate, updateTemplate } = useInvoiceTemplates();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<InvoiceTemplate | null>(null);
  
  // For template creation/editing
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: null as string | null,
    invoicePrefix: '',
    currency: 'USD' as 'USD' | 'PKR',
    notes: '',
    paymentTermsDays: 14,
  });
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 500 * 1024) {
      toast.error('Logo must be less than 500KB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, companyLogo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, companyLogo: null }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleSaveCurrentAsTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    
    addTemplate({
      name: templateName.trim(),
      companyName: currentValues.companyName || undefined,
      companyLogo: currentValues.companyLogo || undefined,
      invoicePrefix: currentValues.invoicePrefix || undefined,
      currency: currentValues.currency,
      notes: currentValues.notes || undefined,
      paymentTermsDays: currentValues.paymentTermsDays,
    });
    
    toast.success('Template saved!');
    setTemplateName('');
    setSaveDialogOpen(false);
  };

  const handleApplyTemplate = (template: InvoiceTemplate) => {
    onApplyTemplate(template);
    toast.success(`Template "${template.name}" applied`);
    setLoadDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    deleteTemplate(id);
    toast.success(`Template "${name}" deleted`);
  };

  const openEditDialog = (template: InvoiceTemplate) => {
    setEditingTemplate(template);
    setFormData({
      companyName: template.companyName || '',
      companyLogo: template.companyLogo || null,
      invoicePrefix: template.invoicePrefix || '',
      currency: template.currency,
      notes: template.notes || '',
      paymentTermsDays: template.paymentTermsDays || 14,
    });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    
    updateTemplate(editingTemplate.id, {
      name: editingTemplate.name,
      companyName: formData.companyName || undefined,
      companyLogo: formData.companyLogo || undefined,
      invoicePrefix: formData.invoicePrefix || undefined,
      currency: formData.currency,
      notes: formData.notes || undefined,
      paymentTermsDays: formData.paymentTermsDays,
    });
    
    toast.success('Template updated!');
    setEditingTemplate(null);
  };

  if (!isPro) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" disabled className="opacity-50">
              <FileText className="h-4 w-4 mr-2" />
              Templates
              <Crown className="h-3 w-3 ml-2 text-amber-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Pro to save and use invoice templates</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex gap-2">
      {/* Load Template Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Load Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Load Invoice Template</DialogTitle>
            <DialogDescription>
              Select a saved template to apply its settings
            </DialogDescription>
          </DialogHeader>
          
          {templates.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No templates saved yet</p>
              <p className="text-sm">Save your current settings as a template to reuse later</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {templates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <div className="flex items-center gap-2">
                        {template.companyLogo && (
                          <img 
                            src={template.companyLogo} 
                            alt="" 
                            className="h-6 w-6 object-contain rounded"
                          />
                        )}
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex gap-2 flex-wrap">
                        {template.companyName && <span>• {template.companyName}</span>}
                        <span>• {template.currency}</span>
                        {template.paymentTermsDays && <span>• Net {template.paymentTermsDays}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(template);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id, template.name);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save your current invoice settings as a reusable template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., My Company Default"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-medium text-foreground">Settings to be saved:</p>
              <ul className="text-muted-foreground space-y-1">
                {currentValues.companyName && <li>• Company: {currentValues.companyName}</li>}
                {currentValues.companyLogo && <li>• Company Logo</li>}
                {currentValues.invoicePrefix && <li>• Invoice Prefix: {currentValues.invoicePrefix}</li>}
                <li>• Currency: {currentValues.currency}</li>
                {currentValues.notes && <li>• Default Notes</li>}
                {currentValues.paymentTermsDays && <li>• Payment Terms: Net {currentValues.paymentTermsDays}</li>}
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveCurrentAsTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the settings for "{editingTemplate?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {/* Company Name */}
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                placeholder="Your Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Company Logo</Label>
              {formData.companyLogo ? (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img 
                    src={formData.companyLogo} 
                    alt="Logo preview" 
                    className="h-12 w-auto max-w-[100px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="edit-logo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              )}
            </div>
            
            {/* Invoice Prefix */}
            <div className="space-y-2">
              <Label>Invoice Prefix</Label>
              <Input
                placeholder="e.g., INV, PROJ"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData(prev => ({ ...prev, invoicePrefix: e.target.value }))}
              />
            </div>
            
            {/* Currency */}
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value: 'USD' | 'PKR') => setFormData(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Payment Terms */}
            <div className="space-y-2">
              <Label>Payment Terms (Days)</Label>
              <Select 
                value={String(formData.paymentTermsDays)} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTermsDays: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Net 7 (1 week)</SelectItem>
                  <SelectItem value="14">Net 14 (2 weeks)</SelectItem>
                  <SelectItem value="30">Net 30 (1 month)</SelectItem>
                  <SelectItem value="45">Net 45</SelectItem>
                  <SelectItem value="60">Net 60 (2 months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <Label>Default Notes</Label>
              <Textarea
                placeholder="Default payment instructions, terms, etc."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
