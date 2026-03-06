import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import Posts from "../components/Posts";
import Update from "../components/update";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, 
  faUserPlus, 
  faUserCheck, 
  faUserTimes, 
  faEllipsisVertical,
  faShare,
  faBookmark,
  faHeart,
  faComment,
  faLocationDot,
  faCalendarAlt,
  faGlobe,
  faEnvelope,
  faPhone
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      username: "sarah_travels",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 12,
      verified: true
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mike_photography",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 8,
      verified: false
    },
    {
      id: 3,
      name: "Emma Davis",
      username: "emma_fitness",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 15,
      verified: true
    }
  ]);

  // Extract userId from the URL pathname
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);
  
  // Fetch user data using userId
  const { isPending, data } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
  });

  const { data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest
        .get("/relationships/?followedUserId=" + userId)
        .then((res) => {
          return res.data;
        }),
  });

  // Get follower and following counts
  const { data: followerCount } = useQuery({
    queryKey: ["followerCount", userId],
    queryFn: () =>
      makeRequest
        .get("/relationships/followers/" + userId)
        .then((res) => res.data.length),
  });

  const { data: followingCount } = useQuery({
    queryKey: ["followingCount", userId],
    queryFn: () =>
      makeRequest
        .get("/relationships/following/" + userId)
        .then((res) => res.data.length),
  });

  // Get posts count
  const { data: postsCount } = useQuery({
    queryKey: ["postsCount", userId],
    queryFn: () =>
      makeRequest
        .get("/posts/user/" + userId)
        .then((res) => res.data.length),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        await makeRequest.delete("/relationships?userId=" + userId);
      } else {
        await makeRequest.post("/relationships", { followedUserId: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
      queryClient.invalidateQueries({ queryKey: ["followerCount", userId] });
      queryClient.invalidateQueries({ queryKey: ["followingCount", userId] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  const handleAcceptRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    // Here you would typically make an API call to accept the friend request
  };

  const handleDeclineRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    // Here you would typically make an API call to decline the friend request
  };

  const handleUpdate = () => {
    setOpenUpdate(prevState => !prevState);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">User not found</div>
        <div className="text-gray-500">The user you're looking for doesn't exist</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div
          className="h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${data.coverPic ? `http://localhost:8800/uploads/posts/${data.coverPic}` : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
          {/* Profile Picture */}
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full ring-4 ring-white bg-white p-1">
                <img
                  src={data.profilePic ? `http://localhost:8800/uploads/posts/${data.profilePic}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                  alt="Profile Picture"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {data.verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-8 flex items-center space-x-4">
            {currentUser?.id === userId ? (
              <button
                onClick={handleUpdate}
                className="flex items-center space-x-2 bg-white bg-opacity-90 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-opacity-100 transition-all shadow-lg"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all shadow-lg ${
                  relationshipData?.includes(currentUser?.id)
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                <FontAwesomeIcon icon={relationshipData?.includes(currentUser?.id) ? faUserCheck : faUserPlus} />
                <span>{relationshipData?.includes(currentUser?.id) ? "Following" : "Follow"}</span>
              </button>
            )}
            
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg">
              <FontAwesomeIcon icon={faShare} className="text-gray-600" />
            </button>
            
            <button className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg">
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
                {data.verified && (
                  <span className="text-blue-500 text-xl">✓</span>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">@{data.username}</p>
              
              {data.desc && (
                <p className="text-gray-700 mb-4 leading-relaxed max-w-2xl">{data.desc}</p>
              )}

              {/* Profile Stats */}
              <div className="flex items-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{postsCount || 0}</div>
                  <div className="text-gray-600 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followerCount || 0}</div>
                  <div className="text-gray-600 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followingCount || 0}</div>
                  <div className="text-gray-600 text-sm">Following</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center space-x-6 text-gray-600">
                {data.city && (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{data.city}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Joined {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>connectify.com</span>
                </div>
              </div>
            </div>

            {/* Friend Requests Badge */}
            {friendRequests.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowFriendRequests(!showFriendRequests)}
                  className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Friend Requests
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                </button>

                {/* Friend Requests Dropdown */}
                {showFriendRequests && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Friend Requests</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {friendRequests.map((request) => (
                        <div key={request.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={request.profilePic}
                                alt={request.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              {request.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                  ✓
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-1">
                                <h4 className="font-semibold text-gray-900">{request.name}</h4>
                                {request.verified && <span className="text-blue-500 text-sm">✓</span>}
                              </div>
                              <p className="text-sm text-gray-600">@{request.username}</p>
                              <p className="text-xs text-gray-500">{request.mutualFriends} mutual friends</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                              >
                                <FontAwesomeIcon icon={faUserCheck} className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeclineRequest(request.id)}
                                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <FontAwesomeIcon icon={faUserTimes} className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium">
              Posts
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium">
              Reels
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium">
              Saved
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium">
              Tagged
            </button>
          </nav>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <Posts userId={userId} />
      </div>

      {/* Update Modal */}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
