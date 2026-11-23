// TypeScript interfaces matching backend models

export interface ChurchInfo {
  id: number;
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  founded_year: number | null;
  logo: string | null;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  updated_at: string;
}

export interface Pastor {
  id: number;
  name: string;
  role: 'head' | 'associate' | 'youth' | 'worship';
  bio: string;
  photo: string | null;
  photo_url?: string | null;
  photo_display_url?: string | null;
  email: string;
  phone: string;
  joined_date: string;
  is_active: boolean;
  order: number;
  sermon_count?: number;
}

export interface ServiceTime {
  id: number;
  day: string;
  time: string;
  service_type: string;
  description: string;
  is_active: boolean;
}

export interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  replied: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: 'service' | 'conference' | 'workshop' | 'retreat' | 'outreach' | 'social' | 'other';
  ministry?: Ministry | null;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  image: string | null;
  image_url?: string | null;
  image_display_url?: string;
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  is_featured: boolean;
  is_published: boolean;
  attendee_count: number;
  is_full: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event: number;
  name: string;
  email: string;
  phone: string;
  number_of_attendees: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  registered_at: string;
}

export interface Sermon {
  id: number;
  title: string;
  description: string;
  pastor: Pastor | null;
  series: SermonSeries | null;
  scripture_reference: string;
  date_preached: string;
  audio_file: string | null;
  video_url: string;
  thumbnail: string | null;
  duration: string | null;
  view_count: number;
  download_count: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SermonSeries {
  id: number;
  title: string;
  description: string;
  image: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  sermon_count?: number;
}

export interface Ministry {
  id: number;
  name: string;
  description: string;
  leader: Member | null;
  image: string | null;
  image_url: string | null;
  image_display_url: string | null;
  is_active: boolean;
  member_count: number;
  created_at: string;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  country: string;
  photo: string | null;
  membership_status: 'active' | 'inactive' | 'visitor';
  joined_date: string;
  baptism_date: string | null;
  is_active: boolean;
}

export interface Donation {
  id: number;
  member: number | null;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  category: DonationCategory | null;
  amount: string;
  currency: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'check' | 'other';
  transaction_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  is_anonymous: boolean;
  notes: string;
  donated_at: string;
  updated_at: string;
}

export interface DonationCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  image: string | null;
  start_date: string;
  end_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrayerRequest {
  id: number;
  name: string;
  email: string;
  request: string;
  is_anonymous: boolean;
  is_answered: boolean;
  member: number | null;
  created_at: string;
  updated_at: string;
}

export interface Newsletter {
  id: number;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  detail?: string;
  [key: string]: any;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  date: string;
  is_featured: boolean;
  is_published: boolean;
  photo_count: number;
  photos?: GalleryPhoto[];
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  id: number;
  album: number;
  title: string;
  description: string;
  image: string;
  thumbnail: string | null;
  photographer: string;
  date_taken: string | null;
  order: number;
  is_featured: boolean;
  created_at: string;
}
