import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  FileText,
  Image,
  Film,
  Pencil,
  Trash,
  Music,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { deleteData, fetchData, postData } from "@/api/ClientFuntion";
import { toast } from "react-toastify";
import { useTalentProfile } from "@/hooks/useTalentProfile";

// Define the types needed for this component
interface ProfessionContent {
  id: number;
  title: string;
  type: "document" | "image" | "video" | "audio";
  file_path?: string;
  description?: string;
  created_at: string;
}
interface PortfolioResponse {
  success: boolean;
  data: ProfessionContent[];
}
interface PortfolioFormResponse {
  success: boolean;
  message: string;
}
interface PortfolioDeleteResponse {
  success: boolean;
  message: string;
}
export function UserPortfolioSection({userProfile}) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<ProfessionContent[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { profile, fetchProfile } = useTalentProfile(user);

  // Mock data for development

  const loadContent = async () => {
    if (!user) return;
    const res = await fetchData<PortfolioResponse>("/api/portfolio/list");
    setContents(res.data);
  };

  // Load content
  useEffect(() => {
    loadContent();
  }, [user]);

  // Validate audio file duration
  const validateAudioDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        // Check if audio is longer than 1 minute (60 seconds)
        if (audio.duration > 60) {
          resolve(false);
        } else {
          resolve(true);
        }
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload for audio
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    contentType: "document" | "image" | "video" | "audio"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type based on contentType
    if (contentType === "audio") {
      if (!file.type.includes("audio/")) {
        toast.error("Please upload a valid audio file");
        return;
      }

      // Check audio duration
      const isValidDuration = await validateAudioDuration(file);
      if (!isValidDuration) {
        toast.error("Audio files must be less than 1 minute long");
        return;
      }
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", contentType);

    const res = await postData<PortfolioFormResponse>(
      "/api/portfolio/add",
      formData
    );
    if (res.success) {
      toast.success(`${contentType} uploaded successfully`);
      loadContent();
    }
  };

  // Add new content
  const handleAddContent = async (
    contentType: "document" | "image" | "video" | "audio"
  ) => {
    if (!user) return;

    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // Set accepted file types based on content type
    switch (contentType) {
      case "document":
        fileInput.accept = ".pdf,.doc,.docx,.txt";
        break;
      case "image":
        fileInput.accept = "image/*";
        break;
      case "video":
        fileInput.accept = "video/*";
        break;
      case "audio":
        fileInput.accept = "audio/*";
        break;
    }

    // Add event listener for file selection
    fileInput.addEventListener("change", (e) =>
      handleFileUpload(e as any, contentType)
    );

    // Trigger file selection dialog
    fileInput.click();
  };

  // Filter content based on active tab
  const filteredContents =
    activeTab === "all"
      ? contents
      : contents.filter((content) => content.type === activeTab);

  // Handle Delete
  const handleDelete = async (id: number) => {
    const res = await deleteData<PortfolioDeleteResponse>(
      `/api/portfolio/delete/${id}`
    );
    // console.log(res);
    if (res.success) {
      toast.success(`Item deleted successfully`);
      loadContent();
    } else {
      toast.error(`Error in deleting file`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Portfolio</h3>
        <div className="flex gap-2">
          {["writer", "Writer"].includes(userProfile?.user_type) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddContent("document")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddContent("image")}
          >
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddContent("video")}
          >
            <Film className="h-4 w-4 mr-2" />
            Add Video
          </Button>
          {["singer", "Singer"].includes(userProfile?.user_type) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddContent("audio")}
            >
              <Music className="h-4 w-4 mr-2" />
              Add Audio
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>

          {["writer", "Writer"].includes(userProfile?.user_type) && (
            <TabsTrigger value="document">Documents</TabsTrigger>
          )}

          {["singer", "Singer"].includes(userProfile?.user_type) && (
            <TabsTrigger value="audio">Audio</TabsTrigger>
          )}

          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="pt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg border-muted">
              <PlusCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No {activeTab !== "all" ? activeTab + " " : ""}content yet
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  handleAddContent(
                    activeTab === "all" ? "document" : (activeTab as any)
                  )
                }
              >
                Add {activeTab === "all" ? "Content" : activeTab}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map((content) => (
                <Card key={content.id} className="overflow-hidden">
                  {content.type === "image" && content.file_path && (
                    <div className="relative h-40 w-full">
                      <img
                        src={content.file_path}
                        alt={content.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {content.type === "video" && content.file_path && (
                    <div className="relative h-40 w-full bg-black">
                      <img
                        src={content.file_path}
                        alt={content.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                          <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-black ml-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {content.type === "document" && (
                    <div className="h-40 w-full bg-muted flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  {content.type === "audio" && (
                    <div className="h-40 w-full bg-muted flex flex-col items-center justify-center p-4">
                      <Music className="h-10 w-10 text-muted-foreground mb-2" />
                      {content.file_path && (
                        <audio
                          ref={audioRef}
                          src={content.file_path}
                          controls
                          className="w-full max-w-[200px]"
                          preload="metadata"
                        />
                      )}
                    </div>
                  )}

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{content.title}</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Also export as default for backward compatibility
export default UserPortfolioSection;
