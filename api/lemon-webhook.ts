import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (singleton pattern)
const getFirebaseAdmin = () => {
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
  return getFirestore();
};

// Verify Lemon Squeezy webhook signature using HMAC SHA256
const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    if (signature.length !== digest.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(digest, 'hex')
    );
  } catch {
    return false;
  }
};

// Subscription event types we handle
type SubscriptionEventType =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused'
  | 'subscription_payment_success'
  | 'subscription_payment_failed';

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: SubscriptionEventType;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'on_trial';
      card_brand: string | null;
      card_last_four: string | null;
      pause: null | { resumes_at: string };
      cancelled: boolean;
      trial_ends_at: string | null;
      billing_anchor: number;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
      urls: {
        update_payment_method: string;
        customer_portal: string;
      };
      first_subscription_item?: {
        id: number;
        subscription_id: number;
        price_id: number;
      };
    };
  };
}

// Get raw body from request for signature verification
async function getRawBody(req: VercelRequest): Promise<string> {
  // If body is already parsed as string, use it
  if (typeof req.body === 'string') {
    return req.body;
  }
  
  // If body is an object (already parsed by Vercel), stringify it
  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }
  
  // Read raw body from stream
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.LEMON_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing LEMON_WEBHOOK_SECRET environment variable');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await getRawBody(req);

    // Get signature from headers (Lemon Squeezy uses X-Signature)
    const signature = req.headers['x-signature'] as string;

    if (!signature) {
      console.error('Missing webhook signature header');
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse the webhook payload
    const payload: LemonSqueezyWebhookPayload = JSON.parse(rawBody);

    const eventName = payload.meta.event_name;
    const subscriptionData = payload.data.attributes;
    const subscriptionId = payload.data.id;
    const userId = payload.meta.custom_data?.user_id;

    console.log(`[Webhook] Processing event: ${eventName} for subscription: ${subscriptionId}`);

    if (!userId) {
      console.error('[Webhook] No user_id in custom_data');
      // Return 200 to acknowledge receipt even if we can't process
      // This prevents Lemon Squeezy from retrying
      return res.status(200).json({ 
        success: false, 
        message: 'No user_id in custom_data - webhook acknowledged but not processed' 
      });
    }

    // Initialize Firestore
    const db = getFirebaseAdmin();

    // Determine plan and status based on event
    let plan: 'free' | 'pro' = 'free';
    let subscriptionStatus = subscriptionData.status;

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'subscription_unpaused':
      case 'subscription_payment_success':
        if (subscriptionData.status === 'active' || subscriptionData.status === 'on_trial') {
          plan = 'pro';
        } else if (subscriptionData.status === 'paused') {
          // Keep pro access during pause
          plan = 'pro';
        }
        break;

      case 'subscription_cancelled':
        // User keeps access until end of billing period
        plan = 'pro';
        break;

      case 'subscription_expired':
      case 'subscription_payment_failed':
        plan = 'free';
        break;

      case 'subscription_paused':
        // Keep pro during pause but mark status
        plan = 'pro';
        break;
    }

    // Update user document in Firestore
    const userRef = db.collection('users').doc(userId);
    const userUpdate: Record<string, unknown> = {
      plan,
      subscriptionStatus,
      lemonCustomerId: String(subscriptionData.customer_id),
      subscriptionId: subscriptionId,
      variantId: String(subscriptionData.variant_id),
      customerPortalUrl: subscriptionData.urls.customer_portal,
      updatePaymentMethodUrl: subscriptionData.urls.update_payment_method,
      updatedAt: Timestamp.now(),
    };

    // Set currentPeriodEnd based on subscription state
    if (subscriptionData.renews_at) {
      userUpdate.currentPeriodEnd = Timestamp.fromDate(new Date(subscriptionData.renews_at));
    } else if (subscriptionData.ends_at) {
      userUpdate.currentPeriodEnd = Timestamp.fromDate(new Date(subscriptionData.ends_at));
    }

    await userRef.set(userUpdate, { merge: true });

    // Also store in subscriptions collection for history/audit
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.set(
      {
        subscriptionId,
        userId,
        customerId: String(subscriptionData.customer_id),
        productId: String(subscriptionData.product_id),
        variantId: String(subscriptionData.variant_id),
        status: subscriptionData.status,
        renewsAt: subscriptionData.renews_at
          ? Timestamp.fromDate(new Date(subscriptionData.renews_at))
          : null,
        endsAt: subscriptionData.ends_at
          ? Timestamp.fromDate(new Date(subscriptionData.ends_at))
          : null,
        cancelled: subscriptionData.cancelled,
        testMode: subscriptionData.test_mode,
        createdAt: Timestamp.fromDate(new Date(subscriptionData.created_at)),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    console.log(`[Webhook] Successfully processed ${eventName} for user ${userId}, plan: ${plan}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    // Return 200 to prevent retries for unrecoverable errors
    return res.status(200).json({ 
      success: false, 
      message: 'Error processing webhook - acknowledged' 
    });
  }
}

// Vercel config - disable body parser to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
