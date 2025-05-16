
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { Event } from "@/types/eventTypes";

interface EventDetailProps {
  event: Event;
  onEdit: () => void;
  onClose: () => void;
}

const EventDetail = ({ event, onEdit, onClose }: EventDetailProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, "MMMM d, yyyy") : dateStr;
    } catch (error) {
      return dateStr;
    }
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

  return (
    <Card className="border-gold/10 bg-card shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription className="mt-2">
              {getStatusBadge(event.event_status)}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {event.description && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Description
            </h4>
            <p className="text-sm">{event.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.event_date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.event_time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.attendees} attendees</span>
          </div>
        </div>

        <div className="border-t border-gold/5 pt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Event Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">ID: </span>
              <span className="font-mono">{event.id}</span>
            </div>

            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>
                {event.createdAt ? formatDate(event.createdAt) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gold/5 pt-4">
        <Button onClick={onEdit}>Edit Event</Button>
      </CardFooter>
    </Card>
  );
};

export default EventDetail;
