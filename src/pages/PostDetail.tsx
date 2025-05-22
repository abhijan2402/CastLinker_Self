import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPostById,
  getApplicantsByPostId,
  PostApplication,
  Post,
  checkIfLiked,
  togglePostLike,
} from "@/services/postsService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format, isValid } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Share2,
  Calendar,
  MapPin,
  Link2,
  ArrowLeft,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApplicantFilters } from "@/hooks/useApplicantFilters";
import { ProfessionFilter } from "@/components/filters/ProfessionFilter";
import { LocationFilter } from "@/components/filters/LocationFilter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteData } from "@/api/ClientFuntion";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<PostApplication[] | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch post and applicant data
  useEffect(() => {
    const loadPostData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const postData = await fetchPostById(id);
        console.log(postData);
        setPost(postData);

        // Check if the user has liked the post
        // if (user) {
        //   const liked = await checkIfLiked(id, user.id);
        //   setIsLiked(liked);
        // }

        // Fetch applicants
        // const applicantsData = await getApplicantsByPostId(id);
        // setApplicants(applicantsData);
      } catch (error) {
        console.error("Error loading post:", error);
        toast({
          title: "Error",
          description: "Failed to load post details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [id, user]);

  // Set up applicant filters
  const {
    selectedProfessions,
    setSelectedProfessions,
    selectedLocations,
    setSelectedLocations,
    searchTerm,
    setSearchTerm,
    availableProfessions,
    availableLocations,
    filteredApplicants,
    resetFilters,
  } = useApplicantFilters(applicants);

  // Handle post like/unlike
  const handleLikeToggle = async () => {
    if (!user || !post) return;

    try {
      const result = await togglePostLike(post.id, user.id);

      if (result !== null) {
        setIsLiked(result);
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            like_count: result
              ? prev.like_count + 1
              : Math.max(0, prev.like_count - 1),
          };
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  // Share post function
  const handleShare = () => {
    if (!post) return;

    const postUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text:
            post.description.substring(0, 100) +
            (post.description.length > 100 ? "..." : ""),
          url: postUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
          copyToClipboard(postUrl);
        });
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive",
        });
      });
  };

  // Delete post function
  const handleDeletePost = async () => {
    if (!post || !user) return;

    try {
      // Import and call deletePost function
      const response = deleteData(`/api/posts/${post.id}`);
      if (response) {
        toast({
          title: "Success",
          description: "Post has been deleted",
        });
        navigate("/posts");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Check if user is creator or admin
  const isCreator = user && post && user.id === post.user_id;
  const isAdmin = user?.email?.includes("admin");
  const canModify = isCreator || isAdmin;

  if (loading) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-8 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground mt-2">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate("/posts")}
          variant="outline"
        >
          Back to Posts
        </Button>
      </div>
    );
  }
  console.log(post);
  // Safely parse and format createdAt
  const formattedDate =
    post?.createdAt && isValid(new Date(post.createdAt))
      ? format(new Date(post.createdAt), "MMM dd, yyyy")
      : "N/A";

  // Safely parse and format event_date
  const eventDate =
    post?.event_date && isValid(new Date(post.event_date))
      ? format(new Date(post.event_date), "MMM dd, yyyy")
      : null;

  return (
    <div className="container max-w-4xl py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={() => navigate("/posts")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Posts
      </Button>

      <div className="space-y-6">
        {/* Post Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <p>Posted by {post.creator_name || "Anonymous"}</p>
              {post.creator_profession && (
                <Badge variant="outline" className="ml-2">
                  {post.creator_profession}
                </Badge>
              )}
              <span className="mx-2">•</span>
              <p>{formattedDate}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                isLiked &&
                  "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
              )}
              onClick={handleLikeToggle}
            >
              <Heart
                className={cn("h-4 w-4 mr-2", isLiked && "fill-red-500")}
              />
              <span>{post.like_count}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            {canModify && (
              <div className="flex items-center space-x-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button> */}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Post Category */}
        <div>
          <Badge variant="secondary" className="text-sm">
            {post.category}
          </Badge>

          {/* Parse and safely render tags */}
          {(() => {
            let parsedTags: string[] = [];

            try {
              const maybeTags = JSON.parse(post.tags || "[]");
              if (Array.isArray(maybeTags)) {
                parsedTags = maybeTags;
              }
            } catch (err) {
              console.warn("Invalid tags format", err);
            }

            return (
              parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {parsedTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )
            );
          })()}
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Post Details</TabsTrigger>
            <TabsTrigger value="applicants">
              Applicants
              {applicants && applicants.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {applicants.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Post Image */}
            {post.media_url && post.media_type === "image" && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.media_url}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Post Video */}
            {post.media_url && post.media_type === "video" && (
              <div className="rounded-lg overflow-hidden">
                <video src={post.media_url} controls className="w-full" />
              </div>
            )}

            {/* Post Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap">{post.description}</p>
            </div>

            {/* Post Metadata */}
            <div className="bg-muted/40 rounded-lg p-4 space-y-3 mt-6">
              {post.event_date && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Event Date</p>
                    <p className="text-sm text-muted-foreground">
                      {post.event_date}
                    </p>
                  </div>
                </div>
              )}

              {(post.place || post.location || post.pincode) && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {[post.place, post.location, post.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {post.external_url && (
                <div className="flex items-center">
                  <Link2 className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">External Link</p>
                    <a
                      href={post.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {post.external_url.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              )}

              {applicants && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Applications</p>
                    <p className="text-sm text-muted-foreground">
                      {applicants.length}{" "}
                      {applicants.length === 1 ? "person" : "people"} applied
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Apply button */}
            {user && (
              <div className="mt-8 flex justify-center">
                <Button
                  className="w-full max-w-xs bg-gold hover:bg-gold/90 text-black dark:text-black"
                  size="lg"
                  disabled={applicants?.some((app) => app.user_id === user.id)}
                  onClick={async () => {
                    try {
                      const { applyToPost } = await import(
                        "@/services/postsService"
                      );
                      await applyToPost(post.id, user.id);

                      toast({
                        title: "Application Submitted",
                        description:
                          "Your application has been sent successfully.",
                      });

                      // Refresh applicants list
                      const updatedApplicants = await getApplicantsByPostId(
                        post.id
                      );
                      setApplicants(updatedApplicants);

                      // Switch to applicants tab
                      setActiveTab("applicants");
                    } catch (error) {
                      console.error("Error applying:", error);
                      toast({
                        title: "Error",
                        description:
                          "Failed to submit your application. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {applicants?.some((app) => app.user_id === user.id)
                    ? "Already Applied"
                    : "Apply Now"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applicants" className="space-y-6 mt-6">
            {/* Applicants section */}
            {!applicants || applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Applications Yet</h3>
                <p className="text-muted-foreground mt-1">
                  Be the first to apply for this post!
                </p>
                {user && (
                  <Button
                    className="mt-4 bg-gold hover:bg-gold/90 text-black"
                    onClick={async () => {
                      try {
                        const { applyToPost } = await import(
                          "@/services/postsService"
                        );
                        await applyToPost(post.id, user.id);

                        toast({
                          title: "Application Submitted",
                          description:
                            "Your application has been sent successfully.",
                        });

                        // Refresh applicants list
                        const updatedApplicants = await getApplicantsByPostId(
                          post.id
                        );
                        setApplicants(updatedApplicants);
                      } catch (error) {
                        console.error("Error applying:", error);
                        toast({
                          title: "Error",
                          description:
                            "Failed to submit your application. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Applicant filters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Filter Applicants</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <ProfessionFilter
                        selectedProfessions={selectedProfessions as any[]}
                        onProfessionChange={setSelectedProfessions as any}
                      />
                    </div>

                    <div>
                      <LocationFilter
                        selectedLocations={selectedLocations}
                        onLocationChange={setSelectedLocations}
                        availableLocations={availableLocations}
                      />
                    </div>
                  </div>

                  {(selectedProfessions.length > 0 ||
                    selectedLocations.length > 0 ||
                    searchTerm) && (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Applicant list */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Applicants ({filteredApplicants.length})
                  </h3>

                  <div className="space-y-4">
                    {filteredApplicants.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No applicants match your filter criteria.
                        </p>
                      </div>
                    ) : (
                      filteredApplicants.map((applicant) => (
                        <Card key={applicant.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12">
                                {applicant.profile?.avatar_url && (
                                  <AvatarImage
                                    src={applicant.profile.avatar_url}
                                    alt={applicant.profile.full_name || "User"}
                                  />
                                )}
                                <AvatarFallback>
                                  {applicant.profile?.full_name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>

                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">
                                      {applicant.profile?.full_name || "User"}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {applicant.profile?.profession_type ||
                                        "Unknown profession"}
                                    </p>
                                  </div>
                                  <div>
                                    {applicant.profile?.location && (
                                      <Badge variant="outline" className="ml-2">
                                        {applicant.profile.location}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                  <p className="text-sm text-muted-foreground">
                                    Applied{" "}
                                    {format(
                                      new Date(applicant.applied_at),
                                      "MMM dd, yyyy"
                                    )}
                                  </p>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (applicant.user_id) {
                                        navigate(
                                          `/profile/${applicant.user_id}`
                                        );
                                      } else {
                                        toast({
                                          title: "Error",
                                          description:
                                            "Could not find user profile",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                  >
                                    View Profile
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm delete dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDeletePost}
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

export default PostDetail;
