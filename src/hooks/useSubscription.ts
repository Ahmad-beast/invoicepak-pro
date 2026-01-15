import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { PlanType, PLAN_LIMITS, UserSubscription, LEMON_SQUEEZY_CONFIG } from '@/types/subscription';
import { toast } from 'sonner';

// Create checkout URL with user metadata
const createCheckoutUrl = (userId: string, email: string, variantId: string): string => {
  const checkoutData = {
    email: email,
    custom: {
      user_id: userId,
    },
  };
  
  // Encode checkout data for URL
  const encodedData = encodeURIComponent(JSON.stringify(checkoutData));
  const successUrl = encodeURIComponent(`${window.location.origin}/subscription?success=true`);
  const cancelUrl = encodeURIComponent(`${window.location.origin}/subscription?cancelled=true`);
  
  return `${LEMON_SQUEEZY_CONFIG.checkoutUrl}/${variantId}?checkout[email]=${encodeURIComponent(email)}&checkout[custom][user_id]=${userId}&success_url=${successUrl}&cancel_url=${cancelUrl}`;
};

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
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Check if month needs reset
        const monthResetDate = data.monthResetDate?.toDate() || new Date();
        const now = new Date();
        
        let invoiceCount = data.invoiceCountThisMonth || 0;
        let newMonthResetDate = monthResetDate;
        
        if (now >= monthResetDate) {
          // Reset monthly count
          invoiceCount = 0;
          newMonthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          
          await updateDoc(userRef, {
            invoiceCountThisMonth: 0,
            monthResetDate: Timestamp.fromDate(newMonthResetDate),
            updatedAt: Timestamp.now(),
          });
        }
        
        setSubscription({
          userId: data.userId,
          email: data.email,
          lemonCustomerId: data.lemonCustomerId,
          plan: data.plan || 'free',
          subscriptionStatus: data.subscriptionStatus,
          currentPeriodEnd: data.currentPeriodEnd?.toDate() || null,
          subscriptionId: data.subscriptionId,
          variantId: data.variantId,
          invoiceCountThisMonth: invoiceCount,
          monthResetDate: newMonthResetDate,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      } else {
        // Create new subscription document
        const newSub = await initializeUserSubscription(user.uid, user.email || '');
        await setDoc(userRef, {
          ...newSub,
          monthResetDate: Timestamp.fromDate(newSub.monthResetDate),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        setSubscription(newSub);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching subscription:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthLoading]);

  const canCreateInvoice = useCallback(() => {
    if (!subscription) return false;
    if (subscription.plan === 'pro' && subscription.subscriptionStatus === 'active') {
      return true;
    }
    return subscription.invoiceCountThisMonth < PLAN_LIMITS.free.maxInvoicesPerMonth;
  }, [subscription]);

  const getRemainingInvoices = useCallback(() => {
    if (!subscription) return 0;
    if (subscription.plan === 'pro' && subscription.subscriptionStatus === 'active') {
      return Infinity;
    }
    return Math.max(0, PLAN_LIMITS.free.maxInvoicesPerMonth - subscription.invoiceCountThisMonth);
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

    try {
      // Generate checkout URL with user metadata
      const checkoutUrl = createCheckoutUrl(
        user.uid,
        user.email || '',
        LEMON_SQUEEZY_CONFIG.proVariantId
      );
      
      // Redirect to Lemon Squeezy checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout. Please try again.');
    }
  }, [user]);

  const manageSubscription = useCallback(async () => {
    if (!subscription?.lemonCustomerId) {
      toast.error('No active subscription found');
      return;
    }

    // Redirect to Lemon Squeezy customer portal
    // The portal URL should be fetched from your Firebase Cloud Function
    // For now, we'll show a placeholder
    toast.info('Customer portal coming soon!');
  }, [subscription]);

  const canUseFeature = useCallback((feature: 'customExchangeRate' | 'invoiceSharing' | 'removeBranding') => {
    if (!subscription) return false;
    if (subscription.plan === 'pro' && subscription.subscriptionStatus === 'active') {
      return PLAN_LIMITS.pro[feature];
    }
    return PLAN_LIMITS.free[feature];
  }, [subscription]);

  const isPro = subscription?.plan === 'pro' && subscription?.subscriptionStatus === 'active';

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
