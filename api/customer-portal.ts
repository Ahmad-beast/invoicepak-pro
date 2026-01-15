import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

interface PortalRequest {
  userId: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body as PortalRequest;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get user's subscription data from Firestore
    const db = getFirebaseAdmin();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    if (!userData?.customerPortalUrl) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    return res.status(200).json({ 
      portalUrl: userData.customerPortalUrl,
      updatePaymentUrl: userData.updatePaymentMethodUrl 
    });
  } catch (error) {
    console.error('Error getting customer portal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
