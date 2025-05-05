
export interface ContactInfo {
  phone?: string;
  email?: string;
  preferredContactMethod?: 'phone' | 'email' | 'platform';
  availabilityHours?: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  showPublicly?: boolean;
  profileUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  createdAt: string;
  contactInfo?: ContactInfo;
  videos?: string[];
  audios?: string[];
  condition?: 'new' | 'like-new' | 'good' | 'used' | 'damaged';
  location?: string;
  sellerType?: 'verified' | 'new' | 'top';
  sellerId?: string;
}
