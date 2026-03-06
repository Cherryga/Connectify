// REPLACE with this clean version:
import { 
  faComment, 
  faShare, 
  faPlay, 
  faMusic,
  faEllipsisVertical,
  faHeart as faHeartSolid,
  faVolumeUp,
  faVolumeMute,
  faBookmark as faBookmarkSolid
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Reels = () => {
  // const { currentUser } = useContext(AuthContext);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef({});
  // const containerRef = useRef(null);

  // Get posts that could be reels (videos or posts with images)
const { isPending, error } = useQuery({    queryKey: ['reels'],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });

  // Enhanced dynamic reels with more variety and real video sources
  const getDynamicReels = () => {
    const videoUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ];

    const descriptions = [
      'Amazing sunset at the beach! 🌅 #travel #sunset #beach #wanderlust',
      'Making the perfect pasta! 🍝 #cooking #food #pasta #chef',
      'Morning workout routine 💪 #fitness #workout #motivation #health',
      'Quote: "In every walk with nature, one receives far more than he seeks." - John Muir 🌲 #nature #quotes #inspiration',
      'Building the future one line of code at a time! 💻 #coding #technology #innovation #programming',
      'Quote: "Peace comes from within. Do not seek it without." - Buddha 🧘‍♀️ #mindfulness #peace #meditation',
      'Mountain climbing in the Alps! The view from the top is absolutely breathtaking! ⛰️ #adventure #mountains #climbing',
      'Quote: "Art enables us to find ourselves and lose ourselves at the same time." - Thomas Merton 🎨 #art #creativity #inspiration',
      'Late night studio session vibes! 🎵 #music #studio #recording #producer',
      'Morning flow to start your day with positive energy! 🌅 #yoga #morning #flow #wellness',
      'Quote: "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill 💪 #motivation #success',
      'Exploring hidden gems in the city! 🏙️ #urban #exploration #city #discovery',
      'Quote: "The only way to do great work is to love what you do." - Steve Jobs 💼 #work #passion #success',
      'Dance like nobody\'s watching! 💃 #dance #freedom #expression #joy',
      'Quote: "Life is what happens when you\'re busy making other plans." - John Lennon 🌟 #life #wisdom #philosophy'
    ];

    const locations = [
      'Maldives', 'Kitchen Studio', 'Gym', 'Swiss Alps', 'Tech Hub', 'Zen Garden', 
      'Art Studio', 'Music Studio', 'Yoga Studio', 'City Center', 'Mountain Peak',
      'Beach Resort', 'Coffee Shop', 'Library', 'Park', 'Museum', 'Concert Hall'
    ];

    const musicTracks = [
      'Original Audio - Travel Lover', 'Cooking Vibes - Foodie Adventures', 'Workout Mix - Fitness Motivation',
      'Peaceful Nature Sounds', 'Digital Dreams - Tech Innovator', 'Meditation Music - Mindfulness Guru',
      'Adventure Calls - Adventure Seeker', 'Creative Flow - Creative Artist', 'Studio Vibes - Anna Rodriguez',
      'Morning Flow - Sophie Chen', 'Urban Beats - City Explorer', 'Motivational Mix - Success Coach',
      'Dance Vibes - Movement Artist', 'Life Soundtrack - Wisdom Seeker', 'Chill Beats - Relaxation Master'
    ];

    const baseReels = [
      {
        id: 'reel1',
        username: 'travel_lover',
        name: 'Sarah Johnson',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel2',
        username: 'foodie_adventures',
        name: 'Mike Chen',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: false,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel3',
        username: 'fitness_motivation',
        name: 'Emma Davis',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: true,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel4',
        username: 'nature_photographer',
        name: 'Alex Thompson',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel5',
        username: 'tech_innovator',
        name: 'David Kim',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: false,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel6',
        username: 'mindfulness_guru',
        name: 'Lisa Wang',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: false,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel7',
        username: 'adventure_seeker',
        name: 'Maria Garcia',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel8',
        username: 'creative_artist',
        name: 'James Wilson',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: false,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel9',
        username: 'music_producer',
        name: 'Anna Rodriguez',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true,
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      {
        id: 'reel10',
        username: 'yoga_instructor',
        name: 'Sophie Chen',
        desc: descriptions[Math.floor(Math.random() * descriptions.length)],
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        music: musicTracks[Math.floor(Math.random() * musicTracks.length)],
        profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: false,
        location: locations[Math.floor(Math.random() * locations.length)]
      }
    ];

    // Shuffle the reels to make them truly dynamic
    return baseReels.sort(() => Math.random() - 0.5);
  };

  const [dynamicReels, setDynamicReels] = useState(getDynamicReels());

  // Refresh reels every 30 seconds to make them truly dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicReels(getDynamicReels());
    }, 30000);

    return () => clearInterval(interval);
  }, []);


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

    // Update the like count in the reels data
    setDynamicReels(prev => prev.map(reel => {
      if (reel.id === reelId) {
        return {
          ...reel,
          likes: likedReels.has(reelId) ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleSave = (reelId) => {
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const toggleMute = () => {
    setMuted(!muted);
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = !muted;
      }
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
      
      {dynamicReels.map((reel) => (
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
                muted={muted}
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

              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeUp} className="text-sm" />
                </button>
                <button className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
                  <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" />
                </button>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-6">
                {/* Profile */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full ring-2 ring-white overflow-hidden">
                      <img
                        src={reel.profilePic}
                        alt={reel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {reel.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
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

                {/* Save */}
                <div className="flex flex-col items-center space-y-1">
                  <button 
                    onClick={() => handleSave(reel.id)}
                    className={`transition-all duration-200 ${
                      savedReels.has(reel.id) 
                        ? 'text-yellow-400 scale-110' 
                        : 'text-white hover:text-yellow-400 hover:scale-105'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={savedReels.has(reel.id) ? faBookmarkSolid : faBookmarkRegular} 
                      className="text-2xl" 
                    />
                  </button>
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
              <div className="absolute bottom-4 left-4 text-white max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold">@{reel.username}</span>
                  {reel.verified && (
                    <span className="text-blue-400 text-sm">✓</span>
                  )}
                  <button className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium hover:bg-opacity-30 transition-colors">
                    Follow
                  </button>
                </div>
                <p className="text-sm mb-2 leading-relaxed">{reel.desc}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <FontAwesomeIcon icon={faMusic} className="text-xs" />
                  <span>{reel.music}</span>
                </div>
                {reel.location && (
                  <div className="text-xs text-white/80 mt-1">
                    📍 {reel.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reels; 