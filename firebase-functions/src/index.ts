/**
 * Firebase Cloud Functions for Lemon Squeezy Subscription Integration
 * 
 * Deploy these functions to your Firebase project:
 * firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Lemon Squeezy webhook event types
type LemonSqueezyEvent = 
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_expired'
  | 'subscription_resumed'
  | 'subscription_paused'
  | 'subscription_payment_success'
  | 'subscription_payment_failed';

interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: LemonSqueezyEvent;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      product_id: number;
      variant_id: number;
      status: string;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      user_email?: string;
      first_subscription_item?: {
        id: number;
        subscription_id: number;
        price_id: number;
        quantity: number;
      };
    };
  };
}

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Map Lemon Squeezy status to our status
function mapStatus(lemonStatus: string): string {
  const statusMap: Record<string, string> = {
    'active': 'active',
    'on_trial': 'on_trial',
    'paused': 'cancelled',
    'past_due': 'past_due',
    'unpaid': 'unpaid',
    'cancelled': 'cancelled',
    'expired': 'expired',
  };
  return statusMap[lemonStatus] || 'cancelled';
}

// Determine plan type based on status
function getPlanType(status: string): 'free' | 'pro' {
  return ['active', 'on_trial'].includes(status) ? 'pro' : 'free';
}

/**
 * Lemon Squeezy Webhook Handler
 * 
 * This function receives webhook events from Lemon Squeezy and updates
 * Firestore accordingly.
 */
export const lemonSqueezyWebhook = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const webhookSecret = functions.config().lemon?.webhook_secret;
  
  if (!webhookSecret) {
    console.error('Webhook secret not configured');
    res.status(500).send('Server configuration error');
    return;
  }

  // Get signature from headers
  const signature = req.headers['x-signature'] as string;
  
  if (!signature) {
    console.error('Missing webhook signature');
    res.status(401).send('Unauthorized');
    return;
  }

  // Verify signature
  const rawBody = JSON.stringify(req.body);
  const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
  
  if (!isValid) {
    console.error('Invalid webhook signature');
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const payload: LemonSqueezyWebhookPayload = req.body;
    const eventName = payload.meta.event_name;
    const subscriptionData = payload.data.attributes;
    const subscriptionId = payload.data.id;
    
    // Get user ID from custom data
    const userId = payload.meta.custom_data?.user_id;
    
    if (!userId) {
      console.error('No user_id in webhook custom_data');
      res.status(400).send('Missing user_id');
      return;
    }

    console.log(`Processing ${eventName} for user ${userId}`);

    // Parse dates
    const renewsAt = subscriptionData.renews_at 
      ? admin.firestore.Timestamp.fromDate(new Date(subscriptionData.renews_at))
      : null;
    const endsAt = subscriptionData.ends_at
      ? admin.firestore.Timestamp.fromDate(new Date(subscriptionData.ends_at))
      : null;
    const currentPeriodEnd = renewsAt || endsAt;

    // Determine status and plan
    const status = mapStatus(subscriptionData.status);
    const plan = getPlanType(status);

    // Update subscription document
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.set({
      subscriptionId,
      userId,
      customerId: String(subscriptionData.customer_id),
      productId: String(subscriptionData.product_id),
      variantId: String(subscriptionData.variant_id),
      status,
      renewsAt,
      endsAt,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(subscriptionData.created_at)),
      updatedAt: admin.firestore.Timestamp.now(),
    }, { merge: true });

    // Update user document
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    const userUpdate: Record<string, any> = {
      plan,
      subscriptionStatus: status,
      lemonCustomerId: String(subscriptionData.customer_id),
      subscriptionId,
      variantId: String(subscriptionData.variant_id),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    if (currentPeriodEnd) {
      userUpdate.currentPeriodEnd = currentPeriodEnd;
    }

    // Reset invoice count if upgrading to pro
    if (plan === 'pro' && (!userDoc.exists || userDoc.data()?.plan !== 'pro')) {
      // Keep invoice count but they now have unlimited
      console.log(`User ${userId} upgraded to Pro`);
    }

    // Handle cancellation - set plan to free at period end
    if (eventName === 'subscription_cancelled') {
      console.log(`Subscription cancelled for user ${userId}, will expire at ${endsAt?.toDate()}`);
      // Keep pro access until period end
      if (endsAt && endsAt.toDate() > new Date()) {
        userUpdate.plan = 'pro';
        userUpdate.subscriptionStatus = 'cancelled';
      }
    }

    await userRef.set(userUpdate, { merge: true });

    console.log(`Successfully processed ${eventName} for user ${userId}`);
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Get Customer Portal URL
 * 
 * This function generates a customer portal URL for managing subscriptions.
 * Call this from your frontend to get the portal link.
 */
export const getCustomerPortalUrl = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  
  try {
    // Get user's subscription
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists || !userDoc.data()?.lemonCustomerId) {
      throw new functions.https.HttpsError('not-found', 'No subscription found');
    }

    const customerId = userDoc.data()?.lemonCustomerId;
    const apiKey = functions.config().lemon?.api_key;

    if (!apiKey) {
      throw new functions.https.HttpsError('internal', 'API key not configured');
    }

    // Fetch customer portal URL from Lemon Squeezy API
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/customers/${customerId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      }
    );

    if (!response.ok) {
      throw new functions.https.HttpsError('internal', 'Failed to fetch customer data');
    }

    const customerData = await response.json();
    const portalUrl = customerData.data.attributes.urls.customer_portal;

    return { portalUrl };
    
  } catch (error) {
    console.error('Error getting portal URL:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get portal URL');
  }
});

/**
 * Create Checkout Session
 * 
 * This function creates a checkout session with proper user metadata.
 * Use this for more control over the checkout process.
 */
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;
  const variantId = data.variantId;

  if (!variantId) {
    throw new functions.https.HttpsError('invalid-argument', 'variantId is required');
  }

  const apiKey = functions.config().lemon?.api_key;
  const storeId = functions.config().lemon?.store_id;

  if (!apiKey || !storeId) {
    throw new functions.https.HttpsError('internal', 'API configuration missing');
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId,
              },
            },
            product_options: {
              redirect_url: `${data.successUrl || 'https://your-app.com/subscription?success=true'}`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Checkout creation failed:', error);
      throw new functions.https.HttpsError('internal', 'Failed to create checkout');
    }

    const checkoutData = await response.json();
    const checkoutUrl = checkoutData.data.attributes.url;

    return { checkoutUrl };
    
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

/**
 * Sync Subscription Status
 * 
 * This function can be called periodically to sync subscription status
 * from Lemon Squeezy (in case webhooks are missed).
 */
export const syncSubscriptionStatus = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    const apiKey = functions.config().lemon?.api_key;
    
    if (!apiKey) {
      console.error('API key not configured');
      return;
    }

    try {
      // Get all active subscriptions from Firestore
      const subscriptionsSnapshot = await db.collection('subscriptions')
        .where('status', 'in', ['active', 'on_trial', 'past_due'])
        .get();

      for (const doc of subscriptionsSnapshot.docs) {
        const subscription = doc.data();
        
        try {
          // Fetch current status from Lemon Squeezy
          const response = await fetch(
            `https://api.lemonsqueezy.com/v1/subscriptions/${subscription.subscriptionId}`,
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/vnd.api+json',
              },
            }
          );

          if (!response.ok) continue;

          const lemonData = await response.json();
          const currentStatus = mapStatus(lemonData.data.attributes.status);
          const currentPlan = getPlanType(currentStatus);

          // Update if status changed
          if (currentStatus !== subscription.status) {
            console.log(`Syncing subscription ${subscription.subscriptionId}: ${subscription.status} -> ${currentStatus}`);
            
            await doc.ref.update({
              status: currentStatus,
              updatedAt: admin.firestore.Timestamp.now(),
            });

            if (subscription.userId) {
              await db.collection('users').doc(subscription.userId).update({
                plan: currentPlan,
                subscriptionStatus: currentStatus,
                updatedAt: admin.firestore.Timestamp.now(),
              });
            }
          }
        } catch (error) {
          console.error(`Error syncing subscription ${subscription.subscriptionId}:`, error);
        }
      }

      console.log('Subscription sync completed');
      
    } catch (error) {
      console.error('Error in subscription sync:', error);
    }
  });
