import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComment, 
  faShare, 
  faBookmark, 
  faPlay, 
  faEllipsisVertical,
  faHeart as faHeartSolid,
  faSmile,
  faImage,
  faLink
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

const Feed = () => {
  const { currentUser } = useContext(AuthContext);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const videoRefs = useRef({});
  const queryClient = useQueryClient();

  // Get all posts for feed (like Instagram - showing all posts, not just followed users)
  const { data: posts, isPending, error } = useQuery({
    queryKey: ['feedPosts'],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: (postId) => makeRequest.post(`/likes`, { postId }),
    onSuccess: (data, postId) => {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentData) => makeRequest.post(`/comments`, commentData),
    onSuccess: () => {
      setCommentText("");
      setShowCommentInput(null);
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    },
  });

  const handleVideoClick = (postId) => {
    const video = videoRefs.current[postId];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideo(postId);
      } else {
        video.pause();
        setPlayingVideo(null);
      }
    }
  };

  const handleVideoPlay = (postId) => {
    setPlayingVideo(postId);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  const handleLike = (postId) => {
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
    if (showCommentInput === postId) {
      setShowCommentInput(null);
    } else {
      setShowCommentInput(postId);
    }
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;
    
    commentMutation.mutate({
      postId: postId,
      desc: commentText
    });
  };

  const handleShare = (post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  const handleShareToSocial = (platform) => {
    const postUrl = `${window.location.origin}/post/${selectedPost.id}`;
    const text = `Check out this amazing post! ${selectedPost.desc || 'Inspiring content'}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + postUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        alert('Link copied to clipboard!');
        setShowShareModal(false);
        return;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    setShowShareModal(false);
  };

  // Sample images for posts without images
  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop"
  ];

  // Enhanced sample content for posts
  const sampleContent = [
    {
      desc: "Just finished reading 'Atomic Habits' by James Clear. The power of small changes is incredible! 📚 #selfimprovement #habits",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop"
    },
    {
      desc: "Morning hike in the mountains. Nature always finds a way to reset your mind. 🏔️ #nature #hiking #peace",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop"
    },
    {
      desc: "Quote of the day: 'The only way to do great work is to love what you do.' - Steve Jobs 💭 #motivation #inspiration",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
    },
    {
      desc: "Perfect sunset at the beach today! Sometimes you need to pause and appreciate the beauty around you. 🌅 #sunset #beach #gratitude",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop"
    },
    {
      desc: "Working on a new project that's really challenging but exciting! The best growth happens outside your comfort zone. 💻 #coding #growth",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=500&fit=crop"
    },
    {
      desc: "Coffee and code - the perfect combination for productivity! ☕ #developer #coffee #coding",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop"
    },
    {
      desc: "Remember: 'Success is not final, failure is not fatal: it is the courage to continue that counts.' - Winston Churchill 🎯",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop"
    },
    {
      desc: "City lights at night have a magical quality. Urban photography is becoming my new passion! 📸 #photography #city #night",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=500&fit=crop"
    },
    {
      desc: "Weekend vibes: Good food, great company, and lots of laughter! Life is about these simple moments. 😊 #weekend #friends",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop"
    },
    {
      desc: "Learning a new programming language today. Never stop growing! 🌱 #learning #programming #growth",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop"
    }
  ];

  const getRandomImage = () => {
    return sampleImages[Math.floor(Math.random() * sampleImages.length)];
  };

  const getRandomContent = () => {
    return sampleContent[Math.floor(Math.random() * sampleContent.length)];
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">Failed to load feed</div>
        <div className="text-gray-500">Please try refreshing the page</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-500 mb-4">Start sharing your moments with the world!</p>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all">
          Create Your First Post
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Post Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full ring-2 ring-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                  <img
                    alt="Profile"
                    src={
                      post.profilePic
                        ? `http://localhost:8800/uploads/posts/${post.profilePic}`
                        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                    }
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {post.name || post.username}
                </div>
                <div className="text-sm text-gray-500">@{post.username}</div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-sm hover:bg-gray-100 rounded-full p-2">
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
              </button>
              <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl border border-gray-200 w-40">
                <li>
                  <button className="text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2">
                    Report
                  </button>
                </li>
                <li>
                  <button className="text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2">
                    Copy Link
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Post Content */}
          <div className="relative">
            {/* Always show an image - either from post or sample */}
            <div className="relative">
              {post.img && post.img.trim() !== "" ? (
                // User uploaded image
                post.img.match(/\.(mp4|avi|mov|wmv)$/i) ? (
                  // Video content
                  <div className="relative">
                    <video
                      ref={(el) => (videoRefs.current[post.id] = el)}
                      className="w-full h-96 object-cover"
                      onClick={() => handleVideoClick(post.id)}
                      onPlay={() => handleVideoPlay(post.id)}
                      onPause={handleVideoPause}
                      loop
                      muted
                    >
                      <source src={`http://localhost:8800/uploads/posts/${post.img}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {playingVideo !== post.id && (
                        <button
                          onClick={() => handleVideoClick(post.id)}
                          className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                        >
                          <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Image content
                  <img
                    src={`http://localhost:8800/uploads/posts/${post.img}`}
                    alt="Post"
                    className="w-full h-96 object-cover"
                  />
                )
              ) : (
                // Show enhanced content for posts without images
                <div className="relative">
                  <img
                    src={getRandomContent().image}
                    alt="Post"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-lg font-semibold">{getRandomContent().desc}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      likedPosts.has(post.id) 
                        ? 'text-red-500 scale-110' 
                        : 'text-gray-700 hover:text-red-500 hover:scale-105'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={likedPosts.has(post.id) ? faHeartSolid : faHeartRegular} 
                      className="text-2xl" 
                    />
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 hover:scale-105 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faComment} className="text-2xl" />
                  </button>
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-500 hover:scale-105 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faShare} className="text-2xl" />
                  </button>
                </div>
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`transition-all duration-200 ${
                    savedPosts.has(post.id) 
                      ? 'text-yellow-500 scale-110' 
                      : 'text-gray-700 hover:text-yellow-500 hover:scale-105'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={savedPosts.has(post.id) ? faBookmark : faBookmarkRegular} 
                    className="text-2xl" 
                  />
                </button>
              </div>

              {/* Comment Input */}
              {showCommentInput === post.id && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <img
                      src={currentUser?.profilePic ? `http://localhost:8800/uploads/posts/${currentUser.profilePic}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!commentText.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Likes Count */}
              <div className="text-sm font-semibold text-gray-900 mb-3">
                {Math.floor(Math.random() * 1000) + 50} likes
              </div>

              {/* Post Description */}
              {post.desc ? (
                <div className="mb-3">
                  <span className="font-semibold text-gray-900 mr-2">{post.username}</span>
                  <span className="text-gray-900">{post.desc}</span>
                </div>
              ) : (
                <div className="mb-3">
                  <span className="font-semibold text-gray-900 mr-2">{post.username}</span>
                  <span className="text-gray-900">{getRandomContent().desc}</span>
                </div>
              )}

              {/* Comments Preview */}
              <div className="text-sm text-gray-500 mb-3 cursor-pointer hover:text-gray-700">
                View all {Math.floor(Math.random() * 50) + 5} comments
              </div>

              {/* Post Time */}
              <div className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Share Modal */}
      {showShareModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-2xl shadow-2xl w-96 mx-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Share Post</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleShareToSocial('twitter')}
                  className="flex items-center space-x-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('facebook')}
                  className="flex items-center space-x-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('whatsapp')}
                  className="flex items-center space-x-3 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShareToSocial('copy')}
                  className="flex items-center space-x-3 p-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faLink} />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed; 