import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  query,
  orderBy,
  where
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
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const rolesRef = collection(db, 'user_roles');
      const rolesSnapshot = await getDocs(rolesRef);
      
      const rolesMap = new Map<string, string>();
      rolesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        rolesMap.set(doc.id, data.role || 'user');
      });

      // Fetch invoice counts per user
      const invoicesRef = collection(db, 'invoices');
      const invoicesSnapshot = await getDocs(invoicesRef);
      const invoiceCountMap = new Map<string, number>();
      invoicesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const uid = data.userId;
        if (uid) {
          invoiceCountMap.set(uid, (invoiceCountMap.get(uid) || 0) + 1);
        }
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
          proExpiresAt: data.proExpiresAt?.toDate() || null,
          invoiceCount: invoiceCountMap.get(doc.id) || 0,
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

  const grantProAccess = async (userId: string, days: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      
      await updateDoc(userRef, {
        plan: 'pro',
        subscriptionStatus: 'active',
        proExpiresAt: Timestamp.fromDate(expiresAt),
        updatedAt: Timestamp.now(),
      });
      
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, plan: 'pro', subscriptionStatus: 'active', proExpiresAt: expiresAt }
            : user
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error granting pro access:', err);
      return { success: false, error: 'Failed to grant pro access' };
    }
  };

  const revokeProAccess = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        plan: 'free',
        subscriptionStatus: null,
        proExpiresAt: null,
        updatedAt: Timestamp.now(),
      });
      
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, plan: 'free', subscriptionStatus: null, proExpiresAt: null }
            : user
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error revoking pro access:', err);
      return { success: false, error: 'Failed to revoke pro access' };
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
      await deleteDoc(doc(db, 'users', userId));
      await deleteDoc(doc(db, 'user_roles', userId));
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
    grantProAccess,
    revokeProAccess,
    toggleBanStatus,
    deleteUser,
  };
};
