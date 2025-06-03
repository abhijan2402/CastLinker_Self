import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  category: string;
  status: string;
  datePosted: string;
  applicantsLikes: number;
}

const dummyPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Looking for Collaborators on a Project',
    category: 'Collaboration',
    status: 'Active',
    datePosted: '2023-10-26',
    applicantsLikes: 15,
  },
  {
    id: 'post-2',
    title: 'Seeking Feedback on My Design Portfolio',
    category: 'Feedback',
    status: 'Active',
    datePosted: '2023-10-25',
    applicantsLikes: 8,
  },
  {
    id: 'post-3',
    title: 'Sharing a Tutorial on React Hooks',
    category: 'Tutorial',
    status: 'Closed',
    datePosted: '2023-10-24',
    applicantsLikes: 50,
  },
  {
    id: 'post-4',
    title: 'Asking for Advice on Freelancing Rates',
    category: 'Advice',
    status: 'Active',
    datePosted: '2023-10-23',
    applicantsLikes: 25,
  },
];

const generatePostId = (id: string) => {
  // Simple hash based on ID to generate a consistent 6-digit number
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const postIdNumber = Math.abs(hash).toString().padStart(6, '0').slice(0, 6);
  return `PD-${postIdNumber}`;
};

const UserPostManagement: React.FC = () => {
  const handleDeletePost = (postId: string) => {
    console.log('Delete post:', postId);
    // Implement delete functionality
  };

  const handleEditPost = (postId: string) => {
    console.log('Edit post:', postId);
    // Implement edit functionality
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Posts</h2>
        <Button>Create New Post</Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead>Applicants/Likes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link to={`/manage/posts/${post.id}`} className="text-blue-600 hover:underline">
                        {generatePostId(post.id)}
                      </Link>
                    </TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell><Badge variant="secondary">{post.category}</Badge></TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>{post.datePosted}</TableCell>
                    <TableCell>{post.applicantsLikes}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(post.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPostManagement; 