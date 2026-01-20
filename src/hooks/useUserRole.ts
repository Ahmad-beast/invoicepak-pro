import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/admin';

export const useUserRole = () => {
  const { user, isAuthLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    
    if (!user) {
      setRole('user');
      setLoading(false);
      return;
    }

    // Listen to user_roles collection for this user
    const roleRef = doc(db, 'user_roles', user.uid);
    
    const unsubscribe = onSnapshot(
      roleRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setRole(data.role || 'user');
        } else {
          // Create default role document if it doesn't exist
          await setDoc(roleRef, {
            userId: user.uid,
            role: 'user',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
          setRole('user');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user role:', error);
        setRole('user');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAuthLoading]);

  const isAdmin = role === 'admin';

  return {
    role,
    isAdmin,
    loading,
  };
};
