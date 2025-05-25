import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  createPost,
  uploadPostMedia,
  updatePost,
} from "@/services/postsService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Loader2,
  X,
  Calendar as CalendarIcon,
  Upload,
  Image,
  Video,
  CodeSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { postData } from "@/api/ClientFuntion";

const CATEGORIES = [
  "Audition",
  "Casting Call",
  "Collaboration",
  "Content Creation",
  "Event",
  "Job Opportunity",
  "Mentorship",
  "Other",
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).optional(),
  event_date: z.date().optional().nullable(),
  external_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .nullable(),
  place: z.string().optional(),
  location: z.string().optional(),
  pincode: z.string().optional(),
  landmark: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadPosts: () => void;
  editPost?: any;
}

const CreatePostDialog = ({
  open,
  onOpenChange,
  editPost,
  loadPosts,
}: CreatePostDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!editPost;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          title: editPost.title,
          description: editPost.description,
          category: editPost.category,
          tags: editPost.tags || [],
          event_date: editPost.event_date
            ? new Date(editPost.event_date)
            : null,
          external_url: editPost.external_url || null,
          place: editPost.place || "",
          location: editPost.location || "",
          pincode: editPost.pincode || "",
          landmark: editPost.landmark || "",
        }
      : {
          title: "",
          description: "",
          category: "",
          tags: [],
          event_date: null,
          external_url: null,
          place: "",
          location: "",
          pincode: "",
          landmark: "",
        },
  });

  const addTag = () => {
    if (!tagInput.trim()) return;

    const currentTags = form.getValues("tags") || [];
    const normalizedTag = tagInput.trim();

    if (currentTags.includes(normalizedTag)) {
      toast({
        title: "Tag already exists",
        description: "This tag has already been added.",
        variant: "destructive",
      });
      return;
    }

    if (currentTags.length >= 5) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 5 tags.",
        variant: "destructive",
      });
      return;
    }

    form.setValue("tags", [...currentTags, normalizedTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);

      // Set media type based on file
      if (file.type.startsWith("image/")) {
        setMediaType("image");
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  type CreateProjectResponse = {
    message: string;
    posts: any;
  };
  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);

    // Convert array of tags to JSON string or individual fields
    values.tags.forEach((tag, i) => {
      formData.append(`tags[${i}]`, tag);
    });

    if (values.event_date) {
      formData.append("event_date", new Date(values.event_date).toISOString());
    }

    if (values.external_url) {
      formData.append("external_url", values.external_url);
    }

    formData.append("place", values.place || "");
    formData.append("location", values.location || "");
    formData.append("pincode", values.pincode || "");
    formData.append("landmark", values.landmark || "");

    // Append media file if it exists
    if (mediaFile) {
      formData.append("media", mediaFile);
    }
    console.log(formData);
    try {
      const response = await postData<CreateProjectResponse>(
        "/api/posts",
        formData
      );

      console.log("✅ Posts created:", response);
      if (response) {
        toast({
          title: "posts created successfully",
        });
        form.reset();
        setMediaFile(null);
        onOpenChange(false);
        loadPosts();
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast({
        title: "Error in creating Project",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your post details below."
              : "Share an opportunity with the community. Fill out the details below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the opportunity in detail..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Media Upload */}
            <div className="space-y-2">
              <FormLabel>Media (Image or Video)</FormLabel>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {mediaFile ? "Change Media" : "Upload Media"}
                </Button>

                {mediaFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={removeMedia}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              {(mediaPreview || (isEditMode && editPost.media_url)) && (
                <div className="mt-4 border rounded-md p-2 max-w-[300px]">
                  {mediaType === "image" ||
                  (isEditMode && editPost.media_type === "image") ? (
                    <div className="relative">
                      <Image className="h-6 w-6 absolute top-2 left-2 bg-black/50 p-1 rounded-md text-white" />
                      <img
                        src={mediaPreview || editPost.media_url}
                        alt="Preview"
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Video className="h-6 w-6 absolute top-2 left-2 bg-black/50 p-1 rounded-md text-white" />
                      {mediaPreview ? (
                        <video
                          src={mediaPreview}
                          controls
                          className="w-full h-auto rounded-md"
                        />
                      ) : (
                        <video
                          src={editPost.media_url}
                          controls
                          className="w-full h-auto rounded-md"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Event Date */}
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event/Deadline Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a date for this opportunity (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* External URL */}
            <FormField
              control={form.control}
              name="external_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a relevant external link (e.g. registration form,
                    YouTube link)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Fields */}
            <div className="space-y-4 border rounded-md p-4">
              <h3 className="text-sm font-medium">
                Address Information (Optional)
              </h3>

              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Studio name, building, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Area/locality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal/zip code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nearby landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tags..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update Post" : "Publish Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
