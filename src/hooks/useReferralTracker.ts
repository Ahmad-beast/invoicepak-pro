import { useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getBrowserName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
};

/**
 * Tracks referral visits by reading ?ref= query parameter
 * and storing each visit in Firestore 'referrals' collection.
 * Also captures UTM params, device info, and timezone.
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
        const now = new Date();
        await addDoc(collection(db, 'referrals'), {
          source: ref.toLowerCase().trim(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          device: getDeviceType(),
          browser: getBrowserName(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          screenWidth: window.screen.width,
          utmMedium: params.get('utm_medium') || null,
          utmCampaign: params.get('utm_campaign') || null,
          timestamp: Timestamp.now(),
          date: now.toISOString().split('T')[0],
          hour: now.getHours(),
        });
        sessionStorage.setItem(sessionKey, '1');
      } catch (err) {
        console.error('Error tracking referral:', err);
      }
    };

    trackReferral();
  }, []);
};
