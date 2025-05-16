import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFormData } from "@/types/eventTypes";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "@/api/ClientFuntion";
import useAuth from "./useAuth";
type FetchFeaturedEvents = {
  data: Event[];
  error?: string;
};

interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  featured_image_url: string | null;
  event_status: string;
  expected_attribute: number;
  user_id: number;
  updatedAt: string;
  createdAt: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
type DeleteEventResponse = {
  success: boolean;
  message: string;
};
export function useEventsData() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = (await fetchData(
        "/api/events/list/admin/"
      )) as FetchFeaturedEvents;

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to fetch jobs");
      }

      const featuredEvents = response.data as Event[];
      console.log(featuredEvents);

      // Use type assertion to treat the data as Event[]
      setEvents(featuredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: EventFormData) => {
    console.log(eventData);
    try {
      setIsLoading(true);

      const payload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.event_date,
        time: eventData.event_time,
        location: eventData.location,
        event_type: eventData.event_type || "general",
        event_status: eventData.status,
        expected_attribute: eventData.attendees,
        user_id: user?.id,
      };

      const response = (await postData(
        "/api/events/create/admin",
        payload
      )) as ApiResponse<EventData>;

      if (!response?.success) {
        throw new Error(response.message || "Failed to create event");
      }
      const newEvent: Event = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        event_date: response.data.date,
        event_time: response.data.time,
        location: response.data.location,
        event_type: response.data.event_type,
        // featured_image_url: response.data.featured_image_url,
        event_status: response.data.event_status,
        attendees: response.data.expected_attribute,
        user_id: response.data.user_id,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      };
      setEvents((prev) => [...prev, newEvent]);

      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      return true;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: EventFormData) => {
    try {
      setIsLoading(true);

      const payload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.event_date,
        time: eventData.event_time,
        location: eventData.location,
        event_type: eventData.event_type || "general",
        event_status: eventData.status,
        expected_attribute: eventData.attendees,
      };

      const response = (await updateData(
        `/api/events/admin/${id}`,
        payload
      )) as ApiResponse<EventData>;

      if (!response?.success) {
        throw new Error(response.message || "Failed to create event");
      }

      if (response?.success) {
        const newEvent: Event = {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          event_date: response.data.date,
          event_time: response.data.time,
          location: response.data.location,
          event_type: response.data.event_type,
          // featured_image_url: response.data.featured_image_url,
          event_status: response.data.event_status,
          attendees: response.data.expected_attribute,
          user_id: response.data.user_id,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        setEvents((prev) => [...prev, newEvent]);

        toast({
          title: "Success",
          description: "Event updated successfully!",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string | number) => {
    try {
      setIsLoading(true);

      const rawResponse = await deleteData(`/api/events/admin/${id}`);
      const result = rawResponse as DeleteEventResponse;

      console.log(result);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((event) => event.id !== id));

      toast({
        title: "Success",
        description: result.message || "Event deleted successfully!",
      });

      return true;
    } catch (error) {
      console.error("Error deleting event:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete event. Please try again.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      (event.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.location?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (event.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const upcomingEvents = events.filter(
    (event) => event.event_status === "upcoming"
  );
  const featuredEvent = [...upcomingEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.time).getTime()
  )[0];

  const totalAttendees = events.reduce(
    (sum, event) => sum + event.expected_attribute,
    0
  );

  return {
    events: filteredEvents,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    featuredEvent,
    totalAttendees,
    upcomingEventsCount: upcomingEvents.length,
  };
}
