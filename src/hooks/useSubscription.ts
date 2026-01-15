import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { PlanType, PLAN_LIMITS, UserSubscription, LEMON_SQUEEZY_CONFIG } from '@/types/subscription';
import { toast } from 'sonner';

// Create checkout via Vercel serverless function
const createCheckoutSession = async (userId: string, email: string, variantId: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        variantId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Checkout error:', error);
      return null;
    }

    const data = await response.json();
    return data.checkoutUrl;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};

// Get customer portal URL via Vercel serverless function
const getCustomerPortalUrl = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.portalUrl;
  } catch (error) {
    console.error('Error getting portal URL:', error);
    return null;
  }
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
      toast.loading('Creating checkout session...');
      
      // Create checkout via Vercel serverless function
      const checkoutUrl = await createCheckoutSession(
        user.uid,
        user.email || '',
        LEMON_SQUEEZY_CONFIG.proVariantId
      );
      
      if (checkoutUrl) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = checkoutUrl;
      } else {
        toast.dismiss();
        toast.error('Failed to create checkout. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.dismiss();
      toast.error('Failed to start checkout. Please try again.');
    }
  }, [user]);

  const manageSubscription = useCallback(async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      toast.loading('Opening customer portal...');
      
      const portalUrl = await getCustomerPortalUrl(user.uid);
      
      if (portalUrl) {
        toast.dismiss();
        window.open(portalUrl, '_blank');
      } else {
        toast.dismiss();
        toast.error('No active subscription found');
      }
    } catch (error) {
      console.error('Error getting portal:', error);
      toast.dismiss();
      toast.error('Failed to open customer portal');
    }
  }, [user]);

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
