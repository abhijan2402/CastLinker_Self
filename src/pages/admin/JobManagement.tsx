import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import JobForm from "@/components/admin/JobForm";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/hooks/useJobsData";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { seedJobsData } from "@/utils/seedJobsData";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
  updateData,
} from "@/api/ClientFuntion";
import { useAuth } from "@/contexts/AuthContext";
type FetchJobsResponse = {
  data: Job[];
  error?: string;
};

type DeleteEventResponse = {
  success: boolean;
  message: string;
};
const JobManagement = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      fetchJobs();
    };

    initializeData();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);

    try {
      const response = (await fetchData(
        "/api/jobs/admin"
      )) as FetchJobsResponse;

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to fetch jobs");
      }

      const jobsData = response.data as Job[];

      setJobs(jobsData);
      setFilteredJobs(jobsData);

      const activeCount = jobsData.filter(
        (job) => job.status === "active"
      ).length;
      const pendingCount = jobsData.filter(
        (job) => job.status === "pending"
      ).length;

      setTotalJobs(jobsData.length);
      setActiveJobs(activeCount);
      setPendingJobs(pendingCount);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to load jobs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.job_title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    }
  };

  const handleJobSubmit = async (jobData: Partial<Job>) => {
    // console.log("Raw job data:", jobData);

    const payload: Partial<Job> = {
      job_title: jobData.job_title || "",
      company: jobData.company || "",
      job_description: jobData.job_description || "",
      job_type: jobData.job_type || "Full-time",
      role_category: jobData.role_category,
      location: jobData.location || "",
      location_type: jobData.location_type || "On-site",
      status: jobData.status || "active",
      is_featured: jobData.is_featured ?? false,
      company_logo: jobData.company_logo || "",
      min_salary: jobData.min_salary || 0,
      max_salary: jobData.max_salary || 0,
      currency: jobData.currency || "INR",
      application_url: jobData.application_url || "",
      application_email: jobData.application_email || "",
      createdAt: jobData.createdAt || new Date().toISOString(),
    };

    const endpoint = currentJob
      ? `/api/jobs/admin/${currentJob.id}` // Update
      : "/api/jobs/admin"; // Create

    const response = currentJob
      ? await updateData(endpoint, payload)
      : await postData(endpoint, payload);

    const result = response as {
      success?: boolean;
      error?: { message: string };
      message?: string;
    };
    console.log(result);
    if (!result) {
      throw new Error(result?.error?.message || result?.message);
    }

    if (response) {
      toast({
        title: "Success",
        description: currentJob
          ? "Job updated successfully"
          : "Job created successfully",
      });

      fetchJobs(); // Refresh job list
      setIsJobFormOpen(false);
      setCurrentJob(null);
    }
  };

  const handleEditJob = (job: Job) => {
    setCurrentJob(job);
    setIsJobFormOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!currentJob) return;

    try {
      const rawResponse = await deleteData(`/api/jobs/admin/${currentJob.id}`);
      const result = rawResponse as DeleteEventResponse;

      // console.log(result);

      if (!result.message) {
        throw new Error(result.message || "Failed to delete event");
      }

      if (result.message) {
        toast({
          title: "Success",
          description: "Job deleted successfully",
        });

        fetchJobs();
        setIsDeleteDialogOpen(false);
        setCurrentJob(null);
      }
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete job",
      });
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    const newStatus = job.status === "active" ? "inactive" : "active";
    try {
      const response = (await patchData(`/api/jobs/admin/${job.id}/status`, {
        status: newStatus,
      })) as {
        error?: string;
      };

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: "Success",
        description: `Job ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`,
      });

      fetchJobs();
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update job status",
      });
    }
  };

  const handleApproveJob = async (job: Job) => {
    try {
      // const response = (await fetchData(
      //   `/api/jobs/admin/${job.id}/status`
      // )) as {
      //   error?: string;
      // };

      // if (response.error) {
      //   throw new Error(response.error);
      // } else {
      //   toast({
      //     title: "Success",
      //     description: "Job approved successfully",
      //   });

      //   fetchJobs();
      // }
    } catch (error: any) {
      console.error("Error approving job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve job",
      });
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Pending Review
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // const generateJobId = (id: string, company: string) => {
  //   if (!id) return "N/A";
  //   return `JOB-${company?.substring(0, 3).toUpperCase() || "XXX"}-${id
  //     .substring(0, 5)
  //     .toUpperCase()}`;
  // };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">
            Job Management
          </h1>
          <p className="text-muted-foreground">
            Manage job listings and applications on the platform.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Jobs</CardTitle>
                <CardDescription>All job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{totalJobs}</span>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Jobs</CardTitle>
                <CardDescription>Currently active listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{activeJobs}</span>
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Review</CardTitle>
                <CardDescription>Jobs awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{pendingJobs}</span>
                  <div className="p-2 bg-amber-500/10 rounded-full">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setCurrentJob(null);
                      setIsJobFormOpen(true);
                    }}
                    className="bg-gold hover:bg-gold/90 text-black w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>
                Manage all job postings across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Loading jobs...
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-mono text-xs">
                            {/* {generateJobId(job.id, job.company || "")} */}
                            {job.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {job.job_title}
                          </TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{formatDate(job.createdAt)}</TableCell>
                          <TableCell>
                            {getStatusBadge(job.status || "active")}
                          </TableCell>
                          <TableCell>
                            {Math.floor(Math.random() * 30)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditJob(job)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {job.status === "pending" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-500"
                                  onClick={() => handleApproveJob(job)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={
                                    job.status === "active"
                                      ? "text-amber-500"
                                      : "text-green-500"
                                  }
                                  onClick={() => handleToggleJobStatus(job)}
                                >
                                  {job.status === "active" ? (
                                    <Clock className="h-4 w-4" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => {
                                  setCurrentJob(job);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No jobs found. Try adjusting your search or create a
                          new job.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <JobForm
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setCurrentJob(null);
        }}
        onSubmit={handleJobSubmit}
        job={currentJob}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCurrentJob(null);
        }}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description={`Are you sure you want to delete the job "${currentJob?.job_title}"? This action cannot be undone.`}
      />
    </>
  );
};

export default JobManagement;
