import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  ClockIcon,
  CalendarIcon,
  Share2,
  Bookmark,
  ExternalLink,
  Mail,
} from "lucide-react";
import { formatDate, formatSalary } from "./utils/jobFormatters";

const DashJobDetails = ({ job, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!job) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <h2 className="text-lg font-medium">Job not found</h2>
          </DialogHeader>
          <p className="text-center py-8">
            Sorry, the job details could not be loaded.
          </p>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto max-w-[95vw] p-3 sm:p-6">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              {job.is_featured && (
                <Badge className="bg-gold/80 hover:bg-gold text-black border-none">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Meta Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/70">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground/50" />
              <span>
                {job.location} • {job.location_type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-foreground/50" />
              <span>{formatSalary(job)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-foreground/50" />
              <span>Posted: {formatDate(job.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-foreground/50" />
              <span>Deadline: {formatDate(job.application_deadline)}</span>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="bg-cinematic-dark/50 border border-gold/10">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="responsibilities">
                Responsibilities
              </TabsTrigger>
              {/* <TabsTrigger value="apply">Apply</TabsTrigger> */}
            </TabsList>

            {/* Tab Content: Details */}
            <TabsContent
              value="details"
              className="mt-4 text-foreground/80 leading-relaxed"
            >
              <h3 className="text-lg font-medium mb-2">Job Description</h3>
           <div className="max-h-16 overflow-y-auto">
  <p className="text-xs sm:text-sm whitespace-normal" style={{ overflowWrap: 'anywhere' }}>
    {job.job_description}
  </p>
</div>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-cinematic-dark/70 border border-gold/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            {/* Tab Content: Requirements */}
            <TabsContent value="requirements" className="mt-4">
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              {job.requirements?.length ? (
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/60">
                  No specific requirements listed.
                </p>
              )}
            </TabsContent>

            {/* Tab Content: Responsibilities */}
            <TabsContent value="responsibilities" className="mt-4">
              <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
              {job.responsibilities?.length ? (
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/60">
                  No specific responsibilities listed.
                </p>
              )}
            </TabsContent>

            {/* Tab Content: Apply */}
            <TabsContent value="apply" className="mt-4">
              <h3 className="text-lg font-medium mb-4">
                Apply for This Position
              </h3>
              <div className="space-y-6">
                <div className="bg-cinematic-dark/30 p-4 rounded-lg border border-gold/10 space-y-3">
                  <h4 className="font-medium mb-2">Application Options:</h4>
                  {job.application_url && (
                    <Button variant="outline" className="w-full border-gold/30">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply on External Website
                    </Button>
                  )}
                  {job.application_email && (
                    <Button variant="outline" className="w-full border-gold/30">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Your Application
                    </Button>
                  )}
                </div>
                <div className="text-sm text-foreground/60">
                  This job will be accepting applications until{" "}
                  {formatDate(job.application_deadline)}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashJobDetails;
