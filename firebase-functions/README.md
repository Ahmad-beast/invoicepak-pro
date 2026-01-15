# Firebase Cloud Functions for Lemon Squeezy Integration

This folder contains the Firebase Cloud Functions code for handling Lemon Squeezy webhooks and subscription management.

## Setup Instructions

### 1. Initialize Firebase Functions

```bash
# Navigate to your Firebase project root
cd your-firebase-project

# Initialize Functions if not already done
firebase init functions

# Choose TypeScript
```

### 2. Install Dependencies

```bash
cd functions
npm install crypto
```

### 3. Set Environment Variables

```bash
# Set your secrets using Firebase Functions config
firebase functions:config:set lemon.api_key="YOUR_LEMON_SQUEEZY_API_KEY"
firebase functions:config:set lemon.webhook_secret="YOUR_LEMON_SQUEEZY_WEBHOOK_SECRET"
firebase functions:config:set lemon.store_id="YOUR_STORE_ID"
```

### 4. Deploy Functions

```bash
firebase deploy --only functions
```

### 5. Configure Lemon Squeezy Webhook

1. Go to Lemon Squeezy Dashboard → Settings → Webhooks
2. Add your webhook URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/lemonSqueezyWebhook`
3. Select events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_resumed`
   - `subscription_paused`
4. Copy the signing secret and add it to Firebase config

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `LEMON_SQUEEZY_API_KEY` | Your Lemon Squeezy API key |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook signing secret |
| `LEMON_SQUEEZY_STORE_ID` | Your store ID |

## Firestore Collections

The functions will update these collections:

### `users/{userId}`
```typescript
{
  userId: string;
  email: string;
  lemonCustomerId: string;
  plan: 'free' | 'pro';
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'past_due' | 'unpaid' | 'on_trial';
  currentPeriodEnd: Timestamp;
  subscriptionId: string;
  variantId: string;
  invoiceCountThisMonth: number;
  monthResetDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `subscriptions/{subscriptionId}`
```typescript
{
  subscriptionId: string;
  userId: string;
  customerId: string;
  productId: string;
  variantId: string;
  status: string;
  renewsAt: Timestamp | null;
  endsAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Testing

1. Use Lemon Squeezy's webhook testing feature
2. Or use ngrok for local testing:
   ```bash
   ngrok http 5001
   ```

## Troubleshooting

- Check Firebase Functions logs: `firebase functions:log`
- Verify webhook secret is correct
- Ensure Firestore rules allow function writes
