import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Banner } from '@/types/banner';

const BANNER_DOC_PATH = 'settings/banner';

export const useBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, BANNER_DOC_PATH);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Banner;
          setBanner(data);
        } else {
          setBanner(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching banner:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateBanner = async (data: Banner): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, BANNER_DOC_PATH);
      await setDoc(docRef, data);
      return { success: true };
    } catch (err) {
      console.error('Error updating banner:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  const clearBanner = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, BANNER_DOC_PATH);
      await setDoc(docRef, { text: '', isActive: false, link: '', ctaText: '' });
      return { success: true };
    } catch (err) {
      console.error('Error clearing banner:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  return {
    banner,
    loading,
    error,
    updateBanner,
    clearBanner,
  };
};
