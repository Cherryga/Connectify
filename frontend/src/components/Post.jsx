/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faEllipsisVertical,
  faBookmark,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import Comments from "./comments2";
import { useContext, useState } from "react";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const shouldRenderImage = Boolean(post.img);

  // Get likes data
  const { isPending, data: likes } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  // Get comments data
  const { data: comments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  // Check if post is saved
  const { data: isSaved } = useQuery({
    queryKey: ["saved", post.id],
    queryFn: () =>
      makeRequest.get(`/posts/${post.id}/saved`).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: async (liked) => {
      if (liked) {
        await makeRequest.delete("/likes?postId=" + post.id);
      } else {
        await makeRequest.post("/likes", { postId: post.id });
        // Create notification for like
        if (post.userId !== currentUser.id) {
          await makeRequest.post("/notifications", {
            toUserId: post.userId,
            type: "like",
            postId: post.id,
            message: "liked your post"
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentText) => {
      const response = await makeRequest.post("/comments", {
        desc: commentText,
        postId: post.id,
      });
      // Create notification for comment
      if (post.userId !== currentUser.id) {
        await makeRequest.post("/notifications", {
          toUserId: post.userId,
          type: "comment",
          postId: post.id,
          message: "commented on your post"
        });
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setCommentText("");
    },
  });

  // Save/Unsave post mutation
  const saveMutation = useMutation({
    mutationFn: async (saved) => {
      if (saved) {
        await makeRequest.delete(`/posts/${post.id}/saved`);
      } else {
        await makeRequest.post(`/posts/${post.id}/saved`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (postId) => makeRequest.delete("/posts/" + postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(likes.includes(currentUser.id));
  };

  const handleComment = () => {
    if (commentText.trim()) {
      commentMutation.mutate(commentText);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(isSaved);
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  if (isPending) return <div className="loading loading-spinner loading-lg"></div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.userId}`}>
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <img
                  alt="Profile"
                  src={
                    post.profilePic
                      ? `http://localhost:5173/uploads/posts/${post.profilePic}`
                      : "http://localhost:5173/default/default_profile.png"
                  }
                />
              </div>
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.userId}`} className="font-semibold text-gray-900 hover:text-blue-600">
              {post.username}
            </Link>
            <div className="text-sm text-gray-500">{formatTime(post.createdAt)}</div>
          </div>
        </div>
        
        {/* Post Options */}
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-sm">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {post.userId === currentUser.id && (
              <li>
                <button onClick={handleDelete} className="text-red-600">Delete</button>
              </li>
            )}
            <li>
              <button>Report</button>
            </li>
            <li>
              <button>Copy link</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Post Content */}
      {post.desc && (
        <div className="px-4 pb-2">
          <p className="text-gray-900">{post.desc}</p>
        </div>
      )}

      {/* Post Image */}
      {shouldRenderImage && (
        <div className="w-full">
          <img
            src={`http://localhost:5173/uploads/posts/${post.img}`}
            alt="Post"
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                likes?.includes(currentUser.id) ? "text-red-500" : "text-gray-500"
              } hover:text-red-500 transition-colors`}
            >
              <FontAwesomeIcon 
                icon={faHeart} 
                className={likes?.includes(currentUser.id) ? "text-red-500" : ""}
              />
              <span>{likes?.length || 0}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon icon={faComment} />
              <span>{comments?.length || 0}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
          
          <button
            onClick={handleSave}
            className={`${
              isSaved ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-500 transition-colors`}
          >
            <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmark} />
          </button>
        </div>

        {/* Likes count */}
        {likes?.length > 0 && (
          <div className="text-sm text-gray-700 mb-2">
            {likes.length} {likes.length === 1 ? "like" : "likes"}
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-gray-100 pt-3">
            <Comments postId={post.id} />
            
            {/* Add Comment */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 input input-bordered input-sm"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="btn btn-sm btn-primary disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
