import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserCheck, faUserTimes, faUserMinus } from "@fortawesome/free-solid-svg-icons";

const Friends = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("friends");
  const queryClient = useQueryClient();

  // Get friends
  const { data: friends, isPending: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: () => makeRequest.get("/relationships/friends").then(res => res.data),
  });

  // Get friend requests
  const { data: friendRequests, isPending: requestsLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => makeRequest.get("/relationships/requests").then(res => res.data),
  });

  // Get suggested friends
  const { data: suggestedFriends, isPending: suggestedLoading } = useQuery({
    queryKey: ['suggestedFriends'],
    queryFn: () => makeRequest.get("/users/suggested").then(res => res.data),
  });

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships/accept", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedFriends'] });
    },
  });

  // Reject friend request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: (userId) => makeRequest.delete(`/relationships/reject/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  // Follow user mutation
  const followMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships", { followedUserId: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedFriends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  // Unfollow user mutation
  const unfollowMutation = useMutation({
    mutationFn: (userId) => makeRequest.delete(`/relationships/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedFriends'] });
    },
  });

  const handleAcceptRequest = (userId) => {
    acceptRequestMutation.mutate(userId);
  };

  const handleRejectRequest = (userId) => {
    rejectRequestMutation.mutate(userId);
  };

  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };

  const handleUnfollow = (userId) => {
    unfollowMutation.mutate(userId);
  };

  const renderFriends = () => (
    <div className="space-y-4">
      {friendsLoading ? (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : friends?.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Friends Yet</h3>
          <p className="text-gray-500">Start following people to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends?.map((friend) => (
            <div key={friend.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${friend.id}`}>
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
                      <img
                        alt="Profile"
                        src={
                          friend.profilePic
                            ? `http://localhost:5173/uploads/posts/${friend.profilePic}`
                            : "http://localhost:5173/default/default_profile.png"
                        }
                      />
                    </div>
                  </div>
                </Link>
                <div className="flex-1">
                  <Link to={`/profile/${friend.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                    {friend.name}
                  </Link>
                  <div className="text-sm text-gray-500">@{friend.username}</div>
                  <div className="text-xs text-gray-400">{friend.mutualFriends || 0} mutual friends</div>
                </div>
                <button
                  onClick={() => handleUnfollow(friend.id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  <FontAwesomeIcon icon={faUserMinus} className="mr-1" />
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFriendRequests = () => (
    <div className="space-y-4">
      {requestsLoading ? (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : friendRequests?.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Friend Requests</h3>
          <p className="text-gray-500">You don&apos;t have any pending friend requests</p>
        </div>
      ) : (
        friendRequests?.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${request.id}`}>
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
                      <img
                        alt="Profile"
                        src={
                          request.profilePic
                            ? `http://localhost:5173/uploads/posts/${request.profilePic}`
                            : "http://localhost:5173/default/default_profile.png"
                        }
                      />
                    </div>
                  </div>
                </Link>
                <div>
                  <Link to={`/profile/${request.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                    {request.name}
                  </Link>
                  <div className="text-sm text-gray-500">@{request.username}</div>
                  <div className="text-xs text-gray-400">{request.mutualFriends || 0} mutual friends</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="btn btn-sm btn-primary"
                  disabled={acceptRequestMutation.isPending}
                >
                  <FontAwesomeIcon icon={faUserCheck} className="mr-1" />
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  className="btn btn-sm btn-outline btn-error"
                  disabled={rejectRequestMutation.isPending}
                >
                  <FontAwesomeIcon icon={faUserTimes} className="mr-1" />
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSuggestedFriends = () => (
    <div className="space-y-4">
      {suggestedLoading ? (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : suggestedFriends?.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Suggestions</h3>
          <p className="text-gray-500">No new people to follow right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedFriends?.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${user.id}`}>
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full">
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
                </Link>
                <div className="flex-1">
                  <Link to={`/profile/${user.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                    {user.name}
                  </Link>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                  <div className="text-xs text-gray-400">{user.followersCount || 0} followers</div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="btn btn-sm btn-primary"
                  disabled={followMutation.isPending}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "friends", label: "Friends", count: friends?.length || 0 },
    { id: "requests", label: "Requests", count: friendRequests?.length || 0 },
    { id: "suggestions", label: "Suggestions", count: suggestedFriends?.length || 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Manage your connections and discover new people</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "friends" && renderFriends()}
        {activeTab === "requests" && renderFriendRequests()}
        {activeTab === "suggestions" && renderSuggestedFriends()}
      </div>
    </div>
  );
};

export default Friends;