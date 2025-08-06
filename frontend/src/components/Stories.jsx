
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useContext, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisVertical, faCirclePlus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
// import AddStory from './addStory';
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { makeRequest } from "../axios";
// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// const Stories = () => {
//   const [openAddStory, setAddStory] = useState(false);
//   const [selectedStory, setSelectedStory] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const queryClient = useQueryClient();

//   // Get stories
//   const { isPending, data: stories, error } = useQuery({
//     queryKey: ['stories'],
//     queryFn: () => makeRequest.get("/stories").then((res) => res.data),
//     retry: 1,
//     retryDelay: 1000,
//   });

//   // Delete story mutation
//   const deleteStoryMutation = useMutation({
//     mutationFn: (storyId) => makeRequest.delete("/stories/" + storyId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["stories"] });
//     },
//   });

//   const handleDeleteStory = (storyId) => {
//     deleteStoryMutation.mutate(storyId);
//   };

//   const handleStoryClick = (story) => {
//     setSelectedStory(story);
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = (now - date) / (1000 * 60 * 60);
    
//     if (diffInHours < 1) {
//       const diffInMinutes = Math.floor((now - date) / (1000 * 60));
//       return `${diffInMinutes}m`;
//     } else if (diffInHours < 24) {
//       return `${Math.floor(diffInHours)}h`;
//     } else {
//       const diffInDays = Math.floor(diffInHours / 24);
//       return `${diffInDays}d`;
//     }
//   };

//   if (isPending) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="flex justify-center items-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="text-center py-8">
//           <div className="text-red-500 mb-2 font-medium">Failed to load stories</div>
//           <div className="text-sm text-gray-500">Please try refreshing the page</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//           {/* Add Story Button */}
//           <div className="flex-shrink-0">
//             <button
//               onClick={() => setAddStory(true)}
//               className="flex flex-col items-center space-y-3 group"
//             >
//               <div className="relative">
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
//                   <FontAwesomeIcon icon={faCirclePlus} className="text-white text-xl" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
//                   <FontAwesomeIcon icon={faPlus} className="text-white text-xs" />
//                 </div>
//               </div>
//               <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
//                 Add Story
//               </span>
//             </button>
//           </div>

//           {/* Stories */}
//           {stories && stories.length > 0 ? (
//             stories.map((story, index) => (
//               <div key={story.id} className="flex-shrink-0">
//                 <button
//                   onClick={() => handleStoryClick(story)}
//                   className="flex flex-col items-center space-y-3 group"
//                 >
//                   <div className="relative">
//                     <div className="w-16 h-16 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
//                       <img
//                         src={`http://localhost:8800/uploads/posts/${story.img}`}
//                         alt={story.username}
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     </div>
//                     {story.userid === currentUser?.id && (
//                       <div className="absolute -top-1 -right-1">
//                         <div className="dropdown dropdown-left">
//                           <button className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
//                             <FontAwesomeIcon icon={faEllipsisVertical} className="text-white text-xs" />
//                           </button>
//                           <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl border border-gray-200 w-32">
//                             <li>
//                               <button 
//                                 onClick={() => handleDeleteStory(story.id)} 
//                                 className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-2"
//                               >
//                                 Delete
//                               </button>
//                             </li>
//                             <li>
//                               <button className="text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2">
//                                 Report
//                               </button>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 truncate max-w-16 transition-colors">
//                       {story.username}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {formatTime(story.createdAt)}
//                     </div>
//                   </div>
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="flex-shrink-0">
//               <div className="flex flex-col items-center space-y-3">
//                 <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
//                   <span className="text-gray-400 text-xs">No stories yet</span>
//                 </div>
//                 <span className="text-xs text-gray-500">Be the first to share a story!</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Story Modal */}
//       {openAddStory && (
//         <AddStory setAddStory={setAddStory} />
//       )}

//       {/* Story Viewer Modal */}
//       {selectedStory && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
//           <div className="relative max-w-md w-full mx-4">
//             <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
//               <div className="relative">
//                 <img
//                   src={`http://localhost:8800/uploads/posts/${selectedStory.img}`}
//                   alt="Story"
//                   className="w-full h-96 object-cover"
//                 />
//                 <button
//                   onClick={() => setSelectedStory(null)}
//                   className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
//                 >
//                   <FontAwesomeIcon icon={faTimes} className="text-white" />
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <div className="w-10 h-10 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5">
//                     <img
//                       src={
//                         selectedStory.profilePic
//                           ? `http://localhost:8800/uploads/posts/${selectedStory.profilePic}`
//                           : "http://localhost:8800/default/default_profile.png"
//                       }
//                       alt="Profile"
//                       className="w-full h-full rounded-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">{selectedStory.username}</div>
//                     <div className="text-xs text-gray-500">{formatTime(selectedStory.createdAt)}</div>
//                   </div>
//                 </div>
//                 <div className="flex space-x-3">
//                   <Link
//                     to={`/profile/${selectedStory.userid}`}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-center hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
//                   >
//                     View Profile
//                   </Link>
//                   <button
//                     onClick={() => setSelectedStory(null)}
//                     className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Stories;


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faCirclePlus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import AddStory from './addStory';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Stories = () => {
  const [openAddStory, setAddStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isPending, data: stories, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
    retry: 1,
    retryDelay: 1000,
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (storyId) => makeRequest.delete("/stories/" + storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleDeleteStory = (storyId) => {
    deleteStoryMutation.mutate(storyId);
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) return `${Math.floor((now - date) / (1000 * 60))}m`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getImageUrl = (path) => `${import.meta.env.VITE_BACKEND_URL}/uploads/posts/${path}`;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">

          {/* Add Story Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setAddStory(true)}
              className="flex flex-col items-center space-y-3 group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <FontAwesomeIcon icon={faCirclePlus} className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <FontAwesomeIcon icon={faPlus} className="text-white text-xs" />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                Add Story
              </span>
            </button>
          </div>

          {/* Stories */}
          {isPending ? (
            <div className="flex justify-center items-center h-32 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 w-full">
              <div className="text-red-500 mb-2 font-medium">Failed to load stories</div>
              <div className="text-sm text-gray-500">Please try refreshing the page</div>
            </div>
          ) : stories && stories.length > 0 ? (
            stories
              .filter((story) => story.username !== "xLoy")
              .map((story) => (
                <div key={story.id} className="flex-shrink-0">
                  <button
                    onClick={() => handleStoryClick(story)}
                    className="flex flex-col items-center space-y-3 group"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                        <img
                          src={getImageUrl(story.img)}
                          alt={story.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {story.userid === currentUser?.id && (
                        <div className="absolute -top-1 -right-1">
                          <div className="dropdown dropdown-left">
                            <button className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                              <FontAwesomeIcon icon={faEllipsisVertical} className="text-white text-xs" />
                            </button>
                            <ul className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl border border-gray-200 w-32">
                              <li>
                                <button
                                  onClick={() => handleDeleteStory(story.id)}
                                  className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-2"
                                >
                                  Delete
                                </button>
                              </li>
                              <li>
                                <button className="text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2">
                                  Report
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-700 group-hover:text-blue-600 truncate max-w-16 transition-colors">
                        {story.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(story.createdAt)}
                      </div>
                    </div>
                  </button>
                </div>
              ))
          ) : (
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No stories yet</span>
                </div>
                <span className="text-xs text-gray-500">Be the first to share a story!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Story Modal */}
      {openAddStory && <AddStory setAddStory={setAddStory} />}

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative">
                <img
                  src={getImageUrl(selectedStory.img)}
                  alt="Story"
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-white" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5">
                    <img
                      src={
                        selectedStory.profilePic
                          ? getImageUrl(selectedStory.profilePic)
                          : "/default/default_profile.png"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedStory.username}</div>
                    <div className="text-xs text-gray-500">{formatTime(selectedStory.createdAt)}</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/profile/${selectedStory.userid}`}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-center hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
