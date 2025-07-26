import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Users } from "lucide-react";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "@/api/ClientFuntion";
import { useJobsData } from "@/hooks/useJobsData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import JobForm from "../admin/JobForm";

interface Applicant {
  user_id: number;
  username: string;
  email: string;
  status: string;
}

interface RawJob {
  job_id: number;
  title: string;
}

const UserJobManagement = () => {
  const { user } = useAuth();
  const { jobs, refetchJobs, myJobs, fetchMyJobs } = useJobsData();
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applicantFilter, setApplicantFilter] = useState<
    "All" | "New" | "Hired" | "Rejected"
  >("All");

  useEffect(() => {
    fetchMyJobs();
  }, [jobs]);

  const toggleExpand = (jobId: string) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  const handleChat = (applicantId: string) => {
    console.log("Chat with applicant:", applicantId);
    // Implement chat functionality
  };

  const handleSelect = (applicantId: string, userId: string) => {
    console.log("Select applicant:", applicantId, userId);
    const payload = {
      job_id: applicantId,
      user_id: userId,
    };
    const res = postData("/api/jobs/hire", payload);
    if (res) {
      fetchMyJobs();
    }
  };

  const handleReject = (applicantId: string) => {
    console.log("Reject applicant:", applicantId);
    // Implement reject functionality
  };

  // Placeholder function for editing a job
  const handleEditJob = async (job: any) => {
    console.log("Edit job:", job);
    setIsJobFormOpen(true);
    setCurrentJob(job);
    const payload: any = {
      job_title: job.job_title || "",
      company: job.company || "",
      job_description: job.job_description || "",
      job_type: job.job_type || "Full-time",
      role_category: job.role_category,
      location: job.location || "",
      location_type: job.location_type || "On-site",
      status: job.status || "active",
      is_featured: job.is_featured ?? false,
      company_logo: job.company_logo || "",
      min_salary: job.min_salary || 0,
      max_salary: job.max_salary || 0,
      currency: job.currency || "INR",
      application_url: job.application_url || "",
      application_email: job.application_email || "",
      createdAt: job.createdAt || new Date().toISOString(),
    };

    const endpoint = currentJob && `/api/jobs/admin/${currentJob.id}`;

    const response: any = currentJob && (await updateData(endpoint, payload));
    if (response.message || response.success || response) {
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
      fetchMyJobs();
      setIsJobFormOpen(false);
      setCurrentJob(null);
    }
    // Implement edit functionality (e.g., open a modal or navigate to an edit page)
  };

  // Placeholder function for deleting a job
  const handleDeleteJob = async (jobId: string) => {
    try {
      const rawResponse: any = await deleteData(`/api/jobs/admin/${jobId}`);
      if (rawResponse.message) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });

        fetchMyJobs();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update job status",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getApplicantStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "hired":
        return "default";
      case "Rejected":
        return "destructive";
      case "New":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredApplicants = (applicants: (typeof myJobs)[0]["applicants"]) => {
    if (applicantFilter === "All") {
      return applicants;
    }
    return applicants.filter(
      (applicant: any) => applicant.status === applicantFilter?.toLowerCase()
    );
  };

  const generateJobId = (id: string) => {
    const hash = id.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const jobIdNumber = Math.abs(hash).toString().padStart(6, "0").slice(0, 6);
    return `JB-${jobIdNumber}`;
  };

  const formatDate = (isoDate: string | null | undefined) => {
    if (!isoDate) return "Not specified";

    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter buttons for applicants */}
            <div className="mb-4 flex items-center">
              <span className="mr-2">Filter Applicants:</span>
              <Button
                variant={applicantFilter === "All" ? "default" : "outline"}
                size="sm"
                className="mr-2"
                onClick={() => setApplicantFilter("All")}
              >
                All (
                {myJobs.reduce((acc, job) => acc + job.applicants.length, 0)})
              </Button>

              <Button
                variant={applicantFilter === "Hired" ? "default" : "outline"}
                size="sm"
                className="mr-2"
                onClick={() => setApplicantFilter("Hired")}
              >
                Hired (
                {myJobs.reduce(
                  (acc, job) =>
                    acc +
                    job.applicants.filter((app: any) => app?.status === "hired")
                      .length,
                  0
                )}
                )
              </Button>
              {/* <Button
            variant={applicantFilter === "Rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setApplicantFilter("Rejected")}
          >
            Rejected (
            {myJobs.reduce(
              (acc, job) =>
                acc +
                job.applicants.filter((app: any) => app.status === "Rejected")
                  .length,
              0
            )}
            )
          </Button> */}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myJobs.map((job) => (
                    <React.Fragment key={job.id}>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link
                            to={`/manage/jobs/${job.id}`}
                            className="text-primary hover:underline"
                          >
                            {generateJobId(job.id.toString())}
                          </Link>
                        </TableCell>
                        <TableCell>{job.job_title || "NA"}</TableCell>
                        <TableCell>{job.company || "NA"}</TableCell>
                        <TableCell>{job.job_type || "NA"}</TableCell>
                        <TableCell>{job.location || "NA"}</TableCell>
                        <TableCell>{formatDate(job.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {job?.applicants?.length || 0}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => toggleExpand(job.id.toString())}
                              >
                                {expandedJobId === job.id.toString()
                                  ? "Hide Applicants"
                                  : "View Applicants"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditJob(job)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteJob(job.id.toString())
                                }
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {expandedJobId === job.id.toString() && (
                        <TableRow>
                          <TableCell colSpan={9} className="p-0">
                            <div className="p-4 bg-muted/20">
                              {/* <h5 className="font-semibold mb-2">
                            Applicants (
                            {filteredApplicants(job.applicants).length})
                          </h5> */}
                              {filteredApplicants(job.applicants).length ===
                              0 ? (
                                <p className="text-muted-foreground text-sm">
                                  No applicants found with the selected filter.
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {filteredApplicants(job?.applicants).map(
                                    (applicant: any) => (
                                      <div
                                        key={applicant?.id}
                                        className="flex items-center justify-between p-3 border rounded-md bg-background"
                                      >
                                        <div>
                                          <p className="font-medium">
                                            {applicant?.username}
                                          </p>

                                          <p className="text-muted-foreground text-sm">
                                            {job?.role_category} -{" "}
                                            {job?.location || "NA"}
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <Badge
                                            variant={getApplicantStatusBadgeVariant(
                                              applicant?.status || "New"
                                            )}
                                          >
                                            {applicant?.status?.toUpperCase() ||
                                              "New"}
                                          </Badge>
                                          {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleChat(applicant.id)}
                                        title="Chat"
                                      >
                                        <MessageSquare className="h-4 w-4" />
                                      </Button> */}
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              handleSelect(
                                                job?.id,
                                                applicant?.user_id
                                              )
                                            }
                                            title="Select"
                                          >
                                            <Check className="h-4 w-4 text-green-600" />
                                          </Button>
                                          {/* <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleReject(applicant.id)
                                        }
                                        title="Reject"
                                      >
                                        <X className="h-4 w-4 text-red-600" />
                                      </Button> */}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <JobForm
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setCurrentJob(null);
        }}
        onSubmit={handleEditJob}
        job={currentJob}
        role={"admin"}
      />
    </>
  );
};

export default UserJobManagement;
