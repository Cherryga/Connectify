import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faComment, 
  faShare, 
  faPlay, 
  faPause,
  faMusic,
  faEllipsisVertical,
  faHeart as faHeartSolid 
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const Reels = () => {
  const { currentUser } = useContext(AuthContext);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [likedReels, setLikedReels] = useState(new Set());
  const videoRefs = useRef({});
  const containerRef = useRef(null);

  // Get posts that could be reels (videos or posts with images)
  const { data: posts, isPending, error } = useQuery({
    queryKey: ['reels'],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });

  // Sample reels data for demonstration
  const sampleReels = [
    {
      id: 'reel1',
      username: 'travel_lover',
      name: 'Travel Lover',
      desc: 'Amazing sunset at the beach! 🌅 #travel #sunset #beach',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      likes: 1247,
      comments: 89,
      shares: 23,
      music: 'Original Audio - Travel Lover',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel2',
      username: 'foodie_adventures',
      name: 'Foodie Adventures',
      desc: 'Making the perfect pasta! 🍝 #cooking #food #pasta',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      likes: 892,
      comments: 45,
      shares: 12,
      music: 'Cooking Vibes - Foodie Adventures',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel3',
      username: 'fitness_motivation',
      name: 'Fitness Motivation',
      desc: 'Morning workout routine 💪 #fitness #workout #motivation',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      likes: 2156,
      comments: 156,
      shares: 67,
      music: 'Workout Mix - Fitness Motivation',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel4',
      username: 'nature_photographer',
      name: 'Nature Photographer',
      desc: 'Quote: "In every walk with nature, one receives far more than he seeks." - John Muir 🌲 #nature #quotes #inspiration',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      likes: 3421,
      comments: 234,
      shares: 89,
      music: 'Peaceful Nature Sounds',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel5',
      username: 'tech_innovator',
      name: 'Tech Innovator',
      desc: 'Building the future one line of code at a time! 💻 #coding #technology #innovation',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      likes: 1892,
      comments: 123,
      shares: 45,
      music: 'Digital Dreams - Tech Innovator',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel6',
      username: 'mindfulness_guru',
      name: 'Mindfulness Guru',
      desc: 'Quote: "Peace comes from within. Do not seek it without." - Buddha 🧘‍♀️ #mindfulness #peace #meditation',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      likes: 5678,
      comments: 456,
      shares: 234,
      music: 'Meditation Music - Mindfulness Guru',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel7',
      username: 'adventure_seeker',
      name: 'Adventure Seeker',
      desc: 'Mountain climbing in the Alps! The view from the top is absolutely breathtaking! ⛰️ #adventure #mountains #climbing',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      likes: 4231,
      comments: 312,
      shares: 156,
      music: 'Adventure Calls - Adventure Seeker',
      profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'reel8',
      username: 'creative_artist',
      name: 'Creative Artist',
      desc: 'Quote: "Art enables us to find ourselves and lose ourselves at the same time." - Thomas Merton 🎨 #art #creativity #inspiration',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      likes: 2987,
      comments: 198,
      shares: 87,
      music: 'Creative Flow - Creative Artist',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const handleVideoClick = (reelId) => {
    const video = videoRefs.current[reelId];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideo(reelId);
      } else {
        video.pause();
        setPlayingVideo(null);
      }
    }
  };

  const handleVideoPlay = (reelId) => {
    setPlayingVideo(reelId);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  const handleLike = (reelId) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">Failed to load reels</div>
        <div className="text-gray-500">Please try refreshing the page</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reels</h2>
        <p className="text-gray-500">Discover amazing short videos</p>
      </div>
      
      {sampleReels.map((reel) => (
        <div key={reel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative">
            {/* Video Container */}
            <div className="relative h-96 bg-black">
              <video
                ref={(el) => (videoRefs.current[reel.id] = el)}
                className="w-full h-full object-cover"
                onClick={() => handleVideoClick(reel.id)}
                onPlay={() => handleVideoPlay(reel.id)}
                onPause={handleVideoPause}
                loop
                muted
                poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop"
              >
                <source src={reel.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                {playingVideo !== reel.id && (
                  <button
                    onClick={() => handleVideoClick(reel.id)}
                    className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
                  </button>
                )}
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-6">
                {/* Profile */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden">
                    <img
                      src={reel.profilePic}
                      alt={reel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>

                {/* Like */}
                <div className="flex flex-col items-center space-y-1">
                  <button 
                    onClick={() => handleLike(reel.id)}
                    className={`transition-all duration-200 ${
                      likedReels.has(reel.id) 
                        ? 'text-red-500 scale-110' 
                        : 'text-white hover:text-red-500 hover:scale-105'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={likedReels.has(reel.id) ? faHeartSolid : faHeartRegular} 
                      className="text-2xl" 
                    />
                  </button>
                  <span className="text-white text-xs font-medium">{formatNumber(reel.likes)}</span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center space-y-1">
                  <button className="text-white hover:text-blue-300 transition-colors">
                    <FontAwesomeIcon icon={faComment} className="text-2xl" />
                  </button>
                  <span className="text-white text-xs font-medium">{formatNumber(reel.comments)}</span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center space-y-1">
                  <button className="text-white hover:text-green-300 transition-colors">
                    <FontAwesomeIcon icon={faShare} className="text-2xl" />
                  </button>
                  <span className="text-white text-xs font-medium">{formatNumber(reel.shares)}</span>
                </div>

                {/* Music */}
                <div className="flex flex-col items-center space-y-1">
                  <button className="text-white hover:text-purple-300 transition-colors">
                    <FontAwesomeIcon icon={faMusic} className="text-xl" />
                  </button>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">@{reel.username}</span>
                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium hover:bg-opacity-30 transition-colors">
                    Follow
                  </button>
                </div>
                <p className="text-sm mb-2 max-w-xs">{reel.desc}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <FontAwesomeIcon icon={faMusic} className="text-xs" />
                  <span>{reel.music}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels; 