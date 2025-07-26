import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, MessageSquare, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJobsData } from "@/hooks/useJobsData";
import { deleteData, postData, updateData } from "@/api/ClientFuntion";
import { toast } from "@/hooks/use-toast";
import JobForm from "@/components/admin/JobForm";

// Using the dummy job data structure for now
const dummyJobs = [
  {
    id: "63",
    title: "Frontend Developer",
    description: "Develop and maintain user interfaces.",
    companyName: "Innovate Solutions",
    category: "Technology",
    jobType: "Full-time",
    location: "Remote",
    salaryRange: "$80,000 - $100,000",
    requiredSkills: ["React", "TypeScript", "CSS"],
    experienceLevel: "Mid-Level",
    languageRequirements: ["English"],
    applicationDeadline: "2023-12-31",
    numberOfOpenings: 2,
    genderPreference: "Any",
    postedDate: "2023-11-15",
    expiryDate: "2024-01-15",
    status: "active",
    applicants: [
      {
        id: "app_001",
        name: "Alice Smith",
        role: "Frontend Developer",
        location: "London",
        appliedDate: "2023-12-01",
        status: "New",
      },
      {
        id: "app_002",
        name: "Bob Johnson",
        role: "UI/UX Designer",
        location: "New York",
        appliedDate: "2023-12-02",
        status: "Selected",
      },
      {
        id: "app_003",
        name: "Charlie Brown",
        role: "Marketing Intern",
        location: "San Francisco",
        appliedDate: "2023-12-03",
        status: "Rejected",
      },
      {
        id: "app_004",
        name: "David Green",
        role: "Project Manager",
        location: "Remote",
        appliedDate: "2023-12-04",
        status: "New",
      },
    ],
  },
  {
    id: "job_002",
    title: "Marketing Specialist",
    description: "Plan and execute marketing campaigns.",
    companyName: "Creative Minds",
    category: "Marketing",
    jobType: "Part-time",
    location: "San Francisco",
    salaryRange: "$40,000 - $50,000",
    requiredSkills: ["SEO", "Content Marketing"],
    experienceLevel: "Entry-Level",
    languageRequirements: ["English"],
    applicationDeadline: "2024-01-15",
    numberOfOpenings: 1,
    genderPreference: "Any",
    postedDate: "2023-11-20",
    expiryDate: "2024-02-20",
    status: "active",
    applicants: [
      {
        id: "app_005",
        name: "Eve Adams",
        role: "Social Media Manager",
        location: "San Francisco",
        appliedDate: "2023-12-05",
        status: "New",
      },
    ],
  },
];

const UserJobDetail = () => {
  const navigate = useNavigate();
  const { jobs, refetchJobs, myJobs, fetchMyJobs } = useJobsData();
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [applicantFilter, setApplicantFilter] = useState<
    "All" | "New" | "Selected" | "Rejected"
  >("All");

  useEffect(() => {
    const foundJob = myJobs.find((j) => j.id === Number(jobId));
    setJob(foundJob || null);
  }, [jobId, myJobs, jobs]);

  console.log(job, jobId);
  console.log(myJobs);

  if (!job) {
    return (
      <div className="container mx-auto py-6 text-center">Job not found.</div>
    );
  }

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
      case "Selected":
        return "default";
      case "Rejected":
        return "destructive";
      case "New":
        return "secondary";
      default:
        return "outline";
    }
  };

  const generateJobId = (id: string | number) => {
    const strId = String(id); // Convert number to string safely
    const hash = strId.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const jobIdNumber = Math.abs(hash).toString().padStart(6, "0").slice(0, 6);
    return `JB-${jobIdNumber}`;
  };

  const filteredApplicants = job.applicants.filter((applicant) => {
    if (applicantFilter === "All") {
      return true;
    }
    return applicant.status === applicantFilter;
  });

  const handleChat = (applicantId: string) => {
    console.log("Chat with applicant:", applicantId);
  };

  const handleSelect = (applicantId: string, userId: string) => {
    console.log("Select applicant:", applicantId);
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

  // Placeholder function for editing the job
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
      navigate("/manage");
    }
    // Implement edit functionality (e.g., open a modal or navigate to an edit page)
  };

  // Placeholder function for deleting the job
  const handleDeleteJob = async () => {
    try {
      const rawResponse: any = await deleteData(`/api/jobs/admin/${job?.id}`);
      if (rawResponse.message) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });

        fetchMyJobs();
        navigate("/manage");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update job status",
      });
    }
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
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Job Details</h1>
            <p className="text-muted-foreground">
              Comprehensive view of Job ID: {generateJobId(job.id)}
            </p>
          </div>
          {/* Optional: Add action buttons here */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditJob(job)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteJob}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Job Title</p>
              <p className="text-muted-foreground text-sm">{job.job_title}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Company Name</p>
              <p className="text-muted-foreground text-sm">{job.company}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Category</p>
              <Badge variant="secondary">{job.role_category}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Job Type</p>
              <p className="text-muted-foreground text-sm">{job.job_type}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Location</p>
              <p className="text-muted-foreground text-sm">
                {job.location || "NA"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Salary Range</p>
              <p className="text-muted-foreground text-sm">
                ₹{job.min_salary} - ₹{job.max_salary}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">
                Experience Level
              </p>
              <p className="text-muted-foreground text-sm">
                {job.experience_level || "NA"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Dates and Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Posted Date</p>
              <p className="text-muted-foreground text-sm">
                {formatDate(job.createdAt)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">
                Application Deadline
              </p>
              <p className="text-muted-foreground text-sm">
                {job.application_deadline || "NA"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">Status</p>
              <Badge variant={getStatusBadgeVariant(job.status)}>
                {job.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none">
                Verification Status
              </p>
              <Badge variant="secondary">Not Verified</Badge>
              {/* Placeholder */}
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {job.job_description}
            </p>
          </CardContent>
        </Card>

        {/* Requirements and Posted By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  <strong>Skills:</strong>
                  {job.tags?.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Posted By */}
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                User profile link goes here (Placeholder)
              </p>
              {/* Placeholder */}
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplicants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Applicant Filter Buttons */}
            <div className="mb-4 flex items-center">
              <span className="mr-2 text-sm font-medium">Filter:</span>
              <Button
                variant={applicantFilter === "All" ? "default" : "outline"}
                size="sm"
                className="mr-2"
                onClick={() => setApplicantFilter("All")}
              >
                All
              </Button>
              <Button
                variant={applicantFilter === "New" ? "default" : "outline"}
                size="sm"
                className="mr-2"
                onClick={() => setApplicantFilter("New")}
              >
                New
              </Button>
              <Button
                variant={applicantFilter === "Selected" ? "default" : "outline"}
                size="sm"
                className="mr-2"
                onClick={() => setApplicantFilter("Selected")}
              >
                Selected
              </Button>
              <Button
                variant={applicantFilter === "Rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setApplicantFilter("Rejected")}
              >
                Rejected
              </Button>
            </div>

            {filteredApplicants.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No applicants found for this job with the selected filter.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role/Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">
                          {applicant.username}
                        </TableCell>
                        <TableCell>{job.role_category}</TableCell>
                        <TableCell>{job.location}</TableCell>

                        <TableCell>
                          <Badge
                            variant={getApplicantStatusBadgeVariant(
                              applicant.status
                            )}
                          >
                            {applicant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
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
                                handleSelect(job?.id, applicant?.user_id)
                              }
                              title="Select"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(applicant.id)}
                            title="Reject"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Placeholder for Sorting and Pagination */}
            {/* <div className="flex justify-between items-center mt-4">
            <div>Sorting options here</div>
            <div>Pagination controls here</div>
          </div> */}
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

export default UserJobDetail;
