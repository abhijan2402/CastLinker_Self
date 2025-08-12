import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Eye,
  Share2,
  MapPin,
  CalendarIcon,
  Link2,
  Image,
  Film,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/services/postsService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { baseURL } from "@/api/ClientFuntion";

interface PostCardProps {
  loadPosts;
  post: Post;
  isApplied: boolean;
  isLiked: boolean;
  applicationCount: number;
  onApply: (postId: string) => void;
  onLike: (postId: string, isLiked:boolean) => void;
  onViewDetails: (post: Post) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

const PostCard = ({
  loadPosts,
  post,
  isApplied,
  isLiked,
  applicationCount,
  onApply,
  onLike,
  onViewDetails,
}: PostCardProps) => {
  console.log(post);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    post.description.length > MAX_DESCRIPTION_LENGTH && !isExpanded
      ? `${post.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : post.description;

  const formattedDate = format(new Date(post.createdAt), "MMM dd, yyyy");

  const handleShare = () => {
    const postUrl = `${window.location.origin}/posts/${post.id}`;

    // Try to use the native share API if available
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
      // Fallback to clipboard
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

  const hasLocation = post.place || post.location || post.pincode;
  const eventDate = post.event_date ? new Date(post.event_date) : null;

  return (
    <Card className="w-full h-full hover:shadow-md transition-shadow duration-200 flex flex-col relative">
      {/* Top-right action buttons (Like and Share) */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full bg-background/80 backdrop-blur-sm border-muted",
                  post?.is_liked && "text-red-500 border-red-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id, post?.is_liked);
                }}
              >
                <Heart
                  className={cn("h-4 w-4", post?.is_liked && "fill-red-500")}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{post?.is_liked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm border-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Media Preview at the top if exists */}
      {post.media ? (
        <div className="w-full relative rounded-t-lg overflow-hidden">
          {post.media === "image" ? (
            <img
              src={post.media || `${baseURL}uploads/${post.media}`}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          ) : post.media === "video" ? (
            <div className="relative w-full h-48 bg-black">
              <video
                src={post.media || `${baseURL}uploads/${post.media}`}
                className="w-full h-full object-cover"
                controls
                poster={post.media_url + "?poster=true"}
              />
            </div>
          ) : (
            <img
              src={`${baseURL}uploads/${post.media}`}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
          <div className="text-center text-muted-foreground">
            {post.media === "image" ? (
              <>
                <Image className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>No image provided</p>
              </>
            ) : post.media === "video" ? (
              <>
                <Film className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>No video provided</p>
              </>
            ) : (
              <>
                <Image className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>No media provided</p>
              </>
            )}
          </div>
        </div>
      )}

      <CardHeader className={cn("pb-2")}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Posted by {post.creator_name || "Anonymous"}
              {post.creator_profession && (
                <span> • {post.creator_profession}</span>
              )}
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {post.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 space-y-3 flex-1">
        <p className="text-sm text-foreground/80">
          {truncatedDescription}
          {post.description.length > MAX_DESCRIPTION_LENGTH && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </p>

        {/* Event date if exists */}
        {eventDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
            <span>Event date: {format(eventDate, "MMM dd, yyyy")}</span>
          </div>
        )}

        {/* Location if exists */}
        {/* {hasLocation && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {[post.place, post.location, post.pincode]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )} */}

        {/* External URL if exists */}
        {post.external_url && (
          <div className="flex items-center text-xs">
            <Link2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <a
              href={post.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate max-w-[250px]"
            >
              {post.external_url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        {/* <div className="flex flex-wrap gap-2 mt-3">
          {post.tags &&
            post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
        </div> */}

        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <span>{formattedDate}</span>
          <div className="flex items-center ml-4">
            <Users className="h-3 w-3 mr-1" />
            <span>{applicationCount} applied</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex items-center justify-between mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => onViewDetails(post)}
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Button>

        {user && (
          <Button
            size="sm"
            className="bg-gold hover:bg-gold/90 text-black dark:text-black"
            disabled={isApplied}
            onClick={(e) => {
              e.stopPropagation();
              onApply(post.id);
            }}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
