export type BannerType = 'promotion' | 'warning' | 'new' | 'urgent';

export interface Banner {
  isActive: boolean;
  text: string;
  link?: string;
  ctaText?: string;
  type: BannerType;
}

export const BANNER_TYPE_OPTIONS: { value: BannerType; label: string }[] = [
  { value: 'promotion', label: 'Promotion/Sale' },
  { value: 'warning', label: 'Warning/Alert' },
  { value: 'new', label: 'New Feature' },
  { value: 'urgent', label: 'Urgent/Downtime' },
];
