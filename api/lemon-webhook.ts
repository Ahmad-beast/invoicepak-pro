import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const getFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    ) as ServiceAccount;
    
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
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// Subscription event types we handle
type SubscriptionEventType = 
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused'
  | 'subscription_unpaused';

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
      status: string;
      card_brand: string | null;
      card_last_four: string | null;
      pause: null | object;
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
    };
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.LEMON_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('Missing LEMON_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    
    // Get signature from headers
    const signature = req.headers['x-signature'] as string;
    
    if (!signature) {
      console.error('Missing webhook signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse the webhook payload
    const payload: LemonSqueezyWebhookPayload = typeof req.body === 'string' 
      ? JSON.parse(req.body) 
      : req.body;

    const eventName = payload.meta.event_name;
    const subscriptionData = payload.data.attributes;
    const subscriptionId = payload.data.id;
    const userId = payload.meta.custom_data?.user_id;

    console.log(`Processing webhook event: ${eventName} for subscription: ${subscriptionId}`);

    if (!userId) {
      console.error('No user_id in webhook custom_data');
      return res.status(400).json({ error: 'Missing user_id in custom_data' });
    }

    // Initialize Firestore
    const db = getFirebaseAdmin();

    // Determine plan and status based on event
    let plan: 'free' | 'pro' = 'free';
    let subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'paused' | null = null;

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'subscription_unpaused':
        if (subscriptionData.status === 'active') {
          plan = 'pro';
          subscriptionStatus = 'active';
        } else if (subscriptionData.status === 'paused') {
          plan = 'pro'; // Keep pro during pause
          subscriptionStatus = 'paused';
        }
        break;
      
      case 'subscription_cancelled':
        // User keeps access until end of period
        plan = 'pro';
        subscriptionStatus = 'cancelled';
        break;
      
      case 'subscription_expired':
        plan = 'free';
        subscriptionStatus = 'expired';
        break;
      
      case 'subscription_paused':
        plan = 'pro'; // Keep pro during pause
        subscriptionStatus = 'paused';
        break;
    }

    // Update user document in Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      plan,
      subscriptionStatus,
      lemonCustomerId: String(subscriptionData.customer_id),
      subscriptionId: subscriptionId,
      variantId: String(subscriptionData.variant_id),
      currentPeriodEnd: subscriptionData.renews_at 
        ? Timestamp.fromDate(new Date(subscriptionData.renews_at))
        : subscriptionData.ends_at 
          ? Timestamp.fromDate(new Date(subscriptionData.ends_at))
          : null,
      customerPortalUrl: subscriptionData.urls.customer_portal,
      updatePaymentMethodUrl: subscriptionData.urls.update_payment_method,
      updatedAt: Timestamp.now(),
    }, { merge: true });

    // Also store in subscriptions collection for history
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.set({
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
    }, { merge: true });

    console.log(`Successfully processed ${eventName} for user ${userId}`);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Vercel config to get raw body
export const config = {
  api: {
    bodyParser: false,
  },
};
