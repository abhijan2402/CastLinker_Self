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
  createdAt: string;
  member_count?: number;
  milestone_count?: number;
}

type ProjectResponse = {
  projects: Project[]; 
};
const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectData, setProjectData] = useState<Project[]>([]);

  useEffect(() => {
    handleGetProject();
    setLoading(false);
  }, [user]);

  const handleGetProject = async () => {
    try {
      const response = (await fetchData("/api/projects")) as ProjectResponse;
      setProjectData(response.projects);
    } catch (error) {
      console.error("❌ Unexpected error:", error);
    }
  };
  useEffect(() => {
    handleGetProject();
  }, []);

  // console.log(projectData);

  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  // Filter projects based on search query
  const filteredProjects = projectData.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredProjects);
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
      ) : projectData?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects?.map((project) => (
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
                    {project.current_status || "Planning"}
                  </Badge>
                </div>
                <CardDescription className="text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
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
