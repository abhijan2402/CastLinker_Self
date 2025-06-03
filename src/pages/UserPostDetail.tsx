import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MoreHorizontal, LinkIcon, MessageSquare, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  datePosted: string;
  applicantsLikes: number;
  mediaUrl: string | null;
  eventType: string | null;
  eventDate: string | null;
  externalUrl: string | null;
  placeName: string | null;
  pincode: string | null;
  landmark: string | null;
  tags: string[];
  applicants: Applicant[];
  comments: Comment[];
  analytics: Analytics;
  postedBy: PostedBy | null;
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  location: string;
  appliedDate: string;
  status: 'New' | 'Selected' | 'Rejected';
}

interface Comment {
    id: string;
    user: string;
    comment: string;
}

interface Analytics {
    views: number;
    clicks: number;
}

interface PostedBy {
    name: string;
    profileLink: string;
}

// Using dummy post data structure
const dummyPosts: Post[] = [
  {
    id: "post-1",
    title: "Looking for Collaborators on a Project",
    description: "We are seeking creative collaborators for an exciting new project. Skills in design, development, or marketing are a plus.",
    category: "Collaboration",
    status: "Active",
    datePosted: "2023-10-26",
    applicantsLikes: 15,
    mediaUrl: null,
    eventType: "Project",
    eventDate: "2023-12-15",
    externalUrl: "https://www.example.com/project",
    placeName: "Online",
    pincode: null,
    landmark: null,
    tags: ["design", "development", "marketing", "team"],
    applicants: [
      { id: "app-1", name: "Alice Smith", role: "Designer", location: "New York", appliedDate: "2023-10-27", status: "New" },
      { id: "app-2", name: "Bob Johnson", role: "Developer", location: "San Francisco", appliedDate: "2023-10-27", status: "Selected" },
      { id: "app-3", name: "Charlie Brown", role: "Marketing Intern", location: "London", appliedDate: "2023-10-28", status: "Rejected" },
      { id: "app-4", name: "David Green", role: "Project Manager", location: "Remote", appliedDate: "2023-10-28", status: "New" },
    ],
    comments: [],
    analytics: { views: 120, clicks: 25 },
    postedBy: { name: "Project Owner", profileLink: "#" },
  },
  {
    id: "post-2",
    title: "Seeking Feedback on My Design Portfolio",
    description: "Looking for constructive feedback on my recent design projects. Any insights are welcome!",
    category: "Feedback",
    status: "Active",
    datePosted: "2023-10-25",
    applicantsLikes: 8,
    mediaUrl: 'https://via.placeholder.com/400x200',
    eventType: null,
    eventDate: null,
    externalUrl: 'https://www.example.com/portfolio',
    placeName: null,
    pincode: null,
    landmark: null,
    tags: ["design", "portfolio", "feedback"],
    applicants: [],
    comments: [],
    analytics: { views: 80, clicks: 15 },
    postedBy: { name: "Designer User", profileLink: "#" },
  },
];

const UserPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [filter, setFilter] = useState<'All' | 'New' | 'Selected' | 'Rejected'>('All');

  useEffect(() => {
    const foundPost = dummyPosts.find(p => p.id === postId);
    setPost(foundPost || null);
  }, [postId]);

  if (!post) {
    return <div className="container mx-auto py-6 text-center">Post not found.</div>;
  }

   const handleEditPost = () => {
    console.log('Editing post:', post?.id);
    // Implement edit functionality
  };

  const handleDeletePost = () => {
    console.log('Deleting post:', post?.id);
    // Implement delete functionality
  };

  const handleChat = (applicantId: string) => {
    console.log('Chat with applicant:', applicantId);
    // Implement chat functionality
  };

  const handleSelect = (applicantId: string) => {
    console.log('Select applicant:', applicantId);
    // Implement select functionality
  };

  const handleReject = (applicantId: string) => {
    console.log('Reject applicant:', applicantId);
    // Implement reject functionality
  };

  const getApplicantStatusBadgeVariant = (status: Applicant['status']) => {
    switch (status) {
      case 'Selected':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'New':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredApplicants = post.applicants.filter(applicant => {
    if (filter === 'All') return true;
    return applicant.status === filter;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Post Details</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditPost}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeletePost}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Information */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Title</p>
            <p className="text-muted-foreground text-sm text-right">{post.title}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Category</p>
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Location</p>
            <p className="text-muted-foreground text-sm text-right">{post.placeName || 'N/A'}</p>
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Posted Date</p>
            <p className="text-muted-foreground text-sm text-right">{post.datePosted}</p>
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Event/Deadline Date</p>
            <p className="text-muted-foreground text-sm text-right">{post.eventDate || 'N/A'}</p>
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">External URL</p>
             {post.externalUrl ? (
              <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm text-right">{post.externalUrl} <LinkIcon className="h-3 w-3 inline-block"/></a>
            ) : (
              <p className="text-muted-foreground text-sm text-right">N/A</p>
            )}
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Place Name</p>
            <p className="text-muted-foreground text-sm text-right">{post.placeName || 'N/A'}</p>
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Pincode</p>
            <p className="text-muted-foreground text-sm text-right">{post.pincode || 'N/A'}</p>
          </div>
           <div className="flex justify-between items-center">
            <p className="text-sm font-medium leading-none">Landmark</p>
            <p className="text-muted-foreground text-sm text-right">{post.landmark || 'N/A'}</p>
          </div>
             <div className="flex justify-between items-center">
              <p className="text-sm font-medium leading-none">Tags</p>
               {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-end">
                  {post.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
              ) : (
                 <p className="text-muted-foreground text-sm text-right">N/A</p>
              )}
            </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{post.description}</p>
        </CardContent>
      </Card>

      {/* Posted By */}
      {post.postedBy && (
        <Card>
          <CardHeader>
            <CardTitle>Posted By</CardTitle>
          </CardHeader>
          <CardContent>
             {/* Placeholder for user profile link */}
            <p className="text-muted-foreground text-sm">{post.postedBy.name} (<a href={post.postedBy.profileLink} className="text-primary hover:underline">View Profile</a>)</p>
          </CardContent>
        </Card>
      )}

      {/* Applications (modified to match image) */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({post.applicants.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter:</span>
            <Button variant={filter === 'All' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('All')}>All</Button>
            <Button variant={filter === 'New' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('New')}>New</Button>
            <Button variant={filter === 'Selected' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('Selected')}>Selected</Button>
            <Button variant={filter === 'Rejected' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('Rejected')}>Rejected</Button>
          </div>

           {filteredApplicants.length === 0 ? (
            <p className="text-muted-foreground text-sm">No applicants found with the selected filter.</p>
          ) : (
             <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role/Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applied Date</TableHead>
                     <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.name}</TableCell>
                      <TableCell>{applicant.role}</TableCell>
                      <TableCell>{applicant.location}</TableCell>
                       <TableCell>{applicant.appliedDate}</TableCell>
                       <TableCell><Badge variant={getApplicantStatusBadgeVariant(applicant.status)}>{applicant.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button variant="ghost" size="icon" onClick={() => handleChat(applicant.id)} title="Chat">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleSelect(applicant.id)} title="Select">
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReject(applicant.id)} title="Reject">
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

       {/* Optional: Back to Posts link */}
       <div className="mt-6">
         <Link to="/manage" className="text-primary hover:underline">Back to Manage Content</Link>
       </div>
    </div>
  );
};

export default UserPostDetail; 