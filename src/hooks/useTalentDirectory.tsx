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
import { fetchData } from "@/api/ClientFuntion";

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

  // Load talents from profiles table
  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoading(true);
      try {
        // First check if we have profiles table data
        const { data: profilesData, error: profilesError } = (await fetchData(
          `auth/profile?user_id=${user.id}`
        )) as {
          data: TalentProfile[];
          error: any;
        };

      console.log(profilesData)

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // If we can't access profiles, try to get users directly (this may not work due to RLS)
          await fetchUsers();
          return;
        }

        if (profilesData) {
          console.log("Found profiles in the database:", profilesData);
          // Map profiles to talent format
          const talentData: TalentProfile[] = profilesData.map((profile) => ({
            id: profile.id,
            user_id: profile.id,
            name: profile.full_name || "Anonymous User",
            role: (profile.profession_type as Profession) || "Actor",
            profession_type: (profile.profession_type as Profession) || "Actor",
            location: profile.location || "Los Angeles, CA",
            avatar:
              profile.avatar_url ||
              `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            rating: profile.rating || 3.5 + Math.random() * 1.5, // Random rating between 3.5 and 5
            reviews: Math.floor(Math.random() * 30) + 1, // Random number of reviews
            isVerified: profile.is_verified || false,
            isPremium: Math.random() > 0.7, // 30% chance of being premium
            isAvailable: profile.availability_status === "Available",
            available_for_hire: profile.availability_status === "Available",
            skills: profile.skills || ["Acting", "Dancing", "Singing"],
            experience:
              profile.experience_years || Math.floor(Math.random() * 15) + 1,
            experience_years:
              profile.experience_years || Math.floor(Math.random() * 15) + 1,
            languages: profile.languages || ["English"],
            bio:
              profile.description ||
              "Film industry professional with diverse skills and experience.",
            featuredIn: profile.achievements || [
              "Independent Film",
              "Commercial",
              "Theater Production",
            ],
            likesCount: profile.likes || Math.floor(Math.random() * 200),
            joinedDate: profile.created_at,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            userId: profile.id,
          }));

          setTalents(talentData);

          // Extract unique locations
          const uniqueLocations = Array.from(
            new Set(talentData.map((talent) => talent.location))
          );
          setLocations(uniqueLocations);

          // Load liked profiles from database
          if (user) {
            fetchLikedProfiles(user.id);
          } else {
            setupDummyInteractions(talentData);
          }
        } else {
          console.log(
            "No profiles found, fetching users or using fallback data"
          );
          await fetchUsers();
        }
      } catch (error) {
        console.error("Error in talent directory:", error);
        generateFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalents();
  }, [user]);

  // Fetch likes from database when user is available
  const fetchLikedProfiles = async (userId: string | number) => {
    try {
      const { data, error } = await supabase
        .from("talent_likes")
        .select("talent_id")
        .eq("liker_id", userId);

      if (error) {
        console.error("Error fetching liked profiles:", error);
        return;
      }

      if (data && data.length > 0) {
        // Map the talent_ids to profile ids
        const likedIds = data.map((like) => like.talent_id);
        console.log("Fetched liked profiles:", likedIds);
        setLikedProfiles(likedIds);
      } else {
        console.log("No liked profiles found");
        // Set up some dummy liked profiles for better UI testing
        if (talents.length > 0) {
          setLikedProfiles([talents[0].id]);
        }
      }

      // Also fetch connection requests
      fetchConnections(userId);
    } catch (error) {
      console.error("Error setting up liked profiles:", error);
    }
  };

  // Fetch connection requests
  const fetchConnections = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("talent_connections")
        .select("*")
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

      if (error) {
        console.error("Error fetching connections:", error);
        return;
      }

      if (data) {
        setConnectionRequests(data);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  // Fetch users from auth or talent_profiles if available
  const fetchUsers = async () => {
    try {
      // Try fetching from talent_profiles which might have more user-friendly RLS
      const { data: talentProfilesData, error: talentProfilesError } =
        await supabase.from("talent_profiles").select("*");

      if (
        !talentProfilesError &&
        talentProfilesData &&
        talentProfilesData.length > 0
      ) {
        console.log("Found talent profiles:", talentProfilesData.length);
        // Map talent_profiles to talent format
        const talentData: TalentProfile[] = talentProfilesData.map(
          (profile) => ({
            id: profile.id,
            user_id: profile.user_id,
            userId: profile.user_id,
            name: profile.name,
            role: profile.role as Profession,
            profession_type: profile.role as Profession,
            location: profile.location,
            avatar:
              profile.avatar ||
              `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            rating: profile.rating || 4.5,
            reviews: profile.reviews || Math.floor(Math.random() * 30) + 1,
            isVerified: profile.is_verified,
            isPremium: profile.is_premium,
            isAvailable: profile.is_available,
            available_for_hire: profile.is_available,
            skills: profile.skills || [],
            experience: profile.experience || 0,
            experience_years: profile.experience || 0,
            languages: profile.languages || [],
            bio: profile.bio || "Film industry professional",
            featuredIn: profile.featured_in || [],
            likesCount: Math.floor(Math.random() * 200),
            joinedDate: profile.created_at,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          })
        );

        setTalents(talentData);

        // Extract unique locations
        const uniqueLocations = Array.from(
          new Set(talentData.map((talent) => talent.location))
        );
        setLocations(uniqueLocations);

        // Load liked profiles if user is available
        if (user) {
          fetchLikedProfiles(user.id);
        } else {
          setupDummyInteractions(talentData);
        }
        return;
      }

      // If we reach here, we need fallback data
      console.log("No talent profiles found, using fallback data");
      generateFallbackData();
    } catch (error) {
      console.error("Error fetching users:", error);
      generateFallbackData();
    }
  };

  // Generate some fallback data if no real data is available
  const generateFallbackData = () => {
    console.log("Generating fallback talent data");
    const defaultLocations = [
      "Los Angeles, CA",
      "New York, NY",
      "Atlanta, GA",
      "Vancouver, BC",
      "London, UK",
      "Mumbai, India",
    ];

    const defaultRoles: Profession[] = [
      "Actor",
      "Director",
      "Producer",
      "Writer",
      "Cinematographer",
    ];

    const defaultSkills = {
      Actor: ["Method Acting", "Improvisation", "Voice Acting"],
      Director: ["Shot Composition", "Script Analysis", "Team Leadership"],
      Producer: ["Project Management", "Budgeting", "Team Coordination"],
      Writer: ["Story Development", "Character Creation", "Dialogue Writing"],
      Cinematographer: ["Camera Operation", "Lighting", "Shot Composition"],
    };

    const fallbackProfiles: TalentProfile[] = Array.from({ length: 10 }).map(
      (_, index) => {
        const role =
          defaultRoles[Math.floor(Math.random() * defaultRoles.length)];
        return {
          id: `fallback-${index}`,
          user_id: `fallback-user-${index}`,
          userId: `fallback-user-${index}`,
          name: `Talent ${index + 1}`,
          role,
          profession_type: role,
          location:
            defaultLocations[
              Math.floor(Math.random() * defaultLocations.length)
            ],
          avatar: `https://i.pravatar.cc/150?img=${
            Math.floor(Math.random() * 70) + 1
          }`,
          rating: 3.5 + Math.random() * 1.5,
          reviews: Math.floor(Math.random() * 30) + 1,
          isVerified: Math.random() > 0.7,
          isPremium: Math.random() > 0.7,
          isAvailable: Math.random() > 0.3,
          available_for_hire: Math.random() > 0.3,
          skills: defaultSkills[role as keyof typeof defaultSkills] || [
            "Acting",
            "Dancing",
            "Singing",
          ],
          experience: Math.floor(Math.random() * 15) + 1,
          experience_years: Math.floor(Math.random() * 15) + 1,
          languages: ["English"],
          bio: `Film industry professional with ${
            Math.floor(Math.random() * 15) + 1
          } years of experience in various productions.`,
          featuredIn: ["Independent Film", "Commercial", "Theater Production"],
          likesCount: Math.floor(Math.random() * 200),
          joinedDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    );

    setTalents(fallbackProfiles);
    setLocations(defaultLocations);
    setupDummyInteractions(fallbackProfiles);
  };

  // Setup some dummy interactions for the profiles
  const setupDummyInteractions = (talentData: TalentProfile[]) => {
    // Mock some liked and wishlisted profiles
    if (talentData.length > 0) {
      setLikedProfiles([talentData[0].id]);
      if (talentData.length > 1) {
        setWishlistedProfiles([talentData[1].id]);
      }
    }

    // Mock connection requests
    setConnectionRequests([
      {
        id: "conn-1",
        requesterId: "current-user",
        recipientId: talentData.length > 0 ? talentData[0].user_id : "",
        status: "accepted",
      },
      {
        id: "conn-2",
        requesterId: talentData.length > 1 ? talentData[1].user_id : "",
        recipientId: "current-user",
        status: "pending",
      },
    ]);
  };

  // Apply filters
  useEffect(() => {
    let results = [...talents];

    // Apply search term filter
    if (debouncedSearchTerm) {
      results = results.filter(
        (talent) =>
          talent.name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          talent.bio
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          talent.role
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          talent.skills.some((skill) =>
            skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
      );
    }

    // Apply role filter - ensure we have a valid array
    if (
      Array.isArray(filters.selectedRoles) &&
      filters.selectedRoles.length > 0
    ) {
      results = results.filter(
        (talent) =>
          filters.selectedRoles.includes(talent.profession_type) ||
          (talent.role && filters.selectedRoles.includes(talent.role))
      );
    }

    // Apply location filter - ensure we have a valid array
    if (
      Array.isArray(filters.selectedLocations) &&
      filters.selectedLocations.length > 0
    ) {
      results = results.filter((talent) =>
        filters.selectedLocations.includes(talent.location)
      );
    }

    // Apply experience range filter
    results = results.filter((talent) => {
      const exp = talent.experience_years || talent.experience || 0;
      return (
        exp >= filters.experienceRange[0] && exp <= filters.experienceRange[1]
      );
    });

    // Apply verified only filter
    if (filters.verifiedOnly) {
      results = results.filter((talent) => talent.isVerified);
    }

    // Apply available only filter
    if (filters.availableOnly) {
      results = results.filter(
        (talent) => talent.isAvailable || talent.available_for_hire
      );
    }

    // Apply likes minimum filter
    if (filters.likesMinimum > 0) {
      results = results.filter(
        (talent) => (talent.likesCount || 0) >= filters.likesMinimum
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "experience":
        results.sort((a, b) => {
          const aExp = a.experience_years || a.experience || 0;
          const bExp = b.experience_years || b.experience || 0;
          return bExp - aExp;
        });
        break;
      case "reviews":
        results.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case "likes":
        results.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        break;
      case "nameAsc":
        results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "nameDesc":
        results.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    setFilteredTalents(results);
    // Reset to first page when filters change
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
    console.log(`Sharing profile: ${profile.name || "Talent"}`);
    alert(
      `Profile of ${profile.name || "Talent"} would be shared in a real app.`
    );
  };

  const sendMessage = (profile: TalentProfile, message: string) => {
    // Mock implementation
    console.log(`Message to ${profile.name || "Talent"}: ${message}`);
    return true;
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
  };
};

export default useTalentDirectory;
export { PROFESSION_OPTIONS, type Profession };
export type { TalentProfile };
