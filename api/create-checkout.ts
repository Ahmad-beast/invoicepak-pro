import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lemon Squeezy API configuration
const LEMON_API_KEY = process.env.LEMON_API_KEY;
const LEMON_STORE_ID = process.env.LEMON_STORE_ID;
const LEMON_PRO_VARIANT_ID = process.env.LEMON_PRO_VARIANT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://invoicepk.lovable.app';

interface CheckoutRequest {
  userId: string;
  email: string;
  variantId?: string;
}

interface LemonCheckoutResponse {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!LEMON_API_KEY) {
    console.error('Missing LEMON_API_KEY environment variable');
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  if (!LEMON_STORE_ID) {
    console.error('Missing LEMON_STORE_ID environment variable');
    return res.status(500).json({ error: 'Server configuration error: Missing store ID' });
  }

  try {
    const { userId, email, variantId } = req.body as CheckoutRequest;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Missing required field: email' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Determine variant ID to use
    const finalVariantId = variantId || LEMON_PRO_VARIANT_ID;
    
    if (!finalVariantId) {
      console.error('No variant ID provided and LEMON_PRO_VARIANT_ID not set');
      return res.status(500).json({ error: 'Server configuration error: Missing variant ID' });
    }

    console.log(`[Checkout] Creating session for user: ${userId}, email: ${email}, variant: ${finalVariantId}`);

    // Create checkout session via Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${LEMON_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              custom: {
                user_id: userId,
              },
            },
            checkout_options: {
              dark: false,
              logo: true,
              embed: false,
            },
            product_options: {
              ...(Number.isFinite(Number(finalVariantId))
                ? { enabled_variants: [Number(finalVariantId)] }
                : {}),
              redirect_url: `${APP_URL.replace(/\/$/, '')}/dashboard/subscription?success=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: finalVariantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Checkout] Lemon Squeezy API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Failed to create checkout session',
        details: errorText,
      });
    }

    const data: LemonCheckoutResponse = await response.json();
    const checkoutUrl = data.data.attributes.url;

    console.log(`[Checkout] Session created successfully for user: ${userId}`);

    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('[Checkout] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
