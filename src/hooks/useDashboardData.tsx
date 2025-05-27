import { useEffect, useState } from "react";

export const useDashboardData = (fetchData: Function) => {
  const [stats, setStats] = useState({
    applications: 0,
    connections: 0,
    likes: 0,
    ratings: 0,
    profileViews: 0,
    callbacks: 0,
    activityScore: 0,
  });

  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [applicationApplied, setApplicationApplied] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetchData("/api/dashboard");

      if (res) {
        setStats({
          applications: res.data.applications || 0,
          connections: res.data.connections || 0,
          likes: res.data.likes || 0,
          ratings: parseFloat(res.data.rating) || 0.0,
          profileViews: 0,
          callbacks: 0,
          activityScore: 0,
        });

        setRecentOpportunities(
          (res.data.recentJobs || []).map((job) => ({
            ...job,
            applied: false,
          }))
        );

        setRecentMessages(res.data.recentMessages || []);
        setUpcomingEvents(res.data.upcomingEvents || []);
        setApplicationApplied(res.data.applicationApplied || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentOpportunities,
    recentMessages,
    upcomingEvents,
    applicationApplied,
  };
};
