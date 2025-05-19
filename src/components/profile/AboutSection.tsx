import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { postData, updateData } from "@/api/ClientFuntion";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { toast } from "react-toastify";

const AboutSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { profile, fetchProfile } = useTalentProfile(user);

  // In a real app, this data would come from API/context
  const parsedTechnicalSkills = (() => {
    try {
      const parsed = JSON.parse(profile?.technical_skills || "[]");
      if (Array.isArray(parsed)) {
        return parsed.map((skill) => skill.name).join(", ");
      }
      return "--";
    } catch {
      return "--";
    }
  })();

  const parsedActingSkills = (() => {
    try {
      const parsed = JSON.parse(profile?.acting_skills || "[]");
      if (Array.isArray(parsed)) {
        return parsed.map((skill) => skill.name).join(", ");
      }
      return "--";
    } catch {
      return "--";
    }
  })();

  const specialSkillsCleaned = (() => {
    try {
      const val = profile?.special_skills;
      if (!val) return "--";
      const parsed = JSON.parse(val); // handles the double quotes
      return typeof parsed === "string" ? parsed : "--";
    } catch {
      return profile?.special_skills || "--";
    }
  })();

  const about = {
    bio: profile?.bio || `Add your bio`,
    details: [
      { label: "Age Range", value: profile?.age_range || "--" },
      { label: "Height", value: profile?.height || "--" },
      { label: "Weight", value: profile?.weight || "--" },
      { label: "Hair Color", value: profile?.hair_color || "--" },
      { label: "Eye Color", value: profile?.eye_color || "--" },
      { label: "Languages", value: profile?.languages || "--" },
      { label: "Union Status", value: profile?.union_status || "--" },
      { label: "Representation", value: profile?.representation || "--" },
    ],
  };

  // Define form for editing about section

  const form = useForm({
    defaultValues: {
      bio: "",
      ageRange: "",
      height: "",
      weight: "",
      hairColor: "",
      eyeColor: "",
      languages: "",
      unionStatus: "",
      representation: "",
    },
  });

  // Reset form with profile data when dialog opens or profile updates
  useEffect(() => {
    if (isEditing && profile) {
      form.reset({
        bio: profile.bio || "",
        ageRange: profile.age_range || "",
        height: profile.height || "",
        weight: profile.weight || "",
        hairColor: profile.hair_color || "",
        eyeColor: profile.eye_color || "",
        languages: profile.languages || "",
        unionStatus: profile.union_status || "",
        representation: profile.representation || "",
      });
    }
  }, [isEditing, profile]);

  const handleSave = async (data: any) => {
    // Map form data to match API schema
    const payload = {
      bio: data.bio,
      age_range: data.ageRange,
      height: data.height,
      weight: data.weight,
      hair_color: data.hairColor,
      eye_color: data.eyeColor,
      languages: data.languages,
      union_status: data.unionStatus,
      representation: data.representation,
      profile_image: data.profile_image || "",
    };

    const res = await updateData("auth/update-profile", payload);
    if (res) {
      fetchProfile();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Biography</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="whitespace-pre-line text-foreground/80">
            {about.bio}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.details.map((detail, index) => (
              <div key={index} className="flex">
                <div className="w-1/3 text-foreground/60">{detail.label}:</div>
                <div className="w-2/3 font-medium">{detail.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        title="Edit About Information"
        description="Update your biographical information and personal details"
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={form.handleSubmit(handleSave)}
      >
        <Form {...form}>
          <div className="max-h-[70vh] overflow-y-auto pr-2 pl-2">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about yourself..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hairColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hair Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eyeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eye Color</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Union Status</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="representation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Representation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </EditProfileDialog>
    </div>
  );
};

export default AboutSection;
