export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  serviceDescription: string;
  amount: number;
  currency: 'USD' | 'PKR';
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
}

export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}
