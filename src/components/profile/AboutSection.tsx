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

  const about = {
    bio:
      profile?.bio ||
      `Passionate actor with over 5 years of experience in film and theater.`,
    details: [
      { label: "Age Range", value: profile?.age_range || "25-35" },
      { label: "Height", value: profile?.height || "5'10\"" },
      { label: "Weight", value: profile?.weight || "160 lbs" },
      { label: "Hair Color", value: profile?.hair_color || "Brown" },
      { label: "Eye Color", value: profile?.eye_color || "Hazel" },
      { label: "Languages", value: profile?.languages || "English, Spanish" },
      { label: "Union Status", value: profile?.union_status || "SAG-AFTRA" },
      {
        label: "Representation",
        value: profile?.representation || "Elite Talent Agency",
      },
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
    if (isEditing && profile && Object.keys(profile).length > 0) {
      form.reset({
        bio:
          profile.bio ||
          `Passionate actor with over 5 years of experience in film and theater.`,
        ageRange: profile.age_range || "25-35",
        height: profile.height || "5'10\"",
        weight: profile.weight || "160 lbs",
        hairColor: profile.hair_color || "Brown",
        eyeColor: profile.eye_color || "Hazel",
        languages: profile.languages || "English, Spanish",
        unionStatus: profile.union_status || "SAG-AFTRA",
        representation: profile.representation || "Elite Talent Agency",
      });
    }
  }, [isEditing, profile, form]);

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
