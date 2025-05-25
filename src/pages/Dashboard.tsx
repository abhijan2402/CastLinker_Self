import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Film,
  Star,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Briefcase,
  MapPin,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Bell,
  Eye,
  Zap,
  Heart,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { dashboardData } from "@/utils/dummyData";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { fetchData } from "@/api/ClientFuntion";

interface DashboardData {
  applications: number;
  connections: number;
  likes: number;
  rating: string; // it is a string in your API
  recentJobs: any[]; // You can improve the typing for jobs later
  recentMessages?: any[]; // optional
  upcomingEvents?: any[]; // optional
}

interface Stats {
  applications: number;
  connections: number;
  likes: number;
  ratings: number;
  profileViews: number;
  callbacks: number;
  activityScore: number;
}
interface ApiResponse {
  success: boolean;
  data: DashboardData; // Updated to reflect the response structure
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const firstName = user?.username?.split(" ")[0] || "Actor";
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    connections: 0,
    likes: 0,
    ratings: 0,
    profileViews: 0,
    callbacks: 0,
    activityScore: 0,
  });
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (Math.random() > 0.7) {
  //       setStats((prev) => ({
  //         ...prev,
  //         connections: prev.connections + 1,
  //       }));
  //     }
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleNavigateToJobs = () => {
    navigate("/jobs");
  };

  const handleNavigateToMessages = () => {
    navigate("/chat");
  };

  const handleNavigateToNotifications = () => {
    navigate("/notifications");
  };

  const handleNavigateToCalendar = () => {
    toast({
      title: "Coming Soon",
      description: "Calendar functionality will be available soon",
    });
  };

  const handleApplyToJob = (jobId: number) => {
    const updatedOpportunities = recentOpportunities.map((job) =>
      job.id === jobId ? { ...job, applied: true } : job
    );
    setRecentOpportunities(updatedOpportunities);

    setStats((prev) => ({
      ...prev,
      applications: prev.applications + 1,
    }));
  };

  const fetchDashboardData = async () => {
    try {
      const res = (await fetchData("/api/dashboard")) as ApiResponse;
      console.log(res);

      if (res) {
        setStats({
          applications: res.data.applications,
          connections: res.data.connections || 0,
          likes: res.data.likes || 0,
          ratings: parseFloat(res.data.rating) || 0.0,
          profileViews: 0,
          callbacks: 0,
          activityScore: 0,
        });

        setRecentOpportunities(
          (res.data.recentJobs || []).map((job) => ({
            ...job,
            applied: false,
          }))
        );

        setRecentMessages(res.data.recentMessages || []);
        setUpcomingEvents(res.data.upcomingEvents || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // console.log(recentOpportunities);

  return (
    <div className="space-y-4 pr-1">
      <div className="flex flex-col space-y-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light capitalize">
              Hello, {firstName}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your activity summary and upcoming opportunities
          </p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gold/10 hover:border-gold/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">
                    Applications
                  </span>
                </CardTitle>
                <div className="rounded-full bg-gold/10 p-2">
                  <Briefcase className="h-4 w-4 text-gold" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{stats.applications}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +2
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    since last week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gold/10 hover:border-gold/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">
                    Projects
                  </span>
                </CardTitle>
                <div className="rounded-full bg-gold/10 p-2">
                  <Briefcase className="h-4 w-4 text-gold" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{stats.applications}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +2
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    since last week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="border-indigo-500/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-indigo-500/10 hover:border-indigo-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">
                    Connections
                  </span>
                </CardTitle>
                <div className="rounded-full bg-indigo-500/10 p-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{stats.connections}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +5
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    from last month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card className="border-pink-500/10 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-pink-500/10 hover:border-pink-500/30 transition-colors duration-300 shadow-lg bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground/80">
                    Likes
                  </span>
                </CardTitle>
                <div className="rounded-full bg-pink-500/10 p-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-col">
                <div className="text-3xl font-bold">{stats.likes}</div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs text-green-500 font-medium flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    new likes this week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="border-gold/10 lg:col-span-2 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
          <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold/10 p-2">
                  <Film className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Recent Opportunities
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Casting calls that match your profile
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1 border-gold/20 text-gold hover:text-gold/80 hover:bg-gold/10"
                onClick={handleNavigateToJobs}
              >
                View all
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="divide-y divide-border/10">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-14 w-14 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {recentOpportunities.map((job) => (
                  <div
                    key={job.id}
                    className="hover:bg-card/80 transition-colors p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="rounded-md bg-card flex-shrink-0 h-14 w-14 flex items-center justify-center border border-gold/20">
                        <Film className="h-7 w-7 text-gold" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base leading-tight">
                                {job.job_title}
                              </h3>
                              {job.is_featured && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 border-green-500/20 text-green-500 text-[10px] rounded-sm py-0 h-5"
                                >
                                  New
                                </Badge>
                              )}
                              {job.applied && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-500/10 border-blue-500/20 text-blue-500 text-[10px] rounded-sm py-0 h-5"
                                >
                                  Applied
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Briefcase className="h-3 w-3" />
                                {job.job_type}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <DollarSign className="h-3 w-3" />
                                {job.min_salary}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {job.posted}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.job_description}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gold/20 text-gold"
                          >
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className={`h-8 ${
                              job.applied
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gold hover:bg-gold/90"
                            } text-black`}
                            onClick={() => handleApplyToJob(job.id)}
                            disabled={job.applied}
                          >
                            {job.applied ? "Applied" : "Apply"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-blue-500/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Messages</CardTitle>
                    <CardDescription className="mt-0.5">
                      Your latest conversations
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1 border-blue-500/20 text-blue-500 hover:text-blue-500/80 hover:bg-blue-500/10"
                  onClick={handleNavigateToMessages}
                >
                  View all
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="divide-y divide-border/10">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-start space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                          <Skeleton className="h-3 w-full mt-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 hover:bg-card/80 transition-colors group cursor-pointer"
                      onClick={handleNavigateToMessages}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full h-10 w-10 bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-colors flex-shrink-0">
                          <span className="text-xs font-medium text-blue-500">
                            {msg.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium leading-none text-sm group-hover:text-blue-500 transition-colors">
                              {msg.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {msg.time}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                            {msg.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold/10 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="px-4 py-4 border-b border-border/10 bg-gradient-to-r from-gold/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gold/10 p-2">
                    <Calendar className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Upcoming</CardTitle>
                    <CardDescription className="mt-0.5">
                      Your scheduled events
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1 border-gold/20 text-gold hover:text-gold/80 hover:bg-gold/10"
                  onClick={handleNavigateToCalendar}
                >
                  Calendar
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="divide-y divide-border/10">
                  {[1, 2].map((_, index) => (
                    <div key={index} className="p-3">
                      <div className="flex gap-2">
                        <Skeleton className="w-14 h-16 rounded-md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full mt-1" />
                          <div className="flex items-center gap-3 mt-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border/10">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 hover:bg-card/80 transition-colors"
                    >
                      <div className="flex gap-2">
                        <div className="flex flex-col items-center justify-center bg-gold/5 p-2 rounded-md border border-gold/20 w-14 h-16 flex-shrink-0">
                          <span className="text-xs font-medium text-gold">
                            {event.date.split(" ")[0]}
                          </span>
                          <span className="text-xl font-bold">
                            {event.date.split(" ")[1]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {event.day}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm">
                              {event.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 border-blue-500/20 text-blue-500 text-[10px] rounded-sm py-0 h-5"
                            >
                              {event.time}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.subtitle}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="h-2.5 w-2.5" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" />
                              {event.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
