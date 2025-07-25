import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserFormData, AdminUserRole } from "@/types/adminTypes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const UserForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      name: "",
      email: "",
      role: "Actor",
      status: "active",
      verified: false,
      avatar_url: "",
      password: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast.success(`User ${isEdit ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Error submitting user form:", error);
      toast.error(
        `Failed to ${isEdit ? "update" : "create"} user. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter user's full name"
              required
              className="bg-background/50 border-gold/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              required
              className="bg-background/50 border-gold/10"
            />
          </div>
        </div>

        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              required={!isEdit}
              className="bg-background/50 border-gold/10"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger className="bg-background/50 border-gold/10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actor">Actor</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
                <SelectItem value="Producer">Producer</SelectItem>
                <SelectItem value="Screenwriter">Screenwriter</SelectItem>
                <SelectItem value="Cinematographer">Cinematographer</SelectItem>
                <SelectItem value="Casting Director">
                  Casting Director
                </SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Production Company">
                  Production Company
                </SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Sound Designer">Sound Designer</SelectItem>
                <SelectItem value="Production Designer">
                  Production Designer
                </SelectItem>
                <SelectItem value="Costume Designer">
                  Costume Designer
                </SelectItem>
                <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                <SelectItem value="Stunt Coordinator">
                  Stunt Coordinator
                </SelectItem>
                <SelectItem value="Visual Effects Artist">
                  Visual Effects Artist
                </SelectItem>
                <SelectItem value="Music Composer">Music Composer</SelectItem>
                <SelectItem value="Art Director">Art Director</SelectItem>
                <SelectItem value="Location Manager">
                  Location Manager
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="bg-background/50 border-gold/10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">Profile Picture URL</Label>
          <Input
            id="avatar_url"
            value={formData.avatar_url || ""}
            onChange={(e) => handleChange("avatar_url", e.target.value)}
            placeholder="Enter profile picture URL"
            className="bg-background/50 border-gold/10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="verified"
            checked={formData.verified}
            onCheckedChange={(checked) => handleChange("verified", checked)}
          />
          <Label htmlFor="verified">Verified User</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
