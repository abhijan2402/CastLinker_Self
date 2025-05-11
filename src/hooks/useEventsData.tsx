import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFormData } from "@/types/eventTypes";
import { fetchData } from "@/api/ClientFuntion";
type FetchFeaturedEvents = {
  data: Events[];
  error?: string;
};
export function useEventsData() {
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
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("industry_events_management")
        .insert([eventData])
        .select();

      if (error) throw error;

      if (data) {
        setEvents((prev) => [...prev, data[0] as Event]);
        toast({
          title: "Success",
          description: "Event created successfully!",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
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

      const { data, error } = await supabase
        .from("industry_events_management")
        .update(eventData)
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data) {
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? (data[0] as Event) : event))
        );
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

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from("industry_events_management")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const featuredEvent = [...upcomingEvents].sort(
    (a, b) =>
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  )[0];

  const totalAttendees = events.reduce(
    (sum, event) => sum + event.attendees,
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
