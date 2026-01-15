import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lemon Squeezy API configuration
const LEMON_API_KEY = process.env.LEMON_API_KEY;
const LEMON_STORE_ID = process.env.LEMON_STORE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://invoicepk.lovable.app';

// Pro plan variant ID - update this with your actual variant ID from Lemon Squeezy
const PRO_VARIANT_ID = process.env.LEMON_PRO_VARIANT_ID || 'YOUR_VARIANT_ID';

interface CheckoutRequest {
  userId: string;
  email: string;
  variantId?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!LEMON_API_KEY || !LEMON_STORE_ID) {
    console.error('Missing Lemon Squeezy configuration');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { userId, email, variantId } = req.body as CheckoutRequest;

    // Validate required fields
    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields: userId and email' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create checkout session via Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMON_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: email,
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
              enabled_variants: [parseInt(variantId || PRO_VARIANT_ID)],
              redirect_url: `${APP_URL}/subscription?success=true`,
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
                id: variantId || PRO_VARIANT_ID,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Lemon Squeezy API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create checkout session',
        details: errorData 
      });
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
