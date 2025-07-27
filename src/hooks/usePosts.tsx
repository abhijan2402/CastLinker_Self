import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Post,
  fetchPosts,
  checkIfApplied,
  togglePostLike,
  checkIfLiked,
  getApplicationsForPost,
  deletePost,
  applyToPost,
} from "@/services/postsService";
import { toast } from "@/hooks/use-toast";
import { fetchData, postData } from "@/api/ClientFuntion";
interface Applicant {
  user_id: number;
  username: string;
  email: string;
  status: string;
}

interface RawJob {
  job_id: number;
  title: string;
}
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  console.log(posts);
  const [myPost, setMyPost] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedPosts, setAppliedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [applicationCounts, setApplicationCounts] = useState<
    Record<string, number>
  >({});
  const [filters, setFilters] = useState({
    category: "all",
    searchTerm: "",
  });

  const { user } = useAuth();
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data: any = await fetchData(`/api/posts`);
      // Ensure we're setting an array even if the API returns null/undefined
      setPosts(data || []);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Load all posts
  useEffect(() => {
    loadPosts();
  }, []);

  const fetchMyJobs = async () => {
    // 1. Fetch jobs
    const postRes = await fetchData<{ success: boolean; data: RawJob[] }>(
      "api/jobs/my-jobs-with-applicants"
    );

    if (!postRes.success) return;

    // 2. Extract job IDs
    const rawJobIds = postRes.data.map((job) => job.job_id);

    // 3. Filter full job data (assuming you have a `jobs` array from global state or elsewhere)
    const myFilteredJobs = posts.filter((job) => rawJobIds.includes(job.id));

    // 4. Fetch applicants for each job using Promise.all
    const applicantPromises = myFilteredJobs.map((job) =>
      fetchData<{ success: boolean; data: Applicant[] | Applicant }>(
        `api/jobs/job-applicants/${job.id}`
      ).then((res) => {
        let applicants: Applicant[] = [];

        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            applicants = res.data.filter(Boolean); // removes null/undefined
          } else {
            applicants = [res.data].filter(Boolean); // handles single object or null
          }
        }

        return {
          jobId: job.id,
          applicants,
        };
      })
    );

    const applicantsResults = await Promise.all(applicantPromises);

    // 5. Merge applicants into jobs
    const enrichedJobs = myFilteredJobs.map((job) => {
      const match = applicantsResults.find((a) => a.jobId === job.id);
      return {
        ...job,
        applicants: match?.applicants ?? [],
      };
    });

    // 6. Update state
    setMyJobs(enrichedJobs);
  };

  // Check which posts the current user has applied to
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user || !posts.length) return;

      const statusMap: Record<string, boolean> = {};

      for (const post of posts) {
        if (post && post.id) {
          statusMap[post.id] = await checkIfApplied(post.id, user.id);
        }
      }

      setAppliedPosts(statusMap);
    };

    checkApplicationStatus();
  }, [posts, user]);

  // Check which posts the current user has liked
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user || !posts.length) return;

      const likeMap: Record<string, boolean> = {};

      for (const post of posts) {
        if (post && post.id) {
          likeMap[post.id] = await checkIfLiked(post.id, user.id);
        }
      }

      setLikedPosts(likeMap);
    };

    checkLikeStatus();
  }, [posts, user]);

  // Get application counts for all posts
  useEffect(() => {
    const loadApplicationCounts = async () => {
      if (!posts.length) return;

      const countsMap: Record<string, number> = {};

      for (const post of posts) {
        if (post && post.id) {
          const applications = await getApplicationsForPost(post.id);
          countsMap[post.id] = applications?.length || 0;
        }
      }

      setApplicationCounts(countsMap);
    };

    loadApplicationCounts();
  }, [posts]);

  // Filtered posts based on category and search term
  const filteredPosts = posts.filter((post) => {
    // Ensure we have proper values to filter on
    if (!post) return false;

    const matchesCategory =
      filters.category === "all" || post.category === filters.category;
    const searchTerm = filters.searchTerm?.toLowerCase() || "";

    let matchesSearch = true;
    if (searchTerm) {
      matchesSearch =
        post.title?.toLowerCase().includes(searchTerm) ||
        post.description?.toLowerCase().includes(searchTerm) ||
        (Array.isArray(post.tags) &&
          post.tags.some((tag) => tag?.toLowerCase().includes(searchTerm)));
    }

    return matchesCategory && matchesSearch;
  });

  // Toggle like on a post
  const handleLikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = await togglePostLike(postId, user.id);

      if (isLiked !== null) {
        setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));

        // Update the like count in the UI without needing to refetch all posts
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  like_count: isLiked
                    ? post.like_count + 1
                    : Math.max(0, post.like_count - 1),
                }
              : post
          )
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Apply to a post
  const handleApplyToPost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this opportunity.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result: any = await postData(`api/posts/apply/${postId}`, {});
      console.log(result);

      if (result.message) {
        toast({
          title: "Successfully Applied",
          description: "You have Successfully applied for this opportunity.",
        });
        setAppliedPosts((prev) => ({ ...prev, [postId]: true }));
        return;
      }else{
         toast({
           title: "Already Applied",
           description: "You have Already applied for this opportunity.",
         });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete a post
  const handleDeletePost = async (postId: string) => {
    if (!user) return false;

    try {
      const success = await deletePost(postId);

      if (success) {
        // Remove the post from local state
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting post:", err);
      return false;
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ category: "all", searchTerm: "" });
  };

  return {
    posts: filteredPosts,
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
    loadPosts,
  };
};

export { applyToPost };
export default usePosts;
