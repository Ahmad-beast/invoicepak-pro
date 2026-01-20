export type UserRole = 'user' | 'admin';

export interface UserRoleRecord {
  userId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
  plan: 'free' | 'pro';
  subscriptionStatus: string | null;
  createdAt: Date;
  role: UserRole;
  isBanned?: boolean;
}
