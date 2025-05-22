export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  date: string;
  time: string;
  event_status: string;
  expected_attribute: number;
  createdAt?: string;
  updatedAt?: string;
  event_type: string;
  user_id: number;
  featured_image_url: string;
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
