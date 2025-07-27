import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Share2,
  UserPlus,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Edit,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTalentProfile } from "@/hooks/useTalentProfile";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL, updateData } from "../../api/ClientFuntion";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { EditProfileDialog } from "./EditProfileDialog";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CreateProfileDialog from "./CreateProfileDialog";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, fetchProfile, UpdateSocialLinks } = useTalentProfile(user);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const form = useForm({
    defaultValues: {
      website: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  useEffect(() => {
    if (isEditing && profile) {
      form.reset({
        website: profile.website || "",
        twitter: profile.twitter || "",
        instagram: profile.instagram || "",
        linkedin: profile.linkedin || "",
        youtube: profile.youtube || "",
      });
    }
  }, [isEditing, profile]);

  const handleSave = async (data: any) => {
    UpdateSocialLinks(data);
  };

  return (
    <div className="rounded-xl bg-card-gradient border border-gold/10 overflow-hidden">
      {/* Cover Image */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${baseURL}${profile?.cover_pic_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cinematic to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="p-6 relative">
        {/* Avatar - positioned to overlap with cover */}
        <Avatar className="h-28 w-28 border-4 border-card absolute -top-16 left-6">
          <AvatarImage
            src={`${baseURL}${profile?.cover_pic_url}`}
            alt={profile?.username}
          />
          <AvatarFallback className="bg-cinematic-light text-2xl capitalize">
            {user?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Actions - positioned on the right side */}
        <div className="flex justify-end gap-3 mb-10">
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 hover:border-gold"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gold/30 hover:border-gold"
            onClick={() => navigate("/chat")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-gold hover:bg-gold-dark text-cinematic"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Social Links
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="sm"
            className="bg-gold hover:bg-gold-dark text-cinematic"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Details */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold capitalize">
              {profile?.username || "User"}
            </h1>
            {!profile?.verified && (
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
            {profile?.availableForWork && (
              <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                Available for Work
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <p className="text-foreground/70 capitalize">{profile?.email}</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-foreground/70 capitalize">
              {profile?.user_type || "NA"}
            </p>
            <p className="text-foreground/70">{profile?.location || "NA"}</p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 mt-4">
            {/* <a
              href={profile?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Globe className="h-5 w-5" />
            </a> */}
            <a
              href={`${profile?.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={`${profile?.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`${profile?.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`${profile?.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profile?.total_connections || "0"}
              </p>
              <p className="text-sm text-foreground/60">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {profile?.total_likes || "0"}
              </p>
              <p className="text-sm text-foreground/60">Likes</p>
            </div>
            {/* <div className="text-center">
              <p className="text-2xl font-bold">
                {profile?.total_ratings || "0"}
              </p>
              <p className="text-sm text-foreground/60">Total Rating</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Ṣocial Media Form */}
      <EditProfileDialog
        title="Add Social Media Links"
        description="Include links to your online presence and social platforms"
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={form.handleSubmit(handleSave)}
      >
        <Form {...form}>
          <div className="max-h-[70vh] overflow-y-auto pr-2 pl-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://youtube.com/username"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </EditProfileDialog>

      {/* Profile and Cover Upload */}
      <CreateProfileDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        fetchProfile={fetchProfile}
      />
    </div>
  );
};

export default ProfileHeader;
