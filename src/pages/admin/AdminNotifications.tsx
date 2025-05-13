import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Send,
  Mail,
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { postData } from "@/api/ClientFuntion";
import { toast } from "react-toastify";
// Notification Payload Type
interface NotificationPayload {
  title: string;
  message: string;
  type: string; // or any other types
  audience: string;
  status: string; // Depending on your system
}

const AdminNotifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    type: "info",
    audience: "all",
  });

  const handleNotification = async (payload: NotificationPayload) => {
    try {
      // Send notification data to API
      const response = await postData(
        "/api/notifications/admin/template",
        payload
      ); // Assuming you have postData utility

      // Show success toast
      toast({
        title: "Success",
        description: "Notification sent successfully.",
      });
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to send notification.",
      });
    }
  };
  const handleSubmit = () => {
    const payload: NotificationPayload = {
      title: notificationForm.title,
      message: notificationForm.message,
      type: notificationForm.type,
      audience:
        notificationForm.audience === "all"
          ? "All Users"
          : notificationForm.audience,
      status: "Sent", // Set status to "Sent" when sending
    };
    console.log(payload);
    handleNotification(payload);
  };
  // Mock notifications data
  const notifications = [
    {
      id: "NOT-2024-001",
      title: "Platform Maintenance",
      message: "Scheduled maintenance on May 20, 2024, from 2 AM to 4 AM EST.",
      type: "system",
      audience: "all",
      sentDate: "2024-05-15",
      status: "sent",
      reads: 234,
    },
    {
      id: "NOT-2024-002",
      title: "New Feature Announcement",
      message:
        "Introducing our new messaging system for talents and casting directors.",
      type: "feature",
      audience: "all",
      sentDate: "2024-05-10",
      status: "sent",
      reads: 420,
    },
    {
      id: "NOT-2024-003",
      title: "Verify Your Account",
      message:
        "Please complete your profile verification to access premium features.",
      type: "alert",
      audience: "unverified",
      sentDate: "2024-05-08",
      status: "sent",
      reads: 156,
    },
    {
      id: "NOT-2024-004",
      title: "Important Policy Update",
      message: "We've updated our terms of service. Please review the changes.",
      type: "important",
      audience: "all",
      sentDate: "2024-05-05",
      status: "sent",
      reads: 389,
    },
    {
      id: "NOT-2024-005",
      title: "Summer Discount",
      message: "Get 20% off on premium plans this summer. Use code SUMMER24.",
      type: "promotion",
      audience: "free",
      sentDate: "2024-05-01",
      status: "scheduled",
      scheduledDate: "2024-06-01",
      reads: 0,
    },
  ];

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "feature":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "important":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "promotion":
        return <Mail className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500 hover:bg-green-600">Sent</Badge>;
      case "scheduled":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>
        );
      case "draft":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNotificationForm({
      ...notificationForm,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gold-gradient-text">
        Notification Management
      </h1>
      <p className="text-muted-foreground">
        Send and manage system notifications to users.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Notifications</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {notifications.length}
                </span>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Reads</CardTitle>
              <CardDescription>Across all notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {notifications.reduce(
                    (acc, notification) => acc + notification.reads,
                    0
                  )}
                </span>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Scheduled</CardTitle>
              <CardDescription>Upcoming notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {
                    notifications.filter(
                      (notification) => notification.status === "scheduled"
                    ).length
                  }
                </span>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Notification Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Notification</CardTitle>
            <CardDescription>Send a new notification to users</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Notification title"
                  value={notificationForm.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter notification message here..."
                  rows={4}
                  value={notificationForm.message}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    name="type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={notificationForm.type}
                    onChange={handleInputChange}
                  >
                    <option value="info">Info</option>
                    <option value="system">System</option>
                    <option value="alert">Alert</option>
                    <option value="feature">Feature</option>
                    <option value="important">Important</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Audience</Label>
                  <select
                    id="audience"
                    name="audience"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={notificationForm.audience}
                    onChange={handleInputChange}
                  >
                    <option value="all">All Users</option>
                    <option value="free">Free Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="unverified">Unverified Users</option>
                    <option value="inactive">Inactive Users</option>
                  </select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save as Draft</Button>
            <Button className="gap-2" onClick={handleSubmit}>
              <Send className="h-4 w-4" />
              Send Now
            </Button>
          </CardFooter>
        </Card>

        {/* Notifications Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Sent Notifications</CardTitle>
                <CardDescription>History of all notifications</CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-10 w-full sm:w-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(notification.type)}
                          <span className="ml-2 capitalize">
                            {notification.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-xs truncate"
                          title={notification.title}
                        >
                          {notification.title}
                        </div>
                        <div
                          className="text-xs text-muted-foreground max-w-xs truncate"
                          title={notification.message}
                        >
                          {notification.message}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="capitalize">
                            {notification.audience}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.status === "scheduled"
                          ? `${notification.scheduledDate} (scheduled)`
                          : notification.sentDate}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.status)}
                      </TableCell>
                      <TableCell>{notification.reads}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Resend
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No notifications found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotifications;
