import { fetchData } from "@/api/ClientFuntion";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { toast } from "react-toastify";

// Define notification object type
export interface Notification {
  id: number;
  user_id: number;
  sender_id: number | null;
  type: string;
  reference_id: number;
  content: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: Notification[];
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      setIsLoading(true);

      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = (await fetchData("/api/notifications")) as ApiResponse;
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user, toast]);

  return { notifications, isLoading };
};
