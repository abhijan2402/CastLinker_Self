
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
export type LocationType = 'On-site' | 'Remote' | 'Hybrid';
export type RoleCategory = 'Acting' | 'Directing' | 'Production' | 'Cinematography' | 'Writing' | 'Editing' | 'Sound' | 'VFX' | 'Costume' | 'Makeup' | 'Other';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
export type PostedWithin = '24h' | '3d' | '7d' | '14d' | '30d' | 'any';

export interface Job {
  id: string;
  ztitle: string;
  company: string;
  company_logo?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  job_type: JobType;
  role_category: RoleCategory;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  location: string;
  location_type: LocationType;
  tags?: string[];
  application_deadline?: string;
  application_url?: string;
  application_email?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  created_at?: string;
  status?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  jobTypes?: JobType[];
  roleCategories?: RoleCategory[];
  experienceLevels?: ExperienceLevel[];
  postedWithin?: PostedWithin;
  locationTypes?: LocationType[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobSort {
  field: 'relevance' | 'created_at' | 'salary_max';
  direction: 'asc' | 'desc';
}
