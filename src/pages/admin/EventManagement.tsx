import { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Plus, Clock, Users, MapPin, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEventsData } from "@/hooks/useEventsData";
import EventForm from "@/components/admin/EventForm";
import EventDetail from "@/components/admin/EventDetail";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Event } from "@/types/eventTypes";

const EventManagement = () => {
  const {
    events,
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
    upcomingEventsCount,
  } = useEventsData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateEvent = async (data: any) => {
    setIsSubmitting(true);
    const success = await addEvent(data);
    setIsSubmitting(false);
    
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!currentEvent) return;
    
    setIsSubmitting(true);
    const success = await updateEvent(currentEvent.id, data);
    setIsSubmitting(false);
    
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!currentEvent) return;
    
    const success = await deleteEvent(currentEvent.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
      setCurrentEvent(null);
    }
  };

  const handleEditClick = (event: Event) => {
    setCurrentEvent(event);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (event: Event) => {
    setCurrentEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>;
      case "registration":
        return <Badge className="bg-green-500 hover:bg-green-600">Registration Open</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gold-gradient-text">
          Event Management
        </h1>
        <p className="text-muted-foreground">
          Manage events and registrations on the platform.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Events</CardTitle>
              <CardDescription>All scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{events.length}</span>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>Scheduled for the future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {upcomingEventsCount}
                </span>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Attendees</CardTitle>
              <CardDescription>Across all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{totalAttendees}</span>
                <div className="p-2 bg-violet-500/10 rounded-full">
                  <Users className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured upcoming event */}
        {featuredEvent && (
          <Card className="bg-card shadow-md border border-gold/10">
            <CardHeader>
              <CardTitle>Featured Upcoming Event</CardTitle>
              <CardDescription>The next major industry event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-secondary/30 rounded-lg p-4 flex items-center justify-center md:w-1/3">
                  <Calendar className="h-12 w-12 text-gold opacity-80" />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2">
                    {featuredEvent.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(featuredEvent.event_date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {featuredEvent.event_time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{featuredEvent.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {featuredEvent.attendees} attendees
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleEditClick(featuredEvent)}
              >
                Edit Event
              </Button>
              <Button onClick={() => handleViewClick(featuredEvent)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Search and filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedDate
                        ? format(selectedDate, "MMM d, yyyy")
                        : "Filter by Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                    {selectedDate && (
                      <div className="p-2 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={resetDateFilter}
                        >
                          Clear Filter
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events table */}
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>
              Manage industry events and workshops
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead>Attendees</TableHead> */}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-xs">
                          {event.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {event.title}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.event_type}</TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{formatDate(event.createdAt)}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>
                          {getStatusBadge(event.status || "NA")}
                        </TableCell>
                        {/* <TableCell>{event.attendees}</TableCell> */}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewClick(event)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(event)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-6 text-muted-foreground"
                      >
                        {searchQuery || selectedDate
                          ? "No events found. Try adjusting your search or filter."
                          : "No events found. Create your first event!"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Event Modal */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Create New Event</SheetTitle>
            <SheetDescription>
              Add details for the new industry event.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <EventForm
              onSubmit={handleCreateEvent}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Event Modal */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Event</SheetTitle>
            <SheetDescription>
              Update details for the selected event.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {currentEvent && (
              <EventForm
                onSubmit={handleUpdateEvent}
                initialData={currentEvent}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Event Detail Modal */}
      <Sheet open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <SheetContent className="sm:max-w-lg">
          {currentEvent && (
            <EventDetail
              event={currentEvent}
              onEdit={() => {
                setIsDetailModalOpen(false);
                setTimeout(() => handleEditClick(currentEvent), 100);
              }}
              onClose={() => setIsDetailModalOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmButtonText="Delete Event"
        confirmButtonVariant="destructive"
      />
    </div>
  );
};

export default EventManagement;
