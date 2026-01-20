export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Supported currency codes
export type CurrencyCode = 'USD' | 'PKR' | 'GBP' | 'EUR' | 'AED' | 'SAR' | 'CAD' | 'AUD';

// Currency configuration for formatting
export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  // Flag for currencies with non-Latin symbols that may not render in PDFs
  useCodeFallback?: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  serviceDescription: string; // Now used as "Project Title / Summary"
  amount: number;
  currency: CurrencyCode;
  convertedAmount: number;
  conversionRate: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  senderName: string;
  notes?: string;
  // New fields
  paidAt?: string;
  shareId?: string;
  customExchangeRate?: number;
  invoicePrefix?: string;
  // Multiple line items
  items?: InvoiceItem[];
  // Company branding (Pro feature)
  companyName?: string;
  companyLogo?: string; // Base64 image string
}

export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  // Branding
  companyName?: string;
  companyLogo?: string;
  // Defaults
  invoicePrefix?: string;
  currency: CurrencyCode;
  notes?: string;
  // Payment terms
  paymentTermsDays?: number; // e.g., 7, 14, 30 days from invoice date
  createdAt: string;
  updatedAt: string;
}
