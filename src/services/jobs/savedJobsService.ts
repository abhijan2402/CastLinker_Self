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
  jobId: string,
  userId: string | number,
  savedJobs: string[]
) => {
  console.log(jobId, userId, savedJobs);

  const isSaved = jobId ;

  const newSavedJobs = isSaved
    ? savedJobs?.filter((id) => id !== jobId)
    : [...savedJobs, jobId];

  const message = {
    title: isSaved ? "Job removed" : "Job saved",
    description: isSaved
      ? "This job has been removed from your saved list"
      : "This job hasdsfs been saved for later",
  };

  if (!userId) {
    return { newSavedJobs, message };
  }

  try {
    const payload = {
      job_id: jobId,
      user_id: userId,
      action: isSaved ? "remove" : "save",
    };

    await postData(`/api/jobs/Save`, payload);

    return { newSavedJobs, message };
  } catch (error) {
    console.error("Error toggling saved job:", error);
    throw error;
  }
};
