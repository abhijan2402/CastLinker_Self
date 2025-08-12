import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Check,
  Film,
  Calendar,
  MessageCircle,
  Building2,
  Award,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useNotifications } from "@/hooks/useNotifications";
import { fetchData, updateData } from "@/api/ClientFuntion";

interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

const NotificationsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { notifications, isLoading, setNotifications } = useNotifications();

  const [activeTab, setActiveTab] = useState("all");

  console.log(notifications);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.is_read;
    return notification.type === activeTab;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Info":
        return <Film className="h-5 w-5 text-blue-500" />;
      case "Important":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case "Alert":
        return <Building2 className="h-5 w-5 text-gold" />;
      case "profile":
        return <Award className="h-5 w-5 text-green-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-red-500" />;
      case "billing":
        return <Mail className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Format timestamps to relative time (e.g., "5 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

    return format(date, "MMM d, yyyy");
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    console.log(id);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const resp = await updateData<MarkAsReadResponse>(
      "/api/notifications/read-all",
      {}
    );

    console.log(resp);
    if (resp?.success) {
      toast({
        title: "Success",
        description: resp.message || "All notifications marked as read",
      });
      const res: any = await fetchData("/api/notifications");
      if (res.data) {
        setNotifications(res.data);
      }
    } else {
      toast({
        title: "Notice",
        description: resp?.message || "No notifications to update.",
        variant: "default",
      });
    }
  };

  return (
    <div className="space-y-4 pr-1">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Notifications
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your activity, messages, and opportunities
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gold/20 text-foreground/80 gap-1"
            onClick={markAllAsRead}
          >
            <Check className="h-4 w-4 text-gold" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-cinematic-dark/50 border border-gold/10 w-full justify-start mb-6">
          <TabsTrigger
            value="all"
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Unread
          </TabsTrigger>
          <TabsTrigger
            value="application"
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Applications
          </TabsTrigger>
          <TabsTrigger
            value="job"
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Jobs
          </TabsTrigger>
          <TabsTrigger
            value="message"
            className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
          >
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card border-gold/10 shadow-md overflow-hidden"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-12 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : filteredNotifications.length > 0 ? (
              // Notification cards
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`
                    bg-card border-gold/10 shadow-md overflow-hidden
                    ${!notification.is_read ? "border-l-4 border-l-gold" : ""}
                    ${
                      !notification.is_read
                        ? "bg-gradient-to-r from-gold/5 to-transparent"
                        : ""
                    }
                  `}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-card/80 flex items-center justify-center border border-gold/20">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {notification.type.charAt(0).toUpperCase() +
                              notification.type.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            !notification.is_read
                              ? "font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {!notification.is_read && (
                    <CardFooter className="pt-0 pb-3 px-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => markAsRead(notification.user_id)}
                      >
                        Mark as read
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              // Empty state
              <div className="bg-card border border-gold/10 rounded-xl p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No notifications yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {activeTab === "all"
                    ? "You don't have any notifications at the moment. Check back later!"
                    : `You don't have any ${
                        activeTab === "unread" ? "unread" : activeTab
                      } notifications.`}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
