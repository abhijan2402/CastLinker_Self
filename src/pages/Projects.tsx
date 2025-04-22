import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FolderOpen,
  Clock,
  Users,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchData } from "@/api/ClientFuntion";

interface Project {
  id: string;
  name: string;
  description: string;
  current_status: string;
  created_at: string;
  member_count?: number;
  milestone_count?: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User not authenticated");
      }

      // First query to get projects where user is team head
      const { data: teamHeadProjects, error: headError } = await supabase
        .from("projects")
        .select("id, name, description, current_status, created_at")
        .eq("team_head_id", user.id);

      if (headError) throw headError;

      // Second query to get projects where user is a member
      const { data: memberProjects, error: memberError } = await supabase
        .from("project_members")
        .select("project_id")
        .eq("user_id", user.id)
        .eq("status", "accepted");

      if (memberError) throw memberError;

      // Get full project details for member projects
      const memberProjectIds = memberProjects.map((mp) => mp.project_id);
      const { data: memberProjectDetails, error: detailsError } = await supabase
        .from("projects")
        .select("id, name, description, current_status, created_at")
        .in("id", memberProjectIds);

      if (detailsError) throw detailsError;

      // Combine and deduplicate projects
      const allProjects = [
        ...(teamHeadProjects || []),
        ...(memberProjectDetails || []),
      ];
      const uniqueProjects = Array.from(
        new Map(allProjects.map((item) => [item.id, item])).values()
      );

      // Enhance projects with additional data
      const enhancedProjects = await Promise.all(
        uniqueProjects.map(async (project) => {
          try {
            // Get member count
            const { count: memberCount, error: memberCountError } =
              await supabase
                .from("project_members")
                .select("*", { count: "exact", head: true })
                .eq("project_id", project.id)
                .eq("status", "accepted");

            if (memberCountError) throw memberCountError;

            // Get milestone count
            const { count: milestoneCount, error: milestoneCountError } =
              await supabase
                .from("project_milestones")
                .select("*", { count: "exact", head: true })
                .eq("project_id", project.id);

            if (milestoneCountError) throw milestoneCountError;

            return {
              ...project,
              member_count: memberCount || 1,
              milestone_count: milestoneCount || 0,
            };
          } catch (error) {
            console.error(
              `Error fetching details for project ${project.id}:`,
              error
            );
            // Return project with default counts if detail fetch fails
            return {
              ...project,
              member_count: 1,
              milestone_count: 0,
            };
          }
        })
      );

      setProjects(enhancedProjects);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Failed to load projects",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      // Set empty projects array to show the "No projects found" state
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProject = async () => {
    try {
      const response = await fetchData("/api/projects");
      setProjectData(response as any[]);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
    }
  };
  useEffect(() => {
    handleGetProject();
  }, []);

      console.log(projectData);


  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold gold-gradient-text">Projects</h1>
        <p className="text-muted-foreground">
          Create and collaborate on film projects with your team
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 focus-visible:ring-gold/30 rounded-xl w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            className="border-gold/20 text-muted-foreground hover:text-gold hover:border-gold/40"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>

          <Button
            className="gap-2 bg-gold hover:bg-gold/90 text-black w-full sm:w-auto"
            onClick={handleCreateProject}
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-card/60 backdrop-blur-sm border-gold/10 hover:border-gold/30 transition-colors duration-200 shadow-md"
            >
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : projectData?.projects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData?.projects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/60 backdrop-blur-sm border-gold/10 hover:border-gold/30 transition-colors duration-200 cursor-pointer shadow-md"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-gold/10 border-gold/20 text-gold"
                  >
                    {project.current_status}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description provided"}
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.member_count || 1}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{project.milestone_count || 0} milestones</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card/60 backdrop-blur-sm border border-gold/10 rounded-lg shadow-md">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            {searchQuery
              ? "No projects match your search criteria"
              : "Create your first project to get started"}
          </p>
          <Button
            onClick={handleCreateProject}
            className="gap-2 bg-gold hover:bg-gold/90 text-black"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
