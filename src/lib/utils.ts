import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateProfileCompletion(profile: {
  business_name?: string | null;
  primary_city?: string | null;
  categories?: string[] | null;
  bio?: string | null;
  mediaCount?: number;
  packages?: unknown[] | null;
  contact_preferences?: unknown;
}): number {
  let score = 0;
  if (profile.business_name) score += 15;
  if (profile.primary_city) score += 10;
  if (profile.categories && profile.categories.length > 0) score += 15;
  if (profile.bio && profile.bio.length > 30) score += 15;
  if ((profile.mediaCount || 0) >= 3) score += 20;
  if (profile.packages && profile.packages.length > 0) score += 15;
  if (profile.contact_preferences) score += 10;
  return Math.min(100, score);
}
