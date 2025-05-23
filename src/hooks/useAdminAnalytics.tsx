// hooks/useAdminAnalytics.ts
import { fetchData } from "@/api/ClientFuntion";
import { useEffect, useState } from "react";

// Assuming fetchData is your custom API caller

// Type definitions
interface JobCategory {
  role_category: string;
  count: string;
}
interface userDemographics {
  user_role: string;
  count: string;
}
type JobMetric = {
  month: string; // Format: YYYY-MM
  posted: number;
  applications: number;
};

interface AnalyticsStats {
  totalUsers: number;
  newUsersThisMonth?: number;
  usersChange?: string;

  activeJobs: number;
  jobsChange?: string;

  applicationsLast30Days: number;
  applicationsChange?: string;

  eventsThisMonth: number;
  eventsChange?: string;

  totalPost: number;
}

// Api
interface JobCategoriesResponse {
  success: boolean;
  data: JobCategory[];
}

interface userDemographicsResponse {
  success: boolean;
  data: userDemographics[];
}

export const useAdminAnalytics = () => {
  const [jobCategoriesData, setJobCategoriesData] = useState<JobCategory[]>([]);
  const [userDemographicsData, setUserDemographicsData] = useState<
    userDemographics[]
  >([]);
  const [userActivityData, setUseruserActivityData] = useState<any[]>([]);
  const [jobMetricData, setJobMetricData] = useState<JobMetric[]>([]);
  const [analyticsStatsData, setAnalyticsStatsData] = useState<AnalyticsStats>({
    totalUsers: 0,
    activeJobs: 0,
    applicationsLast30Days: 0,
    eventsThisMonth: 0,
    totalPost: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // /api/adimn / stats / user - demographics;
  useEffect(() => {
    const fetchAdminStatsData = async () => {
      try {
        setLoading(true);
        const res = await fetchData("/api/admin/stats");

        if (res && typeof res === "object" && !Array.isArray(res)) {
          setAnalyticsStatsData(res);
        } else {
          setError("Failed to fetch admin stats");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    const fetchjobCategoriesData = async () => {
      try {
        setLoading(true);
        const res: JobCategoriesResponse = await fetchData(
          "/api/admin/stats/job-categories"
        );
        if (res.success) {
          setJobCategoriesData(res.data);
        } else {
          setError("Failed to fetch job categories");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserDemographicsData = async () => {
      try {
        setLoading(true);
        const res: userDemographicsResponse = await fetchData(
          "/api/admin/stats/user-demographics"
        );
        if (res.success) {
          setUserDemographicsData(res.data);
        } else {
          setError("Failed to fetch User Demographics data");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserActivityData = async () => {
      try {
        setLoading(true);
        const res = await fetchData("/api/admin/stats/user-activity-stats");
        if (Array.isArray(res)) {
          setUseruserActivityData(res);
        } else {
          setError("Failed to User Activity");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    const fetchJobMetricData = async () => {
      try {
        setLoading(true);
        const res = await fetchData("/api/admin/stats/job-metrics");
        if (Array.isArray(res)) {
          setJobMetricData(res);
        } else {
          setError("Failed to User Activity");
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStatsData();
    fetchUserDemographicsData();
    fetchjobCategoriesData();
    fetchUserActivityData();
    fetchJobMetricData();
  }, []);

  return {
    jobCategoriesData,
    userDemographicsData,
    userActivityData,
    jobMetricData,
    analyticsStatsData,
    loading,
    error,
  };
};
