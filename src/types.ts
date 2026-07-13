/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  entryTickets: number;
  miscellaneous: number;
}

export interface TouristDestination {
  id: string;
  name: string;
  state: string; // "Tamil Nadu" | "Kerala" | "Karnataka" | "Andhra Pradesh" | "Telangana" | "Puducherry"
  district: string;
  overview: string;
  history: string;
  whyVisit: string;
  famousAttractions: string[];
  // Category tags (boolean or list)
  tags: {
    isHillStation: boolean;
    isBeach: boolean;
    isWaterfall: boolean;
    isForestOrNationalPark: boolean;
    isTempleOrMuseum: boolean;
    isViewpoint: boolean;
  };
  // Activities available
  activities: {
    trekking: boolean;
    boating: boolean;
    camping: boolean;
    shopping: boolean;
  };
  foodSpecialities: string[];
  shootingLocations: string[];
  nearbyPlaces: string[];
  bestSeason: string;
  climate: string;
  recommendedDuration: string; // e.g. "2 Days, 1 Night"
  safetyTips: string[];
  travelDistanceKm: number; // reference distance
  baseBudget: BudgetBreakdown;
}

export interface StudentRegistration {
  registerNumber: string;
  studentName: string;
  department: string;
  year: string; // "I" | "II" | "III" | "IV"
}

export interface StudentPreference {
  registerNumber: string;
  studentName: string;
  department: string;
  year: string;
  preferredState: string;
  preferredDestination: string;
  budgetRange: string; // e.g., "Low (Under ₹3,000)", "Medium (₹3,000 - ₹6,000)", "High (Above ₹6,000)"
  activities: string[];
  transportPreference: string; // "Bus" | "Train" | "Flight" | "Private Cab"
  accommodationPreference: string; // "Shared Dormitory" | "Standard Hotel" | "Luxury Resort" | "Homestay"
  foodPreference: string; // "Veg Only" | "Non-Veg Preferred" | "No Preference"
  suggestions: string;
  submissionDate: string;
  aiRecommendation?: string; // Cache the AI advice
}

export interface AdminUser {
  username: string;
  token: string;
}
