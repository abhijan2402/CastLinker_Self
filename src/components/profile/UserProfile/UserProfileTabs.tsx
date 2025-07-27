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

import { fetchData } from "@/api/ClientFuntion";
import AboutSection from "../AboutSection";
import PortfolioSection from "../PortfolioSection";
import SkillsSection from "../SkillsSection";
import ExperienceSection from "../ExperienceSection";
import UserAboutSection from "./UserAboutSection";
import UserPortfolioSection from "./UserPortfolioSection";
import UserSkillsSection from "./UserSkillsSection";
import UserExperienceSection from "./UserExperienceSection";

const UserProfileTabs = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("about");
  // const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { jobs, savedJobs, toggleSaveJob, getSavedJobs, refetchJobs } =
    useJobsData();

  useEffect(() => {
    if (user && activeTab === "saved-jobs") {
      getSavedJobs();
    }
  }, [user, activeTab]);

  const savedJobList = jobs.filter((job) => savedJobs.includes(String(job.id)));

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
        {/* <TabsTrigger
          value="portfolio"
          className={`${
            activeTab === "portfolio"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Portfolio
        </TabsTrigger> */}
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
        {/* <TabsTrigger
          value="experience"
          className={`${
            activeTab === "experience"
              ? "text-gold border-gold"
              : "text-foreground/70 border-transparent"
          } 
            border-b-2 rounded-none`}
        >
          Experience
        </TabsTrigger> */}
      </TabsList>
      <TabsContent value="about" className="pt-6">
        <UserAboutSection userProfile={userProfile} />
      </TabsContent>
      {/* <TabsContent value="portfolio" className="pt-6">
        <UserPortfolioSection userProfile={userProfile} />
      </TabsContent> */}
      <TabsContent value="skills" className="pt-6">
        <UserSkillsSection userProfile={userProfile} />
      </TabsContent>
      {/* <TabsContent value="experience" className="pt-6">
        <UserExperienceSection userProfile={userProfile} />
      </TabsContent> */}
    </Tabs>
  );
};

export default UserProfileTabs;
