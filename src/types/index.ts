export type UserRole = 'client' | 'operator' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  fullName: string;
  nationalId: string;
  phone: string;
  location: string;
  country: string;
  role: UserRole;
  // Operator-specific
  utbLicenseNumber?: string;
  utbLicenseExpiry?: string;
  companyName?: string;
  companyAddress?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  profileImageUrl?: string;
}

export interface Itinerary {
  id: string;
  operatorId: string;
  operatorName: string;
  title: string;
  description: string;
  durationDays: number;
  priceUSD: number;
  currency: string;
  destinations: string[];        // e.g. ["Bwindi", "Queen Elizabeth NP"]
  highlights: string[];
  includes: string[];
  excludes: string[];
  imageUrls: string[];           // Cloudinary URLs
  coverImageUrl: string;
  maxGroupSize: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  category: 'Gorilla Trekking' | 'Wildlife Safari' | 'Cultural' | 'Birding' | 'Multi-Country' | 'Custom';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookingCount: number;
}

export interface Booking {
  id: string;
  itineraryId: string;
  itineraryTitle: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  operatorId: string;
  travelDate: string;
  numberOfGuests: number;
  totalPriceUSD: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username: string;
  fullName: string;
  nationalId: string;
  phone: string;
  location: string;
  country: string;
  role: UserRole;
  utbLicenseNumber?: string;
  utbLicenseExpiry?: string;
  companyName?: string;
  companyAddress?: string;
}
