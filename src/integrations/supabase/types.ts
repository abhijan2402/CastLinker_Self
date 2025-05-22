export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      _escyvd_connections: {
        Row: {
          created_at: string;
          id: string;
          receiver_email: string;
          requester_email: string;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          receiver_email: string;
          requester_email: string;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          receiver_email?: string;
          requester_email?: string;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_events: {
        Row: {
          created_at: string;
          description: string;
          end_datetime: string | null;
          id: string;
          image_url: string | null;
          location: string | null;
          organizer_email: string;
          start_datetime: string;
          status: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          end_datetime?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          organizer_email: string;
          start_datetime: string;
          status?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          end_datetime?: string | null;
          id?: string;
          image_url?: string | null;
          location?: string | null;
          organizer_email?: string;
          start_datetime?: string;
          status?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_job_applications: {
        Row: {
          cover_letter: string | null;
          created_at: string;
          id: string;
          job_id: string;
          status: string | null;
          updated_at: string;
          user_email: string;
        };
        Insert: {
          cover_letter?: string | null;
          created_at?: string;
          id?: string;
          job_id: string;
          status?: string | null;
          updated_at?: string;
          user_email: string;
        };
        Update: {
          cover_letter?: string | null;
          created_at?: string;
          id?: string;
          job_id?: string;
          status?: string | null;
          updated_at?: string;
          user_email?: string;
        };
        Relationships: [
          {
            foreignKeyName: "FilmCollab_escyvd_job_applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "FilmCollab_escyvd_jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      FilmCollab_escyvd_jobs: {
        Row: {
          company: string;
          created_at: string;
          description: string;
          id: string;
          job_type: string | null;
          location: string | null;
          posted_by: string;
          status: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          description: string;
          id?: string;
          job_type?: string | null;
          location?: string | null;
          posted_by: string;
          status?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          description?: string;
          id?: string;
          job_type?: string | null;
          location?: string | null;
          posted_by?: string;
          status?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          is_read: boolean | null;
          receiver_email: string;
          sender_email: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          receiver_email: string;
          sender_email: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          is_read?: boolean | null;
          receiver_email?: string;
          sender_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_news_articles: {
        Row: {
          author_email: string;
          content: string;
          created_at: string;
          id: string;
          image_url: string | null;
          status: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_email: string;
          content: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_email?: string;
          content?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_portfolio_items: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          media_type: string | null;
          media_url: string | null;
          title: string;
          user_email: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          media_type?: string | null;
          media_url?: string | null;
          title: string;
          user_email: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          media_type?: string | null;
          media_url?: string | null;
          title?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_user_experiences: {
        Row: {
          company: string;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          location: string | null;
          start_date: string;
          title: string;
          user_email: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          location?: string | null;
          start_date: string;
          title: string;
          user_email: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          location?: string | null;
          start_date?: string;
          title?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_user_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          headline: string | null;
          id: string;
          location: string | null;
          role: string;
          updated_at: string;
          user_email: string;
          verified: boolean | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          headline?: string | null;
          id?: string;
          location?: string | null;
          role: string;
          updated_at?: string;
          user_email: string;
          verified?: boolean | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          headline?: string | null;
          id?: string;
          location?: string | null;
          role?: string;
          updated_at?: string;
          user_email?: string;
          verified?: boolean | null;
          website?: string | null;
        };
        Relationships: [];
      };
      FilmCollab_escyvd_user_skills: {
        Row: {
          created_at: string;
          id: string;
          skill: string;
          user_email: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          skill: string;
          user_email: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          skill?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_posts: {
        Row: {
          category: string;
          created_at: string;
          created_by: string;
          creator_name: string | null;
          creator_profession: string | null;
          description: string;
          event_date: string | null;
          external_url: string | null;
          id: string;
          landmark: string | null;
          like_count: number | null;
          location: string | null;
          media_type: string | null;
          media_url: string | null;
          pincode: string | null;
          place: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          created_by: string;
          creator_name?: string | null;
          creator_profession?: string | null;
          description: string;
          event_date?: string | null;
          external_url?: string | null;
          id?: string;
          landmark?: string | null;
          like_count?: number | null;
          location?: string | null;
          media_type?: string | null;
          media_url?: string | null;
          pincode?: string | null;
          place?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          created_by?: string;
          creator_name?: string | null;
          creator_profession?: string | null;
          description?: string;
          event_date?: string | null;
          external_url?: string | null;
          id?: string;
          landmark?: string | null;
          like_count?: number | null;
          location?: string | null;
          media_type?: string | null;
          media_url?: string | null;
          pincode?: string | null;
          place?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_portfolio_items: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          media_type: string | null;
          media_url: string | null;
          title: string;
          user_email: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          media_type?: string | null;
          media_url?: string | null;
          title: string;
          user_email: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          media_type?: string | null;
          media_url?: string | null;
          title?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_bookmarks: {
        Row: {
          bookmarked_user_email: string;
          created_at: string;
          id: number;
          user_email: string;
        };
        Insert: {
          bookmarked_user_email: string;
          created_at?: string;
          id?: number;
          user_email: string;
        };
        Update: {
          bookmarked_user_email?: string;
          created_at?: string;
          id?: number;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_connections: {
        Row: {
          created_at: string;
          id: number;
          receiver_email: string;
          requester_email: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          receiver_email: string;
          requester_email: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          receiver_email?: string;
          requester_email?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_experiences: {
        Row: {
          company: string;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: number;
          location: string | null;
          start_date: string;
          title: string;
          user_email: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          location?: string | null;
          start_date: string;
          title: string;
          user_email: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: number;
          location?: string | null;
          start_date?: string;
          title?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_likes: {
        Row: {
          created_at: string;
          id: number;
          liked_user_email: string;
          liker_email: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          liked_user_email: string;
          liker_email: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          liked_user_email?: string;
          liker_email?: string;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          headline: string | null;
          id: string;
          likes_count: number | null;
          location: string | null;
          rating: number | null;
          role: string | null;
          updated_at: string;
          user_email: string;
          verified: boolean | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          headline?: string | null;
          id?: string;
          likes_count?: number | null;
          location?: string | null;
          rating?: number | null;
          role?: string | null;
          updated_at?: string;
          user_email: string;
          verified?: boolean | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          headline?: string | null;
          id?: string;
          likes_count?: number | null;
          location?: string | null;
          rating?: number | null;
          role?: string | null;
          updated_at?: string;
          user_email?: string;
          verified?: boolean | null;
          website?: string | null;
        };
        Relationships: [];
      };
      FilmCollab_x1yc7_user_skills: {
        Row: {
          created_at: string;
          id: number;
          skill: string;
          user_email: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          skill: string;
          user_email: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          skill?: string;
          user_email?: string;
        };
        Relationships: [];
      };
      chat_x1yc7_conversations: {
        Row: {
          created_at: string;
          creator_email: string;
          id: number;
          last_message: string | null;
          last_message_at: string | null;
          participant_email: string;
        };
        Insert: {
          created_at?: string;
          creator_email: string;
          id?: number;
          last_message?: string | null;
          last_message_at?: string | null;
          participant_email: string;
        };
        Update: {
          created_at?: string;
          creator_email?: string;
          id?: number;
          last_message?: string | null;
          last_message_at?: string | null;
          participant_email?: string;
        };
        Relationships: [];
      };
      chat_x1yc7_messages: {
        Row: {
          content: string;
          conversation_id: number;
          created_at: string;
          id: number;
          sender_email: string;
        };
        Insert: {
          content: string;
          conversation_id: number;
          created_at?: string;
          id?: number;
          sender_email: string;
        };
        Update: {
          content?: string;
          conversation_id?: number;
          created_at?: string;
          id?: number;
          sender_email?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_x1yc7_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "chat_x1yc7_conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string | null;
          end_date: string;
          id: string;
          start_date: string;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          end_date: string;
          id?: string;
          start_date: string;
          title: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          end_date?: string;
          id?: string;
          start_date?: string;
          title?: string;
        };
        Relationships: [];
      };
      film_jobs: {
        Row: {
          application_deadline: string | null;
          application_email: string | null;
          application_url: string | null;
          company: string;
          company_logo: string | null;
          coordinates: unknown | null;
          created_at: string | null;
          created_by: string | null;
          description: string;
          experience_level: string | null;
          id: string;
          is_featured: boolean | null;
          is_verified: boolean | null;
          job_type: string;
          location: string;
          location_type: string;
          requirements: string[] | null;
          responsibilities: string[] | null;
          role_category: string;
          salary_currency: string | null;
          salary_max: number | null;
          salary_min: number | null;
          salary_period: string | null;
          status: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          application_deadline?: string | null;
          application_email?: string | null;
          application_url?: string | null;
          company: string;
          company_logo?: string | null;
          coordinates?: unknown | null;
          created_at?: string | null;
          created_by?: string | null;
          description: string;
          experience_level?: string | null;
          id?: string;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          job_type: string;
          location: string;
          location_type: string;
          requirements?: string[] | null;
          responsibilities?: string[] | null;
          role_category: string;
          salary_currency?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          salary_period?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          application_deadline?: string | null;
          application_email?: string | null;
          application_url?: string | null;
          company?: string;
          company_logo?: string | null;
          coordinates?: unknown | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          experience_level?: string | null;
          id?: string;
          is_featured?: boolean | null;
          is_verified?: boolean | null;
          job_type?: string;
          location?: string;
          location_type?: string;
          requirements?: string[] | null;
          responsibilities?: string[] | null;
          role_category?: string;
          salary_currency?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          salary_period?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      industry_courses: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          hours: number | null;
          id: string;
          image: string | null;
          instructor: string;
          is_featured: boolean | null;
          lessons: number | null;
          level: string | null;
          rating: number | null;
          reviews: number | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          hours?: number | null;
          id?: string;
          image?: string | null;
          instructor: string;
          is_featured?: boolean | null;
          lessons?: number | null;
          level?: string | null;
          rating?: number | null;
          reviews?: number | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          hours?: number | null;
          id?: string;
          image?: string | null;
          instructor?: string;
          is_featured?: boolean | null;
          lessons?: number | null;
          level?: string | null;
          rating?: number | null;
          reviews?: number | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      industry_events: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          date: string;
          description: string;
          id: string;
          image: string | null;
          is_featured: boolean | null;
          location: string | null;
          time: string | null;
          title: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          date: string;
          description: string;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          time?: string | null;
          title: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          date?: string;
          description?: string;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          time?: string | null;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      industry_events_management: {
        Row: {
          attendees: number | null;
          created_at: string | null;
          description: string | null;
          event_date: string;
          event_time: string;
          id: string;
          location: string;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          attendees?: number | null;
          created_at?: string | null;
          description?: string | null;
          event_date: string;
          event_time: string;
          id?: string;
          location: string;
          status?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          attendees?: number | null;
          created_at?: string | null;
          description?: string | null;
          event_date?: string;
          event_time?: string;
          id?: string;
          location?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      industry_news: {
        Row: {
          author_avatar: string | null;
          author_id: string | null;
          author_name: string | null;
          category: string | null;
          content: string;
          created_at: string | null;
          date: string | null;
          excerpt: string;
          id: string;
          image: string | null;
          is_featured: boolean | null;
          read_time: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_avatar?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          category?: string | null;
          content: string;
          created_at?: string | null;
          date?: string | null;
          excerpt: string;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          read_time?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_avatar?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string | null;
          date?: string | null;
          excerpt?: string;
          id?: string;
          image?: string | null;
          is_featured?: boolean | null;
          read_time?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      industry_resources: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          downloads: number | null;
          file_url: string | null;
          id: string;
          image: string | null;
          title: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          downloads?: number | null;
          file_url?: string | null;
          id?: string;
          image?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          downloads?: number | null;
          file_url?: string | null;
          id?: string;
          image?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      job_applications: {
        Row: {
          additional_files: string[] | null;
          cover_letter: string | null;
          created_at: string | null;
          id: string;
          job_id: string;
          resume_url: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          additional_files?: string[] | null;
          cover_letter?: string | null;
          created_at?: string | null;
          id?: string;
          job_id: string;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          additional_files?: string[] | null;
          cover_letter?: string | null;
          created_at?: string | null;
          id?: string;
          job_id?: string;
          resume_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "film_jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      jobs: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string | null;
          id: string;
          status: string | null;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          id?: string;
          status?: string | null;
          title: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          id?: string;
          status?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          read: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          read?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          read?: boolean | null;
          user_id?: string;
        };
        Relationships: [];
      };
      post_applications: {
        Row: {
          applied_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          applied_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          applied_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_applications_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "FilmCollab_posts";
            referencedColumns: ["id"];
          }
        ];
      };
      post_likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "FilmCollab_posts";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          achievements: string[] | null;
          availability_status: string | null;
          avatar_url: string | null;
          created_at: string | null;
          description: string | null;
          email: string;
          experience_years: number | null;
          full_name: string | null;
          id: string;
          is_verified: boolean | null;
          languages: string[] | null;
          likes: number | null;
          location: string | null;
          portfolio_urls: string[] | null;
          profession_type: string | null;
          rating: number | null;
          skills: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          achievements?: string[] | null;
          availability_status?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          email: string;
          experience_years?: number | null;
          full_name?: string | null;
          id: string;
          is_verified?: boolean | null;
          languages?: string[] | null;
          likes?: number | null;
          location?: string | null;
          portfolio_urls?: string[] | null;
          profession_type?: string | null;
          rating?: number | null;
          skills?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          achievements?: string[] | null;
          availability_status?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string;
          experience_years?: number | null;
          full_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          languages?: string[] | null;
          likes?: number | null;
          location?: string | null;
          portfolio_urls?: string[] | null;
          profession_type?: string | null;
          rating?: number | null;
          skills?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      project_members: {
        Row: {
          id: string;
          invited_at: string;
          project_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          invited_at?: string;
          project_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          invited_at?: string;
          project_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          project_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          project_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          project_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_milestones: {
        Row: {
          created_at: string;
          description: string | null;
          due_date: string;
          id: string;
          project_id: string;
          status: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          due_date: string;
          id?: string;
          project_id: string;
          status?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          due_date?: string;
          id?: string;
          project_id?: string;
          status?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          created_at: string;
          current_status: string | null;
          description: string | null;
          id: string;
          location: string | null;
          name: string;
          team_head_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_status?: string | null;
          description?: string | null;
          id?: string;
          location?: string | null;
          name: string;
          team_head_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_status?: string | null;
          description?: string | null;
          id?: string;
          location?: string | null;
          name?: string;
          team_head_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          created_at: string | null;
          id: string;
          job_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          job_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          job_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "film_jobs";
            referencedColumns: ["id"];
          }
        ];
      };
      talent_connections: {
        Row: {
          created_at: string;
          id: string;
          message: string | null;
          recipient_id: string;
          requester_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message?: string | null;
          recipient_id: string;
          requester_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string | null;
          recipient_id?: string;
          requester_id?: string;
          status?: string;
        };
        Relationships: [];
      };
      talent_likes: {
        Row: {
          created_at: string | null;
          id: string;
          liker_id: string;
          talent_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          liker_id: string;
          talent_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          liker_id?: string;
          talent_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "talent_likes_talent_id_fkey";
            columns: ["talent_id"];
            isOneToOne: false;
            referencedRelation: "talent_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      talent_messages: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          read: boolean | null;
          recipient_id: string;
          sender_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          read?: boolean | null;
          recipient_id: string;
          sender_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          read?: boolean | null;
          recipient_id?: string;
          sender_id?: string;
        };
        Relationships: [];
      };
      talent_profiles: {
        Row: {
          avatar: string | null;
          bio: string | null;
          created_at: string | null;
          experience: number | null;
          featured_in: string[] | null;
          id: string;
          is_available: boolean | null;
          is_premium: boolean | null;
          is_verified: boolean | null;
          languages: string[] | null;
          location: string;
          name: string;
          rating: number | null;
          reviews: number | null;
          role: string;
          skills: string[] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          experience?: number | null;
          featured_in?: string[] | null;
          id?: string;
          is_available?: boolean | null;
          is_premium?: boolean | null;
          is_verified?: boolean | null;
          languages?: string[] | null;
          location: string;
          name: string;
          rating?: number | null;
          reviews?: number | null;
          role: string;
          skills?: string[] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          avatar?: string | null;
          bio?: string | null;
          created_at?: string | null;
          experience?: number | null;
          featured_in?: string[] | null;
          id?: string;
          is_available?: boolean | null;
          is_premium?: boolean | null;
          is_verified?: boolean | null;
          languages?: string[] | null;
          location?: string;
          name?: string;
          rating?: number | null;
          reviews?: number | null;
          role?: string;
          skills?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      talent_wishlists: {
        Row: {
          created_at: string | null;
          id: string;
          talent_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          talent_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          talent_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "talent_wishlists_talent_id_fkey";
            columns: ["talent_id"];
            isOneToOne: false;
            referencedRelation: "talent_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      users_management: {
        Row: {
          avatar_url: string | null;
          email: string;
          id: string;
          joined_date: string;
          last_active: string;
          name: string;
          role: Database["public"]["Enums"]["admin_user_role"];
          status: string;
          verified: boolean;
        };
        Insert: {
          avatar_url?: string | null;
          email: string;
          id?: string;
          joined_date?: string;
          last_active?: string;
          name: string;
          role: Database["public"]["Enums"]["admin_user_role"];
          status?: string;
          verified?: boolean;
        };
        Update: {
          avatar_url?: string | null;
          email?: string;
          id?: string;
          joined_date?: string;
          last_active?: string;
          name?: string;
          role?: Database["public"]["Enums"]["admin_user_role"];
          status?: string;
          verified?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_user_is_team_head: {
        Args: { project_id: string; user_uuid: string };
        Returns: boolean;
      };
      check_user_project_membership: {
        Args: { project_id: string; user_uuid: string };
        Returns: boolean;
      };
      search_film_jobs: {
        Args: { search_term: string };
        Returns: {
          application_deadline: string | null;
          application_email: string | null;
          application_url: string | null;
          company: string;
          company_logo: string | null;
          coordinates: unknown | null;
          created_at: string | null;
          created_by: string | null;
          description: string;
          experience_level: string | null;
          id: string;
          is_featured: boolean | null;
          is_verified: boolean | null;
          job_type: string;
          location: string;
          location_type: string;
          requirements: string[] | null;
          responsibilities: string[] | null;
          role_category: string;
          salary_currency: string | null;
          salary_max: number | null;
          salary_min: number | null;
          salary_period: string | null;
          status: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        }[];
      };
    };
    Enums: {
      admin_user_role:
        | "actor"
        | "director"
        | "producer"
        | "writer"
        | "cinematographer"
        | "agency";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      admin_user_role: [
        "actor",
        "director",
        "producer",
        "writer",
        "cinematographer",
        "agency",
      ],
    },
  },
} as const;
