export interface SignupProfile {
  firstName: string;
  lastName: string;
  nationality: string;
  age: string;
  email: string;
}

export type BudgetLevel = "Budget" | "Moderate" | "Luxury";
export type TransportPreference = "Public Transport Only" | "Taxi is Okay";
export type TravelGroup = "Solo" | "Couple" | "Friends" | "Family";
export type TimeSlot = "Morning" | "Afternoon" | "Evening";

export type TravelPurpose =
  | "Rest"
  | "Shopping"
  | "Culture"
  | "Cafe"
  | "Food"
  | "Instagram"
  | "Nightlife"
  | "SlowLocal";

export type FoodType = "Korean Focus" | "Asian Variety" | "Western Friendly";
export type DietaryPreference = "No Restriction" | "Vegan" | "Halal" | "No Spicy";
export type DiscoveryStyle = "Famous Spots" | "Hidden Gems" | "Mix";

export interface UserProfile {
  nationality: string;
  language: string;
  arrivalDate: string;
  departureDate: string;
  baseArea: string;
  transportPreference: TransportPreference;
  budgetLevel: BudgetLevel;
  travelGroup: TravelGroup;
  travelPurposes: TravelPurpose[];
  foodType: FoodType;
  dietaryPreferences: DietaryPreference[];
  discoveryStyle: DiscoveryStyle;
  generateCount: number;
}

export interface SwipePlace {
  id: string;
  name: string;
  area: string;
  description: string;
  imageUrl: string;
  tags: string[];
  budgetLevel: BudgetLevel;
  seasonFit: string[];
}

export interface PreferenceScore {
  indoor: number;
  outdoor: number;
  energetic: number;
  calm: number;
  trendy: number;
  classic: number;
  shopping: number;
  experience: number;
}

export interface Place {
  id: string;
  name: string;
  area: string;
  category: string;
  tags: string[];
  budgetLevel: BudgetLevel;
  recommendedTime: TimeSlot;
  googleMapsQuery: string;
  practicalTip: string;
}

export interface TripPlanSection {
  timeSlot: TimeSlot;
  places: Place[];
}

export interface TripPlan {
  id: string;
  title: string;
  baseArea: string;
  sections: TripPlanSection[];
  totalBudgetLevel: BudgetLevel;
  fitReason: string;
}

export type TravelPersona =
  | "Indoor Trend Seeker"
  | "Culture Explorer"
  | "Slow Healing Traveler"
  | "Active Hotspot Hunter";

export interface PreferenceResult {
  persona: TravelPersona;
  description: string;
  topTags: string[];
  vibe: string;
}

export interface Review {
  id: string;
  created_at: string;
  nickname: string;
  persona: string;
  plan_id: string;
  rating: number;
  body: string;
  spots_visited: string[];
  likes_count: number;
}

export interface ReviewComment {
  id: string;
  created_at: string;
  review_id: string;
  nickname: string;
  body: string;
}

export interface Question {
  id: string;
  created_at: string;
  nickname: string;
  title: string;
  body: string;
  tags: string[];
  answer_count?: number;
}

export interface Answer {
  id: string;
  created_at: string;
  question_id: string;
  nickname: string;
  body: string;
  is_local: boolean;
}
