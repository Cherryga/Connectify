import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faEnvelope, 
  faBell, 
  faSearch,
  faUser,
  faCog,
  faBookmark,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch search results
  const { data: searchData } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchTerm ? makeRequest.get(`/users/search?q=${searchTerm}`).then(res => res.data) : [],
    enabled: searchTerm.length > 2,
  });

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData);
      setShowSearchResults(true);
    }
  }, [searchData]);

  // Fetch notifications
  const { data: notificationData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => makeRequest.get("/notifications").then(res => res.data),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData);
    }
  }, [notificationData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchClick = (userId) => {
    setShowSearchResults(false);
    setSearchTerm("");
    navigate(`/profile/${userId}`);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and navigate
    makeRequest.put(`/notifications/${notification.id}/read`);
    if (notification.type === 'like') {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === 'comment') {
      navigate(`/post/${notification.postId}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.fromUserId}`);
    }
  };

  return (
    <div className="navbar bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Connectify
        </Link>
      </div>

      <div className="navbar-center">
        {/* Search Bar */}
        <div className="relative">
          <div className="form-control">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered w-96 pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
              />
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl mt-1 max-h-96 overflow-y-auto z-50">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                  onClick={() => handleSearchClick(user.id)}
                >
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full ring-2 ring-purple-200">
                      <img
                        alt="Profile"
                        src={
                          user.profilePic
                            ? `http://localhost:8800/uploads/posts/${user.profilePic}`
                            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                        }
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-end space-x-2">
        {/* Home */}
        <Link to="/" className="btn btn-ghost btn-circle hover:bg-purple-100 transition-colors">
          <FontAwesomeIcon icon={faHome} className="w-5 h-5 text-gray-600" />
        </Link>

        {/* Messages */}
        <Link to="/messages" className="btn btn-ghost btn-circle relative hover:bg-blue-100 transition-colors">
          <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-gray-600" />
          {notifications.filter(n => n.type === 'message').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {notifications.filter(n => n.type === 'message').length}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle relative hover:bg-yellow-100 transition-colors">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600" />
            {notifications.filter(n => n.type !== 'message').length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {notifications.filter(n => n.type !== 'message').length}
              </span>
            )}
          </button>
          <ul className="dropdown-content menu p-2 shadow-lg bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 w-80 max-h-96 overflow-y-auto">
            <li className="menu-title">
              <span className="text-gray-700 font-semibold">Notifications</span>
            </li>
            {notifications.filter(n => n.type !== 'message').length === 0 ? (
              <li className="text-gray-500 text-center py-4">No new notifications</li>
            ) : (
              notifications
                .filter(n => n.type !== 'message')
                .slice(0, 10)
                .map((notification) => (
                  <li key={notification.id}>
                    <button
                      className={`text-left p-3 rounded-lg transition-colors ${!notification.read ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full ring-2 ring-purple-200">
                            <img
                              alt="Profile"
                              src={
                                notification.fromUser?.profilePic
                                  ? `http://localhost:8800/uploads/posts/${notification.fromUser.profilePic}`
                                  : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
                              }
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{notification.fromUser?.username}</span>
                            <span className="text-gray-600"> {notification.message}</span>
                          </div>
                          <div className="text-xs text-gray-500">{notification.time}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
            )}
            <li>
              <Link to="/notifications" className="text-center text-purple-600 hover:text-purple-800 font-medium">
                View all notifications
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-purple-200 transition-all">
            <div className="w-10 rounded-full ring-2 ring-purple-200">
              <img
                alt="Profile"
                src={
                  currentUser.profilePic
                    ? `http://localhost:8800/uploads/posts/${currentUser.profilePic}`
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                }
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </button>
          <ul className="dropdown-content menu p-2 shadow-lg bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 w-52">
            <li>
              <Link to={`/profile/${currentUser.id}`} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-600" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                <FontAwesomeIcon icon={faCog} className="w-4 h-4 text-gray-600" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link to="/saved" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                <FontAwesomeIcon icon={faBookmark} className="w-4 h-4 text-gray-600" />
                <span>Saved</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 text-red-600" />
                <span className="text-red-600">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
