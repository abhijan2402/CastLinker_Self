import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIndustryHub } from "@/hooks/useIndustryHub";
type FormattedEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  featured_image_url: any;
  user_id: number;
  event_status: string;
  expected_attribute: number;
  createdAt: string;
  updatedAt: string;
  month: string;
  day: number;
  year: number;
};

const Events = () => {
  const { events } = useIndustryHub();
  console.log(events);
  const eventss = [
    {
      id: 3,
      title: "new event ",
      description: "new event new event new event ",
      date: "2025-05-15",
      time: "18:00:00",
      location: "New York",
      event_type: "Seminar",
      featured_image_url: null,
      user_id: 0,
      event_status: "upcoming",
      expected_attribute: 100,
      createdAt: "2025-05-15T15:43:08.523Z",
      updatedAt: "2025-05-15T15:43:08.523Z",
    },
  ];

  const formattedUpcomingEvents: FormattedEvent[] = eventss
    .filter((event) => event.event_status === "upcoming")
    .map((event) => {
      const date = new Date(event.date);

      const monthAbbr = date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const day = date.getDate();
      const year = date.getFullYear();

      return {
        ...event,
        month: monthAbbr,
        day,
        year,
      };
    });

  // console.log(formattedUpcomingEvents);

  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Industry Events</h1>
          <p className="text-lg text-foreground/70 mb-12">
            Connect with industry professionals at these upcoming events.
          </p>

          {formattedUpcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card-gradient border border-gold/10 rounded-xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="bg-gold/20 text-gold rounded-lg p-3 text-center">
                    <span className="block text-sm">{event.month}</span>
                    <span className="block text-3xl font-bold">
                      {event.day}
                    </span>
                    <span className="block text-sm">{event.year}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-foreground/60 flex items-center mb-4">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {`${event.month} ${event.day}, ${event.year}`} •{" "}
                    {event.location}
                  </p>
                  <p className="text-foreground/80 mb-6">{event.description}</p>
                  <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
