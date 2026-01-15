import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { UserSubscription, PlanType, PLAN_LIMITS } from '@/types/subscription';

const getMonthResetDate = () => {
  const now = new Date();
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return firstOfNextMonth.toISOString();
};

const isNewMonth = (monthResetDate: string) => {
  return new Date() >= new Date(monthResetDate);
};

export const useSubscription = () => {
  const { user, isAuthLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const docRef = doc(db, 'subscriptions', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<UserSubscription, 'id'>;
          
          // Check if we need to reset the monthly counter
          if (isNewMonth(data.monthResetDate)) {
            const updatedData = {
              ...data,
              invoiceCountThisMonth: 0,
              monthResetDate: getMonthResetDate(),
              updatedAt: new Date().toISOString(),
            };
            await updateDoc(docRef, updatedData);
            setSubscription({ id: user.uid, ...updatedData });
          } else {
            setSubscription({ id: user.uid, ...data });
          }
        } else {
          // Create new subscription for user
          const newSubscription: Omit<UserSubscription, 'id'> = {
            userId: user.uid,
            planType: 'free',
            invoiceCountThisMonth: 0,
            monthResetDate: getMonthResetDate(),
            subscriptionStartDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(docRef, newSubscription);
          setSubscription({ id: user.uid, ...newSubscription });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, isAuthLoading]);

  const canCreateInvoice = () => {
    if (!subscription) return false;
    const limits = PLAN_LIMITS[subscription.planType];
    return subscription.invoiceCountThisMonth < limits.maxInvoicesPerMonth;
  };

  const getRemainingInvoices = () => {
    if (!subscription) return 0;
    const limits = PLAN_LIMITS[subscription.planType];
    if (limits.maxInvoicesPerMonth === Infinity) return Infinity;
    return Math.max(0, limits.maxInvoicesPerMonth - subscription.invoiceCountThisMonth);
  };

  const incrementInvoiceCount = async () => {
    if (!user || !subscription) return;

    try {
      const docRef = doc(db, 'subscriptions', user.uid);
      const newCount = subscription.invoiceCountThisMonth + 1;
      await updateDoc(docRef, {
        invoiceCountThisMonth: newCount,
        updatedAt: new Date().toISOString(),
      });
      setSubscription({ ...subscription, invoiceCountThisMonth: newCount });
    } catch (error) {
      console.error('Error incrementing invoice count:', error);
    }
  };

  const upgradeToPro = async () => {
    if (!user || !subscription) return;

    try {
      const docRef = doc(db, 'subscriptions', user.uid);
      await updateDoc(docRef, {
        planType: 'pro' as PlanType,
        updatedAt: new Date().toISOString(),
      });
      setSubscription({ ...subscription, planType: 'pro' });
    } catch (error) {
      console.error('Error upgrading to pro:', error);
    }
  };

  const canUseFeature = (feature: 'customExchangeRate' | 'invoiceSharing' | 'removeBranding') => {
    if (!subscription) return false;
    return PLAN_LIMITS[subscription.planType][feature];
  };

  return {
    subscription,
    loading,
    canCreateInvoice,
    getRemainingInvoices,
    incrementInvoiceCount,
    upgradeToPro,
    canUseFeature,
    planLimits: subscription ? PLAN_LIMITS[subscription.planType] : PLAN_LIMITS.free,
  };
};
