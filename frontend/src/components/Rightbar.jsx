// ✅ useEffect imported from REACT (not tanstack)
import {  useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock,
  faStore,
  faGamepad,
  faVideo,
  faImages,
  faTimes,
  faHeart,
  faComment,
  faShare,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const then = new Date(dateString);
  const diffHours = Math.floor((now - then) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
};

const Rightbar = () => {
  // const { currentUser } = useContext(AuthContext);
  const [likedPosts, setLikedPosts] = useState(new Set());
  // const [savedPosts, setSavedPosts] = useState(new Set());
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [showTopicModal, setShowTopicModal] = useState(null);
  const queryClient = useQueryClient();
  const [recentActivities, setRecentActivities] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  

  // ✅ SINGLE suggestedUsers state - populated from Random User API
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
 const [githubTrending, setGithubTrending] = useState([]);


 useEffect(() => {
  fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&sparkline=false")
    .then(r => r.json())
    .then(data => setCryptoPrices(data))
    .catch(() => {});
}, []);
// Refresh every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&sparkline=false")
      .then(r => r.json())
      .then(data => setCryptoPrices(data));
  }, 30000);
  return () => clearInterval(interval);
}, []);

 useEffect(() => {
  fetch("https://api.github.com/search/repositories?q=created:>2026-01-01&sort=stars&order=desc&per_page=5")
    .then(r => r.json())
    .then(data => setGithubTrending(data.items || []))
    .catch(() => {});
}, []);

  // ✅ Fetch real random users from randomuser.me (free, no API key needed)
  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=5");
        const data = await response.json();
        const users = data.results.map((user, index) => ({
          id: index + 1,
          name: `${user.name.first} ${user.name.last}`,
          username: user.login.username,
          profilePic: user.picture.large,
          followers: `${Math.floor(Math.random() * 100)}K`,
          verified: Math.random() > 0.5,
          online: Math.random() > 0.5,
          country: user.location.country,
        }));
        setSuggestedUsers(users);
      } catch (error) {
        console.error("Error fetching random users:", error);
        // Fallback to static data if API fails
        setSuggestedUsers([
          { id: 1, name: "Elon Musk", username: "elonmusk", profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", followers: "150M", verified: true, online: true },
          { id: 2, name: "Mark Zuckerberg", username: "zuck", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", followers: "120M", verified: true, online: false },
        ]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchRandomUsers();
  }, []);

  useEffect(() => {
  makeRequest.get("/posts?page=1&limit=3").then((res) => {
    const posts = res.data.map((post) => ({
      id: post.id,
      type: "post",
      user: {
        name: post.user?.name || "User",
        username: post.user?.username || "user",
        profilePic: post.user?.profilePic
          ? `http://localhost:8800/uploads/posts/${post.user.profilePic}`
          : "https://i.pravatar.cc/150?img=1"
      },
      content: post.desc || "Shared a post",
      image: post.img ? `http://localhost:8800/uploads/posts/${post.img}` : null,
      likes: post.likes || 0,
      comments: post.comments || 0,
      timeAgo: formatTimeAgo(post.createdAt)
    }));
    setRecentActivities(posts);
  }).catch(() => setRecentActivities([]));
}, []);


 
  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: async (userId) => {
      const isFollowing = followingUsers.has(userId);
      if (isFollowing) {
        await makeRequest.delete(`/relationships?userId=${userId}`);
      } else {
        await makeRequest.post("/relationships", { followedUserId: userId });
      }
      return { userId, isFollowing };
    },
    onSuccess: ({ userId, isFollowing }) => {
      setFollowingUsers(prev => {
        const newSet = new Set(prev);
        if (isFollowing) newSet.delete(userId);
        else newSet.add(userId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
    onError: (error) => {
      console.error("Follow/Unfollow error:", error);
    }
  });

  const handleFollow = (userId) => followMutation.mutate(userId);
  const closeTopicModal = () => setShowTopicModal(null);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="flex flex-col h-screen bg-white border-l border-gray-200 w-80 overflow-y-auto">

      {/* ✅ Suggested Users — powered by randomuser.me API */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">People You May Know</h3>
        {usersLoading ? (
          <div className="flex items-center justify-center py-6 text-gray-400">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full p-0.5 ring-2 ring-purple-300">
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {user.verified && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">✓</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                    <p className="text-xs text-gray-400">{user.followers} followers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  disabled={followMutation.isPending}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    followingUsers.has(user.id)
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  } ${followMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {followMutation.isPending ? "..." : followingUsers.has(user.id) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Topics */}
     <div className="p-6 border-b border-gray-100">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
    🔥 Trending on GitHub
  </h3>
  {githubTrending.map((repo, i) => (
    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
      className="flex items-start space-x-3 py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
      <span className="text-gray-400 text-sm font-bold w-4">{i + 1}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{repo.name}</p>
        <p className="text-xs text-gray-500 truncate">{repo.description}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs text-yellow-500">⭐ {(repo.stargazers_count/1000).toFixed(1)}K</span>
          <span className="text-xs text-gray-400">{repo.language}</span>
        </div>
      </div>
    </a>
  ))}
</div>

      {/* Upcoming Events */}
     <div className="p-6 border-b border-gray-100">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
    📈 Live Crypto
    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
  </h3>
  {cryptoPrices.map(coin => (
    <div key={coin.id} className="flex items-center justify-between py-2 border-b border-gray-50">
      <div className="flex items-center space-x-2">
        <img src={coin.image} className="w-6 h-6 rounded-full" />
        <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">${coin.current_price.toLocaleString()}</div>
        <div className={`text-xs ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Recent Activities */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={activity.user.profilePic}
                  alt={activity.user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">{activity.user.name}</h4>
                  <p className="text-sm text-gray-600">{activity.content}</p>
                  <p className="text-xs text-gray-400 flex items-center space-x-1 mt-0.5">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{activity.timeAgo}</span>
                  </p>
                </div>
              </div>

              {activity.image && (
                <div className="relative mb-3">
                  <img src={activity.image} alt="Activity" className="w-full h-32 object-cover rounded-lg" />
                  {activity.type === "post" && (
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleLike(activity.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          likedPosts.has(activity.id) ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                        }`}
                      >
                        <FontAwesomeIcon icon={faHeart} className="text-sm" />
                      </button>
                      <button className="w-8 h-8 bg-white/80 text-gray-600 rounded-full flex items-center justify-center hover:bg-white">
                        <FontAwesomeIcon icon={faComment} className="text-sm" />
                      </button>
                      <button className="w-8 h-8 bg-white/80 text-gray-600 rounded-full flex items-center justify-center hover:bg-white">
                        <FontAwesomeIcon icon={faShare} className="text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                {activity.type === "post" && (
                  <>
                    <span>{formatNumber(activity.likes)} likes</span>
                    <span>{formatNumber(activity.comments)} comments</span>
                  </>
                )}
                {activity.type === "event" && <span>{activity.attendees} attending</span>}
                {activity.type === "marketplace" && (
                  <span className="font-semibold text-green-600">{activity.price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg">
            <FontAwesomeIcon icon={faStore} />
            <span className="text-sm font-medium">Marketplace</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
            <FontAwesomeIcon icon={faGamepad} />
            <span className="text-sm font-medium">Gaming</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
            <FontAwesomeIcon icon={faVideo} />
            <span className="text-sm font-medium">Videos</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
            <FontAwesomeIcon icon={faImages} />
            <span className="text-sm font-medium">Photos</span>
          </button>
        </div>
      </div>

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{showTopicModal.topic}</h2>
                <button
                  onClick={closeTopicModal}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{showTopicModal.posts}</p>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Latest Posts</h3>
                  <div className="space-y-3">
                    {["S", "M"].map((initial, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${i === 0 ? "from-purple-500 to-pink-500" : "from-blue-500 to-green-500"} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {initial}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">&ldquo;Just discovered this incredible {showTopicModal.topic} technique. Game changer!&rdquo;</p>
                          <p className="text-xs text-gray-500 mt-1">{i === 0 ? "2" : "4"} hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Community Discussions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">What&apos;s your favorite {showTopicModal.topic} tip?</span>
                      <span className="text-xs text-gray-500">127 replies</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Best {showTopicModal.topic} resources for beginners</span>
                      <span className="text-xs text-gray-500">89 replies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Join Discussion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rightbar;
