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

interface Applicant {
  user_id: number;
  username: string;
  email: string;
  status: string;
}

interface RawJob {
  job_id: number;
  title: string;
}

export const useJobsData = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    title: "",
    location: "",
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
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters.title) {
        queryParams.append("title", filters.title);
      }
      if (filters.location) {
        queryParams.append("location", filters.location);
      }
      if (filters.jobTypes?.length) {
        queryParams.append("type", filters.jobTypes.join(","));
      }
      if (filters.roleCategories?.length) {
        queryParams.append("roleCategory", filters.roleCategories.join(","));
      }
      if (filters.experienceLevels?.length) {
        const experienceLevels = filters.experienceLevels.map((level) =>
          level.toLowerCase()
        );

        queryParams.append("experienceLevel", experienceLevels.join(","));
      }
      if (filters.salaryMin !== undefined) {
        queryParams.append("min_salary", String(filters.salaryMin));
      }
      if (filters.salaryMax !== undefined) {
        queryParams.append("max_salary", String(filters.salaryMax));
      }

      const queryString = queryParams.toString();
      const endpoint = `/api/jobs/admin${queryString ? `?${queryString}` : ""}`;

      const result: any = await fetchData(endpoint);

      if (result?.data) {
        // const activeJobs = result.data.filter((job) => job.status === "active");
        const activeJobs = result?.data;

        // 🔽 Sort the jobs based on `sort.field` and `sort.direction`
        const sortedJobs = [...activeJobs].sort((a, b) => {
          const fieldA = a[sort.field];
          const fieldB = b[sort.field];

          if (fieldA < fieldB) return sort.direction === "asc" ? -1 : 1;
          if (fieldA > fieldB) return sort.direction === "asc" ? 1 : -1;
          return 0;
        });

        setJobs(sortedJobs);
        setTotalCount(sortedJobs.length);
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
    }
  }, [filters, sort, toast]);

  // MY Jobs
  const fetchMyJobs = async () => {
    // 1. Fetch jobs
    const jobsRes = await fetchData<{ success: boolean; data: RawJob[] }>(
      "api/jobs/my-jobs-with-applicants"
    );

    if (!jobsRes.success) return;

    // 2. Extract job IDs
    const rawJobIds = jobsRes.data.map((job) => job.job_id);

    // 3. Filter full job data (assuming you have a `jobs` array from global state or elsewhere)
    const myFilteredJobs = jobs.filter((job) => rawJobIds.includes(job.id));

    // 4. Fetch applicants for each job using Promise.all
    const applicantPromises = myFilteredJobs.map((job) =>
      fetchData<{ success: boolean; data: Applicant[] | Applicant }>(
        `api/jobs/job-applicants/${job.id}`
      ).then((res) => {
        let applicants: Applicant[] = [];

        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            applicants = res.data.filter(Boolean); // removes null/undefined
          } else {
            applicants = [res.data].filter(Boolean); // handles single object or null
          }
        }

        return {
          jobId: job.id,
          applicants,
        };
      })
    );

    const applicantsResults = await Promise.all(applicantPromises);

    // 5. Merge applicants into jobs
    const enrichedJobs = myFilteredJobs.map((job) => {
      const match = applicantsResults.find((a) => a.jobId === job.id);
      return {
        ...job,
        applicants: match?.applicants ?? [],
      };
    });

    // 6. Update state
    setMyJobs(enrichedJobs);
  };

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
        job_id: number;
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
      const jobIds = data?.map((job) => job.job_id.toString());
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
    getJobs();
  }, [filters, sort]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    getSavedJobs();
  }, [getSavedJobs]);

  useEffect(() => {
    fetchMyJobs();
  }, [setMyJobs, jobs]);

  return {
    jobs,
    myJobs,
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
    getSavedJobs,
    refetchJobs: getJobs,
    setJobs,
    setTotalCount,
    fetchMyJobs,
  };
};
