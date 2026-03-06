
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faChevronLeft, 
  faChevronRight,
  faHeart,
  faComment,
  faShare,
  faBookmark,
  faLocationDot,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const Stories = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [likedStories, setLikedStories] = useState(new Set());
  const [savedStories, setSavedStories] = useState(new Set());

  // Get stories from API
  const { isPending, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  // Enhanced dynamic stories with no xLoy references
 const dynamicStories = [
  { id: 1, username: "sarah_travels", name: "Sarah Johnson", profilePic: "https://i.pravatar.cc/150?img=1", verified: true, online: true, images: ["https://picsum.photos/400/600?random=101","https://picsum.photos/400/600?random=102","https://picsum.photos/400/600?random=103"], createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(), location: "Maldives", likes: 1247, comments: 89 },
  { id: 2, username: "mike_photography", name: "Mike Chen", profilePic: "https://i.pravatar.cc/150?img=3", verified: true, online: false, images: ["https://picsum.photos/400/600?random=201","https://picsum.photos/400/600?random=202","https://picsum.photos/400/600?random=203"], createdAt: new Date(Date.now() - 4*60*60*1000).toISOString(), location: "Studio", likes: 892, comments: 45 },
  { id: 3, username: "emma_fitness", name: "Emma Davis", profilePic: "https://i.pravatar.cc/150?img=5", verified: false, online: true, images: ["https://picsum.photos/400/600?random=301","https://picsum.photos/400/600?random=302","https://picsum.photos/400/600?random=303"], createdAt: new Date(Date.now() - 6*60*60*1000).toISOString(), location: "Gym", likes: 2156, comments: 156 },
  { id: 4, username: "alex_tech", name: "Alex Thompson", profilePic: "https://i.pravatar.cc/150?img=7", verified: true, online: false, images: ["https://picsum.photos/400/600?random=401","https://picsum.photos/400/600?random=402","https://picsum.photos/400/600?random=403"], createdAt: new Date(Date.now() - 8*60*60*1000).toISOString(), location: "Tech Hub", likes: 3421, comments: 234 },
  { id: 5, username: "lisa_creative", name: "Lisa Wang", profilePic: "https://i.pravatar.cc/150?img=9", verified: false, online: true, images: ["https://picsum.photos/400/600?random=501","https://picsum.photos/400/600?random=502","https://picsum.photos/400/600?random=503"], createdAt: new Date(Date.now() - 10*60*60*1000).toISOString(), location: "Art Studio", likes: 1892, comments: 123 },
  { id: 6, username: "david_music", name: "David Kim", profilePic: "https://i.pravatar.cc/150?img=11", verified: true, online: true, images: ["https://picsum.photos/400/600?random=601","https://picsum.photos/400/600?random=602","https://picsum.photos/400/600?random=603"], createdAt: new Date(Date.now() - 12*60*60*1000).toISOString(), location: "Music Studio", likes: 5678, comments: 456 },
  { id: 7, username: "sophie_yoga", name: "Sophie Chen", profilePic: "https://i.pravatar.cc/150?img=13", verified: false, online: false, images: ["https://picsum.photos/400/600?random=701","https://picsum.photos/400/600?random=702","https://picsum.photos/400/600?random=703"], createdAt: new Date(Date.now() - 14*60*60*1000).toISOString(), location: "Yoga Studio", likes: 2987, comments: 198 },
  { id: 8, username: "james_art", name: "James Wilson", profilePic: "https://i.pravatar.cc/150?img=15", verified: true, online: true, images: ["https://picsum.photos/400/600?random=801","https://picsum.photos/400/600?random=802","https://picsum.photos/400/600?random=803"], createdAt: new Date(Date.now() - 16*60*60*1000).toISOString(), location: "Gallery", likes: 4231, comments: 312 },
  { id: 9, username: "maria_adventure", name: "Maria Garcia", profilePic: "https://i.pravatar.cc/150?img=17", verified: false, online: true, images: ["https://picsum.photos/400/600?random=901","https://picsum.photos/400/600?random=902","https://picsum.photos/400/600?random=903"], createdAt: new Date(Date.now() - 18*60*60*1000).toISOString(), location: "Mountain Peak", likes: 3456, comments: 267 },
  { id: 10, username: "anna_food", name: "Anna Rodriguez", profilePic: "https://i.pravatar.cc/150?img=19", verified: true, online: false, images: ["https://picsum.photos/400/600?random=1001","https://picsum.photos/400/600?random=1002","https://picsum.photos/400/600?random=1003"], createdAt: new Date(Date.now() - 20*60*60*1000).toISOString(), location: "Kitchen", likes: 2789, comments: 189 }
];

  // Combine real stories with dynamic content
      // const enhancedStories = stories ? [...stories] : [];

      const enhancedStories = dynamicStories;
  
  // Add dynamic stories if feed is empty or has few stories
  if (enhancedStories.length < 5) {
    enhancedStories.push(...dynamicStories);
  }

  // Auto-advance stories
  useEffect(() => {
    if (showStoryViewer && selectedStory) {
      const interval = setInterval(() => {
        const currentImageIdx = currentImageIndex[selectedStory.id] || 0;
        const maxImages = selectedStory.images ? selectedStory.images.length : 1;
        
        if (currentImageIdx < maxImages - 1) {
          setCurrentImageIndex(prev => ({
            ...prev,
            [selectedStory.id]: currentImageIdx + 1
          }));
        } else {
          // Move to next story
          const currentStoryIdx = enhancedStories.findIndex(s => s.id === selectedStory.id);
          if (currentStoryIdx < enhancedStories.length - 1) {
            setSelectedStory(enhancedStories[currentStoryIdx + 1]);
            setCurrentImageIndex(prev => ({
              ...prev,
              [enhancedStories[currentStoryIdx + 1].id]: 0
            }));
          } else {
            // Close story viewer when all stories are viewed
            setShowStoryViewer(false);
            setSelectedStory(null);
          }
        }
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [showStoryViewer, selectedStory, currentImageIndex, enhancedStories]);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setCurrentImageIndex(prev => ({
      ...prev,
      [story.id]: 0
    }));
    setShowStoryViewer(true);
  };

  const handleCloseStory = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
  };

  const handleNextStory = () => {
    const currentStoryIdx = enhancedStories.findIndex(s => s.id === selectedStory.id);
    if (currentStoryIdx < enhancedStories.length - 1) {
      const nextStory = enhancedStories[currentStoryIdx + 1];
      setSelectedStory(nextStory);
      setCurrentImageIndex(prev => ({
        ...prev,
        [nextStory.id]: 0
      }));
    } else {
      handleCloseStory();
    }
  };

  const handlePrevStory = () => {
    const currentStoryIdx = enhancedStories.findIndex(s => s.id === selectedStory.id);
    if (currentStoryIdx > 0) {
      const prevStory = enhancedStories[currentStoryIdx - 1];
      setSelectedStory(prevStory);
      setCurrentImageIndex(prev => ({
        ...prev,
        [prevStory.id]: 0
      }));
    }
  };

  const handleImageChange = (direction) => {
    if (!selectedStory) return;
    
    const currentImageIdx = currentImageIndex[selectedStory.id] || 0;
    const maxImages = selectedStory.images ? selectedStory.images.length : 1;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentImageIdx >= maxImages - 1 ? 0 : currentImageIdx + 1;
    } else {
      newIndex = currentImageIdx <= 0 ? maxImages - 1 : currentImageIdx - 1;
    }
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [selectedStory.id]: newIndex
    }));
  };

  const handleLike = (storyId) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const handleSave = (storyId) => {
    setSavedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const storyDate = new Date(dateString);
    const diffInHours = Math.floor((now - storyDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };



  if (isPending) {
    return (
        <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">Failed to load stories</div>
        <div className="text-gray-500">Please try refreshing the page</div>
      </div>
    );
  }

  // Show placeholder if no stories available
  if (!enhancedStories || enhancedStories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">No stories yet</div>
        <div className="text-gray-400">Be the first to share a story!</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Stories Carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {/* Add Story Button */}
          <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full ring-4 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">+</span>
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-600">Add Story</p>
        </div>

        {/* Story Items */}
        {enhancedStories.map((story) => (
          <div key={story.id} className="flex-shrink-0 flex flex-col items-center">        <div className="relative flex-shrink-0">
                    <div 
                      onClick={() => handleStoryClick(story)}
                      className="w-20 h-20 rounded-full ring-4 ring-purple-400 p-0.5 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                    >
                   <img
  // src={
  //   story.images?.[0] ||
  //   (story.img && `http://localhost:8800/uploads/posts/${story.img}`) ||
  //   story.profilePic
  // }

  src={story.images?.[0] || story.profilePic}
  alt={story.name}
  className="w-full h-full rounded-full object-cover"
/>
                    </div>
                    {story.online && (
                      <div className="absolute bottom-0 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10"></div>
                    )}
                  </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-900 font-medium truncate w-20">{story.name}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(story.createdAt)}</p>
              </div>
          </div>
        ))}
          </div>

      {/* Story Viewer Modal */}
      {showStoryViewer && selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Story Content */}
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Story Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full ring-2 ring-white p-0.5">
                      <img
                        src={selectedStory.profilePic}
                        alt={selectedStory.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {selectedStory.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="text-white font-semibold">{selectedStory.name}</h3>
                      {selectedStory.verified && (
                        <span className="text-blue-400 text-sm">✓</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      {selectedStory.location && (
                        <>
                          <FontAwesomeIcon icon={faLocationDot} />
                          <span>{selectedStory.location}</span>
                        </>
                      )}
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatTimeAgo(selectedStory.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseStory}
                  className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>

           {/* Story Image */}
            <div className="relative w-full h-full">
              {(() => {
               const imgSrc =
                  selectedStory.images?.[currentImageIndex[selectedStory.id] || 0] ||
                  (selectedStory.img &&
                    `http://localhost:8800/uploads/posts/${selectedStory.img}`);

                return imgSrc ? (
                  <>
                    <img
                      src={imgSrc}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                    {selectedStory.images && selectedStory.images.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageChange('prev')}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                          onClick={() => handleImageChange('next')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                        >
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {selectedStory.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 rounded-full transition-all ${
                                idx === (currentImageIndex[selectedStory.id] || 0)
                                  ? 'bg-white w-8'
                                  : 'bg-white/50 w-4'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : null;
              })()}
            </div>

            {/* Story Actions */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(selectedStory.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      likedStories.has(selectedStory.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <button className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  <button className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
                <button
                  onClick={() => handleSave(selectedStory.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    savedStories.has(selectedStory.id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
              </div>
            </div>

            {/* Story Navigation */}
            <button
              onClick={handlePrevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={handleNextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
