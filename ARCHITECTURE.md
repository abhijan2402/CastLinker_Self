# FilmCollab - Application Architecture

## Overview

FilmCollab is a professional networking platform designed specifically for the film industry. It connects various film industry professionals, from actors and directors to production companies and agents.

## System Architecture Map

### 🔵 Frontend (Next.js Web App)

#### Public Landing Page (/)

- About FilmCollab
- How it Works
- CTA buttons (Signup / Login)
- Talent Features Preview
- Success Stories
- Industry Insights

#### Role-Based Dashboards (Protected Routes)

##### Normal User Dashboard

1. **Sidebar Navigation**

   - Dashboard Overview
   - Jobs Management
   - Projects
   - Talent Directory
   - Industry Hub
   - Messages
   - Notifications
   - Profile Settings

2. **Dashboard Overview**

   - Profile completion percentage
   - Job posting statistics
   - Project participation metrics
   - Analytics graphs (likes, saves, shares)
   - Recent activities

3. **Jobs Management**

   - Create casting calls
   - Manage job postings
   - Track applications
   - Job status updates

4. **Projects Section**

   - Project creation interface
   - Team collaboration tools
   - Project timeline tracking
   - Resource management

5. **Talent Directory**

   - Comprehensive talent listing
   - Advanced filtering system
   - Interactive talent cards
   - Connection management

6. **Industry Hub**

   - News feed
   - Upcoming auditions
   - Industry events
   - Educational resources
   - Online courses

7. **Messaging Center**

   - Real-time chat interface
   - Group conversations
   - Media sharing
   - Chat history

8. **Profile Portfolio**
   - Media showcase (Showreels, Videos, Photos)
   - Professional information
   - Skills and achievements
   - Project history
   - Physical attributes (for actors)
   - Contact information

##### Admin Dashboard

1. **User Management**

   - User approval system
   - Account suspension tools
   - Profile verification
   - User analytics

2. **Content Management**

   - Job post moderation
   - Project oversight
   - Content filtering
   - Report handling

3. **Industry Hub Management**

   - News publication
   - Event management
   - Resource curation
   - Course administration

4. **Analytics Dashboard**
   - User growth metrics
   - Platform engagement
   - Content performance
   - System health

### 🔵 Backend Services (Supabase)

#### Authentication System

```sql
-- Enhanced auth configuration
AUTH_ROLES = ['ADMIN', 'NORMAL_USER', 'VERIFIED_TALENT']
AUTH_PROVIDERS = ['email', 'google', 'facebook']
```

#### Database Schema (PostgreSQL)

##### Enhanced Users Table (auth.users)

```sql
id: uuid (primary key)
email: string
role: enum (ADMIN, NORMAL_USER, VERIFIED_TALENT)
created_at: timestamp
last_login: timestamp
account_status: enum (ACTIVE, SUSPENDED, PENDING)
```

##### Extended User Profiles Table (public.FilmCollab_escyvd_user_profiles)

```sql
id: uuid (primary key)
user_email: string (foreign key to auth.users)
display_name: string
role: string (enum of Profession)
location: string
avatar_url: string
bio: text
headline: string
verified: boolean
physical_attributes: jsonb  -- For actors (height, eye color, etc.)
skills: string[]
achievements: jsonb
website: string
social_links: jsonb
created_at: timestamp
updated_at: timestamp
```

##### Jobs Table (public.jobs)

```sql
id: uuid (primary key)
creator_id: uuid (foreign key)
title: string
description: text
role_type: string
requirements: jsonb
location: string
compensation: jsonb
status: enum (OPEN, CLOSED, DRAFT)
created_at: timestamp
deadline: timestamp
```

##### Projects Table (public.projects)

```sql
id: uuid (primary key)
creator_id: uuid (foreign key)
title: string
description: text
team_members: uuid[]
status: enum (PLANNING, ACTIVE, COMPLETED)
start_date: timestamp
end_date: timestamp
resources: jsonb
```

##### Industry Hub Table (public.industry_hub)

```sql
id: uuid (primary key)
type: enum (NEWS, EVENT, RESOURCE, COURSE)
title: string
content: text
author_id: uuid
media_urls: string[]
published_at: timestamp
expires_at: timestamp
```

#### Storage Configuration

```
storage/
├── showreels/
├── headshots/
├── portfolio_images/
├── project_files/
├── messages_attachments/
└── documents/
```

## Security Enhancements

1. **Authentication**

   - Multi-factor authentication
   - Session management
   - Password policies
   - OAuth integration

2. **Authorization**

   - Role-based access control (RBAC)
   - Resource-level permissions
   - API rate limiting
   - Request validation

3. **Data Protection**
   - End-to-end encryption for messages
   - Secure file storage
   - Data backup system
   - GDPR compliance

## Performance Optimizations

1. **Frontend**

   - Next.js static generation
   - Image optimization
   - Code splitting
   - Progressive loading
   - Service worker caching

2. **Backend**
   - Database indexing
   - Query optimization
   - Connection pooling
   - Cache management
   - Real-time optimizations

## Monitoring System

1. **Performance Metrics**

   - Response times
   - Error rates
   - Resource usage
   - User engagement

2. **Analytics**
   - User behavior tracking
   - Feature usage statistics
   - Conversion metrics
   - Growth analytics

## Deployment Architecture

1. **Production Environment**

   - Load balancer
   - Multiple app instances
   - CDN integration
   - Database replication

2. **Development Pipeline**
   - CI/CD workflow
   - Testing environments
   - Staging servers
   - Backup systems

## Directory Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── talent/
│   │   ├── TalentCard.tsx
│   │   └── TalentGrid.tsx
│   └── ui/
│       └── [shadcn components]
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useTalentDirectory.tsx
│   ├── useAuth.tsx
│   └── use-toast.tsx
├── integrations/
│   └── supabase/
│       └── client.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   └── Analytics.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   └── talent/
│       ├── Directory.tsx
│       └── Profile.tsx
└── types/
    └── index.ts
```

## Key Workflows

### 1. User Registration Flow

1. User visits signup page
2. Fills professional information
3. Email verification
4. Complete profile setup
5. Optional verification request

### 2. Talent Search Flow

1. User accesses talent directory
2. Applies filters (role, location, etc.)
3. Views filtered results
4. Interacts with profiles (like, wishlist)
5. Sends connection requests

### 3. Messaging Flow

1. User selects a connection
2. Opens chat interface
3. Real-time message exchange
4. File sharing if needed
5. Message notifications

### 4. Admin Verification Flow

1. User requests verification
2. Admin reviews request
3. Checks provided credentials
4. Approves/Rejects verification
5. User notification

## Security Measures

1. **Authentication**

   - JWT-based authentication
   - Secure password hashing
   - Rate limiting
   - Session management

2. **Authorization**

   - Role-based access control
   - Row-level security in Supabase
   - Protected routes
   - API endpoint protection

3. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - CORS configuration

## Performance Optimizations

1. **Frontend**

   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

2. **Backend**
   - Database indexing
   - Query optimization
   - Connection pooling
   - Rate limiting

## Monitoring and Analytics

1. **Performance Monitoring**

   - Page load times
   - API response times
   - Error tracking
   - User behavior

2. **Business Analytics**
   - User engagement
   - Connection rates
   - Popular roles/locations
   - Conversion metrics

## Future Considerations

1. **Scalability**

   - Horizontal scaling
   - Load balancing
   - CDN integration
   - Caching layers

2. **Features**

   - Video chat
   - Project collaboration
   - Job board integration
   - Mobile applications

3. **Integrations**

   - Payment processing
   - Calendar scheduling
   - Portfolio platforms
   - Social media

   Landing Page (Public)

Home (/)

About FilmCollab

How it Works

CTA buttons (Signup / Login)

Highlights of Talent Features (small previews, not full profiles)

🔵 Dashboards (Role-Based after login)

Normal User Dashboard

Sidebar Menus:

Dashboard

User profile overview: profile completion %, job counts, project participation, graphs (likes, saves, shares).

Jobs

Users can create jobs (casting calls, crew hiring).

See a list of their created jobs.

Projects

Users can create project groups, invite others, collaborate on projects.

Talent Directory

List of all registered users.

Interactions on cards: Like, Save, Share, View Profile.

Filter options: Profession, Location, Skills.

Industry Hub

Display industry news, auditions, events, resources, online courses.

Messages

Real-time chat with other users (individual and group chats).

Notifications

All app notifications including messages, invites, approvals.

Profile Page

User portfolio showcasing:

Showreels, Videos, Photos, Scripts, Music Audios.

Personal Details: Height, Hair Color, Eye Color, Skills, Location.

Achievements, Awards, Completed Projects.

Admin Dashboard

Manage Users (approve, suspend, delete)

Manage Jobs and Projects

Approve Talent Directory Profiles

Post Industry Hub Content (auditions, news, resources)

Moderate Messages and Reports

Analytics Overview (User growth, activity stats)

🔵 Backend (Supabase Services)

Authentication

Handle signup/login (Normal User or Admin roles).

Database (PostgreSQL)

users table (role, personal details)

jobs table (job posts)

projects table (project collaborations)

messages table (chats)

notifications table (alerts)

industry_hub table (auditions, news, events, resources)

portfolio_media table (showreels, videos, photos, scripts, audios)

Storage

Buckets: reels/, videos/, photos/, scripts/, audio/

✅ Important Updates (based on your change):

Only one public page: Home (/)

Everything else is behind authentication (Login required).

Talent Directory, Jobs, Projects, Messages — all available only after login.

Admin and Normal Users have separate dashboards with different access.
