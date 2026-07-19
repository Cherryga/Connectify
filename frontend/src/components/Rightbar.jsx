import { useContext, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faChartLine,
  faClock,
  faComment,
  faHeart,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { getMediaUrl, getProfileUrl } from "../utils/config";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const diffHours = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

const Rightbar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [likedPosts, setLikedPosts] = useState(new Set());

  const { data: suggestedUsers = [], isPending: usersLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => makeRequest.get("/users/suggested").then((res) => res.data),
  });

  const { data: trendingPosts = [] } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: () => makeRequest.get("/posts/trending").then((res) => res.data),
  });

  const { data: trendingHashtags = [] } = useQuery({
    queryKey: ["trendingHashtags"],
    queryFn: () => makeRequest.get("/posts/hashtags/trending").then((res) => res.data),
  });

  const { data: recentActivities = [] } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: () => makeRequest.get("/posts/recent-activities").then((res) => res.data),
  });

  const followMutation = useMutation({
    mutationFn: async (userId) => {
      await makeRequest.post("/relationships", { followedUserId: userId });
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const topMetrics = useMemo(() => {
    const totalLikes = trendingPosts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    const totalComments = trendingPosts.reduce((sum, post) => sum + Number(post.comments || 0), 0);
    return {
      likes: totalLikes,
      comments: totalComments,
      hashtags: trendingHashtags.length,
    };
  }, [trendingPosts, trendingHashtags]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="flex h-full w-80 flex-col overflow-y-auto border-l border-slate-200 bg-[#fcfcfd]">
      <div className="border-b border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Dynamic Insights</p>
        <div className="mt-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Right Sidebar</h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live data</span>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/50">Network Pulse</p>
              <h4 className="mt-1 text-xl font-semibold">{currentUser?.name || "User"}</h4>
            </div>
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-lg text-cyan-300" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-2xl bg-white/10 px-2 py-3">
              <p className="text-white/60">Likes</p>
              <p className="mt-1 font-semibold">{topMetrics.likes}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-3">
              <p className="text-white/60">Comments</p>
              <p className="mt-1 font-semibold">{topMetrics.comments}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-2 py-3">
              <p className="text-white/60">Trends</p>
              <p className="mt-1 font-semibold">{topMetrics.hashtags}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="mb-4 font-semibold text-slate-900">People You May Know</h4>
          {usersLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Loading users...
            </div>
          ) : suggestedUsers.length ? (
            <div className="space-y-4">
              {suggestedUsers.slice(0, 6).map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3">
                  <Link to={`/profile/${user.id}`} className="flex min-w-0 items-center gap-3">
                    <img src={getProfileUrl(user.profilePic)} alt={user.name} className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">@{user.username}</p>
                      <p className="text-xs text-slate-400">{user.followersCount || 0} followers</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    disabled={followMutation.isPending}
                    onClick={() => followMutation.mutate(user.id)}
                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No new user suggestions right now.</p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Trending Hashtags</h4>
            <FontAwesomeIcon icon={faChartLine} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {trendingHashtags.length ? (
              trendingHashtags.slice(0, 6).map((item) => (
                <div key={item.hashtag} className="rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">#{item.hashtag}</p>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.postCount} posts</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.userCount} creators joined this topic</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Hashtag trends will appear once posts include hashtags.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Trending Posts</h4>
            <FontAwesomeIcon icon={faChartLine} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {trendingPosts.length ? (
              trendingPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <img src={getProfileUrl(post.profilePic)} alt={post.name} className="h-10 w-10 rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{post.name}</p>
                      <p className="text-sm text-slate-600">{post.desc || "Shared a post"}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  {post.img ? <img src={getMediaUrl(post.img)} alt="Trending post" className="mb-3 h-32 w-full rounded-2xl object-cover" /> : null}
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => toggleLike(post.id)} className={`flex h-9 w-9 items-center justify-center rounded-full ${likedPosts.has(post.id) ? "bg-rose-500 text-white" : "bg-white text-slate-600"}`}>
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 text-sm text-slate-600">
                      <FontAwesomeIcon icon={faComment} />
                      <span>{post.comments || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 text-sm text-slate-600">
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{Number(post.likes || 0) + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Trending posts will show up after people start interacting.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Recent Activity Replay</h4>
            <FontAwesomeIcon icon={faChartLine} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.length ? (
              recentActivities.map((activity, index) => (
                <div key={`${activity.type}-${activity.postId}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-start gap-3">
                    <img src={getProfileUrl(activity.profilePic)} alt={activity.name} className="h-10 w-10 rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.name}</p>
                      <p className="text-sm text-slate-600">
                        {activity.type === "like" ? "Liked" : "Commented on"} your post
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{formatTimeAgo(activity.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{activity.postDesc || "Your post is getting attention."}</p>
                  {activity.postImg ? <img src={getMediaUrl(activity.postImg)} alt="Activity" className="mt-3 h-32 w-full rounded-2xl object-cover" /> : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Activity replay will appear after likes and comments arrive.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Rightbar;
