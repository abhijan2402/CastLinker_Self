import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "./useDebounce";
import {
  Profession,
  PROFESSION_OPTIONS,
  TalentProfile,
  TalentFilters,
} from "@/types/talent";
import { useAuth } from "@/contexts/AuthContext";
import { fetchData, postData } from "@/api/ClientFuntion";

// Default filters configuration
const DEFAULT_FILTERS: TalentFilters = {
  searchTerm: "",
  selectedRoles: [],
  selectedLocations: [],
  experienceRange: [0, 30],
  verifiedOnly: false,
  availableOnly: false,
  likesMinimum: 0,
  sortBy: "rating",
};

type ChatResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    is_read: boolean;
  };
};

export const useTalentDirectory = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([]);
  const [filters, setFilters] = useState<TalentFilters>({ ...DEFAULT_FILTERS });
  const [locations, setLocations] = useState<string[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  console.log(talents);
  // Load talents from profiles table
  const fetchTalents = async () => {
    setIsLoading(true);
    try {
      const res: any = await fetchData(`api/users?liker_id=${user?.id}`);
      console.log(res);
      if (res?.success) {
        setTalents(res?.data);
      }
      // if (Array.isArray(res)) {
      //   console.log("Profiles Data:", res);
      //   setTalents(res); // Safe to set
      // } else {
      //   console.warn("API returned non-array data:", res);
      // }
    } catch (error) {
      console.error("Error in talent directory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [user]);

  // Fetch connection requests
  const fetchConnections = async (userId: string) => {
    try {
      // const { data, error } = await supabase
      //   .from("talent_connections")
      //   .select("*")
      //   .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

      // if (error) {
      //   console.error("Error fetching connections:", error);
      //   return;
      // }

      // if (data) {
      //   setConnectionRequests(data);
      // }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  // Apply filters
  useEffect(() => {
    let results = [...talents];

    const search = debouncedSearchTerm?.toLowerCase();

    // ✅ Search filter (username or user_type)
    if (search) {
      results = results.filter((talent) => {
        return (
          (talent.username && talent.username.toLowerCase().includes(search)) ||
          (talent.user_type && talent.user_type.toLowerCase().includes(search))
        );
      });
    }

    // ✅ Filter by selected roles (user_type)
    if (
      Array.isArray(filters.selectedRoles) &&
      filters.selectedRoles.length > 0
    ) {
      results = results.filter((talent) =>
        filters.selectedRoles.includes(talent.user_type)
      );
    }

    // ✅ Filter by selected locations
    if (
      Array.isArray(filters.selectedLocations) &&
      filters.selectedLocations.length > 0
    ) {
      results = results.filter((talent) =>
        filters.selectedLocations.includes(talent.location)
      );
    }

    // ✅ Filter by verified users only
    if (filters.verifiedOnly) {
      results = results.filter((talent) => talent.verified === true);
    }

    // ✅ Filter by available users only
    if (filters.availableOnly) {
      results = results.filter((talent) => talent.status === "active");
    }

    // ✅ Filter by experience range (assuming `experience` is a number field)
    if (
      Array.isArray(filters.experienceRange) &&
      filters.experienceRange.length === 2
    ) {
      const [minExp, maxExp] = filters.experienceRange;
      results = results.filter((talent) => {
        const exp = Number(talent.experience ?? 0); // Adjust this key based on your data
        return exp >= minExp && exp <= maxExp;
      });
    }

    // ✅ Filter by likes minimum (assuming `likes` is a number field)
    if (filters.likesMinimum > 0) {
      results = results.filter((talent) => {
        const likes = Number(talent.likes ?? 0); // Adjust this key based on your data
        return likes >= filters.likesMinimum;
      });
    }

    // ✅ Sorting
    switch (filters.sortBy) {
      case "nameAsc":
        results.sort((a, b) =>
          (a.username || "").localeCompare(b.username || "")
        );
        break;
      case "nameDesc":
        results.sort((a, b) =>
          (b.username || "").localeCompare(a.username || "")
        );
        break;
      default:
        break;
    }

    setFilteredTalents(results);
    setCurrentPage(1);
  }, [talents, filters, debouncedSearchTerm]);

  // Calculate pagination values
  const totalCount = filteredTalents.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedTalents = filteredTalents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handler functions and return values
  const toggleLike = (profileId: string) => {
    setLikedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );

    // Update talent likesCount
    if (user) {
      setTalents((prev) =>
        prev.map((talent) => {
          if (talent.id === profileId) {
            const wasLiked = likedProfiles.includes(profileId);
            return {
              ...talent,
              likesCount: wasLiked
                ? Math.max(0, (talent.likesCount || 0) - 1)
                : (talent.likesCount || 0) + 1,
            };
          }
          return talent;
        })
      );
    }
  };

  const toggleWishlist = (profileId: string) => {
    setWishlistedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const sendConnectionRequest = (profile: TalentProfile) => {
    const newRequest = {
      id: `conn-${Date.now()}`,
      requesterId: "current-user", // In a real app this would be the current user's ID
      recipientId: profile.user_id || profile.userId,
      status: "pending",
    };

    setConnectionRequests((prev) => [...prev, newRequest]);
    return true;
  };

  const shareProfile = (profile: TalentProfile) => {
    // Mock implementation
    console.log(`Sharing profile: ${profile.username || "Talent"}`);
    alert(
      `Profile of ${
        profile.username || "Talent"
      } would be shared in a real app.`
    );
  };

  const sendMessage = async (
    profile: TalentProfile,
    message: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const payload = {
        sender_id: user.id,
        receiver_id: profile.id,
        content: message,
      };

      const res = await postData<ChatResponse>("/api/chat/send", payload);

      if (res.success) {
        return { success: true, message: res.message };
      } else {
        return {
          success: false,
          message: res.message || "Failed to send message",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      console.error("Error sending message:", errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Make sure updateFilters properly handles arrays
  const updateFilters = (newFilters: Partial<TalentFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // Ensure arrays are properly initialized
      if (newFilters.selectedRoles !== undefined) {
        updated.selectedRoles = Array.isArray(newFilters.selectedRoles)
          ? newFilters.selectedRoles
          : [];
      }

      if (newFilters.selectedLocations !== undefined) {
        updated.selectedLocations = Array.isArray(newFilters.selectedLocations)
          ? newFilters.selectedLocations
          : [];
      }

      return updated;
    });
  };

  return {
    talents: paginatedTalents,
    profiles: paginatedTalents, // Alias for backward compatibility
    isLoading,
    filters,
    setFilters,
    updateFilters,
    locations,
    resetFilters: () => setFilters({ ...DEFAULT_FILTERS }),
    PROFESSION_OPTIONS,
    likedProfiles,
    wishlistedProfiles,
    connectionRequests,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    toggleLike,
    toggleWishlist,
    sendConnectionRequest,
    shareProfile,
    sendMessage,
    changePage,
    fetchTalents,
  };
};

export default useTalentDirectory;
export { PROFESSION_OPTIONS, type Profession };
export type { TalentProfile };
