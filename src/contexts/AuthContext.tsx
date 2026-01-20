import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserRole } from '@/types/admin';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isRoleLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  /**
   * Explicit auth initialization state.
   * While true, protected pages must not render.
   */
  isAuthLoading: boolean;

  /** @deprecated Use isAuthLoading */
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('user');
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!isMounted) return;

      setUser(nextUser);
      setIsAuthLoading(false);

      // Default role state
      if (!nextUser) {
        setRole('user');
        setIsRoleLoading(false);
        return;
      }

      // Fetch user data and role from Firestore
      setIsRoleLoading(true);
      (async () => {
        try {
          // Check if user is banned
          const userSnap = await getDoc(doc(db, 'users', nextUser.uid));
          if (userSnap.exists() && userSnap.data()?.isBanned === true) {
            console.log('User is banned, signing out...');
            await signOut(auth);
            alert('Your account has been suspended. Please contact support.');
            if (isMounted) {
              setUser(null);
              setRole('user');
              setIsRoleLoading(false);
            }
            return;
          }

          // Fetch role
          const roleSnap = await getDoc(doc(db, 'user_roles', nextUser.uid));
          const fetchedRole = (roleSnap.exists() ? (roleSnap.data()?.role as UserRole) : 'user') || 'user';
          console.log('Fetched User Role:', fetchedRole);
          if (isMounted) setRole(fetchedRole);
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (isMounted) setRole('user');
        } finally {
          if (isMounted) setIsRoleLoading(false);
        }
      })();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to sign in with Google';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isRoleLoading,
        isAdmin: role === 'admin',
        login,
        signup,
        signInWithGoogle,
        logout,
        isAuthLoading,
        isLoading: isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
