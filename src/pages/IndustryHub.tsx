
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight, BookOpen, Calendar, Clock, Download, 
  Film, FileText, MapPin, Award, Play, Search, 
  Plus, MessageCircle, Star, Mail 
} from "lucide-react";
import { useIndustryHub } from "@/hooks/useIndustryHub";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitNewsForm } from "@/components/industry/SubmitNewsForm";
import { SubmitEventForm } from "@/components/industry/SubmitEventForm";
import { SubmitCourseForm } from "@/components/industry/SubmitCourseForm";
import { SubmitResourceForm } from "@/components/industry/SubmitResourceForm";
import { useToast } from "@/hooks/use-toast";

const IndustryHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({
    news: false,
    events: false,
    courses: false,
    resources: false,
    subscribe: false
  });
  
  const {
    news,
    events,
    courses,
    resources,
    isLoading,
    searchQuery,
    activeTab: hubActiveTab,
    setSearchQuery,
    setActiveTab: setHubActiveTab,
    submitContent,
    refreshData
  } = useIndustryHub();
  
  // Create featured items by finding any item with is_featured=true, or default to first item
  const featuredNews = news.find(item => item.is_featured) || (news.length > 0 ? news[0] : null);
  const featuredEvent = events.find(item => item.is_featured) || (events.length > 0 ? events[0] : null);
  const featuredCourse = courses.find(item => item.is_featured) || (courses.length > 0 ? courses[0] : null);

  // Filter functions based on search term
  const filteredNews = news.filter(item => 
    searchTerm === "" || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredEvents = events.filter(item => 
    searchTerm === "" || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredCourses = courses.filter(item => 
    searchTerm === "" || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.level && item.level.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredResources = resources.filter(item => 
    searchTerm === "" || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle email subscription
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate subscription process
    setTimeout(() => {
      toast({
        title: "Success",
        description: "You've been subscribed to industry updates",
      });
      setIsSubmitting(false);
      
      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  // Handle resource download
  const handleDownload = async (resource: typeof resources[0]) => {
    // If there's a file URL, open the URL
    if (resource.file_url) {
      // Submit content to increment download count
      await submitContent({
        type: 'resource',
        data: { id: resource.id, incrementDownload: true }
      });
      
      window.open(resource.file_url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Download Started",
        description: `Downloading ${resource.title}`
      });
    } else {
      toast({
        title: "Resource Unavailable",
        description: "This resource is currently unavailable for download",
        variant: "destructive"
      });
    }
  };

  // Submit handlers for different content types
  const submitNews = async (data: any) => {
    return submitContent({
      type: 'news',
      data
    });
  };
  
  const submitEvent = async (data: any) => {
    return submitContent({
      type: 'event',
      data
    });
  };
  
  const submitCourse = async (data: any) => {
    return submitContent({
      type: 'course',
      data
    });
  };
  
  const submitResource = async (data: any) => {
    return submitContent({
      type: 'resource',
      data
    });
  };

  return (
    <div className="space-y-4 pr-1">
      {/* Header Section */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Industry Hub
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay informed, learn, and grow with the latest news, events, and educational resources from the film industry.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              size="sm" 
              className="bg-gold hover:bg-gold/90 text-black gap-1"
              onClick={() => setDialogOpen(prev => ({ ...prev, [activeTab]: true }))}
            >
              <Plus className="h-4 w-4" />
              <span>Submit Content</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
        
      {/* Search Bar */}
      <div className="relative flex-1 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for news, events, courses, or resources..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-background/50 border-gold/10 focus-visible:ring-gold/30"
        />
      </div>
      
      <Tabs defaultValue="news" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-cinematic-dark/50 border border-gold/10 w-full justify-start mb-6">
          <TabsTrigger 
            value="news" 
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            News & Insights
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Events & Webinars
          </TabsTrigger>
          <TabsTrigger 
            value="courses" 
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger 
            value="resources" 
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Resources
          </TabsTrigger>
        </TabsList>
          
        {/* News & Insights Tab */}
        <TabsContent value="news">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Featured Article */}
            {isLoading ? (
              <div className="lg:col-span-3 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <Skeleton className="h-64 lg:h-auto" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ) : featuredNews ? (
              <div className="lg:col-span-3 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div 
                    className="h-64 lg:h-auto bg-cover bg-center" 
                    style={{ backgroundImage: `url(${featuredNews.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000"})` }}
                  ></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <span className="text-sm text-foreground/60">{featuredNews.category || "Industry Analysis"}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
                    <p className="text-foreground/70 mb-6">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={featuredNews.author_avatar} />
                          {/* <AvatarFallback>{featuredNews?.author_name?.charAt(0)}</AvatarFallback> */}
                        </Avatar>
                        <span className="text-sm">By {featuredNews.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <Clock className="h-4 w-4" />
                        <span>{featuredNews.read_time || "10 min read"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-3 bg-card border border-gold/10 rounded-xl p-6 text-center">
                <p>No featured news available</p>
              </div>
            )}
              
            {/* Regular News Items */}
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                  <Skeleton className="h-48" />
                  <CardHeader>
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </CardFooter>
                </Card>
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <Card key={item.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.image || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000"})` }}
                  ></div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-foreground/60">{item.category || "Industry News"}</span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.author_avatar} />
                        {/* <AvatarFallback>{item.author_name.charAt(0)}</AvatarFallback> */}
                      </Avatar>
                      <span className="text-xs">{item.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/60">
                      <Clock className="h-3 w-3" />
                      <span>{item.read_time || "5 min read"}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="lg:col-span-3 bg-card border border-gold/10 rounded-xl p-6 text-center">
                <p>No news articles found matching your search criteria</p>
              </div>
            )}
              
            <div className="lg:col-span-3 text-center mt-4">
              <Button 
                variant="outline" 
                className="border-gold/30 hover:border-gold mr-4"
                onClick={() => setDialogOpen(prev => ({ ...prev, news: true }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit News
              </Button>
              <Button variant="outline" className="border-gold/30 hover:border-gold">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
          
        {/* Events & Webinars Tab */}
        <TabsContent value="events">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Featured Event */}
              {isLoading ? (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <Skeleton className="h-64 lg:h-auto lg:col-span-2" />
                    <div className="p-8 lg:col-span-3 space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              ) : featuredEvent ? (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div 
                      className="h-64 lg:h-auto lg:col-span-2 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${featuredEvent.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000"})` }}
                    ></div>
                    <div className="p-8 lg:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          Featured Event
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">{featuredEvent.title}</h2>
                      <p className="text-foreground/70 mb-6">
                        {featuredEvent.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gold" />
                          <div>
                            <p className="text-sm font-medium">{featuredEvent.date}</p>
                            <p className="text-xs text-foreground/60">{featuredEvent.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gold" />
                          <div>
                            <p className="text-sm font-medium">{featuredEvent.location || "Virtual Event"}</p>
                            <p className="text-xs text-foreground/60">{featuredEvent.type || "Workshop"}</p>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <p>No featured events available</p>
                </div>
              )}
            </div>
              
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <Skeleton className="h-40" />
                    <CardHeader>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${event.image || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000"})` }}
                    ></div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          {event.type || "Workshop"}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{event.time || "All Day"}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-gold/30 hover:border-gold">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <p>No events found matching your search criteria</p>
                </div>
              )}
            </div>
              
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className="border-gold/30 hover:border-gold mr-4"
                onClick={() => setDialogOpen(prev => ({ ...prev, events: true }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Event
              </Button>
              <Button variant="outline" className="border-gold/30 hover:border-gold">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
          
        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Course */}
              {isLoading ? (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <Skeleton className="h-64 lg:h-auto lg:col-span-2" />
                    <div className="p-8 lg:col-span-3 space-y-4">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-24 w-full" />
                      <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                      <Skeleton className="h-10 w-40" />
                    </div>
                  </div>
                </div>
              ) : featuredCourse ? (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl overflow-hidden shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div 
                      className="h-64 lg:h-auto lg:col-span-2 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${featuredCourse.image || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000"})` }}
                    ></div>
                    <div className="p-8 lg:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          Featured Course
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          PRO
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{featuredCourse.title}</h2>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(featuredCourse.rating || 5) ? "text-gold fill-gold" : "text-gray-300"}`} />
                          ))}
                          <span className="ml-2 text-sm">{featuredCourse.rating || "5.0"} ({featuredCourse.reviews || 324} reviews)</span>
                        </div>
                      </div>
                      <p className="text-foreground/70 mb-6">
                        Learn from industry expert {featuredCourse.instructor} in this comprehensive course.
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">{featuredCourse.lessons || 36}</p>
                          <p className="text-xs text-foreground/60">Lessons</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{featuredCourse.hours || 14.5}</p>
                          <p className="text-xs text-foreground/60">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{featuredCourse.level || "Advanced"}</p>
                          <p className="text-xs text-foreground/60">Level</p>
                        </div>
                      </div>
                      <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                        <Play className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <p>No featured courses available</p>
                </div>
              )}
            </div>
              
            <h3 className="text-xl font-bold mb-4">Popular Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <Skeleton className="h-40" />
                    <CardHeader>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-24" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card key={course.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center relative" 
                      style={{ backgroundImage: `url(${course.image || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000"})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-cinematic to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-cinematic-dark/70 px-2 py-1 rounded-full">
                        <Play className="h-3 w-3 text-gold" />
                        <span className="text-xs">{course.lessons || 24} lessons</span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>By {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-gold" />
                          <span className="text-sm">{course.rating || 4.8} ({course.reviews || 156})</span>
                        </div>
                        <span className="text-sm">{course.hours || 8.5} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          {course.level || "Intermediate"}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                        Enroll Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <p>No courses found matching your search criteria</p>
                </div>
              )}
            </div>
              
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className="border-gold/30 hover:border-gold mr-4"
                onClick={() => setDialogOpen(prev => ({ ...prev, courses: true }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Course
              </Button>
              <Button variant="outline" className="border-gold/30 hover:border-gold">
                Browse All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
          
        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Resource Categories */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <BookOpen className="h-10 w-10 text-gold mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Guides & Tutorials</h3>
                  <p className="text-sm text-foreground/70">Step-by-step instructions for film professionals</p>
                </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <FileText className="h-10 w-10 text-gold mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Templates</h3>
                  <p className="text-sm text-foreground/70">Professional documents for various purposes</p>
                </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <Film className="h-10 w-10 text-gold mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Industry Reports</h3>
                  <p className="text-sm text-foreground/70">In-depth analysis and market insights</p>
                </div>
                <div className="bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <Award className="h-10 w-10 text-gold mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Career Resources</h3>
                  <p className="text-sm text-foreground/70">Tools to advance your film career</p>
                </div>
              </div>
            </div>
              
            <h3 className="text-xl font-bold mb-4">Popular Downloads</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <Skeleton className="h-40" />
                    <CardHeader>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-5 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <Card key={resource.id} className="bg-card border-gold/10 overflow-hidden shadow-lg">
                    <div 
                      className="h-40 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${resource.image || "https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=1000"})` }}
                    ></div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                          {resource.type}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-foreground/60" />
                        <span className="text-sm">{resource.downloads || 0} downloads</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full border-gold/30 hover:border-gold"
                        onClick={() => handleDownload(resource)}
                      >
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 bg-card border border-gold/10 rounded-xl p-6 text-center">
                  <p>No resources found matching your search criteria</p>
                </div>
              )}
            </div>
              
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className="border-gold/30 hover:border-gold mr-4"
                onClick={() => setDialogOpen(prev => ({ ...prev, resources: true }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Submit Resource
              </Button>
              <Button variant="outline" className="border-gold/30 hover:border-gold">
                View All Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
        
      {/* Subscribe Section */}
      <div className="bg-card border border-gold/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Industry Updates</h2>
        <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
          Stay updated with the latest news, events, and resources from the film industry. 
          No spam, just valuable content delivered to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <Input 
            name="email"
            type="email"
            placeholder="Enter your email address" 
            className="bg-cinematic-dark/50 border-gold/10 focus:border-gold"
            required
          />
          <Button 
            type="submit"
            className="bg-gold hover:bg-gold-dark text-cinematic"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">●</span>
                Subscribing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Subscribe
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Form Dialogs */}
      <SubmitNewsForm 
        isOpen={dialogOpen.news} 
        onClose={() => setDialogOpen(prev => ({ ...prev, news: false }))} 
        onSubmit={submitNews}
      />
      
      <SubmitEventForm
        isOpen={dialogOpen.events} 
        onClose={() => setDialogOpen(prev => ({ ...prev, events: false }))} 
        onSubmit={submitEvent}
      />
      
      <SubmitCourseForm
        isOpen={dialogOpen.courses} 
        onClose={() => setDialogOpen(prev => ({ ...prev, courses: false }))} 
        onSubmit={async (data) => {
          // Extract description from the data before passing to submitCourse
          // const { description, ...courseData } = data;
          return submitCourse(data);
        }}
      />
      
      <SubmitResourceForm
        isOpen={dialogOpen.resources} 
        onClose={() => setDialogOpen(prev => ({ ...prev, resources: false }))} 
        onSubmit={async (data) => {
          // Extract description from the data before passing to submitResource
          const { description, ...resourceData } = data;
          return submitResource(resourceData);
        }}
      />
    </div>
  );
};

export default IndustryHub;
