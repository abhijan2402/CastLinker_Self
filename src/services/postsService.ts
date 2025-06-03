import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchData, postData } from "@/api/ClientFuntion";

export type Post = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  creator_name: string | null;
  creator_profession: string | null;
  category: string;
  tags: string[];
  createdAt: string;
  updated_at: string;
  total_likes: number;
  total_applications: string;
  media_url?: string | null;
  media_type?: "image" | "video" | null;
  event_date?: string | null;
  external_url?: string | null;
  place?: string | null;
  location?: string | null;
  pincode?: string | null;
  landmark?: string | null;
  user_id: number;
};

export type PostApplication = {
  id: string;
  post_id: string;
  user_id: string;
  applied_at: string;
  profile?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
    profession_type?: string;
    location?: string;
    email?: string;
  };
};

interface LikeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("FilmCollab_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchPostById = async (id: string): Promise<Post | null> => {
  try {
    const post = await fetchData(`/api/posts/${id}`);
    return post as Post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const createPost = async (
  post: Omit<Post, "id" | "created_at" | "updated_at" | "like_count">
) => {
  try {
    const { data, error } = await supabase
      .from("FilmCollab_posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

export const updatePost = async (id: string, post: Partial<Post>) => {
  try {
    const { data, error } = await supabase
      .from("FilmCollab_posts")
      .update(post)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Post;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};

export const deletePost = async (id: string) => {
  try {
    const { error } = await supabase
      .from("FilmCollab_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

export const applyToPost = async (post_id: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_applications")
      .insert({ post_id, user_id })
      .select()
      .single();

    if (error) throw error;
    return data as PostApplication;
  } catch (error) {
    console.error("Error applying to post:", error);
    return null;
  }
};

export const checkIfApplied = async (post_id: string, user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("post_applications")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking application:", error);
    return false;
  }
};

export const getApplicationsForPost = async (post_id: string) => {
  try {
    const { data: applications, error: appsError } = await supabase
      .from("post_applications")
      .select("*")
      .eq("post_id", post_id);

    if (appsError) throw appsError;

    if (!applications || applications.length === 0) {
      return [];
    }

    const userIds = applications.map((app) => app.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, profession_type, location, email")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    const applicantsWithProfiles = applications.map((app) => {
      const profile = profiles?.find((p) => p.id === app.user_id) || null;
      return {
        ...app,
        profile,
      };
    });

    return applicantsWithProfiles as PostApplication[];
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const togglePostLike = async (post_id: string, user_id: string) => {
  try {
    const response = await postData<LikeResponse>("/api/likes/like", {
      post_id,
      user_id,
    });

    const likeres = await fetchData(`/api/likes/count/${post_id}`);
  
    console.log(likeres);
    if (response.success) {
      // Post was liked
      return true;
    } else {
      // Post already liked (i.e., this acts like an "unlike")
      return false;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const checkIfLiked = async (post_id: number, user_id: number) => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error("Error checking like:", error);
    return false;
  }
};

export const uploadPostMedia = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("post_media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post_media").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const getApplicantsByPostId = async (postId: string) => {
  try {
    const { data: applications, error: appsError } = await supabase
      .from("post_applications")
      .select("*")
      .eq("post_id", postId);

    if (appsError) throw appsError;

    if (!applications || applications.length === 0) {
      return [];
    }

    const userIds = applications.map((app) => app.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, profession_type, location, email")
      .in("id", userIds);

    if (profilesError) throw profilesError;

    // Make sure we have profiles before we try to use them
    const profileData = profiles || [];

    const applicantsWithProfiles = applications.map((app) => {
      const profile = profileData.find((p) => p.id === app.user_id) || {
        id: app.user_id,
        full_name: "User",
        avatar_url: "",
        profession_type: "Unknown",
        location: "",
        email: "",
      };

      return {
        ...app,
        profile,
      };
    });

    return applicantsWithProfiles;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
};

export const getUserProfileById = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
