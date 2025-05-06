import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { format, isBefore, isAfter } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Loader2,
  Plus,
  Search,
  X,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreatePostDialog from "@/components/posts/CreatePostDialog";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Audition",
  "Casting Call",
  "Collaboration",
  "Content Creation",
  "Event",
  "Job Opportunity",
  "Mentorship",
  "Other",
];

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Any Location",
];

const ITEMS_PER_PAGE = 9; // For 3x3 grid

const Posts = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postDateRange, setPostDateRange] = useState<DateRange | undefined>();
  const [deadlineDateRange, setDeadlineDateRange] = useState<
    DateRange | undefined
  >();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    posts,
    loading,
    error,
    appliedPosts,
    likedPosts,
    applicationCounts,
    handleLikePost,
    handleApplyToPost,
    handleDeletePost,
    filters,
    updateFilters,
    clearFilters,
  } = usePosts();

  const confirmDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };

  const executeDelete = async () => {
    if (postToDelete) {
      const success = await handleDeletePost(postToDelete);
      if (success) {
        toast({
          title: "Post deleted",
          description: "The post has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        });
      }
      setPostToDelete(null);
    }
  };

  const handleViewDetails = (post) => {
    navigate(`/posts/${post.id}`);
  };

  const filteredPosts = posts.filter((post) => {
    if (filters.category !== "all" && post.category !== filters.category) {
      return false;
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        post.title?.toLowerCase().includes(searchTerm) ||
        post.description?.toLowerCase().includes(searchTerm) ||
        (Array.isArray(post.tags) &&
          post.tags.some((tag) => tag?.toLowerCase().includes(searchTerm)));

      if (!matchesSearch) return false;
    }

    if (selectedLocation && selectedLocation !== "Any Location") {
      if (!post.location || !post.location.includes(selectedLocation)) {
        return false;
      }
    }

    if (postDateRange?.from) {
      const postDate = new Date(post.created_at);
      if (isBefore(postDate, postDateRange.from)) {
        return false;
      }
    }

    if (postDateRange?.to) {
      const postDate = new Date(post.created_at);
      if (isAfter(postDate, postDateRange.to)) {
        return false;
      }
    }

    if (deadlineDateRange?.from && post.event_date) {
      const eventDate = new Date(post.event_date);
      if (isBefore(eventDate, deadlineDateRange.from)) {
        return false;
      }
    }

    if (deadlineDateRange?.to && post.event_date) {
      const eventDate = new Date(post.event_date);
      if (isAfter(eventDate, deadlineDateRange.to)) {
        return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSelectedLocation(null);
    setPostDateRange(undefined);
    setDeadlineDateRange(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.category !== "all" ||
    selectedLocation ||
    postDateRange ||
    deadlineDateRange;

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Find opportunities for auditions, collaborations, and more
          </p>
        </div>
        {user && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      <div className="bg-card p-4 rounded-lg mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              />
            </div>

            <Select
              value={filters.category}
              onValueChange={(value) => updateFilters({ category: value })}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={selectedLocation || "any"}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Location">
                  <div className="flex items-center gap-2">
                    {selectedLocation && <MapPin className="h-4 w-4" />}
                    {selectedLocation || "Location"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Location</SelectItem>
                {LOCATIONS.filter(
                  (location) => location !== "Any Location"
                ).map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full md:w-[240px]",
                    !postDateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {postDateRange?.from ? (
                    postDateRange.to ? (
                      <>
                        {format(postDateRange.from, "LLL dd, y")} -{" "}
                        {format(postDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(postDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Post Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={postDateRange?.from}
                  selected={postDateRange}
                  onSelect={setPostDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
{/* 
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full md:w-[240px]",
                    !deadlineDateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDateRange?.from ? (
                    deadlineDateRange.to ? (
                      <>
                        {format(deadlineDateRange.from, "LLL dd, y")} -{" "}
                        {format(deadlineDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(deadlineDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Event Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={deadlineDateRange?.from}
                  selected={deadlineDateRange}
                  onSelect={setDeadlineDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover> */}

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found.</p>
          {hasActiveFilters && (
            <p className="text-sm mt-2">Try adjusting your search filters.</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isApplied={!!appliedPosts[post.id]}
                isLiked={!!likedPosts[post.id]}
                applicationCount={applicationCounts[post.id] || 0}
                onApply={handleApplyToPost}
                onLike={handleLikePost}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <CreatePostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <AlertDialog
        open={!!postToDelete}
        onOpenChange={(open) => !open && setPostToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Posts;
