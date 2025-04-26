import { deleteData, postData } from "@/api/ClientFuntion";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobFilters } from "@/types/jobTypes";

export const fetchJobs = async (
  filters: JobFilters,
  sort: { field: string; direction: string }
) => {
  try {
    console.log("Fetching jobs with filters:", filters, "and sort:", sort);

    // Set a reasonable limit to prevent timeout issues
    const PAGE_SIZE = 20;

    // Note: Explicitly type this as any to avoid TS errors with the database schema
    let query = supabase
      .from("film_jobs")
      .select("*", { count: "exact" })
      .limit(PAGE_SIZE) as any;

    // Apply filters
    if (filters.search && filters.search.trim() !== "") {
      console.log("Using search term:", filters.search);
      // Use the search_film_jobs function for text search
      const { data, error, count } = (await supabase
        .rpc("search_film_jobs", {
          search_term: filters.search,
        })
        .limit(PAGE_SIZE)) as any;

      if (error) {
        console.error("Search error:", error);
        throw new Error(`Search failed: ${error.message}`);
      }

      console.log("Search results:", data?.length || 0, "jobs found");
      return { data: data || [], count: count || 0 };
    }

    if (filters.location && filters.location !== "Remote") {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.location === "Remote") {
      query = query.eq("location_type", "Remote");
    }

    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query = query.in("job_type", filters.jobTypes);
    }

    if (filters.roleCategories && filters.roleCategories.length > 0) {
      query = query.in("role_category", filters.roleCategories);
    }

    if (filters.locationTypes && filters.locationTypes.length > 0) {
      query = query.in("location_type", filters.locationTypes);
    }

    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      query = query.in("experience_level", filters.experienceLevels);
    }

    if (filters.salaryMin) {
      query = query.gte("salary_min", filters.salaryMin);
    }

    if (filters.salaryMax) {
      query = query.lte("salary_max", filters.salaryMax);
    }

    if (filters.postedWithin && filters.postedWithin !== "any") {
      const now = new Date();
      let date = new Date();

      switch (filters.postedWithin) {
        case "24h":
          date.setDate(now.getDate() - 1);
          break;
        case "3d":
          date.setDate(now.getDate() - 3);
          break;
        case "7d":
          date.setDate(now.getDate() - 7);
          break;
        case "14d":
          date.setDate(now.getDate() - 14);
          break;
        case "30d":
          date.setDate(now.getDate() - 30);
          break;
      }

      query = query.gte("created_at", date.toISOString());
    }

    // Apply sorting
    if (sort.field === "created_at") {
      query = query.order("created_at", {
        ascending: sort.direction === "asc",
      });
    } else if (sort.field === "salary_max") {
      query = query.order("salary_max", {
        ascending: sort.direction === "asc",
        nullsFirst: false,
      });
    } else {
      // Default sorting (relevance) - order by featured first, then created_at
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
    }

    // Only active jobs
    query = query.eq("status", "active");

    console.log("Executing query for jobs");

    // Using an AbortController with a timeout for the query
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 8000); // 8 second timeout

    const { data, error, count } = (await query) as any;

    // Clear the timeout since the query completed
    clearTimeout(timeoutId);

    if (error) {
      console.error("Query error:", error);
      throw new Error(`Query failed: ${error.message}`);
    }

    console.log("Query results:", data?.length || 0, "jobs found");
    return { data: data || [], count: count || 0 };
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    // Return empty data but with error property to handle in the UI
    return {
      data: [],
      count: 0,
      error: {
        message:
          error.message ||
          "Failed to fetch jobs. Please check your connection and try again.",
        originalError: error,
      },
    };
  }
};

export const fetchSavedJobs = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }

  try {
    const { data, error } = await (supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", userId) as any);

    if (error) throw error;

    return data?.map((record: any) => record.job_id) || [];
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }
};

export const toggleSaveJob = async (
  jobId: string,
  userId: string | undefined,
  savedJobs: string[]
) => {
  console.log("Toggling save for job:", jobId, "user:", userId);

  const isSaved = savedJobs.includes(jobId);

  try {
    const payload = {
      job_id: jobId,
      user_id: userId, // dynamically used
    };

    let newSavedJobs: string[] = [];
    let message = { title: "", description: "" };

    if (isSaved) {
      await deleteData("/api/jobs/unsave", payload);
      newSavedJobs = savedJobs.filter((id) => id !== jobId);
      message = {
        title: "Job removed",
        description: "This job been removed from your saved list",
      };
    } else {
      const response = (await postData("/api/jobs/save", payload)) as {
        message: string;
      };

      if (response?.message === "Job already saved") {
        newSavedJobs = savedJobs; // don't update local state
        message = {
          title: "Already saved",
          description: "This job is already in your saved list",
        };
      } else {
        newSavedJobs = [...savedJobs, jobId];
        message = {
          title: "Job saved",
          description: "This job hasttttttttttt been saved for later",
        };
      }
    }

    return { newSavedJobs, message };
  } catch (error) {
    console.error("Error toggling saved job:", error);
    throw error;
  }
};

export const applyForJob = async (
  jobId: string,
  userId: string | undefined,
  application: {
    resume_url?: string;
    cover_letter?: string;
    additional_files?: string[];
  }
) => {
  if (!userId) {
    return {
      success: false,
      message: {
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive" as const,
      },
    };
  }

  try {
    const { error } = await (supabase.from("job_applications").insert({
      user_id: userId,
      job_id: jobId,
      ...application,
    }) as any);

    if (error) throw error;

    return {
      success: true,
      message: {
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      },
    };
  } catch (error: any) {
    console.error("Error applying for job:", error);
    return {
      success: false,
      message: {
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive" as const,
      },
    };
  }
};
