import { UserProfile, PreferenceScore, TripPlan, SignupProfile } from "@/types";

const STORAGE_KEYS = {
  SIGNUP_PROFILE: "sns_signup_profile",
  USER_PROFILE: "sns_user_profile",
  PREFERENCE_SCORE: "sns_preference_score",
  SWIPE_RESULTS: "sns_swipe_results",
  TRIP_PLANS: "sns_trip_plans",
  GENERATE_COUNT: "sns_generate_count",
} as const;

function get<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export const storage = {
  getSignupProfile: () => get<SignupProfile>(STORAGE_KEYS.SIGNUP_PROFILE),
  setSignupProfile: (p: SignupProfile) => set(STORAGE_KEYS.SIGNUP_PROFILE, p),

  getUserProfile: () => get<UserProfile>(STORAGE_KEYS.USER_PROFILE),
  setUserProfile: (p: UserProfile) => set(STORAGE_KEYS.USER_PROFILE, p),

  getPreferenceScore: () => get<PreferenceScore>(STORAGE_KEYS.PREFERENCE_SCORE),
  setPreferenceScore: (s: PreferenceScore) => set(STORAGE_KEYS.PREFERENCE_SCORE, s),

  getSwipeResults: () => get<Record<string, boolean>>(STORAGE_KEYS.SWIPE_RESULTS),
  setSwipeResults: (r: Record<string, boolean>) => set(STORAGE_KEYS.SWIPE_RESULTS, r),

  getTripPlans: () => get<TripPlan[]>(STORAGE_KEYS.TRIP_PLANS),
  setTripPlans: (plans: TripPlan[]) => set(STORAGE_KEYS.TRIP_PLANS, plans),

  getGenerateCount: (): number => get<number>(STORAGE_KEYS.GENERATE_COUNT) ?? 0,
  incrementGenerateCount: () => {
    const count = get<number>(STORAGE_KEYS.GENERATE_COUNT) ?? 0;
    set(STORAGE_KEYS.GENERATE_COUNT, count + 1);
    return count + 1;
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(remove);
  },
};
