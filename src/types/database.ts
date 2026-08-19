export type UserRole = "vendor" | "manager" | "admin";

export type VerificationStatus = "unverified" | "self_claimed" | "verified";

export type MediaType = "image" | "video" | "youtube" | "vimeo";

export type InquiryStatus = "pending" | "responded" | "closed";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  primary_city: string;
  serviceable_cities: string[];
  categories: string[]; // multi-select
  bio: string | null;
  years_experience: number | null;
  team_size: number | null;
  languages: string[];
  contact_preferences: {
    phone: boolean;
    whatsapp: boolean;
    email: boolean;
    visibility: "public" | "inquiry_only";
  };
  packages: Package[];
  verification_status: VerificationStatus;
  profile_completion_score: number;
  average_rating: number;
  review_count: number;
  view_count: number;
  is_featured: boolean;
  is_active: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id?: string;
  title: string;
  description?: string;
  price_min: number;
  price_max?: number;
  currency: "INR";
  inclusions?: string[];
}

export interface MediaItem {
  id: string;
  vendor_id: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  vendor_id: string;
  manager_id: string;
  rating: number;
  comment: string | null;
  photos: string[];
  created_at: string;
  manager?: Profile;
}

export interface Inquiry {
  id: string;
  vendor_id: string;
  manager_id: string;
  message: string;
  event_date?: string | null;
  event_type?: string | null;
  city?: string | null;
  budget_range?: string | null;
  status: InquiryStatus;
  created_at: string;
}

export interface Favorite {
  manager_id: string;
  vendor_id: string;
  created_at: string;
}

// Constants
export const CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "All India",
] as const;

export const CATEGORIES = [
  "Production",
  "Fabrication",
  "Printing",
  "Sound",
  "Lights",
  "AV",
  "Pyro",
  "Security",
  "Security Equipment",
  "Photo/Video",
  "Anchors",
  "Wedding Decor",
  "Furniture",
  "Car Rentals",
  "Teleprompters",
  "Power Management",
  "Vanity Vans",
] as const;

export type City = (typeof CITIES)[number];
export type Category = (typeof CATEGORIES)[number];
