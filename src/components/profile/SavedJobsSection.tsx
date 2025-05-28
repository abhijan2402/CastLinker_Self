import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Job, useJobsData } from "@/hooks/useJobsData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import JobDetail from "@/components/jobs/JobDetail";
import JobApplicationForm from "@/components/jobs/JobApplicationForm";

interface SavedJobsSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onRefresh: () => void;
  onRemove: (jobId: string) => void;
}

const SavedJobsSection = ({
  jobs,
  isLoading,
  onRefresh,
  onRemove,
}: SavedJobsSectionProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRemoveSavedJob = async (jobId: number) => {
    if (!user) return;

    try {
      onRemove(jobId.toString());

      toast({
        title: "Job removed",
        description: "The job has been removed from your saved list",
      });

      onRefresh();
    } catch (error: any) {
      console.error("Error removing saved job:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while removing the job",
        variant: "destructive",
      });
    }
  };

  const handleApplyForJob = async (jobId: string, application: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.from("job_applications").insert({
        user_id: user.id,
        job_id: jobId,
        ...application,
      });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });

      onRefresh();
      return true;
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
      return false;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-card-gradient border-gold/10 p-8 text-center">
        <div className="space-y-3">
          <h3 className="text-xl font-medium">No saved jobs</h3>
          <p className="text-foreground/70">
            You haven't saved any jobs yet. Browse the jobs page to find
            opportunities that interest you.
          </p>
          <Button className="mt-4 bg-gold hover:bg-gold/90 text-black" asChild>
            <a href="/jobs">Browse Jobs</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Jobs</h2>
        <Button variant="outline" onClick={onRefresh} size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-card-gradient border-gold/10">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-bold">{job.job_title}</h3>
                    <p className="text-sm text-foreground/70">{job.company}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-foreground/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location} • {job.location_type}
                    </span>

                    {job.application_deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {formatDate(job.application_deadline)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-cinematic-dark/50">
                      {job.job_type}
                    </Badge>
                    <Badge variant="outline" className="bg-cinematic-dark/50">
                      {job.role_category}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsDetailOpen(true);
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveSavedJob(job.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gold hover:bg-gold-dark text-cinematic"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsApplicationOpen(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          isSaved={true}
          onToggleSave={() => handleRemoveSavedJob(selectedJob.id)}
          onApply={() => setIsApplicationOpen(true)}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      {/* Job Application Form */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          onSubmit={(application) =>
            handleApplyForJob(selectedJob.id.toString(), application)
          }
        />
      )}
    </div>
  );
};

export default SavedJobsSection;
