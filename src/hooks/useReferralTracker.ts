import { useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Tracks referral visits by reading ?ref= query parameter
 * and storing each visit in Firestore 'referrals' collection.
 * Uses sessionStorage to avoid duplicate tracking per session.
 */
export const useReferralTracker = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    if (!ref) return;
    
    // Avoid duplicate tracking in same session
    const sessionKey = `ref_tracked_${ref}`;
    if (sessionStorage.getItem(sessionKey)) return;
    
    const trackReferral = async () => {
      try {
        await addDoc(collection(db, 'referrals'), {
          source: ref.toLowerCase().trim(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Timestamp.now(),
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for easy grouping
        });
        sessionStorage.setItem(sessionKey, '1');
      } catch (err) {
        console.error('Error tracking referral:', err);
      }
    };

    trackReferral();
  }, []);
};
