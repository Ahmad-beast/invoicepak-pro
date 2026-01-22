import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  Timestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Feedback, FeedbackType } from '@/types/feedback';

export const useFeedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const feedbacksRef = collection(db, 'feedbacks');
      const feedbacksQuery = query(feedbacksRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(feedbacksQuery);
      
      const feedbacksList: Feedback[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || '',
          userEmail: data.userEmail || '',
          message: data.message || '',
          type: data.type || 'general',
          status: data.status || 'new',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      
      setFeedbacks(feedbacksList);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const submitFeedback = async (message: string, type: FeedbackType) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      await addDoc(collection(db, 'feedbacks'), {
        userId: user.uid,
        userEmail: user.email || '',
        message: message.trim(),
        type,
        status: 'new',
        createdAt: Timestamp.now(),
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error submitting feedback:', err);
      return { success: false, error: 'Failed to submit feedback' };
    }
  };

  const markAsRead = async (feedbackId: string) => {
    try {
      const feedbackRef = doc(db, 'feedbacks', feedbackId);
      await updateDoc(feedbackRef, {
        status: 'read',
      });
      
      // Update local state
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackId ? { ...f, status: 'read' } : f
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error marking feedback as read:', err);
      return { success: false, error: 'Failed to update feedback' };
    }
  };

  return {
    feedbacks,
    loading,
    error,
    refetch: fetchFeedbacks,
    submitFeedback,
    markAsRead,
  };
};
