import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComment, 
  faShare, 
  faPaperPlane,
  faEllipsisVertical,
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faChevronLeft,
  faChevronRight,
  faLocationDot,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

const Feed = () => {
  const { currentUser } = useContext(AuthContext);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showShareModal, setShowShareModal] = useState(null);

  const queryClient = useQueryClient();

  // Get posts from API with pagination
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [dynamicFallbackPosts, setDynamicFallbackPosts] = useState([]);

  const { data: postsPage, isPending, error } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => makeRequest.get(`/posts?page=${page}&limit=5`).then((res) => res.data),
  });

  useEffect(() => {
    if (!postsPage) return;

    setHasMore(postsPage.length === 5);
    setAllPosts((prev) => {
      const incoming = page === 1 ? postsPage : [...prev, ...postsPage];
      const dedupedMap = new Map();

      incoming.forEach((post) => {
        dedupedMap.set(post.id, post);
      });

      return Array.from(dedupedMap.values());
    });
  }, [postsPage, page]);

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: (postId) => makeRequest.post(`/likes`, { postId }),
    onSuccess: (data, postId) => {
      // Update local state immediately for better UX
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      // Invalidate queries to get updated like count
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      // Revert the optimistic update on error
      console.error("Like error:", error);
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: ({ postId, comment }) => makeRequest.post(`/comments`, { postId, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentText("");
      setShowCommentInput(null);
    },
  });

  const fallbackQuotes = [
    { content: "Discipline is choosing what you want most over what you want now.", author: "Abraham Lincoln" },
    { content: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { content: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
    { content: "Focus on progress, not perfection.", author: "Unknown" },
    { content: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  ];

  // Dynamic users for enhanced content
  const dynamicUsers = [
    {
      id: 101,
      name: "Sarah Johnson",
      username: "sarah_travels",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    {
      id: 102,
      name: "Mike Chen",
      username: "mike_photography",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    {
      id: 103,
      name: "Emma Davis",
      username: "emma_fitness",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: false
    },
    {
      id: 104,
      name: "Alex Thompson",
      username: "alex_tech",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true
    },
    {
      id: 105,
      name: "Lisa Wang",
      username: "lisa_creative",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      verified: false
    }
  ];

  useEffect(() => {
    let cancelled = false;
    const minFeedCount = 5;
    const needed = Math.max(0, minFeedCount - allPosts.length);
    const locations = ["City Center", "Downtown", "Cafe District", "Tech Park", "Riverside"];

    const buildFallbackPosts = async () => {
      if (needed === 0) {
        setDynamicFallbackPosts([]);
        return;
      }

      const quoteResults = await Promise.all(
        Array.from({ length: needed }, async (_, index) => {
          try {
            const response = await fetch("https://api.quotable.io/random");
            if (!response.ok) {
              throw new Error("Quote API failed");
            }
            return await response.json();
          } catch (err) {
            return fallbackQuotes[index % fallbackQuotes.length];
          }
        })
      );

      const now = Date.now();
      const generatedPosts = quoteResults.map((quote, index) => {
        const randomBase = now + index * 100;
        return {
          id: `dynamic_quote_${randomBase}`,
          desc: `"${quote.content}" - ${quote.author}`,
          img: `https://picsum.photos/800/600?random=${randomBase}`,
          images: [
            `https://picsum.photos/800/600?random=${randomBase}`,
            `https://picsum.photos/800/600?random=${randomBase + 1}`,
            `https://picsum.photos/800/600?random=${randomBase + 2}`,
          ],
          likes: Math.floor(Math.random() * 1800) + 200,
          comments: Math.floor(Math.random() * 160) + 20,
          location: locations[index % locations.length],
          createdAt: new Date(now - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
          userId: dynamicUsers[index % dynamicUsers.length].id,
          user: dynamicUsers[index % dynamicUsers.length],
        };
      });

      if (!cancelled) {
        setDynamicFallbackPosts(generatedPosts);
      }
    };

    buildFallbackPosts();

    return () => {
      cancelled = true;
    };
  }, [allPosts.length]);

  const enhancedPosts = [...allPosts, ...dynamicFallbackPosts];

  // Infinite scroll handler
  const loadMorePosts = useCallback(() => {
    if (hasMore && !isPending) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isPending]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreElement = document.getElementById('load-more-trigger');
    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [loadMorePosts, hasMore]);

  const handleLike = (postId) => {
    // Only call API to like/unlike - UI will update after successful response
    likeMutation.mutate(postId);
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleComment = (postId) => {
    setShowCommentInput(showCommentInput === postId ? null : postId);
  };

  const handleCommentSubmit = (postId) => {
    if (commentText.trim()) {
      commentMutation.mutate({ postId, comment: commentText });
    }
  };

  const handleShare = (postId) => {
    setShowShareModal(showShareModal === postId ? null : postId);
  };

  const handleShareToSocial = (platform) => {
    const url = window.location.href;
    const text = "Check out this amazing post!";
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    window.open(shareUrls[platform], '_blank');
    setShowShareModal(null);
  };

  const handleImageChange = (postId, direction) => {
    setCurrentImageIndex(prev => {
      const currentIndex = prev[postId] || 0;
      const post = enhancedPosts.find(p => p.id === postId);
      const maxIndex = (post.images ? post.images.length : 1) - 1;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      }
      
      return { ...prev, [postId]: newIndex };
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">Failed to load posts</div>
        <div className="text-gray-500">Please try refreshing the page</div>
      </div>
    );
  }

  if (enhancedPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No posts yet</div>
        <div className="text-gray-400">Be the first to share something!</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enhancedPosts.map((post) => {
        const currentImageIdx = currentImageIndex[post.id] || 0;
        const postImages = post.images || (post.img ? [post.img] : []);
        const hasMultipleImages = postImages.length > 1;
        const postUser = post.user || { name: "User", username: "user", profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" };
        
        return (
          <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5">
                    <img
                      src={postUser.profilePic}
                      alt={postUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {postUser.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-gray-900">{postUser.name}</h3>
                    {postUser.verified && (
                      <span className="text-blue-500 text-sm">✓</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>@{postUser.username}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                          {post.location}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
              </button>
          </div>

          {/* Post Content */}
          <div className="relative">
              {postImages.length > 0 && (
                  <div className="relative">
                  <img
                    src={postImages[currentImageIdx]}
                    alt="Post"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                  {hasMultipleImages && (
                    <>
                      <button 
                        onClick={() => handleImageChange(post.id, 'prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button 
                        onClick={() => handleImageChange(post.id, 'next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {postImages.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIdx ? 'bg-white' : 'bg-white/50'
                            }`} 
                          />
                        ))}
                      </div>
                    </>
                )}
              </div>
            )}
              {post.desc && (
                <div className="p-4">
                  <p className="text-gray-900 leading-relaxed">{post.desc}</p>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      likedPosts.has(post.id) 
                        ? 'text-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={likedPosts.has(post.id) ? faHeartSolid : faHeartRegular} 
                      className="text-xl" 
                    />
                    <span className="text-sm font-medium">{formatNumber(post.likes || 0)}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faComment} className="text-xl" />
                    <span className="text-sm font-medium">{formatNumber(post.comments || 0)}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faShare} className="text-xl" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`transition-all duration-200 ${
                    savedPosts.has(post.id) 
                      ? 'text-yellow-500' 
                      : 'text-gray-600 hover:text-yellow-500'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={savedPosts.has(post.id) ? faBookmarkSolid : faBookmarkRegular} 
                    className="text-xl" 
                  />
                </button>
              </div>

              {/* Comment Input */}
              {showCommentInput === post.id && (
                <div className="flex items-center space-x-2 mb-3">
                  <img 
                    src={currentUser?.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover" 
                  />
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                    className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentText.trim()}
                    className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              )}

              {/* Share Modal */}
              {showShareModal === post.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-xl font-semibold mb-4">Share Post</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleShareToSocial('facebook')}
                        className="flex items-center space-x-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        <span className="text-2xl">📘</span>
                        <span>Facebook</span>
                      </button>
                      <button 
                        onClick={() => handleShareToSocial('twitter')}
                        className="flex items-center space-x-3 p-4 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition-colors"
                      >
                        <span className="text-2xl">🐦</span>
                        <span>Twitter</span>
                      </button>
                      <button 
                        onClick={() => handleShareToSocial('linkedin')}
                        className="flex items-center space-x-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <span className="text-2xl">💼</span>
                        <span>LinkedIn</span>
                      </button>
                      <button 
                        onClick={() => handleShareToSocial('whatsapp')}
                        className="flex items-center space-x-3 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <span className="text-2xl">📱</span>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowShareModal(null)}
                      className="w-full mt-4 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
              </div>
              </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div id="load-more-trigger" className="flex justify-center py-8">
          {isPending ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          ) : (
            <div className="text-gray-500 text-sm">Scroll down to load more posts</div>
          )}
        </div>
      )}
      
      {!hasMore && enhancedPosts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg font-medium">You have reached the end!</div>
          <div className="text-sm">No more posts to load</div>
        </div>
      )}
    </div>
  );
};

export default Feed; 
