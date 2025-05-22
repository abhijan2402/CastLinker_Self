import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  industryNews,
  industryEvents,
  industryCourses,
  industryResources,
} from "@/utils/dummyData";
import { fetchData, postData } from "@/api/ClientFuntion";

// Type definitions
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author_name: string;
  author_avatar: string;
  category: string;
  read_time: string;
  image: string;
  is_featured?: boolean;
  featured_image_url: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  is_featured?: boolean;
  event_status?: string;
};

export type CourseItem = {
  id: string;
  title: string;
  instructor: string;
  lessons: number;
  hours: number;
  level: string;
  rating: number;
  reviews: number;
  image: string;
  is_featured?: boolean;
};

export type ResourceItem = {
  id: string;
  title: string;
  type: string;
  downloads: number;
  image: string;
  file_url: string;
};

export type IndustrySubmission = {
  type: "news" | "event" | "course" | "resource";
  data: any;
};
interface NewsApiResponse {
  data: NewsItem[];
}

interface EventApiResponse {
  data: EventItem[];
}

interface CourseApiResponse {
  data: CourseItem[];
}
interface ResourceApiResponse {
  data: ResourceItem[];
}

export const useIndustryHub = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIndustryData = useCallback(async () => {
    setIsLoading(true);
    try {
      setResources(industryResources);

      // Fetch News Data
      const newsResult = await fetchData("/api/articles/list");
      const newsResponse = newsResult as NewsApiResponse;
      if (newsResponse?.data) {
        setNews(newsResponse.data);
      }

      // Fetch Event Data
      const eventsResult = await fetchData("/api/events/list");
      const eventsResponse = eventsResult as EventApiResponse;
      if (eventsResponse?.data) {
        setEvents(eventsResponse.data);
      }
      console.log(eventsResponse);

      // Fetch Course Data
      const coursesResult = await fetchData("/api/courses/list");
      const coursesResponse = coursesResult as CourseApiResponse;
      if (coursesResponse?.data) {
        setCourses(coursesResponse.data);
      }
      // Fetch Course Data
      const resourcesResult = await fetchData("/api/resources/list");

      const resourcesResponse = resourcesResult as ResourceApiResponse;
      if (resourcesResponse?.data) {
        setResources(resourcesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching industry data:", error);
      toast({
        title: "Error",
        description: "Failed to load industry data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndustryData();
  }, [fetchIndustryData]);

  // Filter news based on search query
  const filteredNews = searchQuery
    ? news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  // Filter events based on search query
  const filteredEvents = searchQuery
    ? events.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.level.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;

  // Filter resources based on search query
  const filteredResources = searchQuery
    ? resources.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resources;

  // Submit new content
  const submitContent = async (submission: IndustrySubmission) => {
    // if (!user) {
    //   toast({
    //     title: "Authentication Required",
    //     description: "You must be logged in to submit content",
    //     variant: "destructive",
    //   });
    //   return { success: false };
    // }

    try {
      const { type, data } = submission;

      switch (type) {
        case "news": {
          // API call to backend
          const formattedPayload = {
            title: data.title,
            excerpt: data.excerpt,
            description: data.content,
            category: data.category,
            read_time: data.read_time,
            featured_image_url: data.image,
          };
          const response = await postData(
            "/api/articles/create",
            formattedPayload
          );
          fetchIndustryData();
          toast({
            title: "Submission Successful",
            description: "Your article has been created successfully",
          });

          return { success: true };
          break;
        }

        // Keep the rest of the cases unchanged (you can update them similarly later)
        case "event": {
          const timeValue = parseFloat(data.time);
          const hours = Math.floor(timeValue).toString().padStart(2, "0");
          const minutes = Math.round((timeValue % 1) * 60)
            .toString()
            .padStart(2, "0");
          const formattedTime = `${hours}:${minutes}:00`;

          const payload = {
            title: data.title,
            description: data.description,
            date: new Date(data.date).toISOString().split("T")[0],
            time: formattedTime,
            location: data.location,
            event_type: data.type,
            featured_image_url: data.image,
          };

          const response = await postData("/api/events/create", payload);
          fetchIndustryData();
          // toast({
          //   title: "Submission Successful",
          //   description: "Your article has been created successfully",
          // });

          return { success: true };
          break;
        }

        case "course": {
          console.log(data);
          const payload = {
            title: data.title,
            instructor: data.instructor,
            description: data.description,
            no_of_lessons: data.lessons,
            duration: data.hours,
            level: data.level,
            featured_image_url: data.image,
          };
          console.log(payload);
          const response = await postData("/api/courses/create", payload);
          console.log(response);
          fetchIndustryData();
          // toast({
          //   title: "Submission Successful",
          //   description: "Your article has been created successfully",
          // });

          return { success: true };
          break;
        }

        case "resource": {
          console.log(data);
          const formattedPayload = {
            title: data.title,
            description: data.description,
            category: data.category,
            featured_image_url: data.image,
            file_url: data.file_url,
          };
          const response = await postData(
            "/api/resources/create",
            formattedPayload
          );
          // console.log(response);
          // toast({
          //   title: "Submission Successful",
          //   description: "Your article has been created successfully",
          // });
          fetchIndustryData();

          return { success: true };
          break;
        }
      }

      toast({
        title: "Submission Successful",
        description: "Your content has been submitted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error("Error submitting content:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your content",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  // Subscribe to newsletter
  const subscribeToNewsletter = async (email: string) => {
    try {
      // In a real implementation, we would store the email in Supabase
      // For now, we'll simulate success

      toast({
        title: "Subscription Successful",
        description: "You have been subscribed to our newsletter",
      });

      return { success: true };
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return {
    // Data
    news: filteredNews,
    events: filteredEvents,
    courses: filteredCourses,
    resources: filteredResources,

    // State
    isLoading,
    searchQuery,
    activeTab,

    // Actions
    setSearchQuery,
    setActiveTab,
    submitContent,
    downloadResource: async () => {},
    subscribeToNewsletter,
    refreshData: fetchIndustryData,
  };
};
