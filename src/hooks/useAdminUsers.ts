import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AdminUser } from '@/types/admin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all users from users collection
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      
      // Fetch all roles from user_roles collection
      const rolesRef = collection(db, 'user_roles');
      const rolesSnapshot = await getDocs(rolesRef);
      
      // Create a map of userId -> role
      const rolesMap = new Map<string, string>();
      rolesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        rolesMap.set(doc.id, data.role || 'user');
      });
      
      const usersList: AdminUser[] = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || null,
          plan: data.plan || 'free',
          subscriptionStatus: data.subscriptionStatus || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          role: (rolesMap.get(doc.id) as 'user' | 'admin') || 'user',
          isBanned: data.isBanned || false,
        };
      });
      
      setUsers(usersList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleProStatus = async (userId: string, currentPlan: 'free' | 'pro') => {
    try {
      const userRef = doc(db, 'users', userId);
      const newPlan = currentPlan === 'pro' ? 'free' : 'pro';
      
      await updateDoc(userRef, {
        plan: newPlan,
        subscriptionStatus: newPlan === 'pro' ? 'active' : null,
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, plan: newPlan, subscriptionStatus: newPlan === 'pro' ? 'active' : null }
            : user
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error toggling pro status:', err);
      return { success: false, error: 'Failed to update user plan' };
    }
  };

  const toggleBanStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      const newStatus = !currentStatus;
      
      await updateDoc(userRef, {
        isBanned: newStatus,
        updatedAt: Timestamp.now(),
      });
      
      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, isBanned: newStatus }
            : user
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error toggling ban status:', err);
      return { success: false, error: 'Failed to update user ban status' };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete from users collection
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete from user_roles collection
      await deleteDoc(doc(db, 'user_roles', userId));
      
      // Update local state
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: 'Failed to delete user' };
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    toggleProStatus,
    toggleBanStatus,
    deleteUser,
  };
};
