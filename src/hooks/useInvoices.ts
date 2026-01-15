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

const USD_TO_PKR_RATE = 278.50;

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

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const createInvoice = async (data: Omit<Invoice, 'id' | 'userId' | 'createdAt' | 'invoiceNumber' | 'convertedAmount' | 'conversionRate'>) => {
    if (!user) return null;

    const convertedAmount = data.currency === 'USD' 
      ? data.amount * USD_TO_PKR_RATE 
      : data.amount / USD_TO_PKR_RATE;

    try {
      const docRef = await addDoc(collection(db, 'invoices'), {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        invoiceNumber: generateInvoiceNumber(),
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        conversionRate: USD_TO_PKR_RATE,
        invoiceDate: data.invoiceDate || new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
        senderName: data.senderName || '',
        notes: data.notes || '',
      });

      return { id: docRef.id };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    try {
      await updateDoc(doc(db, 'invoices', id), { status });
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const getConversionRate = () => USD_TO_PKR_RATE;

  return { invoices, loading, createInvoice, updateInvoiceStatus, deleteInvoice, getConversionRate };
};
