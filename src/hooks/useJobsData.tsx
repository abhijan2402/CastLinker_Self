import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchJobs,
  fetchSavedJobs,
  toggleSaveJob as toggleSaveJobService,
  applyForJob as applyForJobService,
} from "@/services/jobs";
import { Job, JobFilters, JobSort } from "@/types/jobTypes";
import { fetchData } from "@/api/ClientFuntion";

export type {
  Job,
  JobFilters,
  JobSort,
  JobType,
  LocationType,
  RoleCategory,
  ExperienceLevel,
  PostedWithin,
} from "@/types/jobTypes";

export const useJobsData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sort, setSort] = useState<JobSort>({
    field: "relevance",
    direction: "desc",
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Add a ref to track if this is the initial render
  const initialRenderCompleted = useRef(false);
  // Add a ref for ongoing fetch operations
  const fetchInProgress = useRef(false);

  // Fetch jobs based on filters and sorting
  const getJobs = useCallback(async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/api/jobs${queryString ? `?${queryString}` : ""}`;

      console.log(endpoint);
      const result = await fetchData(endpoint);

      if (!Array.isArray(result)) {
        setError("Invalid response from server");
        setJobs([]);
        setTotalCount(0);
        toast({
          title: "Error fetching jobs",
          description: "Invalid response from server",
          variant: "destructive",
        });
      } else {
        console.log("Job data fetched:", result.length, "jobs");
        setJobs(result);
        setTotalCount(result.length);
      }
    } catch (error: any) {
      console.error("Error in getJobs:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error fetching jobs",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setJobs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [toast, filters]);

  const getSavedJobs = useCallback(async () => {
    try {
      const response = await fetchData(`/api/jobs/list/3`);

      // Define the expected structure of the response
      type SavedJob = {
        job_id: number;
        // Include other properties if needed
      };

      type SavedJobsResponse = {
        success: boolean;
        data: SavedJob[];
      };

      // Assert the type of the response
      const { data } = response as SavedJobsResponse;

      // Extract job IDs and convert them to strings
      const jobIds = data.map((job) => job.job_id.toString());

      setSavedJobs(jobIds);
    } catch (error: any) {
      console.error("Error fetching saved jobs:", error);
    }
  }, [user]);

  // Toggle saving a job
  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      try {
        const { newSavedJobs, message } = await toggleSaveJobService(
          jobId,
          user.id,
          savedJobs
        );
        setSavedJobs(newSavedJobs);
        toast(message);
      } catch (error: any) {
        console.error("Error toggling saved job:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save/unsave job",
          variant: "destructive",
        });
      }
    },
    [savedJobs, user, toast]
  );

  // Apply for a job
  const   applyForJob = useCallback(
    async (
      jobId: string,
      application: {
        resume_url?: string;
        cover_letter?: string;
        additional_files?: string[];
      }
    ) => {
      const result = await applyForJobService(jobId, user?.id, application);
      toast(result.message);
      return result.success;
    },
    [user, toast]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: JobSort) => {
    setSort(newSort);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Effect to fetch jobs when filters or sort changes, but not on initial render
  useEffect(() => {
    // If this is the first render, mark it as completed and fetch jobs
    if (!initialRenderCompleted.current) {
      initialRenderCompleted.current = true;
      getJobs();
      return;
    }

    // For subsequent filter/sort changes, fetch jobs after a small delay
    const timer = setTimeout(() => {
      getJobs();
    }, 100);

    return () => clearTimeout(timer);
  }, [getJobs, filters, sort]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    getSavedJobs();
  }, [getSavedJobs]);

  return {
    jobs,
    isLoading,
    error,
    totalCount,
    filters,
    sort,
    savedJobs,
    updateFilters,
    updateSort,
    resetFilters,
    toggleSaveJob,
    applyForJob,
    refetchJobs: getJobs,
  };
};
