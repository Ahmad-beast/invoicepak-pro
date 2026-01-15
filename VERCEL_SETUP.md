# Vercel + Lemon Squeezy Setup Guide

This guide explains how to set up Lemon Squeezy subscriptions with Vercel Serverless Functions for InvoicePK.

## Architecture Overview

- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Vercel Serverless Functions (`/api/*`)
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore
- **Payments**: Lemon Squeezy Subscriptions

## Step 1: Lemon Squeezy Setup

### 1.1 Create a Product

1. Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com/)
2. Create a new **Subscription** product
3. Name it "InvoicePK Pro" with monthly billing
4. Set your price (e.g., $9.99/month)
5. Note down the **Variant ID** from the product settings

### 1.2 Get API Credentials

1. Go to Settings → API
2. Create a new API key
3. Copy the API key (starts with `eyJ...`)

### 1.3 Get Store ID

1. Go to Settings → Stores
2. Copy your Store ID (numeric value)

### 1.4 Set Up Webhook

1. Go to Settings → Webhooks
2. Create a new webhook:
   - **URL**: `https://your-vercel-domain.vercel.app/api/lemon-webhook`
   - **Events**: Select all subscription events:
     - subscription_created
     - subscription_updated
     - subscription_cancelled
     - subscription_resumed
     - subscription_expired
     - subscription_paused
     - subscription_unpaused
3. Copy the **Signing Secret**

## Step 2: Firebase Setup

### 2.1 Create Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **Important**: This will be used as `FIREBASE_SERVICE_ACCOUNT`

### 2.2 Firestore Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own subscription data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server can write
    }
    
    // Subscriptions are server-side only
    match /subscriptions/{subscriptionId} {
      allow read, write: if false; // Server-side only
    }
    
    // Invoices - users can read/write their own
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 3: Vercel Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `LEMON_API_KEY` | Lemon Squeezy API key | `eyJ...` |
| `LEMON_STORE_ID` | Your Lemon Squeezy store ID | `12345` |
| `LEMON_PRO_VARIANT_ID` | Pro plan variant ID | `67890` |
| `LEMON_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `https://invoicepk.vercel.app` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (stringify it) | `{"type":"service_account",...}` |

### How to set FIREBASE_SERVICE_ACCOUNT:

1. Open the downloaded service account JSON file
2. Minify/stringify it (remove all newlines)
3. Paste the entire JSON string as the environment variable value

You can use this command to stringify:
```bash
cat path/to/serviceAccount.json | jq -c
```

## Step 4: Update Frontend Configuration

Update `src/types/subscription.ts` with your actual Lemon Squeezy IDs:

```typescript
export const LEMON_SQUEEZY_CONFIG = {
  storeId: 'YOUR_STORE_ID',
  proVariantId: 'YOUR_VARIANT_ID',
  checkoutUrl: 'https://your-store.lemonsqueezy.com/checkout',
};
```

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect the repository to Vercel
3. Vercel will automatically detect the Vite config
4. The `/api` folder will be deployed as serverless functions

## API Endpoints

### POST /api/create-checkout

Creates a Lemon Squeezy checkout session.

**Request:**
```json
{
  "userId": "firebase-user-id",
  "email": "user@example.com",
  "variantId": "optional-variant-id"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://your-store.lemonsqueezy.com/checkout/..."
}
```

### POST /api/lemon-webhook

Handles Lemon Squeezy webhook events. Called automatically by Lemon Squeezy.

**Headers:**
- `x-signature`: HMAC SHA256 signature for verification

### POST /api/customer-portal

Gets the customer portal URL for managing subscriptions.

**Request:**
```json
{
  "userId": "firebase-user-id"
}
```

**Response:**
```json
{
  "portalUrl": "https://app.lemonsqueezy.com/my-orders/...",
  "updatePaymentUrl": "https://..."
}
```

## Subscription Flow

1. User clicks "Upgrade to Pro"
2. Frontend calls `/api/create-checkout`
3. User is redirected to Lemon Squeezy checkout
4. After payment, Lemon Squeezy sends webhook to `/api/lemon-webhook`
5. Webhook verifies signature and updates Firestore
6. User document is updated with `plan: 'pro'`
7. Frontend reads updated plan from Firestore

## Testing

### Test Mode

Lemon Squeezy provides test mode:
1. Enable test mode in Lemon Squeezy dashboard
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and any CVC

### Local Development

For local webhook testing:
1. Use [ngrok](https://ngrok.com/) to expose localhost
2. Update webhook URL in Lemon Squeezy to ngrok URL
3. Run `vercel dev` locally

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is correct
- Verify the domain is accessible
- Check Vercel function logs

### Signature verification failing
- Ensure `LEMON_WEBHOOK_SECRET` is set correctly
- Check for extra whitespace in the secret

### Firestore permission denied
- Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON
- Check service account has Firestore access

## Security Notes

- All secrets are stored in Vercel environment variables (not in code)
- Webhook signature is verified using HMAC SHA256
- Firestore rules prevent client-side subscription manipulation
- User can only read their own subscription data
