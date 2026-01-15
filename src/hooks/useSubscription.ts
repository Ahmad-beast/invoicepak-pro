import { useState } from 'react';
import { PlanType, PLAN_LIMITS } from '@/types/subscription';

// Simple static subscription hook - no database dependency
export const useSubscription = () => {
  // Static state - always free plan for now
  const [planType] = useState<PlanType>('free');
  const [invoiceCount] = useState(0);

  const subscription = {
    id: 'static',
    userId: 'static',
    planType,
    invoiceCountThisMonth: invoiceCount,
    monthResetDate: new Date().toISOString(),
    subscriptionStartDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const canCreateInvoice = () => true; // Always allow for now
  const getRemainingInvoices = () => Infinity;
  const incrementInvoiceCount = async () => {};
  const upgradeToPro = async () => {
    // Placeholder - would redirect to payment
    console.log('Upgrade to Pro clicked');
  };
  const canUseFeature = (feature: 'customExchangeRate' | 'invoiceSharing' | 'removeBranding') => {
    return PLAN_LIMITS[planType][feature];
  };

  return {
    subscription,
    loading: false,
    canCreateInvoice,
    getRemainingInvoices,
    incrementInvoiceCount,
    upgradeToPro,
    canUseFeature,
    planLimits: PLAN_LIMITS[planType],
  };
};
