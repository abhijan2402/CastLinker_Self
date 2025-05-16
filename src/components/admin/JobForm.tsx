import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job } from "@/hooks/useJobsData";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { postData } from "@/api/ClientFuntion";
import { useAuth } from "@/contexts/AuthContext";

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Partial<Job>) => void;
  job: Job | null;
}

interface PostDataResponse {
  message: string;
}

const JobForm = ({ isOpen, onClose, onSubmit, job }: JobFormProps) => {
  console.log(job)
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    company: "",
    description: "",
    job_type: "Full-time",
    role_category: "Acting",
    location: "",
    location_type: "On-site",
    status: "active",
    is_featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when job changes
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.job_title || "",
        company: job.company || "",
        description: job.description || "",
        company_logo: job.company_logo || "",
        job_type: job.job_type || "Full-time",
        role_category: job.role_category || "Acting",
        location: job.location || "",
        location_type: job.location_type || "On-site",
        status: job.status || "active",
        is_featured: job.is_featured || false,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_currency: job.salary_currency || "INR",
        salary_period: job.salary_period || "yearly",
        application_url: job.application_url || "",
        application_email: job.application_email || "",
      });
    } else {
      // Reset form for new job
      setFormData({
        title: "",
        company: "",
        description: "",
        job_type: "Full-time",
        role_category: "Acting",
        location: "",
        location_type: "On-site",
        status: "active",
        is_featured: false,
      });
    }
  }, [job, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseInt(value, 10) : undefined;
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add created_at for new jobs
      if (!job) {
        formData.created_at = new Date().toISOString();
      }
      // console.log(formData);
      if (user.role === "admin") {
        onSubmit(formData);
        return;
      }

      // await onSubmit(formData);
      const response = (await postData(
        "/api/jobs",
        formData
      )) as PostDataResponse;
      if (response.message) {
        console.log("✅ Job created:", response);
        toast({
          title: "Job created successfully",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Add New Job"}</DialogTitle>
          <DialogDescription>
            {job
              ? "Update the details of this job listing"
              : "Fill in the details to create a new job listing"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Lead Actor for Feature Film"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="company">Company/Studio *</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g. Universal Studios"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_logo">Company Logo URL</Label>
              <Input
                id="company_logo"
                name="company_logo"
                value={formData.company_logo || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => handleSelectChange("job_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {["Full-time", "Part-time", "Contract", "Temporary"].map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role_category">Role Category *</Label>
              <Select
                value={formData.role_category}
                onValueChange={(value) =>
                  handleSelectChange("role_category", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Acting",
                    "Directing",
                    "Production",
                    "Cinematography",
                    "Writing",
                    "Editing",
                    "Sound",
                    "VFX",
                  ].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Los Angeles, CA"
                required
              />
            </div>

            <div>
              <Label htmlFor="location_type">Location Type *</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) =>
                  handleSelectChange("location_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  {["On-site", "Remote", "Hybrid"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary_min">Min Salary</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                value={formData.salary_min || ""}
                onChange={handleNumberChange}
                placeholder="e.g. 50000"
              />
            </div>

            <div>
              <Label htmlFor="salary_max">Max Salary</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                value={formData.salary_max || ""}
                onChange={handleNumberChange}
                placeholder="e.g. 80000"
              />
            </div>

            <div>
              <Label htmlFor="salary_currency">Currency</Label>
              <Select
                value={formData.salary_currency || "INR"}
                onValueChange={(value) =>
                  handleSelectChange("salary_currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {["INR"].map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary_period">Payment Period</Label>
              <Select
                value={formData.salary_period || "yearly"}
                onValueChange={(value) =>
                  handleSelectChange("salary_period", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {["hourly", "daily", "weekly", "monthly", "yearly"].map(
                    (period) => (
                      <SelectItem key={period} value={period}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the job..."
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="application_url">Application URL</Label>
              <Input
                id="application_url"
                name="application_url"
                value={formData.application_url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/apply"
              />
            </div>

            <div>
              <Label htmlFor="application_email">Application Email</Label>
              <Input
                id="application_email"
                name="application_email"
                value={formData.application_email || ""}
                onChange={handleInputChange}
                placeholder="jobs@example.com"
              />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("is_featured", checked as boolean)
                }
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Mark as Featured Job
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
