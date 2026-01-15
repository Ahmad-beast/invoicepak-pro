import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Invoice } from '@/types/invoice';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEFAULT_USD_TO_PKR_RATE = 278.50;

export const useInvoices = () => {
  const { user, isAuthLoading } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before doing anything
    if (isAuthLoading) {
      return;
    }

    // If no user after auth resolves, clear invoices
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    // User is authenticated, fetch their invoices
    const q = query(
      collection(db, 'invoices'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invoiceData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt:
            docSnap.data().createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        })) as Invoice[];
        setInvoices(invoiceData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAuthLoading]);

  const generateInvoiceNumber = (prefix?: string) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const baseNumber = `${year}${month}-${random}`;
    return prefix ? `${prefix}-${baseNumber}` : `INV-${baseNumber}`;
  };

  const generateShareId = () => {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  };

  const createInvoice = async (data: Omit<Invoice, 'id' | 'userId' | 'createdAt' | 'invoiceNumber' | 'convertedAmount' | 'conversionRate' | 'shareId'> & { customExchangeRate?: number; invoicePrefix?: string }) => {
    if (!user) return null;

    const conversionRate = data.customExchangeRate || DEFAULT_USD_TO_PKR_RATE;
    const convertedAmount = data.currency === 'USD' 
      ? data.amount * conversionRate 
      : data.amount / conversionRate;

    try {
      const shareId = generateShareId();
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        invoiceNumber: generateInvoiceNumber(data.invoicePrefix),
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        conversionRate: conversionRate,
        invoiceDate: data.invoiceDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
        senderName: data.senderName || '',
        notes: data.notes || '',
        shareId: shareId,
        paidAt: data.status === 'paid' ? new Date().toISOString() : null,
      });

      return { id: docRef.id, shareId };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    try {
      const updateData: Record<string, unknown> = { status };
      
      // If marking as paid, set paidAt timestamp
      if (status === 'paid') {
        updateData.paidAt = new Date().toISOString();
      } else {
        updateData.paidAt = null;
      }
      
      await updateDoc(doc(db, 'invoices', id), updateData);
      const statusLabel = status === 'paid' ? 'paid' : status === 'sent' ? 'sent' : 'draft';
      toast.success(`Invoice marked as ${statusLabel}`);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const getConversionRate = () => DEFAULT_USD_TO_PKR_RATE;

  return { invoices, loading, createInvoice, updateInvoiceStatus, deleteInvoice, getConversionRate };
};
