import { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import { useAuth } from '@/contexts/AuthContext';

const USD_TO_PKR_RATE = 278.50;

export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (user) {
      const allInvoices = JSON.parse(localStorage.getItem('invoicepk_invoices') || '[]');
      const userInvoices = allInvoices.filter((inv: Invoice) => inv.userId === user.id);
      setInvoices(userInvoices);
    }
  }, [user]);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const createInvoice = (data: Omit<Invoice, 'id' | 'userId' | 'createdAt' | 'invoiceNumber' | 'convertedAmount' | 'conversionRate'>) => {
    if (!user) return null;

    const convertedAmount = data.currency === 'USD' 
      ? data.amount * USD_TO_PKR_RATE 
      : data.amount / USD_TO_PKR_RATE;

    const newInvoice: Invoice = {
      ...data,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      invoiceNumber: generateInvoiceNumber(),
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      conversionRate: USD_TO_PKR_RATE,
    };

    const allInvoices = JSON.parse(localStorage.getItem('invoicepk_invoices') || '[]');
    allInvoices.push(newInvoice);
    localStorage.setItem('invoicepk_invoices', JSON.stringify(allInvoices));
    setInvoices(prev => [...prev, newInvoice]);
    
    return newInvoice;
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    const allInvoices = JSON.parse(localStorage.getItem('invoicepk_invoices') || '[]');
    const updatedInvoices = allInvoices.map((inv: Invoice) => 
      inv.id === id ? { ...inv, status } : inv
    );
    localStorage.setItem('invoicepk_invoices', JSON.stringify(updatedInvoices));
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const deleteInvoice = (id: string) => {
    const allInvoices = JSON.parse(localStorage.getItem('invoicepk_invoices') || '[]');
    const filteredInvoices = allInvoices.filter((inv: Invoice) => inv.id !== id);
    localStorage.setItem('invoicepk_invoices', JSON.stringify(filteredInvoices));
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const getConversionRate = () => USD_TO_PKR_RATE;

  return { invoices, createInvoice, updateInvoiceStatus, deleteInvoice, getConversionRate };
};
