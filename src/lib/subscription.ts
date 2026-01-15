// Subscription utilities and type definitions

export type PlanType = 'free' | 'pro';

export type SubscriptionStatus = 
  | 'active' 
  | 'cancelled' 
  | 'expired' 
  | 'past_due' 
  | 'unpaid' 
  | 'on_trial' 
  | 'paused';

export interface UserSubscription {
  userId: string;
  email: string;
  lemonCustomerId?: string;
  plan: PlanType;
  subscriptionStatus: SubscriptionStatus | null;
  currentPeriodEnd: Date | null;
  subscriptionId?: string;
  variantId?: string;
  invoiceCountThisMonth: number;
  monthResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
  customerPortalUrl?: string;
  updatePaymentMethodUrl?: string;
}

export const PLAN_LIMITS = {
  free: {
    maxInvoicesPerMonth: 5,
    customExchangeRate: false,
    invoiceSharing: false,
    removeBranding: false,
    label: 'Free',
  },
  pro: {
    maxInvoicesPerMonth: Infinity,
    customExchangeRate: true,
    invoiceSharing: true,
    removeBranding: true,
    label: 'Pro',
  },
} as const;

export type PlanFeature = keyof typeof PLAN_LIMITS.free;

/**
 * Check if a user has access to a specific feature
 */
// Active subscription statuses that grant Pro access
const ACTIVE_STATUSES: SubscriptionStatus[] = ['active', 'on_trial', 'paused'];

/**
 * Check if subscription status grants Pro access
 */
export const isActiveSubscription = (status: SubscriptionStatus | null): boolean => {
  return status !== null && ACTIVE_STATUSES.includes(status);
};

/**
 * Check if a user has access to a specific feature
 */
export const hasFeatureAccess = (
  plan: PlanType,
  status: SubscriptionStatus | null,
  feature: 'customExchangeRate' | 'invoiceSharing' | 'removeBranding'
): boolean => {
  if (plan === 'pro' && isActiveSubscription(status)) {
    return PLAN_LIMITS.pro[feature];
  }
  return PLAN_LIMITS.free[feature];
};

/**
 * Check if user can create more invoices
 */
export const canCreateMoreInvoices = (
  plan: PlanType,
  status: SubscriptionStatus | null,
  currentCount: number
): boolean => {
  if (plan === 'pro' && isActiveSubscription(status)) {
    return true;
  }
  return currentCount < PLAN_LIMITS.free.maxInvoicesPerMonth;
};

/**
 * Get remaining invoice count
 */
export const getRemainingInvoiceCount = (
  plan: PlanType,
  status: SubscriptionStatus | null,
  currentCount: number
): number => {
  if (plan === 'pro' && isActiveSubscription(status)) {
    return Infinity;
  }
  return Math.max(0, PLAN_LIMITS.free.maxInvoicesPerMonth - currentCount);
};

/**
 * Check if user is on Pro plan with active subscription
 */
export const isProUser = (
  plan: PlanType,
  status: SubscriptionStatus | null
): boolean => {
  return plan === 'pro' && isActiveSubscription(status);
};
