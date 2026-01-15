export type PlanType = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'on_trial';

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
}

export interface Subscription {
  subscriptionId: string;
  userId: string;
  productId: string;
  variantId: string;
  status: SubscriptionStatus;
  renewsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  variantId: string;
  active: boolean;
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

// Lemon Squeezy configuration
export const LEMON_SQUEEZY_CONFIG = {
  // Replace with your actual Lemon Squeezy store ID and variant ID
  storeId: import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID || 'YOUR_STORE_ID',
  proVariantId: import.meta.env.VITE_LEMON_SQUEEZY_PRO_VARIANT_ID || 'YOUR_VARIANT_ID',
  checkoutUrl: 'https://invoicepk.lemonsqueezy.com/checkout/buy',
};
