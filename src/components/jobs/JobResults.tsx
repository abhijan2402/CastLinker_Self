import { useState, memo, useCallback, useEffect } from "react";
import { Job, JobSort } from "@/types/jobTypes";
import JobDetail from "./JobDetail";
import JobApplicationForm from "./JobApplicationForm";
import JobCard from "./JobCard";
import JobSortSelect from "./JobSortSelect";
import JobListSkeleton from "./JobListSkeleton";
import NoJobsFound from "./NoJobsFound";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  error?: string | null;
  totalCount: number;
  savedJobs: string[];
  onSaveJob: (jobId: string) => void;
  onApplyJob: (jobId: string, data: any) => Promise<boolean>;
  onSort: (sort: JobSort) => void;
  refetchJobs?: () => Promise<void>;
}

const JobResults = memo(
  ({
    jobs,
    isLoading,
    error,
    totalCount,
    savedJobs,
    onSaveJob,
    onApplyJob,
    onSort,
    refetchJobs,
  }: JobResultsProps) => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
    const [retryCount, setRetryCount] = useState(0); // Track retry attempts
    const [isRetrying, setIsRetrying] = useState(false);
    // console.log(savedJobs)

    const handleJobClick = useCallback((job: Job) => {
      console.log(selectedJob);
      setSelectedJob(job);
    }, []);

    const handleApplyClick = useCallback((job: Job) => {
      setSelectedJob(job);
      setIsApplyFormOpen(true);
    }, []);

    const handleSubmitApplication = useCallback(
      async (data: any) => {
        if (selectedJob) {
          const result = await onApplyJob(selectedJob.id, data);
          if (result) {
            setIsApplyFormOpen(false);
          }
          return result;
        }
        return false;
      },
      [selectedJob, onApplyJob]
    );

    const handleCloseDetail = useCallback(() => {
      setSelectedJob(null);
    }, []);

    const handleCloseApplyForm = useCallback(() => {
      setIsApplyFormOpen(false);
      setSelectedJob(null);
    }, []);

    const handleOpenApplyForm = useCallback(() => {
      setIsApplyFormOpen(true);
    }, []);

    // Avoid unnecessary calculation on each render
    const isSaved = useCallback(
      (jobId: string | number) => savedJobs.includes(String(jobId)),
      [savedJobs]
    );

    // Handle retry with exponential backoff
    const handleRetry = useCallback(async () => {
      if (!refetchJobs || isRetrying) return;

      setIsRetrying(true);
      setRetryCount((prev) => prev + 1);

      try {
        await refetchJobs();
      } catch (err) {
        console.error("Retry failed:", err);
      } finally {
        setIsRetrying(false);
      }
    }, [refetchJobs, isRetrying]);

    // Reset retry count when jobs change
    useEffect(() => {
      if (jobs.length > 0) {
        setRetryCount(0);
      }
    }, [jobs]);

    return (
      <>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h3 className="text-base sm:text-lg font-medium">
              {error
                ? "Job Search"
                : `${totalCount} ${totalCount === 1 ? "Job" : "Jobs"} Found`}
              <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1 sm:ml-2 block sm:inline">
                {error
                  ? "An error occurred"
                  : "Showing available opportunities"}
              </span>
            </h3>

            <JobSortSelect onSort={onSort} />
          </div>

          {error ? (
            <Alert variant="destructive" className="animate-none">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error fetching jobs</AlertTitle>
              <AlertDescription className="text-sm space-y-3">
                <p>{error}</p>
                {refetchJobs && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={isLoading || isRetrying}
                  >
                    <RefreshCcw
                      className={`mr-1 h-4 w-4 ${
                        isLoading || isRetrying ? "animate-spin" : ""
                      }`}
                    />
                    Try Again
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-3">
              <div className="w-full">
                <Progress
                  value={100}
                  className="h-2"
                  indicatorClassName="animate-pulse bg-gold"
                />
              </div>
              <JobListSkeleton count={3} />
            </div>
          ) : jobs.length === 0 ? (
            <NoJobsFound />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={isSaved(job.id)}
                  onSaveClick={onSaveJob}
                  onViewDetailsClick={handleJobClick}
                  onApplyClick={handleApplyClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Job Detail Modal */}
        <JobDetail
          job={selectedJob}
          isOpen={!!selectedJob && !isApplyFormOpen}
          onClose={handleCloseDetail}
          onApply={handleOpenApplyForm}
          isSaved={selectedJob ? isSaved(selectedJob.id) : false}
          onToggleSave={onSaveJob}
        />

        {/* Job Application Form */}
        {selectedJob && (
          <JobApplicationForm
            job={selectedJob}
            isOpen={isApplyFormOpen}
            onClose={handleCloseApplyForm}
            onSubmit={handleSubmitApplication}
          />
        )}
      </>
    );
  }
);

JobResults.displayName = "JobResults";

export default JobResults;
