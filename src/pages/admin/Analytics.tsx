import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Users,
  Calendar,
  Film,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Sparkles,
} from "lucide-react";
import { parse, format } from "date-fns";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";

// Colors for pie charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CFF",
  "#FF6B6B",
];

const Analytics = () => {
  const {
    jobCategoriesData,
    userDemographicsData,
    userActivityData,
    jobMetricData,
    analyticsStatsData,
    loading,
    error,
  } = useAdminAnalytics();

  const transformedUserDemographicsData = userDemographicsData.map((item) => ({
    name: item.user_role,
    value: parseInt(item.count, 10),
  }));
  const pieChartData = jobCategoriesData.map((item) => ({
    name: item.role_category,
    value: parseInt(item.count, 10),
  }));

  const transformedUserActivityData = userActivityData.map((item) => ({
    name: format(new Date(item.month), "MMM"), // e.g., "Apr"
    value: parseInt(item.activeUsers, 10),
  }));

  const transformedJobMetricsData = jobMetricData.map((item) => ({
    name: format(parse(item.month, "yyyy-MM", new Date()), "MMM"),
    posted: item.posted,
    applications: item.applications,
  }));

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
      <h1 className="text-3xl font-bold gold-gradient-text">
        Analytics Dashboard
      </h1>
      <p className="text-muted-foreground">
        Track key metrics and performance indicators.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {analyticsStatsData.totalUsers ?? 0}
            </div>
            <div
              className={`flex items-center pt-1 text-xs ${usersChangeMeta.textColor}`}
            >
              {usersChangeMeta.icon || ".."}
              <span>{usersChangeMeta.label}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <CardDescription>Open positions</CardDescription>
            </div>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
              <CardTitle className="text-sm font-medium">
                Applications
              </CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsStatsData.applicationsLast30Days ?? 0}
            </div>
            <div
              className={`flex items-center pt-1 text-xs ${applicationsChangeMeta.textColor}`}
            >
              {applicationsChangeMeta.icon || ".."}
              <span>{applicationsChangeMeta.label}</span>
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
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  width={500}
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

        {/* Jobs Posted vs Applications Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Job Metrics</CardTitle>
                <CardDescription>
                  Jobs posted vs applications received
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {transformedJobMetricsData.length > 0 ? (
                <RechartsBarChart
                  width={500}
                  height={300}
                  data={transformedJobMetricsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posted" fill="#8884d8" />
                  <Bar dataKey="applications" fill="#82ca9d" />
                </RechartsBarChart>
              ) : (
                <p className="text-gray-500 text-sm">No data found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>Breakdown by role type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {transformedUserDemographicsData.length > 0 ? (
                <RechartsPieChart width={400} height={300}>
                  <Pie
                    data={transformedUserDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userDemographicsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              ) : (
                <p className="text-gray-500 text-sm">No data found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
            <CardDescription>Most popular job types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {pieChartData.length > 0 ? (
                <RechartsPieChart width={400} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              ) : (
                <p className="text-gray-500 text-sm">No data found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
