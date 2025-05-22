
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobTypes";
import JobDetailHeader from "./detail/JobDetailHeader";
import JobMetadata from "./detail/JobMetadata";
import JobDetailTabs from "./detail/JobDetailTabs";
import JobDetailFooter from "./detail/JobDetailFooter";

interface JobDetailProps {
  job: Job | null;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetail = ({ job, isSaved, onToggleSave, onApply, isOpen, onClose }: JobDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  // Don't render anything if dialog is not open
  if (!isOpen) {
    return null;
  }
  
  // Show error state if job is null
  if (!job) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <h2 className="text-lg font-medium">Job not found</h2>
          </DialogHeader>
          <p className="text-center py-8">Sorry, the job details could not be loaded.</p>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.job_title,
        text: `Check out this job: ${job.job_title} at ${job.company}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto max-w-[95vw] p-3 sm:p-6">
        <DialogHeader>
          <JobDetailHeader 
            job={job} 
            isSaved={isSaved} 
            onToggleSave={onToggleSave} 
            onShare={handleShare} 
          />
          <JobMetadata job={job} />
        </DialogHeader>
        
        <JobDetailTabs 
          job={job} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onApply={onApply} 
        />
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <JobDetailFooter 
            jobId={job.id} 
            isSaved={isSaved} 
            onToggleSave={onToggleSave} 
            onApplyTab={() => setActiveTab("apply")} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetail;
