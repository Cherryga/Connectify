import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Rightbar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [trendingTopics] = useState([
    "#SocialPulse2024",
    "#ReactDevelopment", 
    "#OpenSource",
    "#WebDevelopment",
    "#Innovation"
  ]);

  // Get suggested users
  const { data: suggestedData } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: () => makeRequest.get("/users/suggested").then(res => res.data),
  });

  // Get recent activities
  const { data: activitiesData } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => makeRequest.get("/posts/recent-activities").then(res => res.data),
  });

  useEffect(() => {
    if (suggestedData) {
      setSuggestedUsers(suggestedData);
    }
  }, [suggestedData]);

  useEffect(() => {
    if (activitiesData) {
      setRecentActivities(activitiesData);
    }
  }, [activitiesData]);

  // Follow user mutation
  const followMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships", { followedUserId: userId }),
    onSuccess: (_, userId) => {
      // Remove the followed user from suggested list
      setSuggestedUsers(prev => prev.filter(user => user.id !== userId));
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleFollow = async (userId) => {
    try {
      await followMutation.mutateAsync(userId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="sticky top-4 z-30 h-screen overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-6">
        
        {/* Current User Profile */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              <img
                alt="Profile"
                src={
                  currentUser.profilePic
                    ? `http://localhost:5173/uploads/posts/${currentUser.profilePic}`
                    : "http://localhost:5173/default/default_profile.png"
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <Link to={`/profile/${currentUser.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
              {currentUser.username}
            </Link>
            <p className="text-sm text-gray-500">{currentUser.name}</p>
          </div>
        </div>

        {/* Suggested Friends */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Suggested for you</h3>
          {suggestedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No suggestions available</p>
          ) : (
            suggestedUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        alt="Profile"
                        src={
                          user.profilePic
                            ? `http://localhost:5173/uploads/posts/${user.profilePic}`
                            : "http://localhost:5173/default/default_profile.png"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 hover:text-blue-600">
                      {user.username}
                    </div>
                    <p className="text-xs text-gray-500">Followed by {user.followersCount || 0} people</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>

        {/* Trending Topics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Trending</h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-sm text-gray-700">{topic}</span>
                <span className="text-xs text-gray-500">{Math.floor(Math.random() * 1000) + 100} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity</p>
            ) : (
              recentActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.username}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/messages" className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <div className="text-blue-600 text-lg mb-1">💬</div>
              <div className="text-xs font-medium text-gray-700">Messages</div>
            </Link>
            <Link to="/friends" className="p-3 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
              <div className="text-green-600 text-lg mb-1">👥</div>
              <div className="text-xs font-medium text-gray-700">Friends</div>
            </Link>
            <Link to="/groups" className="p-3 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
              <div className="text-purple-600 text-lg mb-1">🏠</div>
              <div className="text-xs font-medium text-gray-700">Groups</div>
            </Link>
            <Link to="/events" className="p-3 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors">
              <div className="text-orange-600 text-lg mb-1">📅</div>
              <div className="text-xs font-medium text-gray-700">Events</div>
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700">About</a>
            <a href="#" className="hover:text-gray-700">Help</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">API</a>
            <a href="#" className="hover:text-gray-700">Jobs</a>
          </div>
          <p className="text-xs text-gray-400 mt-2">© 2024 SocialPulse</p>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;