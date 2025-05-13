export interface User {
  id: number;
  avatar_url: string;
  email: string;
  user_role: string;
  status: string;
  verified: boolean;
  user_type: string | null;
  username: string | null;
  bio: string | null;
  age_range: string | null;
  weight: string | null;
  height: string | null;
  eye_color: string | null;
  hair_color: string | null;
  union_status: string | null;
  languages: string | null;
  representation: string | null;
  physical_attributes: string | null;
  acting_skills: string | null;
  technical_skills: string | null;
  special_skills: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  avatar_url?: string;
  password?: string;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

// Define admin team roles separately from user roles
export type AdminUserRole =
  | "actor"
  | "director"
  | "producer"
  | "writer"
  | "cinematographer"
  | "agency";
export type AdminTeamRole =
  | "super_admin"
  | "moderator"
  | "content_manager"
  | "recruiter";
