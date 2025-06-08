import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { updateData } from "@/api/ClientFuntion";
import { toast } from "react-toastify";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { useAuth } from "@/contexts/AuthContext";

const getDefaultSkillsForRole = (role: string): string[] => {
  switch (role) {
    case "Actor":
      return ["Method Acting", "Improvisation", "Voice Acting"];
    case "Director":
      return ["Shot Composition", "Script Analysis", "Team Leadership"];
    case "Producer":
      return ["Project Management", "Budgeting", "Team Coordination"];
    case "Screenwriter":
      return ["Story Development", "Character Creation", "Dialogue Writing"];
    case "Cinematographer":
      return ["Camera Operation", "Lighting", "Shot Composition"];
    case "Editor":
      return ["Video Editing", "Sound Editing", "Color Correction"];
    case "Sound Designer":
      return ["Sound Mixing", "Foley Art", "Audio Post-production"];
    case "Production Designer":
      return ["Set Design", "Art Direction", "Visual Storytelling"];
    default:
      return [];
  }
};

const getTechnicalSkillsForRole = (role: string): string[] => {
  switch (role) {
    case "Actor":
      return [
        "Green Screen Acting",
        "Motion Capture",
        "Teleprompter Proficiency",
      ];
    case "Director":
      return [
        "Camera Equipment Knowledge",
        "Storyboarding Software (e.g., FrameForge)",
        "Editing Software Basics (e.g., Adobe Premiere Pro)",
      ];
    case "Producer":
      return [
        "Production Management Software (e.g., Movie Magic)",
        "Contract & Rights Handling",
        "Call Sheet & Scheduling Tools",
      ];
    case "Screenwriter":
      return [
        "Scriptwriting Software (e.g., Final Draft, Celtx)",
        "Screenplay Formatting",
        "Writing Collaboration Tools",
      ];
    case "Cinematographer":
      return [
        "Camera Systems (e.g., RED, ARRI)",
        "Gimbal & Steadicam Operation",
        "Digital Imaging (DIT)",
        "Lens Selection & Operation",
      ];
    case "Editor":
      return [
        "Non-linear Editing Software (e.g., Adobe Premiere, Final Cut Pro)",
        "DAW for Syncing Audio (e.g., Pro Tools)",
        "VFX Integration",
      ];
    case "Sound Designer":
      return [
        "DAW Tools (e.g., Pro Tools, Logic Pro)",
        "Sound Libraries",
        "Audio Plugins (e.g., EQ, Compression)",
        "Field Recording Equipment",
      ];
    case "Production Designer":
      return [
        "3D Design Software (e.g., SketchUp, AutoCAD)",
        "Set Budgeting Tools",
        "Prop Fabrication Techniques",
      ];
    default:
      return [];
  }
};
type Skill = {
  name: string;
  level: number;
};
type ActingFormData = {
  acting: Skill[];
};

type TechnicalFormData = {
  technical: Skill[];
};
const isSkillArray = (skills: any): skills is Skill[] => {
  return (
    Array.isArray(skills) &&
    skills.every(
      (s) =>
        s &&
        typeof s === "object" &&
        typeof s.name === "string" &&
        typeof s.level === "number"
    )
  );
};

const SkillsSection = () => {
  const [isEditingActing, setIsEditingActing] = useState(false);
  const [isEditingTechnical, setIsEditingTechnical] = useState(false);
  const [isEditingSpecial, setIsEditingSpecial] = useState(false);
  const [isEditingPhysical, setIsEditingPhysical] = useState(false);
  const { user } = useAuth();
  const { profile, fetchProfile } = useTalentProfile(user);

  const [skills, setSkills] = useState<{ specialSkills: string[] }>({
    specialSkills: [],
  });

  const actingForm = useForm<ActingFormData>({
    defaultValues: {
      acting: [],
    },
  });

  const technicalForm = useForm<TechnicalFormData>({
    defaultValues: {
      technical: [],
    },
  });

  const specialSkillsForm = useForm<{ specialSkills: string }>({
    defaultValues: {
      specialSkills: "",
    },
  });

  useEffect(() => {
    // Default Skills Sets
    const defaultSkillNames = getDefaultSkillsForRole(
      profile?.user_type || "Actor"
    );
    const defaultSkills = defaultSkillNames.map((name) => ({ name, level: 0 }));

    const profileSkills = isSkillArray(profile?.acting_skills)
      ? profile.acting_skills
      : defaultSkills;

    actingForm.reset({
      acting: profileSkills,
    });

    // Default Technial Skills Sets
    const defaultTechnicalSkills = getTechnicalSkillsForRole(
      profile?.user_type || "Actor"
    );
    const defaultTechSkills = defaultTechnicalSkills.map((name) => ({
      name,
      level: 0,
    }));
    const profileTechnicalSkills = isSkillArray(profile?.technical_skills)
      ? profile.technical_skills
      : defaultTechSkills;

    technicalForm.reset({
      technical: profileTechnicalSkills,
    });

    // Special Skills
    if (profile?.special_skills && Array.isArray(profile.special_skills)) {
      setSkills({
        specialSkills: profile.special_skills,
      });
    }
  }, [profile?.user_type, profile?.acting_skills, profile?.technical_skills]);

  const physicalAttributesForm = useForm({
    defaultValues: {
      height: "6'1\" (185 cm)",
      weight: "180 lbs (82 kg)",
      build: "Athletic",
      hairColor: "Brown",
      eyeColor: "Blue",
    },
  });

  const handleSaveActing = async () => {
    const formData = actingForm.getValues();
    const payload = {
      acting_skills: formData.acting,
    };

    const res = await updateData("auth/update-profile", payload);
    if (res) {
      toast.success("Acting Skills Updated Successfully");
      fetchProfile();
    }
  };

  const handleSaveTechnical = async (data: any) => {
    const formData = technicalForm.getValues();
    const payload = {
      technical_skills: formData.technical,
    };

    const res = await updateData("auth/update-profile", payload);
    if (res) {
      toast.success("Technical Skills Updated Successfully");
      fetchProfile();
    }
  };

  const handleSaveSpecialSkills = async (data: any) => {
    const { specialSkills } = specialSkillsForm.getValues();

    console.log("Raw specialSkills:", specialSkills);

    const skillsArray = specialSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log("Processed skillsArray:", skillsArray);

    const payload = { special_skills: skillsArray };

    console.log("Payload to send:", payload);
    const res = await updateData("auth/update-profile", payload);
    if (res) {
      toast.success("Technical Skills Updated Successfully");
      fetchProfile();
    }
  };

  const handleSavePhysical = async (data: any) => {
    console.log("Saving physical attributes:", data);
    return Promise.resolve();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Acting Skills</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingActing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="space-y-4">
            {actingForm.watch("acting")?.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/80">{skill.name}</span>
                  <span className="text-gold">{skill.level}%</span>
                </div>
                <Progress
                  value={skill.level}
                  className="h-2 bg-cinematic-dark"
                  indicatorClassName="bg-gradient-to-r from-gold-light to-gold"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Technical Skills</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingTechnical(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="space-y-4">
            {technicalForm.watch("technical").map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/80">{skill.name}</span>
                  <span className="text-gold">{skill.level}%</span>
                </div>
                <Progress
                  value={skill.level}
                  className="h-2 bg-cinematic-dark"
                  indicatorClassName="bg-gradient-to-r from-gold-light to-gold"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Special Skills</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-gold hover:text-gold hover:bg-gold/10"
              onClick={() => setIsEditingSpecial(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.specialSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cinematic-dark/70 text-foreground/80 text-sm rounded-full border border-gold/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        title="Edit Acting Skills"
        description="Update your acting skills and proficiency levels"
        isOpen={isEditingActing}
        onClose={() => setIsEditingActing(false)}
        onSave={handleSaveActing}
      >
        <div className="flex flex-col max-h-[60vh]">
          <Form {...actingForm}>
            <div className="overflow-y-auto pr-2 pl-2 flex-1">
              {actingForm.watch("acting")?.map((skill, index) => (
                <div key={index} className="mb-6">
                  {/* Skill Name */}
                  <FormField
                    control={actingForm.control}
                    name={`acting.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Skill Level */}
                  <FormField
                    control={actingForm.control}
                    name={`acting.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between mt-2">
                          <FormLabel>Proficiency Level</FormLabel>
                          <span className="text-sm text-gold">
                            {field.value}%
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {index < actingForm.watch("acting")?.length - 1 && (
                    <hr className="border-gold/10 my-4" />
                  )}
                </div>
              ))}
            </div>
          </Form>
        </div>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Technical Skills"
        description="Update your technical skills and proficiency levels"
        isOpen={isEditingTechnical}
        onClose={() => setIsEditingTechnical(false)}
        onSave={handleSaveTechnical}
      >
        <div className="flex flex-col max-h-[60vh]">
          <Form {...technicalForm}>
            <div className="overflow-y-auto pr-2 pl-2 flex-1">
              {technicalForm.watch("technical")?.map((skill, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={technicalForm.control}
                    name={`technical.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={technicalForm.control}
                    name={`technical.${index}.level`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Proficiency Level</FormLabel>
                          <span className="text-sm text-gold">
                            {field.value}%
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {index < technicalForm.watch("technical").length - 1 && (
                    <hr className="border-gold/10 my-4" />
                  )}
                </div>
              ))}
            </div>
          </Form>
        </div>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Special Skills"
        description="Update your special skills (comma-separated)"
        isOpen={isEditingSpecial}
        onClose={() => setIsEditingSpecial(false)}
        onSave={handleSaveSpecialSkills}
      >
        <Form {...specialSkillsForm}>
          <FormField
            control={specialSkillsForm.control}
            name="specialSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Skills</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Separate skills with commas"
                    className="h-32"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </EditProfileDialog>

      <EditProfileDialog
        title="Edit Physical Attributes"
        description="Update your physical attributes"
        isOpen={isEditingPhysical}
        onClose={() => setIsEditingPhysical(false)}
        onSave={handleSavePhysical}
      >
        <Form {...physicalAttributesForm}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
              name="build"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={physicalAttributesForm.control}
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
              control={physicalAttributesForm.control}
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
          </div>
        </Form>
      </EditProfileDialog>
    </div>
  );
};

export default SkillsSection;
