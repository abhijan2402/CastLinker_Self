
import { useState } from "react";
import { Bookmark, BookmarkCheck, Calendar, ChevronDown, DollarSign, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/jobTypes";
import { formatDate, formatSalary } from "./utils/jobFormatters";
import { useAuth } from "@/contexts/AuthContext";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onSaveClick: (jobId: string) => void;
  onViewDetailsClick: (job: Job) => void;
  onApplyClick: (job: Job) => void;
}

const JobCard = ({ 
  job, 
  isSaved, 
  onSaveClick,  
  onViewDetailsClick, 
  onApplyClick 
}: JobCardProps) => {
  const { user } = useAuth();
  const isFeatured = job.is_featured;
  const isRemote = job.location_type === 'Remote';
  
  return (
    <Card
      className={`border-border/40 overflow-hidden transition-all hover:shadow-md hover:border-gold/20 cursor-pointer ${
        isFeatured ? "border-l-4 border-l-gold" : ""
      }`}
      onClick={() => onViewDetailsClick(job)}
    >
      <CardContent className="p-0">
        {isFeatured && (
          <div className="bg-gold/10 py-1 px-3 sm:px-4">
            <span className="text-gold text-xs font-medium">
              Featured Opportunity
            </span>
          </div>
        )}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-4">
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <h3 className="font-bold text-lg sm:text-xl leading-tight">
                {job.job_title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:text-gold h-8 w-8 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick(job.id);
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              ) : (
                <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
            {job.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {job.location}
                </span>
                {isRemote && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    Remote
                  </Badge>
                )}
              </div>
            )}

            {job.createdAt && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-muted-foreground">
              ₹<span>{formatSalary(job)}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm line-clamp-2">
            {job.job_description}
          </p>

          {job.requirements && job.requirements.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {job.requirements.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-muted text-foreground text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-muted text-foreground text-xs"
                >
                  +{job.requirements.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gold/30 text-gold hover:bg-gold/5 text-xs h-8 px-2 sm:px-3"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailsClick(job);
              }}
            >
              View Details
              <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {user && (
              <Button
                size="sm"
                className="bg-gold hover:bg-gold/90 text-white dark:text-black text-xs h-8 px-2 sm:px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyClick(job);
                }}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
