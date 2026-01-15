// Lemon Squeezy configuration
// All API calls go through Vercel serverless functions

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

/**
 * Create a checkout session via Vercel serverless function
 */
export const createCheckout = async (
  userId: string,
  email: string,
  variantId?: string
): Promise<string | null> => {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        variantId: variantId || LEMON_CONFIG.proVariantId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Checkout error:', error);
      return null;
    }

    const data: CheckoutResponse = await response.json();
    return data.checkoutUrl;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
};

/**
 * Get customer portal URL via Vercel serverless function
 */
export const getCustomerPortal = async (
  userId: string
): Promise<PortalResponse | null> => {
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
