import { postData } from "@/api/ClientFuntion";
import { supabase } from "@/integrations/supabase/client";

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
  jobId: string | number,
  userId: string | number,
  savedJobs: string[]
) => {
  const jobIdStr = String(jobId);
  const isSaved = savedJobs.includes(jobIdStr);

  const newSavedJobs = isSaved
    ? savedJobs.filter((id) => id !== jobIdStr)
    : [...(savedJobs || []), jobIdStr];

  const message = {
    title: isSaved ? "Job removed" : "Job saved",
    description: isSaved
      ? "This job has been removed from your saved list"
      : "This job has been saved for later",
  };

  if (!userId) {
    return { newSavedJobs, message };
  }

  const payload = {
    job_id: jobId,
    user_id: userId,
  };

  try {
    if (isSaved) {
      await postData(`/api/jobs/unsave`, payload);
    } else {
      await postData(`/api/jobs/Save`, payload);
    }

    return { newSavedJobs, message };
  } catch (error) {
    console.error("Error toggling saved job:", error);
    throw error;
  }
};

