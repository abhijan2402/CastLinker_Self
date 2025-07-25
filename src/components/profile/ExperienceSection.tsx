import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { fetchData, postData, updateData } from "@/api/ClientFuntion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const CATEGORIES = [
  "Film",
  "Casting Call",
  "Collaboration",
  "Content Creation",
  "Event",
  "Job Opportunity",
  "Mentorship",
  "Other",
];
interface Experience {
  id: number;
  user_id: number;
  type: string;
  project_title: string;
  role: string;
  director: string;
  production_company: string;
  year: string;
  description: string;
  files?: any[];
}

interface ExperienceAPIResponse {
  success: boolean;
  data: Experience[];
  message?: string;
}

const ExperienceSection = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  console.log(experiences);
  const [filters, setFilters] = useState({
    category: "film",
    searchTerm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingExperience, setEditingExperience] = useState<{
    type: string;
    index: number;
    id: number;
  } | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState<string | null>(
    null
  );
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchData(
        `/api/experience?type=${filters?.category?.toLowerCase()}`
      );
      const data = res as ExperienceAPIResponse;
      console.log(data);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch experiences.");
      }

      setExperiences(data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExperiences();
  }, [user, filters]);

  // Form for editing experience
  const experienceForm = useForm({
    defaultValues: {
      title: "",
      role: "",
      director: "",
      company: "",
      year: "",
      description: "",
    },
  });

  // Set form values when editing an experience
  const handleEdit = (type: string, index: number) => {
    const filteredExperiences = experiences.filter((exp) => exp.type === type);

    if (!filteredExperiences[index]) {
      console.warn(`No experience found for type "${type}" at index ${index}`);
      return;
    }

    const experience = filteredExperiences[index];

    experienceForm.reset({
      title: experience.project_title,
      role: experience.role,
      director: experience.director,
      company: experience.production_company,
      year: experience.year,
      description: experience.description,
    });

    setEditingExperience({ type, index, id: experience.id });
  };

  // Set empty form values when adding a new experience
  const handleAdd = (type: string) => {
    experienceForm.reset({
      title: "",
      role: "",
      director: "",
      company: "",
      year: "",
      description: "",
    });
    setIsAddingExperience(type);
  };

  const handleSaveExperience = async (data: any) => {
    const formattedData = {
      type:
        editingExperience?.type.toLowerCase() ||
        isAddingExperience.toLowerCase() ||
        "film",
      project_title: data.title,
      role: data.role,
      director: data.director,
      production_company: data.company,
      year: data.year,
      description: data.description,
      files: data.files || null,
    };
    try {
      let res: any;

      if (isAddingExperience) {
        res = await postData("/api/experience", formattedData);
        console.log(res);
      } else if (editingExperience) {
        res = await updateData(
          `/api/experience/${editingExperience.id}`,
          formattedData
        );
        console.log(res);
      }

      // Check if response indicates success
      if (res && res.success) {
        toast.success(
          editingExperience
            ? "Experience updated successfully!"
            : "New experience added successfully!"
        );
        fetchExperiences();
      } else {
        throw new Error(res?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error saving experience:", error);
      toast.error(error.message || "Failed to save experience.");
      return;
    }
  };

  const closeEditingDialogs = () => {
    setEditingExperience(null);
    setIsAddingExperience(null);
  };

  // Helper function to render experience cards
  const renderExperienceCards = (type: string, data: typeof experiences) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gold">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </h3>
        <div className="flex gap-2 items-center">
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="film">Select Items</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="text-gold border-gold/30 hover:bg-gold/10"
            onClick={() => handleAdd(type)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add{" "}
            {type.charAt(0).toUpperCase() + type.slice(1)} Experience
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <Card className="bg-card-gradient border-gold/10 p-8 text-center">
            <div className="space-y-3">
              <h3 className="text-xl font-medium">No Experiences Available</h3>
              <p className="text-foreground/70">
                You haven't added any experiences yet. Add the experience to
                find opportunities that interest you.
              </p>
            </div>
          </Card>
        ) : (
          data.map((exp, index) => (
            <Card key={index} className="bg-card-gradient border-gold/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">{exp.project_title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/60 text-sm">
                      {exp.year}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gold hover:text-gold hover:bg-gold/10"
                      onClick={() => handleEdit(type?.toLowerCase(), index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gold mb-2">{exp.role}</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-foreground/70 mb-4">
                  <span>Director: {exp.director}</span>
                  <span>
                    {type === "television" ? "Network" : "Production"}:{" "}
                    {exp.production_company}
                  </span>
                </div>
                <p className="text-foreground/80 text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Film Experience */}
      {renderExperienceCards(filters?.category || "All", experiences)}

      {/* Edit Experience Dialog */}
      <EditProfileDialog
        title={
          editingExperience
            ? `Edit ${
                editingExperience.type.charAt(0).toUpperCase() +
                editingExperience.type.slice(1)
              } Experience`
            : `Add New ${
                isAddingExperience
                  ? isAddingExperience.charAt(0).toUpperCase() +
                    isAddingExperience.slice(1)
                  : ""
              } Experience`
        }
        description={
          editingExperience
            ? "Update your experience information"
            : "Add a new experience to your profile"
        }
        isOpen={!!editingExperience || !!isAddingExperience}
        onClose={closeEditingDialogs}
        onSave={experienceForm.handleSubmit(handleSaveExperience)}
      >
        <Form {...experienceForm}>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={experienceForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={experienceForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={experienceForm.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={experienceForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={experienceForm.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={experienceForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your role and experience..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </EditProfileDialog>
    </div>
  );
};

export default ExperienceSection;
