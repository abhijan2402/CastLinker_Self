# FilmCollab Database Flow Diagram

```mermaid
erDiagram
    auth_users ||--o{ user_profiles : has
    auth_users ||--o{ jobs : creates
    auth_users ||--o{ projects : manages
    auth_users ||--o{ messages : sends
    auth_users ||--o{ notifications : receives
    auth_users ||--o{ industry_hub : posts

    auth_users {
        uuid id PK
        string email
        enum role
        timestamp created_at
        timestamp last_login
        enum account_status
    }

    user_profiles {
        uuid id PK
        string user_email FK
        string display_name
        string role
        string location
        string avatar_url
        text bio
        string headline
        boolean verified
        jsonb physical_attributes
        array skills
        jsonb achievements
        string website
        jsonb social_links
        timestamp created_at
        timestamp updated_at
    }

    jobs {
        uuid id PK
        uuid creator_id FK
        string title
        text description
        string role_type
        jsonb requirements
        string location
        jsonb compensation
        enum status
        timestamp created_at
        timestamp deadline
    }

    projects {
        uuid id PK
        uuid creator_id FK
        string title
        text description
        array team_members
        enum status
        timestamp start_date
        timestamp end_date
        jsonb resources
    }

    talent_connections {
        uuid id PK
        uuid requester_id FK
        uuid recipient_id FK
        enum status
        text message
        timestamp created_at
    }

    messages {
        uuid id PK
        uuid sender_id FK
        uuid recipient_id FK
        text message
        timestamp created_at
        timestamp read_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        string type
        jsonb data
        boolean read
        timestamp created_at
    }

    industry_hub {
        uuid id PK
        enum type
        string title
        text content
        uuid author_id FK
        array media_urls
        timestamp published_at
        timestamp expires_at
    }

    portfolio_media {
        uuid id PK
        uuid user_id FK
        enum media_type
        string title
        string url
        jsonb metadata
        timestamp uploaded_at
    }

    talent_likes {
        uuid id PK
        uuid talent_id FK
        uuid liker_id FK
        timestamp created_at
    }

    talent_wishlists {
        uuid id PK
        uuid talent_id FK
        uuid user_id FK
        timestamp created_at
    }

    user_profiles ||--o{ talent_likes : receives
    user_profiles ||--o{ talent_wishlists : included_in
    user_profiles ||--o{ talent_connections : participates
    user_profiles ||--o{ portfolio_media : owns
    jobs ||--o{ notifications : generates
    projects ||--o{ notifications : creates
    messages ||--o{ notifications : triggers
    industry_hub ||--o{ notifications : produces
```

## Table Relationships Explanation

1. **auth_users → user_profiles**

   - One-to-one relationship
   - Each auth user has one profile
   - Profile contains extended user information

2. **auth_users → jobs**

   - One-to-many relationship
   - Users can create multiple job postings
   - Each job has one creator

3. **auth_users → projects**

   - One-to-many relationship
   - Users can create/participate in multiple projects
   - Each project has one creator but multiple team members

4. **user_profiles → talent_connections**

   - Many-to-many relationship
   - Users can connect with multiple other users
   - Connections have status (pending, accepted, rejected)

5. **user_profiles → portfolio_media**

   - One-to-many relationship
   - Users can have multiple media items
   - Each media item belongs to one user

6. **user_profiles → talent_likes/wishlists**

   - Many-to-many relationship
   - Users can like/wishlist multiple profiles
   - Profiles can be liked/wishlisted by multiple users

7. **Various Entities → notifications**
   - One-to-many relationship
   - Multiple entities can generate notifications
   - Each notification is linked to specific user and action

## Key Features

1. **Data Integrity**

   - Foreign key constraints
   - Cascading deletes where appropriate
   - Unique constraints on critical fields

2. **Performance**

   - Indexed foreign keys
   - Composite indexes for common queries
   - Partitioned tables for large datasets

3. **Security**

   - Row-level security policies
   - Role-based access control
   - Encrypted sensitive data

4. **Scalability**
   - Normalized structure
   - Efficient query patterns
   - JSON/JSONB for flexible data
