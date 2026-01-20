import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Announcement } from '@/types/announcement';

const ANNOUNCEMENT_DOC_PATH = 'settings/announcements';

export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, ANNOUNCEMENT_DOC_PATH);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Announcement;
          setAnnouncement(data);
        } else {
          setAnnouncement(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching announcement:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateAnnouncement = async (data: Announcement): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, ANNOUNCEMENT_DOC_PATH);
      await setDoc(docRef, data);
      return { success: true };
    } catch (err) {
      console.error('Error updating announcement:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  const clearAnnouncement = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const docRef = doc(db, ANNOUNCEMENT_DOC_PATH);
      await setDoc(docRef, { message: '', isActive: false, type: 'info' });
      return { success: true };
    } catch (err) {
      console.error('Error clearing announcement:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  return {
    announcement,
    loading,
    error,
    updateAnnouncement,
    clearAnnouncement,
  };
};
