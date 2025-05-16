export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  event_time: string;
  event_status: string;
  attendees: number;
  createdAt?: string;
  updatedAt?: string;
  event_type: string;
  user_id: number;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  status: "upcoming" | "completed" | "registration" | "cancelled";
  attendees: number;
  event_type: string;
}
