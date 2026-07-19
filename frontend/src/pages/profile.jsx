import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Posts from "../components/Posts";
import Update from "../components/update";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faEdit,
  faEllipsisVertical,
  faGlobe,
  faLocationDot,
  faCalendarAlt,
  faEnvelope,
  faShare,
  faUserCheck,
  faUserClock,
  faUserPlus,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";
import { getProfileUrl, getMediaUrl } from "../utils/config";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isPending, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { data: relationshipData = [] } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () => makeRequest.get("/relationships/?followedUserId=" + userId).then((res) => res.data),
  });

  const { data: requestStatus } = useQuery({
    queryKey: ["requestStatus", userId],
    queryFn: () => makeRequest.get(`/relationships/request-status/${userId}`).then((res) => res.data),
    enabled: currentUser?.id !== userId,
  });

  const { data: followerCount = 0 } = useQuery({
    queryKey: ["followerCount", userId],
    queryFn: () => makeRequest.get("/relationships/followers/" + userId).then((res) => res.data.length),
  });

  const { data: followingCount = 0 } = useQuery({
    queryKey: ["followingCount", userId],
    queryFn: () => makeRequest.get("/relationships/following/" + userId).then((res) => res.data.length),
  });

  const { data: postsCount = 0 } = useQuery({
    queryKey: ["postsCount", userId],
    queryFn: () => makeRequest.get("/posts?userId=" + userId).then((res) => res.data.length),
  });

  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => makeRequest.get("/relationships/requests").then((res) => res.data),
    enabled: currentUser?.id === userId,
  });

  const refreshProfileData = () => {
    queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    queryClient.invalidateQueries({ queryKey: ["requestStatus", userId] });
    queryClient.invalidateQueries({ queryKey: ["followerCount", userId] });
    queryClient.invalidateQueries({ queryKey: ["followingCount", userId] });
    queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
  };

  const followMutation = useMutation({
    mutationFn: async () => {
      if (requestStatus?.following) {
        await makeRequest.delete("/relationships?userId=" + userId);
      } else if (requestStatus?.outgoingPending) {
        await makeRequest.delete("/relationships?userId=" + userId);
      } else {
        await makeRequest.post("/relationships", { followedUserId: userId });
      }
    },
    onSuccess: refreshProfileData,
  });

  const acceptMutation = useMutation({
    mutationFn: (requesterId) => makeRequest.post("/relationships/accept", { userId: requesterId }),
    onSuccess: refreshProfileData,
  });

  const rejectMutation = useMutation({
    mutationFn: (requesterId) => makeRequest.delete(`/relationships/reject/${requesterId}`),
    onSuccess: refreshProfileData,
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleMessage = () => {
    navigate(`/messages?userId=${userId}`);
  };

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-8 text-center">
        <div className="mb-2 text-lg text-red-500">User not found</div>
        <div className="text-gray-500">The user you&apos;re looking for doesn&apos;t exist</div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const followLabel = requestStatus?.following ? "Following" : requestStatus?.outgoingPending ? "Requested" : "Request Follow";
  const followIcon = requestStatus?.following ? faUserCheck : requestStatus?.outgoingPending ? faUserClock : faUserPlus;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="relative">
        <div
          className="relative h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${data.coverPic ? getMediaUrl(data.coverPic) : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30" />

          <div className="absolute bottom-0 left-8 translate-y-1/2 transform">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white p-1 ring-4 ring-white">
                <img src={getProfileUrl(data.profilePic)} alt="Profile Picture" className="h-full w-full rounded-full object-cover" />
              </div>
              {data.verified ? (
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                  ✓
                </div>
              ) : null}
            </div>
          </div>

          <div className="absolute bottom-4 right-8 flex items-center space-x-4">
            {isOwnProfile ? (
              <button onClick={() => setOpenUpdate((prev) => !prev)} className="flex items-center space-x-2 rounded-full bg-white bg-opacity-90 px-6 py-3 font-medium text-gray-800 shadow-lg transition-all hover:bg-opacity-100">
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 rounded-full px-6 py-3 font-medium shadow-lg transition-all ${
                    requestStatus?.following || requestStatus?.outgoingPending
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  <FontAwesomeIcon icon={followIcon} />
                  <span>{followLabel}</span>
                </button>
                <button onClick={handleMessage} className="flex items-center space-x-2 rounded-full bg-blue-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-600">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Message</span>
                </button>
              </>
            )}

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-90 shadow-lg transition-all hover:bg-opacity-100">
              <FontAwesomeIcon icon={faShare} className="text-gray-600" />
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-90 shadow-lg transition-all hover:bg-opacity-100">
              <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="px-8 pb-8 pt-20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
                {data.verified ? <span className="text-xl text-blue-500">✓</span> : null}
              </div>
              <p className="mb-4 text-lg text-gray-600">@{data.username}</p>

              {data.bio ? <p className="mb-4 max-w-2xl leading-relaxed text-gray-700">{data.bio}</p> : null}

              <div className="mb-6 flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{postsCount}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followerCount}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-600">
                {data.city ? (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{data.city}</span>
                  </div>
                ) : null}
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Joined {data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "recently"}</span>
                </div>
                {data.website ? (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>{data.website}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {isOwnProfile && friendRequests.length > 0 ? (
              <div className="relative">
                <button
                  onClick={() => setShowFriendRequests(!showFriendRequests)}
                  className="relative rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-medium text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600"
                >
                  Follow Requests
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {friendRequests.length}
                  </span>
                </button>

                {showFriendRequests ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-2xl">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="font-semibold text-gray-900">Follow Requests</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {friendRequests.map((request) => (
                        <div key={request.id} className="border-b border-gray-100 p-4 hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img src={getProfileUrl(request.profilePic)} alt={request.name} className="h-12 w-12 rounded-full object-cover" />
                              {request.verified ? (
                                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                  ✓
                                </div>
                              ) : null}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{request.name}</h4>
                              <p className="text-sm text-gray-600">@{request.username}</p>
                              <p className="text-xs text-gray-500">{request.mutualFriends || 0} mutual friends</p>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => acceptMutation.mutate(request.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600">
                                <FontAwesomeIcon icon={faUserCheck} className="text-xs" />
                              </button>
                              <button onClick={() => rejectMutation.mutate(request.id)} className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                                <FontAwesomeIcon icon={faUserTimes} className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-8">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-purple-500 px-1 py-4 font-medium text-purple-600">Posts</button>
            <button className="border-b-2 border-transparent px-1 py-4 font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Reels</button>
            <button className="border-b-2 border-transparent px-1 py-4 font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Saved</button>
            <button className="border-b-2 border-transparent px-1 py-4 font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">Tagged</button>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-8">
        <Posts userId={userId} />
      </div>

      {openUpdate ? <Update setOpenUpdate={setOpenUpdate} user={data} /> : null}
    </div>
  );
};

export default Profile;
