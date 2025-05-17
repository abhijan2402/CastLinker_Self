import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchData } from "@/api/ClientFuntion";
import { format, parseISO } from "date-fns";

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
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usersByRole, setUsersByRole] = useState<UsersByRole[]>([]);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [usersActivity, setUsersActivity] = useState<UsersActivity[]>([]);
  const [usersByMonth, setUsersByMonth] = useState<UserCountByMonth[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  console.log(usersByRole);

  // Fetch users data
  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
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
          console.log(formattedData);
          // Finally, set state
          setUsersByMonth(formattedData);
        }

        // Fetch users by role
        const response = await fetchData("/api/admin/stats/team-summary");
        console.log("Role data from API:", response);

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
    console.log(usersByRole)

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
              {loading ? "..." : totalUsers}
            </div>
            <div
              className={`flex items-center pt-1 text-xs ${
                percentageChange && percentageChange >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {percentageChange !== null ? (
                <>
                  <ArrowUpRight
                    className={`h-3 w-3 mr-1 ${
                      percentageChange >= 0 ? "" : "transform rotate-180"
                    }`}
                  />
                  <span>{percentageChange.toFixed(2)}% from last month</span>
                </>
              ) : (
                <span>No previous data</span>
              )}
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
            <div className="text-2xl font-bold">86</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% from last month</span>
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
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>20% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                User Activity
              </CardTitle>
              <CardDescription>Daily active users</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>5% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default AdminDashboard;
