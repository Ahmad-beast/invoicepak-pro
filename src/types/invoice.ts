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
}
