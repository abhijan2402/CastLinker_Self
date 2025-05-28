import { fetchData, updateData } from "@/api/ClientFuntion";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Types
type TalentProfile = {
  id: number;
  isLoggedIn: boolean;
  verified: boolean;
  token: string;
  username: string | null;
  bio: string;
  age_range: string;
  height: string;
  weight: string;
  hair_color: string;
  eye_color: string;
  languages: string;
  union_status: string;
  representation: string;
  special_skills: string;
  technical_skills: string;
  acting_skills: string;
  createdAt: string;
  updatedAt: string;

  total_connections: number;
  total_likes: number;
  total_ratings: number;
  email: string;
  user_role: string;
  user_type: string;
  avatar_url: string;
  cover_image: string;
  availableForWork: boolean;
  profile_image?: string;
  location: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
};

type ProfileFormValues = {
  bio: string;
  ageRange: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  languages: string;
  unionStatus: string;
  representation: string;
  special_skills?: string;
  technical_skills?: string;
  acting_skills?: string;
  profile_image?: string;
};

type Job = {
  // Add your actual Job type definition here
};

export const useTalentProfile = (user: any) => {
  const form = useForm<ProfileFormValues>();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const { data: profileData } = (await fetchData(
        `auth/profile?user_id=${user.id}`
      )) as {
        data: TalentProfile;
        error: any;
      };

      setProfile(profileData);

      // Update form values
      form.reset({
        bio: profileData.bio || "",
        ageRange: profileData.age_range || "",
        height: profileData.height || "",
        weight: profileData.weight || "",
        hairColor: profileData.hair_color || "",
        eyeColor: profileData.eye_color || "",
        languages: profileData.languages || "",
        unionStatus: profileData.union_status || "",
        representation: profileData.representation || "",
        special_skills: profileData.special_skills || "",
        technical_skills: profileData.technical_skills || "",
        acting_skills: profileData.acting_skills || "",
        profile_image: profileData.profile_image || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleSave = async (data: ProfileFormValues) => {
    const payload = {
      bio: data.bio,
      age_range: data.ageRange,
      height: data.height,
      weight: data.weight,
      hair_color: data.hairColor,
      eye_color: data.eyeColor,
      languages: data.languages,
      union_status: data.unionStatus,
      representation: data.representation,
      special_skills: data.special_skills || "",
      technical_skills: data.technical_skills || "",
      acting_skills: data.acting_skills || "",
      profile_image: data.profile_image || "",
    };
    console.log(payload);

    // try {
    //   const res = await updateData("auth/update-profile", payload);
    //   console.log("Profile updated:", res);
    //   await fetchProfile();
    // } catch (err) {
    //   console.error("Error saving profile:", err);
    // }
  };

  const fetchSavedJobs = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data } = (await fetchData("/api/jobs/user-saved-jobs")) as {
        success: boolean;
        data: Job[];
      };
      setSavedJobs(data || []);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const UpdateSocialLinks = useCallback(
    async (data: any) => {
      const payload = {
        website: data.website,
        twitter: data.twitter,
        instagram: data.instagram,
        linkedin: data.linkedin,
        youtube: data.youtube,
      };

      try {
        const res = await updateData("auth/update-social-links", payload);
        if (res) {
          fetchProfile();
        }
      } catch (error) {
        console.error("Failed to update social links", error);
      }
    },
    [fetchProfile]
  );

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  return {
    form,
    profile,
    handleSave,
    fetchProfile,
    fetchSavedJobs,
    savedJobs,
    isLoading,
    UpdateSocialLinks,
  };
};
