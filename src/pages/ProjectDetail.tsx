import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Clock,
  Edit,
  Trash2,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchData } from "@/api/ClientFuntion";

type Project = {
  id: number;
  name: string;
  description: string;
  location: string;
  status: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
};

type ProjectsResponse = {
  projects: Project[];
};
interface ProjectMember {
  id: string;
  user_id: string;
  status: string;
  user_email?: string;
  user_name?: string;
  user_avatar?: string;
}

interface ProjectMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
}

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "planning":
      return "bg-blue-500/10 border-blue-500/20 text-blue-500";
    case "pre-production":
      return "bg-purple-500/10 border-purple-500/20 text-purple-500";
    case "production":
      return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    case "post-production":
      return "bg-green-500/10 border-green-500/20 text-green-500";
    case "completed":
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    default:
      return "bg-gray-500/10 border-gray-500/20 text-gray-500";
  }
};

const getMilestoneStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    case "delayed":
      return "bg-red-500/10 border-red-500/20 text-red-500";
    case "in progress":
      return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    default:
      return "bg-blue-500/10 border-blue-500/20 text-blue-500"; // pending
  }
};

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTeamHead, setIsTeamHead] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({
    name: "",
    description: "",
    current_status: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMilestoneDialogOpen, setNewMilestoneDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
  });

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  console.log(projectId);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      if (!projectId || !user) return;

      // Fetch project details
      const response = (await fetchData("/api/projects")) as ProjectsResponse;
      console.log(response);

      const projectData = response?.projects?.find(
        (p: any) => p.id === Number(projectId)
      );

      console.log(projectData);
      setProject(projectData);
      if (!projectData) {
        toast({
          title: "Project not found",
          description: "The requested project does not exist",
          variant: "destructive",
        });
        navigate("/projects");
        return;
      }

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("project_members")
        .select("id, user_id, status")
        .eq("project_id", projectId);

      if (!membersError && membersData) {
        // Fetch user details for each member
        const enhancedMembers = await Promise.all(
          membersData.map(async (member) => {
            const { data: userData } = await supabase
              .from("profiles")
              .select("full_name, avatar_url, email")
              .eq("id", member.user_id)
              .single();

            return {
              ...member,
              user_name: userData?.full_name || "Unknown User",
              user_avatar: userData?.avatar_url || null,
              user_email: userData?.email || "unknown@email.com",
            };
          })
        );

        setMembers(enhancedMembers);
      }

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("project_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (!messagesError && messagesData) {
        // Fetch user details for each message sender
        const enhancedMessages = await Promise.all(
          messagesData.map(async (message) => {
            const { data: userData } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", message.user_id)
              .single();

            return {
              ...message,
              user_name: userData?.full_name || "Unknown User",
              user_avatar: userData?.avatar_url || null,
            };
          })
        );

        setMessages(enhancedMessages);
      }

      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (!milestonesError && milestonesData) {
        setMilestones(milestonesData);
      }
    } catch (error: any) {
      console.error("Error fetching project details:", error);
      toast({
        title: "Error loading project",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !projectId || !user) return;

    try {
      setSendingMessage(true);

      const { error } = await supabase.from("project_messages").insert({
        project_id: projectId,
        user_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;

      // Refresh messages
      const { data: newMessageData } = await supabase
        .from("project_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (newMessageData) {
        // Fetch user details for each message sender
        const enhancedMessages = await Promise.all(
          newMessageData.map(async (message) => {
            const { data: userData } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", message.user_id)
              .single();

            return {
              ...message,
              user_name: userData?.full_name || "Unknown User",
              user_avatar: userData?.avatar_url || null,
            };
          })
        );

        setMessages(enhancedMessages);
      }

      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId || !isTeamHead) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been permanently removed",
      });

      navigate("/projects");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Failed to delete project",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!projectId || !isTeamHead) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: updatedProject.name,
          description: updatedProject.description,
          current_status: updatedProject.current_status,
        })
        .eq("id", projectId);

      if (error) throw error;

      setProject((prev) =>
        prev
          ? {
              ...prev,
              name: updatedProject.name,
              description: updatedProject.description,
              current_status: updatedProject.current_status,
            }
          : null
      );

      toast({
        title: "Project updated",
        description: "Project details have been updated successfully",
      });

      setEditDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        title: "Failed to update project",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    if (!projectId || !isTeamHead || !inviteEmail) return;

    try {
      setSending(true);

      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmail)
        .single();

      if (userError || !userData) {
        toast({
          title: "User not found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Check if already invited
      const { data: existingMember } = await supabase
        .from("project_members")
        .select("id, status")
        .eq("project_id", projectId)
        .eq("user_id", userData.id)
        .single();

      if (existingMember) {
        toast({
          title: "Already invited",
          description: `User is already ${
            existingMember.status === "pending" ? "invited" : "a member"
          }`,
          variant: "destructive",
        });
        return;
      }

      // Send invitation
      const { error } = await supabase.from("project_members").insert({
        project_id: projectId,
        user_id: userData.id,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: "User has been invited to the project",
      });

      // Refresh members
      fetchProjectDetails();
      setInviteEmail("");
      setInviteDialogOpen(false);
    } catch (error: any) {
      console.error("Error inviting member:", error);
      toast({
        title: "Failed to invite member",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleCreateMilestone = async () => {
    if (
      !projectId ||
      !isTeamHead ||
      !newMilestone.title ||
      !newMilestone.due_date
    )
      return;

    try {
      const { error } = await supabase.from("project_milestones").insert({
        project_id: projectId,
        title: newMilestone.title,
        description: newMilestone.description,
        due_date: newMilestone.due_date,
        status: newMilestone.status,
      });

      if (error) throw error;

      toast({
        title: "Milestone created",
        description: "New milestone has been created successfully",
      });

      // Refresh milestones
      const { data: milestonesData } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (milestonesData) {
        setMilestones(milestonesData);
      }

      setNewMilestone({
        title: "",
        description: "",
        due_date: "",
        status: "pending",
      });
      setNewMilestoneDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating milestone:", error);
      toast({
        title: "Failed to create milestone",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMilestoneStatus = async (
    milestoneId: string,
    newStatus: string
  ) => {
    if (!projectId || !isTeamHead) return;

    try {
      const { error } = await supabase
        .from("project_milestones")
        .update({ status: newStatus })
        .eq("id", milestoneId);

      if (error) throw error;

      // Update local state
      setMilestones((prev) =>
        prev.map((milestone) =>
          milestone.id === milestoneId
            ? { ...milestone, status: newStatus }
            : milestone
        )
      );

      toast({
        title: "Status updated",
        description: `Milestone status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Error updating milestone status:", error);
      toast({
        title: "Failed to update status",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>

        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground mt-2">
          The project you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button
          onClick={() => navigate("/projects")}
          className="mt-6 bg-gold hover:bg-gold/90 text-black"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/projects")}
          className="rounded-full h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold gold-gradient-text">
          {project.name}
        </h1>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`${getStatusColor(project.status)}`}
        >
          {project.status}
        </Badge>

        {isTeamHead && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-gold/20 hover:border-gold/40"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {project.description && (
        <div className="bg-card/60 backdrop-blur-sm border border-gold/10 p-4 rounded-lg">
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      )}

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Milestones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-card/60 backdrop-blur-sm border-gold/10">
            <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-gold/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gold" />
                Project Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col-reverse gap-3 mb-4 h-[400px] overflow-y-auto border border-gold/10 rounded-lg p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                    <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.user_id === user?.id
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <Avatar className="h-8 w-8 border border-gold/20">
                          <AvatarImage src={message.user_avatar || undefined} />
                          <AvatarFallback className="bg-gold/10 text-gold">
                            {getInitials(message.user_name || "User")}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col max-w-[80%] ${
                            message.user_id === user?.id
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.user_id === user?.id
                                ? "bg-gold text-black rounded-tr-none"
                                : "bg-card border border-gold/20 rounded-tl-none"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{message.user_name || "Unknown User"}</span>
                            <span>•</span>
                            <span>
                              {new Date(message.created_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                    .reverse()
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] focus-visible:ring-gold/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="h-[60px] w-[60px] bg-gold hover:bg-gold/90 text-black"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Team Members ({members.length})
            </h3>
            {isTeamHead && (
              <Button
                onClick={() => setInviteDialogOpen(true)}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                <Plus className="h-4 w-4" />
                Invite Member
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Card
                key={member.id}
                className="bg-card/60 backdrop-blur-sm border-gold/10"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gold/20">
                      <AvatarImage src={member.user_avatar || undefined} />
                      <AvatarFallback className="bg-gold/10 text-gold">
                        {getInitials(member.user_name || "User")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {member.user_name}
                        {project.team_head_id === member.user_id && (
                          <span className="ml-2 text-xs bg-gold/10 text-gold px-2 py-0.5 rounded">
                            Team Head
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {member.user_email}
                      </p>
                    </div>

                    {member.status === "pending" && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 border-amber-500/20 text-amber-500"
                      >
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Project Milestones ({milestones.length})
            </h3>
            {isTeamHead && (
              <Button
                onClick={() => setNewMilestoneDialogOpen(true)}
                className="bg-gold hover:bg-gold/90 text-black gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {milestones.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-card/60 backdrop-blur-sm border border-gold/10 rounded-lg">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No milestones yet</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  {isTeamHead
                    ? "Add project milestones to track progress"
                    : "No milestones have been added to this project yet"}
                </p>
                {isTeamHead && (
                  <Button
                    onClick={() => setNewMilestoneDialogOpen(true)}
                    className="gap-2 bg-gold hover:bg-gold/90 text-black"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add First Milestone</span>
                  </Button>
                )}
              </div>
            ) : (
              milestones.map((milestone) => (
                <Card
                  key={milestone.id}
                  className="bg-card/60 backdrop-blur-sm border-gold/10"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {milestone.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${getMilestoneStatusColor(
                          milestone.status
                        )}`}
                      >
                        {milestone.status}
                      </Badge>
                    </div>

                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {milestone.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Due: </span>
                        {formatDate(milestone.due_date)}
                      </p>

                      {isTeamHead && milestone.status !== "completed" && (
                        <Button
                          onClick={() =>
                            handleUpdateMilestoneStatus(
                              milestone.id,
                              "completed"
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Project Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}" and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="edit-name"
                value={updatedProject.name}
                onChange={(e) =>
                  setUpdatedProject((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="focus-visible:ring-gold/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={updatedProject.description}
                onChange={(e) =>
                  setUpdatedProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="focus-visible:ring-gold/30"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                Current Status
              </label>
              <select
                id="edit-status"
                value={updatedProject.current_status}
                onChange={(e) =>
                  setUpdatedProject((prev) => ({
                    ...prev,
                    current_status: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
              >
                <option value="Planning">Planning</option>
                <option value="Pre-production">Pre-production</option>
                <option value="Production">Production</option>
                <option value="Post-production">Post-production</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              className="bg-gold hover:bg-gold/90 text-black"
              disabled={!updatedProject.name}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join this project
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="invite-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="focus-visible:ring-gold/30"
              />
              <p className="text-xs text-muted-foreground">
                The user must already have an account on the platform
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteMember}
              className="bg-gold hover:bg-gold/90 text-black gap-2"
              disabled={!inviteEmail || sending}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Milestone Dialog */}
      <Dialog
        open={newMilestoneDialogOpen}
        onOpenChange={setNewMilestoneDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to track project progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="milestone-title" className="text-sm font-medium">
                Milestone Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="milestone-title"
                placeholder="e.g. Complete Script"
                value={newMilestone.title}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="focus-visible:ring-gold/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="milestone-desc" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="milestone-desc"
                placeholder="Describe this milestone"
                value={newMilestone.description}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="focus-visible:ring-gold/30"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="milestone-date" className="text-sm font-medium">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="milestone-date"
                type="date"
                value={newMilestone.due_date}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    due_date: e.target.value,
                  }))
                }
                className="focus-visible:ring-gold/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="milestone-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="milestone-status"
                value={newMilestone.status}
                onChange={(e) =>
                  setNewMilestone((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewMilestoneDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMilestone}
              className="bg-gold hover:bg-gold/90 text-black"
              disabled={!newMilestone.title || !newMilestone.due_date}
            >
              Create Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
