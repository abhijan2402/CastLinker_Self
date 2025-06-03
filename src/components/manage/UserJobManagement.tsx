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
import { fetchData, postData, updateData } from "@/api/ClientFuntion";
import { useJobsData } from "@/hooks/useJobsData";
import { useAuth } from "@/contexts/AuthContext";

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
  const { jobs, refetchJobs } = useJobsData();
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applicantFilter, setApplicantFilter] = useState<
    "All" | "New" | "Hired" | "Rejected"
  >("All");

  const fetchMyJobs = async () => {
    // 1. Fetch jobs
    const jobsRes = await fetchData<{ success: boolean; data: RawJob[] }>(
      "api/jobs/my-jobs-with-applicants"
    );

    if (!jobsRes.success) return;

    // 2. Extract job IDs
    const rawJobIds = jobsRes.data.map((job) => job.job_id);

    // 3. Filter full job data (assuming you have a `jobs` array from global state or elsewhere)
    const myFilteredJobs = jobs.filter((job) => rawJobIds.includes(job.id));

    // 4. Fetch applicants for each job using Promise.all
    const applicantPromises = myFilteredJobs.map((job) =>
      fetchData<{ success: boolean; data: Applicant[] | Applicant }>(
        `api/jobs/job-applicants/${job.id}`
      ).then((res) => ({
        jobId: job.id,
        applicants: res.success
          ? Array.isArray(res.data)
            ? res.data
            : [res.data]
          : [],
      }))
    );

    const applicantsResults = await Promise.all(applicantPromises);

    // 5. Merge applicants into jobs
    const enrichedJobs = myFilteredJobs.map((job) => {
      const match = applicantsResults.find((a) => a.jobId === job.id);
      return {
        ...job,
        applicants: match?.applicants ?? [],
      };
    });

    // 6. Update state
    setMyJobs(enrichedJobs);
  };

  console.log(myJobs);

  useEffect(() => {
    fetchMyJobs();
  }, [user, jobs]);

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
  const handleEditJob = (jobId: string) => {
    console.log("Edit job:", jobId);
    // Implement edit functionality (e.g., open a modal or navigate to an edit page)
  };

  // Placeholder function for deleting a job
  const handleDeleteJob = (jobId: string) => {
    console.log("Delete job:", jobId);
    // Implement delete functionality (e.g., show a confirmation dialog and make an API call)
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
      (applicant) => applicant.status === applicantFilter?.toLowerCase()
    );
  };

  const generateJobId = (id: string) => {
    const hash = id.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const jobIdNumber = Math.abs(hash).toString().padStart(6, "0").slice(0, 6);
    return `JB-${jobIdNumber}`;
  };

  return (
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
            All ({myJobs.reduce((acc, job) => acc + job.applicants.length, 0)})
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
                job.applicants.filter((app: any) => app.status === "hired")
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
                    <TableCell>{job.job_title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.createdAt}</TableCell>
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
                            onClick={() => handleEditJob(job.id.toString())}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job.id.toString())}
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
                          {filteredApplicants(job.applicants).length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                              No applicants found with the selected filter.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {filteredApplicants(job?.applicants).map(
                                (applicant) => (
                                  <div
                                    key={applicant?.id}
                                    className="flex items-center justify-between p-3 border rounded-md bg-background"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {applicant?.username}
                                      </p>
                                      <p className="text-muted-foreground text-sm">
                                        {job?.role_category} - {job?.location}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge
                                        variant={getApplicantStatusBadgeVariant(
                                          applicant?.status
                                        )}
                                      >
                                        {applicant?.status?.toUpperCase()}
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
  );
};

export default UserJobManagement;
