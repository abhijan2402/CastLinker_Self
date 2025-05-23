import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart as RechartsAreaChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Users,
  FilmIcon,
  Calendar,
  Activity,
  Clock,
  Download,
  ArrowDownRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchData } from "@/api/ClientFuntion";
import { format, parseISO, isSameMonth, subMonths } from "date-fns";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { useEventsData } from "@/hooks/useEventsData";
import EventDetail from "@/components/admin/EventDetail";
import EventForm from "@/components/admin/EventForm";

type UsersByRole = {
  role: string;
  count: number;
};
type UsersActivity = {
  role: string;
  count: number;
};

type UserCountByMonth = {
  month: string;
  count: number;
};

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
  featured_image_url: string | null;
  user_id: number;
  event_status: string;
  expected_attribute: number;
  createdAt: string;
  updatedAt: string;
};

type EventListResponse = {
  success: boolean;
  message: string;
  data: Event[];
};

const AdminDashboard = () => {
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
  const {
    jobCategoriesData,
    userDemographicsData,
    userActivityData,
    jobMetricData,
    analyticsStatsData,
  } = useAdminAnalytics();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersByRole, setUsersByRole] = useState<UsersByRole[]>([]);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [usersActivity, setUsersActivity] = useState<UsersActivity[]>([]);
  const [usersByMonth, setUsersByMonth] = useState<UserCountByMonth[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const now = new Date();

  const currentMonthData = userActivityData.find((item) =>
    isSameMonth(parseISO(item.month), now)
  );

  const previousMonthDate = subMonths(now, 1);
  const previousMonthData = userActivityData.find((item) =>
    isSameMonth(parseISO(item.month), previousMonthDate)
  );

  const currentActiveUsers = currentMonthData
    ? Number(currentMonthData.activeUsers)
    : 0;
  const previousActiveUsers = previousMonthData
    ? Number(previousMonthData.activeUsers)
    : 0;

  // Calculate percentage change safely
  const percentageChanges =
    previousActiveUsers === 0
      ? currentActiveUsers === 0
        ? 0
        : 100
      : ((currentActiveUsers - previousActiveUsers) / previousActiveUsers) *
        100;

  const isPositiveChange = percentageChanges >= 0;
  const formattedPercentage = Math.abs(percentageChanges).toFixed(1);
  // Fetch users data
  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        // const rep = fetchData("/api/admin/stats/recent-activities");
        const rep = await fetchData("/api/admin/stats/posts-category");

        // Fetch event list
        const responseUserActivity = (await fetchData(
          "/api/events/list/admin/"
        )) as EventListResponse;
        if (
          responseUserActivity &&
          responseUserActivity.success &&
          Array.isArray(responseUserActivity.data)
        ) {
          const eventData = responseUserActivity.data;
          setTotalUsers(eventData?.length);

          const eventCountsByMonth: Record<string, number> = eventData.reduce(
            (acc: Record<string, number>, event) => {
              const month = format(parseISO(event.createdAt), "yyyy-MM"); // e.g., "2025-05"
              acc[month] = (acc[month] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

          // Now transform into an array of type UserCountByMonth[]
          const formattedData: UserCountByMonth[] = Object.entries(
            eventCountsByMonth
          ).map(
            ([month, count]) => ({ month, count }) // count is now known to be a number
          );

          // Optional: sort chronologically
          formattedData.sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
          );
          // Finally, set state
          setUsersByMonth(formattedData);
        }

        // Fetch users by role
        const response = await fetchData("/api/admin/stats/team-summary");

        if (response && Array.isArray(response)) {
          setUsersByRole(response); // response is already in desired format
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    if (usersByRole.length === 0) return;

    // Assume userGrowth is sorted ascending by month
    const lastIndex = usersByRole.length - 1;

    const currentMonthCount = usersByRole[lastIndex].count;
    const lastMonthCount = usersByRole[lastIndex - 1]?.count || 0;

    setTotalUsers(currentMonthCount);

    if (lastMonthCount === 0) {
      setPercentageChange(null); // can't divide by zero
    } else {
      const change =
        ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
      setPercentageChange(change);
    }
  }, [usersByRole]);

  // Filter users by profession
  const filteredUsersByRole =
    selectedProfession === "all"
      ? usersByRole
      : usersByRole.filter((item) => item.role === selectedProfession);

  const transformedUserActivityData = userActivityData.map((item) => ({
    name: format(new Date(item.month), "MMM"), // e.g., "Apr"
    value: parseInt(item.activeUsers, 10),
  }));

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  const handleUpdateEvent = async (data: any) => {
    if (!currentEvent) return;

    setIsSubmitting(true);
    const success = await updateEvent(currentEvent.id, data);
    setIsSubmitting(false);

    if (success) {
      setIsEditModalOpen(false);
      fetchEvents();
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

const getChangeMeta = (change: string | undefined | null) => {
  if (!change) {
    return {
      icon: "...",
      label: "...",
      textColor: "text-muted-foreground",
    };
  }

  if (change === "New") {
    return {
      icon: <Sparkles className="h-3 w-3 mr-1" />,
      label: "New",
      textColor: "text-blue-500",
    };
  }

  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");

  return {
    icon: isPositive ? (
      <ArrowUpRight className="h-3 w-3 mr-1" />
    ) : isNegative ? (
      <ArrowDownRight className="h-3 w-3 mr-1" />
    ) : (
      "..."
    ),
    label: change,
    textColor: isPositive
      ? "text-green-500"
      : isNegative
      ? "text-red-500"
      : "text-muted-foreground",
  };
};


  const usersChangeMeta = getChangeMeta(analyticsStatsData.usersChange);
  const jobsChangeMeta = getChangeMeta(analyticsStatsData.jobsChange);
  const applicationsChangeMeta = getChangeMeta(
    analyticsStatsData.applicationsChange
  );
  const eventsChangeMeta = getChangeMeta(analyticsStatsData.eventsChange);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of platform statistics and insights.
      </p>

      {/* User statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <CardDescription>Platform registrations</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              { analyticsStatsData.totalUsers ?? 0}
            </div>

            <div
              className={`flex items-center pt-1 text-xs ${
                usersChangeMeta?.textColor ?? ""
              }`}
            >
              <span className="flex items-center gap-1">
                {usersChangeMeta?.icon ?? "..."}
                {usersChangeMeta?.label ?? "..."}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CardDescription>Open positions</CardDescription>
            </div>
            <FilmIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {analyticsStatsData.activeJobs ?? 0}
            </div>
            <div
              className={`flex items-center pt-1 text-xs ${jobsChangeMeta.textColor}`}
            >
              {jobsChangeMeta.icon || ".."}
              <span>{jobsChangeMeta.label}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <CardDescription>Scheduled this month</CardDescription>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              {analyticsStatsData.eventsThisMonth ?? 0}
            </div>
            <div
              className={`flex items-center pt-1 text-xs ${eventsChangeMeta.textColor}`}
            >
              {eventsChangeMeta.icon || ".."}
              <span>{eventsChangeMeta.label}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                User Activity
              </CardTitle>
              <CardDescription>Active users this month</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentActiveUsers}</div>
            <div
              className={`flex items-center pt-1 text-xs ${
                isPositiveChange ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositiveChange ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              <span>{formattedPercentage}% from last month</span>
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
                      {formatDate(featuredEvent.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {featuredEvent.expected_attribute} attendees
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

      {/* User growth chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usersByMonth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Users"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Users by profession chart with filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Users by Profession</CardTitle>
              <CardDescription>
                Breakdown of user professional roles
              </CardDescription>
            </div>

            {/* Profession filter */}
            <Select
              value={selectedProfession}
              onValueChange={setSelectedProfession}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professions</SelectItem>
                <SelectItem value="actor">Actors</SelectItem>
                <SelectItem value="director">Directors</SelectItem>
                <SelectItem value="producer">Producers</SelectItem>
                <SelectItem value="writer">Writers</SelectItem>
                <SelectItem value="cinematographer">
                  Cinematographers
                </SelectItem>
                <SelectItem value="agency">Agencies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading user data...</p>
              </div>
            ) : filteredUsersByRole.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredUsersByRole}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  No user data available for the selected profession.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Daily active users over time</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            {transformedUserActivityData.length > 0 ? (
              <RechartsAreaChart
                width={1100}
                height={300}
                data={transformedUserActivityData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </RechartsAreaChart>
            ) : (
              <p className="text-gray-500 text-sm">No data found</p>
            )}
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AdminDashboard;
