export interface Announcement {
  message: string;
  isActive: boolean;
  type: 'info' | 'warning' | 'promo';
  actionLink?: string;
  actionText?: string;
}
