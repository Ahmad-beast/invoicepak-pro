import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Lemon Squeezy API configuration
const LEMON_API_KEY = process.env.LEMON_API_KEY;
const LEMON_STORE_ID = process.env.LEMON_STORE_ID;
const LEMON_VARIANT_ID = process.env.LEMON_VARIANT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://invoicepk.lovable.app';

// Initialize Firebase Admin SDK (singleton pattern)
const getFirebaseAdminAuth = () => {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
    }

    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return getAuth();
};

interface LemonCheckoutResponse {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
}

const getBearerToken = (req: VercelRequest): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Logging: incoming body
  console.log('[Checkout] Incoming body:', req.body);

  // Logging: env vars presence (boolean only)
  console.log('[Checkout] Env presence:', {
    hasLemonApiKey: Boolean(LEMON_API_KEY),
    hasLemonStoreId: Boolean(LEMON_STORE_ID),
    hasLemonVariantId: Boolean(LEMON_VARIANT_ID),
    hasAppUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    hasFirebaseServiceAccount: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
  });

  // Validate environment variables
  if (!LEMON_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  if (!LEMON_STORE_ID) {
    return res.status(500).json({ error: 'Server configuration error: Missing store ID' });
  }

  // Variant ID (critical)
  if (!LEMON_VARIANT_ID) {
    return res.status(400).json({ error: 'Variant ID missing' });
  }

  // Auth handling: verify Firebase ID token
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let userId: string | undefined;
  let email: string | undefined;

  try {
    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    userId = decoded.uid;
    // decoded.email is optional depending on provider
    email = typeof decoded.email === 'string' ? decoded.email : undefined;
  } catch (error) {
    console.error('[Checkout] Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate authenticated user
  if (!userId || !email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log(`[Checkout] Creating session for user: ${userId}, email: ${email}`);

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
              enabled_variants: [Number(LEMON_VARIANT_ID)],
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
                id: LEMON_VARIANT_ID,
              },
            },
          },
        },
      }),
    });

    // Logging: Lemon API response status
    console.log('[Checkout] Lemon API response status:', response.status);

    if (!response.ok) {
      const raw = await response.text();
      console.error('[Checkout] Lemon Squeezy API error:', response.status, raw);
      return res.status(500).json({
        error: 'Failed to create checkout session',
        details: raw,
      });
    }

    const data: LemonCheckoutResponse = await response.json();
    const checkoutUrl = data?.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error('[Checkout] Missing checkoutUrl in Lemon response:', data);
      return res.status(500).json({ error: 'Failed to create checkout session', details: 'Missing checkoutUrl' });
    }

    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('[Checkout] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

