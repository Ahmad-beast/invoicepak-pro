import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserSubscription, 
  PLAN_LIMITS, 
  isProUser, 
  canCreateMoreInvoices,
  getRemainingInvoiceCount,
  hasFeatureAccess,
} from '@/lib/subscription';
import { createCheckout, getCustomerPortal } from '@/lib/lemon';
import { toast } from 'sonner';

// Initialize user subscription document
const initializeUserSubscription = async (userId: string, email: string): Promise<UserSubscription> => {
  const now = new Date();
  const monthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const subscription: UserSubscription = {
    userId,
    email,
    plan: 'free',
    subscriptionStatus: null,
    currentPeriodEnd: null,
    invoiceCountThisMonth: 0,
    monthResetDate,
    createdAt: now,
    updatedAt: now,
  };
  
  return subscription;
};

export const useSubscription = () => {
  const { user, isAuthLoading } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch/create subscription on auth change
  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const now = new Date();

          // Derive effective plan/status on client (avoid restricted writes for plan fields)
          let effectivePlan = data.plan || 'free';
          let effectiveStatus = data.subscriptionStatus || null;

          const proExpiresAt = data.proExpiresAt?.toDate ? data.proExpiresAt.toDate() : null;
          const trialEndDate = data.trialEndDate?.toDate ? data.trialEndDate.toDate() : null;
          const giftExpiryDate = proExpiresAt || trialEndDate;

          if (effectivePlan === 'pro' && data.isTrial && giftExpiryDate && now >= giftExpiryDate) {
            effectivePlan = 'free';
            effectiveStatus = 'expired';
          }

          if (effectivePlan === 'pro' && !data.isTrial && data.currentPeriodEnd?.toDate) {
            const periodEnd = data.currentPeriodEnd.toDate();
            const endedStatuses = ['cancelled', 'expired', 'past_due', 'unpaid'];
            if (now >= periodEnd && endedStatuses.includes(String(effectiveStatus))) {
              effectivePlan = 'free';
              effectiveStatus = 'expired';
            }
          }

          // Check if month needs reset (allowed user-owned usage fields)
          const monthResetDate = data.monthResetDate?.toDate() || new Date();
          let invoiceCount = data.invoiceCountThisMonth || 0;
          let newMonthResetDate = monthResetDate;

          if (now >= monthResetDate) {
            invoiceCount = 0;
            newMonthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            try {
              await updateDoc(userRef, {
                invoiceCountThisMonth: 0,
                monthResetDate: Timestamp.fromDate(newMonthResetDate),
                updatedAt: Timestamp.now(),
              });
            } catch (resetError) {
              console.error('Error resetting monthly invoice count:', resetError);
            }
          }

          setSubscription({
            userId: data.userId,
            email: data.email,
            lemonCustomerId: data.lemonCustomerId,
            plan: effectivePlan,
            subscriptionStatus: effectiveStatus,
            currentPeriodEnd: data.currentPeriodEnd?.toDate() || null,
            subscriptionId: data.subscriptionId,
            variantId: data.variantId,
            invoiceCountThisMonth: invoiceCount,
            monthResetDate: newMonthResetDate,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        } else {
          const newSub = await initializeUserSubscription(user.uid, user.email || '');
          await setDoc(userRef, {
            ...newSub,
            monthResetDate: Timestamp.fromDate(newSub.monthResetDate),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          setSubscription(newSub);
        }
      } catch (err) {
        console.error('Error processing subscription:', err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching subscription:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthLoading]);

  const canCreateInvoice = useCallback(() => {
    if (!subscription) return false;
    return canCreateMoreInvoices(
      subscription.plan,
      subscription.subscriptionStatus,
      subscription.invoiceCountThisMonth
    );
  }, [subscription]);

  const getRemainingInvoices = useCallback(() => {
    if (!subscription) return 0;
    return getRemainingInvoiceCount(
      subscription.plan,
      subscription.subscriptionStatus,
      subscription.invoiceCountThisMonth
    );
  }, [subscription]);

  const incrementInvoiceCount = useCallback(async () => {
    if (!user || !subscription) return;
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      invoiceCountThisMonth: subscription.invoiceCountThisMonth + 1,
      updatedAt: Timestamp.now(),
    });
  }, [user, subscription]);

  const upgradeToPro = useCallback(async () => {
    if (!user) {
      toast.error('Please log in to upgrade');
      return;
    }

    const toastId = toast.loading('Creating checkout session...');

    try {
      const checkoutUrl = await createCheckout();
      toast.dismiss(toastId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      const message = error instanceof Error ? error.message : 'Failed to start checkout';
      toast.error(message, { id: toastId });
    }
  }, [user]);

  const manageSubscription = useCallback(async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    const toastId = toast.loading('Opening customer portal...');

    try {
      const portal = await getCustomerPortal(user.uid);

      if (portal?.portalUrl) {
        toast.dismiss(toastId);
        window.open(portal.portalUrl, '_blank');
      } else {
        toast.error('No active subscription found', { id: toastId });
      }
    } catch (error) {
      console.error('Error getting portal:', error);
      toast.error('Failed to open customer portal', { id: toastId });
    }
  }, [user]);

  const canUseFeature = useCallback((feature: 'customExchangeRate' | 'invoiceSharing' | 'removeBranding') => {
    if (!subscription) return false;
    return hasFeatureAccess(
      subscription.plan,
      subscription.subscriptionStatus,
      feature
    );
  }, [subscription]);

  const isPro = subscription 
    ? isProUser(subscription.plan, subscription.subscriptionStatus) 
    : false;

  return {
    subscription,
    loading,
    canCreateInvoice,
    getRemainingInvoices,
    incrementInvoiceCount,
    upgradeToPro,
    manageSubscription,
    canUseFeature,
    planLimits: isPro ? PLAN_LIMITS.pro : PLAN_LIMITS.free,
    isPro,
  };
};
