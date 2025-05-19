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
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    roleCategories: [],
    experienceLevels: [],
    salaryMin: 0,
    salaryMax: 200000,
  });



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
      // console.log("Current filters:", filters);

      const queryParams = new URLSearchParams();

      // Mapping frontend filter keys to backend query parameters
      if (filters.jobTypes) {
        queryParams.append("type", filters.jobTypes.join(","));
      }
      if (filters.roleCategories) {
        queryParams.append("roleCategory", filters.roleCategories.join(","));
      }
      if (filters.experienceLevels) {
        queryParams.append(
          "experienceLevel",
          filters.experienceLevels.join(",")
        );
      }
      if (filters.salaryMin !== undefined && filters.salaryMin !== null) {
        queryParams.append("min_salary", String(filters.salaryMin));
      }
      if (filters.salaryMax !== undefined && filters.salaryMax !== null) {
        queryParams.append("max_salary", String(filters.salaryMax));
      }

      const queryString = queryParams.toString();
      const endpoint = `/api/jobs${queryString ? `?${queryString}` : ""}`;


      const result = await fetchData(endpoint);

      if (
        result &&
        typeof result === "object" &&
        result !== null &&
        "data" in result
      ) {
        const res = result as { data: any[]; length: number };
        setJobs(res.data);
        setTotalCount(res.data.length);
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
  }, [
    toast,
    filters,
    sort
  ]);

  const getSavedJobs = useCallback(async () => {
    try {
      const response = await fetchData(`/api/jobs/list/${user?.id}`);

      // Define the expected structure of the response
      type Job = {
        id: number;
        job_title: string;
        company: string;
        company_logo_url: string;
        job_type: string;
        role_category: string;
        location: string;
        location_type: string;
        min_salary: number;
        max_salary: number;
        currency: string;
        payment_period: string;
        application_deadline: string | null;
        job_description: string;
        requirements: string[];
        responsibilities: string[];
        tags: string[];
        application_url: string;
        application_email: string;
        is_featured: boolean;
        status: string;
        user_id: number;
        createdAt: string;
        updatedAt: string;
      };

      type SavedJobsResponse = {
        success: boolean;
        data: Job[];
      };

      // Assert the type of the response
      const { data } = response as SavedJobsResponse;

      // Extract job IDs and convert them to strings
      const jobIds = data?.map((job) => job.id.toString());
      setSavedJobs(jobIds);
      console.log("Saved Jobs:", savedJobs);
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
  const applyForJob = useCallback(
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
