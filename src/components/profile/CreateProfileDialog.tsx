import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { fetchData, postData, updateData } from "@/api/ClientFuntion";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchProfile: () => void;
}

const CreateProfileDialog = ({
  open,
  onOpenChange,
  fetchProfile,
}: CreateProfileProps) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const profileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  // console.log(profileImage, coverImage);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setProfileImage(file);
        setProfilePreview(reader.result as string);
      } else {
        setCoverImage(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: "profile" | "cover") => {
    if (type === "profile") {
      setProfileImage(null);
      setProfilePreview(null);
      if (profileRef.current) profileRef.current.value = "";
    } else {
      setCoverImage(null);
      setCoverPreview(null);
      if (coverRef.current) coverRef.current.value = "";
    }
  };

  const onSubmit = async () => {
    if (!profileImage || !coverImage) {
      toast({
        title: "Upload required",
        description: "Please upload both profile and cover images.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile_image", profileImage); // ✅ Correct key
      formData.append("cover_image", coverImage); // ✅ Correct key

      const response: any = await updateData("auth/update-profile", formData);

      console.log(response);

      if (!response?.success) {
        throw new Error(response.message || "Failed to update profile");
      }

      toast({
        title: "Profile updated",
        description: "Your profile was updated successfully!",
      });

      fetchProfile();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Profile update failed:", error);

      let message = "Something went wrong";
      if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("ERR_CONNECTION_RESET")
      ) {
        message =
          "Cannot connect to server. Please check your internet or server status.";
      } else if (error?.message) {
        message = error.message;
      }

      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>Upload profile & cover images.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            {/* Username */}
            {/* <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Profile Image Upload */}
            <div className="space-y-2">
              <FormLabel>Profile Image</FormLabel>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={profileRef}
                  onChange={(e) => handleImageChange(e, "profile")}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => profileRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {profileImage ? "Change Image" : "Upload Image"}
                </Button>
                {profileImage && (
                  <Button
                    type="button"
                    onClick={() => removeImage("profile")}
                    variant="ghost"
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="rounded-md w-24 h-34 object-cover border mt-2"
                />
              )}
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <FormLabel>Cover Image</FormLabel>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={coverRef}
                  onChange={(e) => handleImageChange(e, "cover")}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {coverImage ? "Change Cover" : "Upload Cover"}
                </Button>
                {coverImage && (
                  <Button
                    type="button"
                    onClick={() => removeImage("cover")}
                    variant="ghost"
                    className="text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="rounded-md max-w-full h-auto border mt-2"
                />
              )}
            </div>

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
