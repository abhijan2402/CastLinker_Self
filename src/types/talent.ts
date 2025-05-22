
// If this file doesn't exist, we need to create it with the necessary types
export type Profession = 
  | "Actor" 
  | "Director" 
  | "Producer" 
  | "Writer" 
  | "Cinematographer" 
  | "Editor" 
  | "Sound Designer" 
  | "Music Director" 
  | "Costume Designer" 
  | "Art Director" 
  | "Makeup Artist"
  | "VFX Artist"
  | "Animator"
  | "Assistant Director"
  | "Production Manager"
  | "Casting Director"
  | "Photographer"
  | "Dancer"
  | "Singer"
  | "Other";

export const PROFESSION_OPTIONS: Profession[] = [
  "Actor",
  "Director",
  "Producer",
  "Writer",
  "Cinematographer",
  "Editor",
  "Sound Designer",
  "Music Director",
  "Costume Designer",
  "Art Director",
  "Makeup Artist",
  "VFX Artist",
  "Animator",
  "Assistant Director",
  "Production Manager",
  "Casting Director",
  "Photographer",
  "Dancer",
  "Singer",
  "Other"
];

export type TalentProfile = {
  id: string;
  user_id: string;
  profession_type: Profession;
  acting_skills: string[];
  experience_years: number;
  bio: string;
  location: string;
  available_for_hire: boolean;
  portfolio_url?: string;
  showreel_url?: string;
  rating?: number;
  created_at: string;
  updated_at: string;

  // Additional properties needed by the UI components
  username?: string;
  user_role?: Profession;
  avatar?: string;
  reviews?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  isAvailable?: boolean;
  experience?: number;
  languages?: string[];
  featuredIn?: string[];
  likesCount?: number;
  userId?: string;
  joinedDate?: string;
};

export type TalentFilters = {
  searchTerm: string;
  selectedRoles: Profession[];
  selectedLocations: string[];
  experienceRange: [number, number];
  verifiedOnly: boolean;
  availableOnly: boolean;
  likesMinimum: number;
  sortBy: 'rating' | 'experience' | 'reviews' | 'likes' | 'nameAsc' | 'nameDesc';
};
