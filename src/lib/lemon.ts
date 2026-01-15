// Lemon Squeezy configuration
// All API calls go through Vercel serverless functions

import { auth } from '@/lib/firebase';

export const LEMON_CONFIG = {
  storeId: import.meta.env.VITE_LEMON_STORE_ID || '',
  proVariantId: import.meta.env.VITE_LEMON_PRO_VARIANT_ID || '',
};

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface PortalResponse {
  portalUrl: string;
  updatePaymentUrl?: string;
}

type ApiErrorShape = {
  error?: string;
  details?: string;
};

const parseApiErrorMessage = async (response: Response): Promise<string> => {
  const raw = await response.text();
  try {
    const json = JSON.parse(raw) as ApiErrorShape;
    return json?.error || json?.details || raw || `Request failed (${response.status})`;
  } catch {
    return raw || `Request failed (${response.status})`;
  }
};

/**
 * Create a checkout session via Vercel serverless function.
 * Auth is derived from the Firebase session (ID token).
 */
export const createCheckout = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Unauthorized');
  }

  const idToken = await user.getIdToken();

  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    // Server reads userId/email from Firebase token; keep body minimal.
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const message = await parseApiErrorMessage(response);
    throw new Error(message);
  }

  const data: CheckoutResponse = await response.json();
  if (!data?.checkoutUrl) {
    throw new Error('Checkout URL missing from response');
  }

  return data.checkoutUrl;
};

/**
 * Get customer portal URL via Vercel serverless function
 */
export const getCustomerPortal = async (userId: string): Promise<PortalResponse | null> => {
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

    const data: PortalResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting portal URL:', error);
    return null;
  }
};

