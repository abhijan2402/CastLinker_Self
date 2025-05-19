import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Job,
  JobType,
  LocationType,
  RoleCategory,
  useJobsData,
} from "@/hooks/useJobsData";
import AboutSection from "./AboutSection";
import { PortfolioSection } from "./PortfolioSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import SavedJobsSection from "./SavedJobsSection";
import ApplicationsSection from "./ApplicationsSection";
import { fetchData } from "@/api/ClientFuntion";

// Type for raw job data from database
interface RawJobData {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  job_type: string;
  role_category: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  location: string;
  location_type: string;
  tags?: string[];
  application_deadline?: string;
  application_url?: string;
  application_email?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  created_at?: string;
  status?: string;
}

// Convert raw job data to Job type
const mapRawJobToJob = (rawJob: RawJobData): Job => ({
  id: rawJob.id,
  title: rawJob.title,
  company: rawJob.company,
  company_logo: rawJob.company_logo,
  description: rawJob.description,
  requirements: rawJob.requirements,
  responsibilities: rawJob.responsibilities,
  job_type: rawJob.job_type as JobType,
  role_category: rawJob.role_category as RoleCategory,
  experience_level: rawJob.experience_level,
  salary_min: rawJob.salary_min,
  salary_max: rawJob.salary_max,
  salary_currency: rawJob.salary_currency,
  salary_period: rawJob.salary_period,
  location: rawJob.location,
  location_type: rawJob.location_type as LocationType,
  tags: rawJob.tags,
  application_deadline: rawJob.application_deadline,
  application_url: rawJob.application_url,
  application_email: rawJob.application_email,
  is_featured: rawJob.is_featured,
  is_verified: rawJob.is_verified,
  created_at: rawJob.created_at,
  status: rawJob.status,
});

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
    if (user && activeTab === "saved-jobs") {
      fetchSavedJobs();
    }
    if (user && activeTab === "applications") {
      fetchAppliedJobs();
    }
  }, [user, activeTab]);

  const fetchSavedJobs = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const response = await fetchData(`/api/jobs/user-saved-jobs`);
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
      console.log(data);
    } catch (error: any) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Get applied job IDs
      const { data: appliedData, error: appliedError } = await supabase
        .from("job_applications")
        .select("job_id")
        .eq("user_id", user.id);

      if (appliedError) throw appliedError;

      if (appliedData && appliedData.length > 0) {
        const jobIds = appliedData.map((item) => item.job_id);

        // Fetch job details for applied jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("film_jobs")
          .select("*")
          .in("id", jobIds);

        if (jobsError) throw jobsError;

        const typedJobs = (jobsData || []).map(mapRawJobToJob);
        setAppliedJobs(typedJobs);
      } else {
        setAppliedJobs([]);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="about" className="mt-8" onValueChange={setActiveTab}>
      <TabsList className="bg-cinematic-dark/50 border border-gold/10 w-full justify-start">
        <TabsTrigger
          value="about"
          className={`${
            activeTab === "about"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          About
        </TabsTrigger>
        <TabsTrigger
          value="portfolio"
          className={`${
            activeTab === "portfolio"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Portfolio
        </TabsTrigger>
        <TabsTrigger
          value="skills"
          className={`${
            activeTab === "skills"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Skills & Attributes
        </TabsTrigger>
        <TabsTrigger
          value="experience"
          className={`${
            activeTab === "experience"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Experience
        </TabsTrigger>
        <TabsTrigger
          value="saved-jobs"
          className={`${
            activeTab === "saved-jobs"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Saved Jobs
        </TabsTrigger>
        <TabsTrigger
          value="applications"
          className={`${
            activeTab === "applications"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Applications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="about" className="pt-6">
        <AboutSection />
      </TabsContent>
      <TabsContent value="portfolio" className="pt-6">
        <PortfolioSection />
      </TabsContent>
      <TabsContent value="skills" className="pt-6">
        <SkillsSection />
      </TabsContent>
      <TabsContent value="experience" className="pt-6">
        <ExperienceSection />
      </TabsContent>
      <TabsContent value="saved-jobs" className="pt-6">
        <SavedJobsSection
          jobs={savedJobs}
          isLoading={isLoading}
          onRefresh={fetchSavedJobs}
        />
      </TabsContent>
      <TabsContent value="applications" className="pt-6">
        <ApplicationsSection
          jobs={appliedJobs}
          isLoading={isLoading}
          onRefresh={fetchAppliedJobs}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
