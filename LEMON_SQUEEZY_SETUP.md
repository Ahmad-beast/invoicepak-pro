# Lemon Squeezy Integration Setup Guide

This guide explains how to set up the Lemon Squeezy subscription integration for InvoicePK.

## Overview

The integration uses:
- **Frontend (React/Vite)**: Checkout redirect, subscription display, usage tracking
- **Firebase Auth**: User authentication
- **Cloud Firestore**: Subscription data storage
- **Firebase Cloud Functions**: Webhook handling, customer portal

## Step 1: Lemon Squeezy Setup

### 1.1 Create Your Product

1. Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com)
2. Create a new product (e.g., "InvoicePK Pro")
3. Add a subscription variant:
   - Name: "Monthly"
   - Price: ₨999/month (or your preferred price)
   - Billing interval: Monthly
4. Note down:
   - **Store ID**: Found in Settings → Stores
   - **Variant ID**: Click on your product variant and copy the ID from URL

### 1.2 Get API Key

1. Go to Settings → API Keys
2. Create a new API key with these permissions:
   - `read_subscriptions`
   - `read_customers`
   - `write_checkouts`
3. Save the API key securely

### 1.3 Set Up Webhook

1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. URL: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/lemonSqueezyWebhook`
4. Select events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_resumed`
   - `subscription_paused`
5. Save and copy the **Signing Secret**

## Step 2: Firebase Configuration

### 2.1 Update Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_LEMON_SQUEEZY_STORE_ID=your_store_id
VITE_LEMON_SQUEEZY_PRO_VARIANT_ID=your_variant_id
```

### 2.2 Deploy Cloud Functions

1. Navigate to the `firebase-functions` folder
2. Install dependencies:
   ```bash
   cd firebase-functions
   npm install
   ```
3. Set Firebase config:
   ```bash
   firebase functions:config:set \
     lemon.api_key="YOUR_API_KEY" \
     lemon.webhook_secret="YOUR_WEBHOOK_SECRET" \
     lemon.store_id="YOUR_STORE_ID"
   ```
4. Deploy:
   ```bash
   firebase deploy --only functions
   ```

### 2.3 Update Firestore Rules

Add these rules to your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Subscriptions collection - only functions can write, users can read their own
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      // Note: writes are done by Cloud Functions with admin access
    }
    
    // Products collection - anyone can read
    match /products/{productId} {
      allow read: if true;
    }
  }
}
```

## Step 3: Testing

### 3.1 Test Mode

1. Enable Test Mode in Lemon Squeezy dashboard
2. Use test card number: `4242 4242 4242 4242`
3. Any future expiry date and CVC

### 3.2 Verify Webhook

1. Create a test subscription
2. Check Firebase Functions logs:
   ```bash
   firebase functions:log --only lemonSqueezyWebhook
   ```
3. Verify Firestore updates in Firebase Console

## Flow Diagram

```
User clicks "Upgrade to Pro"
        ↓
Redirect to Lemon Squeezy Checkout
(with user_id in custom metadata)
        ↓
User completes payment
        ↓
Lemon Squeezy sends webhook
        ↓
Firebase Cloud Function:
- Verifies signature
- Updates Firestore
- Sets plan = "pro"
        ↓
User sees Pro features
```

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is correct
- Verify Firebase Functions are deployed
- Check Functions logs for errors

### Subscription not updating
- Verify `user_id` is in custom metadata
- Check Firestore rules allow function writes
- Look for errors in Functions logs

### Customer portal not working
- Ensure `lemonCustomerId` is saved in user document
- Verify API key has correct permissions

## Files Structure

```
├── src/
│   ├── types/
│   │   └── subscription.ts    # Types and config
│   ├── hooks/
│   │   └── useSubscription.ts # Subscription hook
│   └── components/
│       └── dashboard/
│           └── SubscriptionCard.tsx
├── firebase-functions/
│   ├── src/
│   │   └── index.ts           # Cloud Functions
│   ├── package.json
│   └── tsconfig.json
└── LEMON_SQUEEZY_SETUP.md     # This file
```

## Support

For issues:
1. Check Lemon Squeezy [documentation](https://docs.lemonsqueezy.com)
2. Check Firebase [Cloud Functions docs](https://firebase.google.com/docs/functions)
3. Review webhook payload in Lemon Squeezy dashboard
