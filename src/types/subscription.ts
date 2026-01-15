export type PlanType = 'free' | 'pro';

export interface UserSubscription {
  id: string;
  userId: string;
  planType: PlanType;
  invoiceCountThisMonth: number;
  monthResetDate: string;
  subscriptionStartDate: string;
  updatedAt: string;
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
