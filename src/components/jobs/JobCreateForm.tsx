import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Currency, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Job, JobType, LocationType, RoleCategory } from "@/hooks/useJobsData";
import { supabase } from "@/integrations/supabase/client";

import { postData } from "@/api/ClientFuntion";

interface JobCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

const JobCreateForm = ({
  isOpen,
  onClose,
  onJobCreated,
}: JobCreateFormProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    job_title: "",
    company: "",
    job_description: "",
    job_type: "Full-time",
    role_category: "Acting",
    location: "",
    location_type: "On-site",
    requirements: [],
    responsibilities: [],
    tags: [],
    is_featured: false,
    currency: "INR",
    experience_level: "",
  });
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...(prev.requirements || []), currentRequirement.trim()],
      }));
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index),
    }));
  };

  const addResponsibility = () => {
    if (currentResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...(prev.responsibilities || []),
          currentResponsibility.trim(),
        ],
      }));
      setCurrentResponsibility("");
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to create a project",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        job_title: formData.job_title,
        company: formData.company,
        company_logo_url: formData.company_logo,
        job_type: formData.job_type,
        role_category: formData.role_category,
        location: formData.location,
        location_type: formData.location_type,
        min_salary: formData.min_salary,
        max_salary: formData.max_salary,
        job_description: formData.job_description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        tags: formData.tags,
        application_url: formData.application_url,
        application_email: formData.application_email,
        is_featured: formData.is_featured || false,
        user_id: user.id,
        currency: formData.currency,
        experience_level: formData.experience_level,
      };
      console.log(payload);
      const response = await postData("/api/jobs", payload);
      console.log("✅ Job created:", response);
      toast({
        title: "Job created successfully",
      });
      onClose();
      onJobCreated();
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast({
        title: "Error in creating Job",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Listing</DialogTitle>
          <DialogDescription>
            Fill in the details for your new job opportunity in the film
            industry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="job_title" className="block mb-2">
                Job title*
              </Label>
              <Input
                id="job_title"
                name="job_title"
                placeholder="e.g., Lead Actor for Indie Film"
                value={formData.job_title}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="block mb-2">
                Company/Studio*
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g., Sunrise Productions"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_logo" className="block mb-2">
                Company Logo URL
              </Label>
              <Input
                id="company_logo"
                name="company_logo"
                placeholder="https://example.com/logo.png"
                value={formData.company_logo || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="job_type" className="block mb-2">
                Job Type*
              </Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => handleSelectChange("job_type", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Full-time",
                    "Part-time",
                    "Contract",
                    "Temporary",
                    "Project",
                  ].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role_category" className="block mb-2">
                Role Category*
              </Label>
              <Select
                value={formData.role_category}
                onValueChange={(value) =>
                  handleSelectChange("role_category", value)
                }
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
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
                    "Costume",
                    "Makeup",
                    "Other",
                  ].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="block mb-2">
                Location*
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Los Angeles, CA or Remote"
                value={formData.location}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                required
              />
            </div>

            <div>
              <Label htmlFor="location_type" className="block mb-2">
                Location Type*
              </Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) =>
                  handleSelectChange("location_type", value)
                }
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
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
              <Label htmlFor="min_salary" className="block mb-2">
                Min Salary
              </Label>
              <Input
                id="min_salary"
                name="min_salary"
                type="number"
                placeholder="e.g., 50000"
                value={formData.min_salary || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="max_salary" className="block mb-2">
                Max Salary
              </Label>
              <Input
                id="max_salary"
                name="max_salary"
                type="number"
                placeholder="e.g., 80000"
                value={formData.max_salary || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="currency" className="block mb-2">
                Currency
              </Label>
              <Select
                value={formData.currency || "INR"}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
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
              <Label htmlFor="payment_period" className="block mb-2">
                Payment Period
              </Label>
              <Select
                value={formData.payment_period || "yearly"}
                onValueChange={(value) =>
                  handleSelectChange("payment_period", value)
                }
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "hourly",
                    "daily",
                    "weekly",
                    "monthly",
                    "yearly",
                    "fixed",
                  ].map((period) => (
                    <SelectItem key={period} value={period}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block mb-2">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full bg-cinematic-dark/50 border-gold/10 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadlineDate ? (
                      format(deadlineDate, "PPP")
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black">
                  <Calendar
                    mode="single"
                    selected={deadlineDate}
                    onSelect={setDeadlineDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="experience_level" className="block mb-2">
                Experience Level
              </Label>
              <Select
                value={formData.experience_level || ""}
                onValueChange={(value) =>
                  handleSelectChange("experience_level", value)
                }
              >
                <SelectTrigger className="bg-cinematic-dark/50 border-gold/10 focus:border-gold">
                  <SelectValue placeholder="Select experience level" />{" "}
                  {/* Updated placeholder */}
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Entry-level",
                    "Junior",
                    "Mid-level",
                    "Senior",
                    "Lead",
                    "Expert",
                  ].map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job job_description */}
          <div>
            <Label htmlFor="job_description" className="block mb-2">
              Job job_description*
            </Label>
            <Textarea
              id="job_description"
              name="job_description"
              placeholder="Provide a detailed job_description of the job..."
              value={formData.job_description}
              onChange={handleInputChange}
              className="min-h-32 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <Label className="block mb-2">Requirements</Label>
            <div className="space-y-2">
              {formData.requirements?.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-cinematic-dark/30 rounded-md"
                >
                  <span className="flex-1">{req}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement"
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === "Enter" && addRequirement()}
                />
                <Button
                  variant="outline"
                  onClick={addRequirement}
                  disabled={!currentRequirement.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <Label className="block mb-2">Responsibilities</Label>
            <div className="space-y-2">
              {formData.responsibilities?.map((resp, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-cinematic-dark/30 rounded-md"
                >
                  <span className="flex-1">{resp}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeResponsibility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a responsibility"
                  value={currentResponsibility}
                  onChange={(e) => setCurrentResponsibility(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === "Enter" && addResponsibility()}
                />
                <Button
                  variant="outline"
                  onClick={addResponsibility}
                  disabled={!currentResponsibility.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="block mb-2">Tags</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-cinematic-dark/50 border border-gold/10 rounded-full"
                  >
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-transparent text-foreground/60 hover:text-foreground"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., Feature Film, Voice Over)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                />
                <Button
                  variant="outline"
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Application Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="application_url" className="block mb-2">
                Application URL
              </Label>
              <Input
                id="application_url"
                name="application_url"
                placeholder="https://example.com/apply"
                value={formData.application_url || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>

            <div>
              <Label htmlFor="application_email" className="block mb-2">
                Application Email
              </Label>
              <Input
                id="application_email"
                name="application_email"
                placeholder="jobs@example.com"
                value={formData.application_email || ""}
                onChange={handleInputChange}
                className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange("is_featured", checked as boolean)
              }
            />
            <Label htmlFor="is_featured" className="cursor-pointer">
              Mark as Featured Job (gives higher visibility)
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gold hover:bg-gold-dark text-cinematic"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobCreateForm;
