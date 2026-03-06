// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Link, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { 
//   faHome, 
//   faUser, 
//   faUsers, 
//   faCalendar, 
//   faBookmark, 
//   faCog, 
//   faQuestionCircle,
//   faSignOutAlt,
//   faBell,
//   faComments,
//   faVideo,
//   faImages,
//   faNewspaper,
//   faCloudSun,
//   faClock,
//   faCircle,
//   faTimes
// } from "@fortawesome/free-solid-svg-icons";

// const Leftbar = () => {
//   const { currentUser, logout } = useContext(AuthContext);
//   const location = useLocation();
//   const [showNewsModal, setShowNewsModal] = useState(false);
//   const [selectedNews, setSelectedNews] = useState(null);
//   const [weather, setWeather] = useState(null);
//   const [weatherError, setWeatherError] = useState("");
//   const [onlineFriends, setOnlineFriends] = useState([]);
//   const [showPollModal, setShowPollModal] = useState(false);
//   const [currentPoll, setCurrentPoll] = useState(null);
//   const [pollVotes, setPollVotes] = useState({});

//   // Daily News Data
//   const dailyNews = [
//     {
//       id: 1,
//       title: "Tech Giants Announce Revolutionary AI Breakthrough",
//       summary: "Major technology companies have unveiled a new artificial intelligence system that promises to transform how we interact with digital devices.",
//       category: "Technology",
//       time: "2 hours ago",
//       image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop"
//     },
//     {
//       id: 2,
//       title: "Global Climate Summit Reaches Historic Agreement",
//       summary: "World leaders have agreed on ambitious new targets to combat climate change, marking a significant step forward in environmental protection.",
//       category: "Environment",
//       time: "4 hours ago",
//       image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
//     },
//     {
//       id: 3,
//       title: "SpaceX Successfully Launches New Satellite Constellation",
//       summary: "Elon Musk's aerospace company has successfully deployed another batch of satellites, expanding global internet coverage.",
//       category: "Space",
//       time: "6 hours ago",
//       image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop"
//     },
//     {
//       id: 4,
//       title: "Breakthrough in Renewable Energy Storage",
//       summary: "Scientists have developed a new battery technology that could revolutionize renewable energy storage and make clean energy more accessible.",
//       category: "Science",
//       time: "8 hours ago",
//       image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop"
//     },
//     {
//       id: 5,
//       title: "Major Sports League Announces Expansion Plans",
//       summary: "The league has revealed plans to add new teams and expand into international markets, creating new opportunities for athletes and fans.",
//       category: "Sports",
//       time: "10 hours ago",
//       image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
//     }
//   ];

//   // Online Friends Data
//   const onlineFriendsData = [
//     { id: 1, name: "Sarah Johnson", username: "sarah_travels", profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", status: "online" },
//     { id: 2, name: "Mike Chen", username: "mike_photography", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", status: "online" },
//     { id: 3, name: "Emma Davis", username: "emma_fitness", profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face", status: "away" },
//     { id: 4, name: "Alex Thompson", username: "alex_tech", profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", status: "online" },
//     { id: 5, name: "Lisa Wang", username: "lisa_creative", profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", status: "online" }
//   ];

//   const weatherCodeMap = {
//     0: "Clear sky",
//     1: "Mainly clear",
//     2: "Partly cloudy",
//     3: "Overcast",
//     45: "Fog",
//     48: "Rime fog",
//     51: "Light drizzle",
//     53: "Drizzle",
//     55: "Dense drizzle",
//     61: "Slight rain",
//     63: "Rain",
//     65: "Heavy rain",
//     71: "Slight snow",
//     73: "Snow",
//     75: "Heavy snow",
//     80: "Rain showers",
//     81: "Rain showers",
//     82: "Violent rain showers",
//     95: "Thunderstorm"
//   };

//   // Quick Polls Data
//   const quickPolls = [
//     {
//       id: 1,
//       question: "What's your favorite social media platform?",
//       options: [
//         { id: 1, text: "Instagram", votes: 45 },
//         { id: 2, text: "TikTok", votes: 32 },
//         { id: 3, text: "Twitter", votes: 28 },
//         { id: 4, text: "LinkedIn", votes: 15 }
//       ],
//       totalVotes: 120,
//       timeLeft: "2 days left"
//     },
//     {
//       id: 2,
//       question: "Which programming language do you prefer?",
//       options: [
//         { id: 1, text: "JavaScript", votes: 38 },
//         { id: 2, text: "Python", votes: 42 },
//         { id: 3, text: "Java", votes: 25 },
//         { id: 4, text: "C++", votes: 15 }
//       ],
//       totalVotes: 120,
//       timeLeft: "1 day left"
//     }
//   ];

//   useEffect(() => {
//     // Simulate loading online friends
//     setOnlineFriends(onlineFriendsData);

//     // const updateWeather = async (lat, lon) => {
//     //   try {
//     //     const weatherRes = await fetch(
//     //       `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`
//     //     );
//     //     const weatherJson = await weatherRes.json();

//     //     const geoRes = await fetch(
//     //       `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`
//     //     );
//     //     const geoJson = await geoRes.json();
//     //     const city = geoJson?.address?.city || geoJson?.address?.town || geoJson?.address?.village || "Your area";
//     //     const state = geoJson?.address?.state || "";

//     //     setWeather({
//     //       location: state ? `${city}, ${state}` : city,
//     //       temperature: `${Math.round(weatherJson.current.temperature_2m)}F`,
//     //       condition: weatherCodeMap[weatherJson.current.weather_code] || "Unknown",
//     //       humidity: `${weatherJson.current.relative_humidity_2m}%`,
//     //       wind: `${Math.round(weatherJson.current.wind_speed_10m)} mph`,
//     //       icon: "cloud-sun"
//     //     });
//     //     setWeatherError("");
//     //   } catch (error) {
//     //     setWeatherError("Weather unavailable");
//     //   }
//     // };

//     const updateWeather = async (lat, lon) => {
//   try {
//     // Use Open-Meteo API (free, no API key required)
//     const weatherRes = await fetch(
//       `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
//     );
//     const weatherJson = await weatherRes.json();

//     // Use Nominatim (OpenStreetMap) for geocoding - free, no API key
//     const geoRes = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
//       {
//         headers: {
//           'User-Agent': 'Connectify-Social-App' // Required by Nominatim
//         }
//       }
//     );
//     const geoJson = await geoRes.json();
    
//     const city = geoJson?.address?.city || 
//                  geoJson?.address?.town || 
//                  geoJson?.address?.village || 
//                  geoJson?.address?.county || 
//                  "Your area";
//     const state = geoJson?.address?.state || "";

//     setWeather({
//       location: state ? `${city}, ${state}` : city,
//       temperature: `${Math.round(weatherJson.current.temperature_2m)}°F`,
//       condition: weatherCodeMap[weatherJson.current.weather_code] || "Unknown",
//       humidity: `${weatherJson.current.relative_humidity_2m}%`,
//       wind: `${Math.round(weatherJson.current.wind_speed_10m)} mph`,
//       icon: "cloud-sun"
//     });
//     setWeatherError("");
//   } catch (error) {
//     console.error("Weather fetch error:", error);
//     setWeatherError("Weather unavailable");
//   }
// };

//     if (!navigator.geolocation) {
//       setWeatherError("Geolocation unsupported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         updateWeather(position.coords.latitude, position.coords.longitude);
//       },
//       () => {
//         setWeatherError("Location permission denied");
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
//     );
//   }, []);

//   const handleLogout = () => {
//     logout();
//   };

//   const handleNewsClick = (news) => {
//     setSelectedNews(news);
//     setShowNewsModal(true);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'online': return 'bg-green-500';
//       case 'away': return 'bg-yellow-500';
//       case 'busy': return 'bg-red-500';
//       default: return 'bg-gray-400';
//     }
//   };

//   const handlePollClick = (poll) => {
//     setCurrentPoll(poll);
//     setShowPollModal(true);
//   };

//   const handlePollVote = (pollId, optionId) => {
//     setPollVotes(prev => ({
//       ...prev,
//       [pollId]: optionId
//     }));
//     // Here you would typically make an API call to record the vote
//   };

//   const closePollModal = () => {
//     setShowPollModal(false);
//     setCurrentPoll(null);
//   };

//   const menuItems = [
//     {
//       id: "home",
//       label: "Home",
//       icon: faHome,
//       path: "/",
//       badge: null
//     },
//     {
//       id: "profile",
//       label: "Profile",
//       icon: faUser,
//       path: `/profile/${currentUser?.id}`,
//       badge: null
//     },
//     {
//       id: "friends",
//       label: "Friends",
//       icon: faUsers,
//       path: "/friends",
//       badge: "3"
//     },
//     {
//       id: "events",
//       label: "Events",
//       icon: faCalendar,
//       path: "/events",
//       badge: "5"
//     },
//     {
//       id: "saved",
//       label: "Saved",
//       icon: faBookmark,
//       path: "/saved",
//       badge: null
//     },
//     {
//       id: "notifications",
//       label: "Notifications",
//       icon: faBell,
//       path: "/notifications",
//       badge: "12"
//     },
//     {
//       id: "messages",
//       label: "Messages",
//       icon: faComments,
//       path: "/messages",
//       badge: "2"
//     },
//     {
//       id: "videos",
//       label: "Videos",
//       icon: faVideo,
//       path: "/videos",
//       badge: null
//     },
//     {
//       id: "photos",
//       label: "Photos",
//       icon: faImages,
//       path: "/photos",
//       badge: null
//     }
//   ];

//   const bottomMenuItems = [
//     {
//       id: "settings",
//       label: "Settings",
//       icon: faCog,
//       path: "/settings",
//       badge: null
//     },
//     {
//       id: "help",
//       label: "Help & Support",
//       icon: faQuestionCircle,
//       path: "/help",
//       badge: null
//     },
//     {
//       id: "logout",
//       label: "Logout",
//       icon: faSignOutAlt,
//       path: null,
//       badge: null,
//       onClick: handleLogout
//     }
//   ];

//   const isActive = (path) => {
//     if (path === "/") {
//       return location.pathname === "/";
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-64">
//       {/* Logo */}
//       <div className="p-6 border-b border-gray-100">
//         <Link to="/" className="flex items-center space-x-2">
//           <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-lg">C</span>
//           </div>
//           <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//             Connectify
//           </span>
//         </Link>
//       </div>

//       {/* User Profile */}
//       <div className="p-4 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <div className="w-10 h-10 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5">
//               <img
//                 src={currentUser?.profilePic ? `http://localhost:8800/uploads/posts/${currentUser.profilePic}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"}
//                 alt="Profile"
//                 className="w-full h-full rounded-full object-cover"
//               />
//             </div>
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-900 truncate">{currentUser?.name || "User"}</h3>
//             <p className="text-sm text-gray-500 truncate">@{currentUser?.username || "username"}</p>
//           </div>
//         </div>
//       </div>

//       {/* Weather Widget */}
//       {weather && (
//         <div className="p-4 border-b border-gray-100">
//           <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="font-semibold text-sm">Weather</h3>
//               <FontAwesomeIcon icon={faCloudSun} className="text-lg" />
//             </div>
//             <div className="text-2xl font-bold mb-1">{weather.temperature}</div>
//             <div className="text-sm opacity-90">{weather.condition}</div>
//             <div className="text-xs opacity-75 mt-1">{weather.location}</div>
//           </div>
//         </div>
//       )}
//       {!weather && weatherError && (
//         <div className="p-4 border-b border-gray-100">
//           <div className="bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl p-4 text-white">
//             <div className="font-semibold text-sm">Weather</div>
//             <div className="text-xs opacity-90 mt-1">{weatherError}</div>
//           </div>
//         </div>
//       )}

//       {/* Quick Polls */}
//       <div className="p-4 border-b border-gray-100">
//         <h3 className="font-semibold text-gray-900 mb-3">Quick Polls</h3>
//         <div className="space-y-3">
//           {quickPolls.slice(0, 2).map((poll) => (
//             <div 
//               key={poll.id}
//               onClick={() => handlePollClick(poll)}
//               className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
//             >
//               <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{poll.question}</h4>
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <span>{poll.totalVotes} votes</span>
//                 <span>{poll.timeLeft}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Who's Online */}
//       <div className="p-4 border-b border-gray-100">
//         <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
//           <FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs mr-2" />
//           Who&apos;s Online
//         </h3>
//         <div className="space-y-2">
//           {onlineFriends.slice(0, 3).map((friend) => (
//             <div key={friend.id} className="flex items-center space-x-2">
//               <div className="relative">
//                 <img
//                   src={friend.profilePic}
//                   alt={friend.name}
//                   className="w-6 h-6 rounded-full object-cover"
//                 />
//                 <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(friend.status)}`}></div>
//               </div>
//               <span className="text-sm text-gray-700 truncate">{friend.name}</span>
//             </div>
//           ))}
//           {onlineFriends.length > 3 && (
//             <div className="text-xs text-gray-500">
//               +{onlineFriends.length - 3} more online
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto py-4">
//         <nav className="space-y-1">
//           {menuItems.map((item) => (
//             <Link
//               key={item.id}
//               to={item.path}
//               className={`flex items-center justify-between px-4 py-3 mx-2 rounded-xl transition-all duration-200 group ${
//                 isActive(item.path)
//                   ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <FontAwesomeIcon 
//                   icon={item.icon} 
//                   className={`text-lg ${isActive(item.path) ? 'text-white' : 'text-gray-600 group-hover:text-purple-600'}`}
//                 />
//                 <span className="font-medium">{item.label}</span>
//               </div>
//               {item.badge && (
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   isActive(item.path) 
//                     ? 'bg-white/20 text-white' 
//                     : 'bg-purple-100 text-purple-600'
//                 }`}>
//                   {item.badge}
//                 </span>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* Daily News Section */}
//         <div className="mt-6 px-4">
//           <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
//             <FontAwesomeIcon icon={faNewspaper} className="text-blue-500 mr-2" />
//             Daily News
//           </h3>
//           <div className="space-y-3">
//             {dailyNews.slice(0, 3).map((news) => (
//               <div
//                 key={news.id}
//                 onClick={() => handleNewsClick(news)}
//                 className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-start space-x-3">
//                   <img
//                     src={news.image}
//                     alt={news.title}
//                     className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
//                       {news.title}
//                     </h4>
//                     <div className="flex items-center space-x-2 text-xs text-gray-500">
//                       <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
//                         {news.category}
//                       </span>
//                       <FontAwesomeIcon icon={faClock} />
//                       <span>{news.time}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <button
//               onClick={() => handleNewsClick(dailyNews[0])}
//               className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
//             >
//               View All News
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Menu */}
//       <div className="border-t border-gray-100 py-4">
//         <nav className="space-y-1">
//           {bottomMenuItems.map((item) => (
//             <div
//               key={item.id}
//               onClick={item.onClick}
//               className={`flex items-center justify-between px-4 py-3 mx-2 rounded-xl transition-all duration-200 cursor-pointer group ${
//                 item.onClick ? 'text-gray-700 hover:bg-gray-100' : ''
//               }`}
//             >
//               {item.onClick ? (
//                 <>
//                   <div className="flex items-center space-x-3">
//                     <FontAwesomeIcon 
//                       icon={item.icon} 
//                       className="text-lg text-gray-600 group-hover:text-red-600"
//                     />
//                     <span className="font-medium group-hover:text-red-600">{item.label}</span>
//                   </div>
//                 </>
//               ) : (
//                 <Link
//                   to={item.path}
//                   className="flex items-center justify-between w-full"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <FontAwesomeIcon 
//                       icon={item.icon} 
//                       className="text-lg text-gray-600 group-hover:text-purple-600"
//                     />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* News Modal */}
//       {showNewsModal && selectedNews && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-gray-900">Daily News</h2>
//                 <button
//                   onClick={() => setShowNewsModal(false)}
//                   className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
//                 >
//                   <FontAwesomeIcon icon={faSignOutAlt} className="text-gray-600" />
//                 </button>
//               </div>
              
//               <img
//                 src={selectedNews.image}
//                 alt={selectedNews.title}
//                 className="w-full h-48 object-cover rounded-lg mb-4"
//               />
              
//               <div className="flex items-center space-x-2 mb-3">
//                 <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
//                   {selectedNews.category}
//                 </span>
//                 <div className="flex items-center space-x-1 text-gray-500 text-sm">
//                   <FontAwesomeIcon icon={faClock} />
//                   <span>{selectedNews.time}</span>
//                 </div>
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 {selectedNews.title}
//               </h3>
              
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 {selectedNews.summary}
//               </p>
              
//               <div className="flex space-x-3">
//                 <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
//                   Read Full Article
//                 </button>
//                 <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
//                   Share
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poll Modal */}
//       {showPollModal && currentPoll && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">Quick Poll</h2>
//                 <button
//                   onClick={closePollModal}
//                   className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
//                 >
//                   <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">{currentPoll.question}</h3>
              
//               <div className="space-y-3 mb-4">
//                 {currentPoll.options.map((option) => {
//                   const percentage = (option.votes / currentPoll.totalVotes) * 100;
//                   const isVoted = pollVotes[currentPoll.id] === option.id;
                  
//                   return (
//                     <div key={option.id} className="relative">
//                       <button
//                         onClick={() => handlePollVote(currentPoll.id, option.id)}
//                         className={`w-full p-3 rounded-xl text-left transition-all ${
//                           isVoted 
//                             ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
//                             : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{option.text}</span>
//                           <span className="text-sm opacity-75">{option.votes} votes</span>
//                         </div>
//                         <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
//                           <div 
//                             className="h-full bg-white/40 rounded-full transition-all duration-300"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
              
//               <div className="text-center text-sm text-gray-500">
//                 <p>{currentPoll.totalVotes} total votes • {currentPoll.timeLeft}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leftbar;


import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faUser, 
  faUsers, 
  faCalendar, 
  faBookmark, 
  faCog, 
  faQuestionCircle,
  faSignOutAlt,
  faBell,
  faComments,
  faVideo,
  faImages,
  faNewspaper,
  faCloudSun,
  faClock,
  faCircle,
  faTimes,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Leftbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [showPollModal, setShowPollModal] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollVotes, setPollVotes] = useState({});

  // ✅ Real dynamic state
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [onlineFriendsLoading, setOnlineFriendsLoading] = useState(true);
  const [dailyNews, setDailyNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const weatherCodeMap = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Snow", 75: "Heavy snow",
    80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
    95: "Thunderstorm"
  };

  const quickPolls = [
    {
      id: 1,
      question: "What's your favorite social media platform?",
      options: [
        { id: 1, text: "Instagram", votes: 45 },
        { id: 2, text: "TikTok", votes: 32 },
        { id: 3, text: "Twitter", votes: 28 },
        { id: 4, text: "LinkedIn", votes: 15 }
      ],
      totalVotes: 120,
      timeLeft: "2 days left"
    },
    {
      id: 2,
      question: "Which programming language do you prefer?",
      options: [
        { id: 1, text: "JavaScript", votes: 38 },
        { id: 2, text: "Python", votes: 42 },
        { id: 3, text: "Java", votes: 25 },
        { id: 4, text: "C++", votes: 15 }
      ],
      totalVotes: 120,
      timeLeft: "1 day left"
    }
  ];

  // ✅ Fetch real online friends from Random User API (free, no key)
  useEffect(() => {
    const fetchOnlineFriends = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=5");
        const data = await response.json();
        const statuses = ["online", "online", "away", "online", "busy"];
        const friends = data.results.map((user, index) => ({
          id: index + 1,
          name: `${user.name.first} ${user.name.last}`,
          username: user.login.username,
          profilePic: user.picture.thumbnail,
          status: statuses[index],
        }));
        setOnlineFriends(friends);
      } catch (error) {
        console.error("Error fetching online friends:", error);
        // Fallback static data
        setOnlineFriends([
          { id: 1, name: "Sarah Johnson", username: "sarah_travels", profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face", status: "online" },
          { id: 2, name: "Mike Chen", username: "mike_photography", profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", status: "online" },
        ]);
      } finally {
        setOnlineFriendsLoading(false);
      }
    };
    fetchOnlineFriends();
  }, []);

  // ✅ Fetch real news from GNews API (free tier: 100 requests/day, no credit card)
  // Sign up at: https://gnews.io/ to get your free API key
  // Replace YOUR_GNEWS_API_KEY below with your actual key
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Option A: GNews API (free, 100/day) — replace key below
        const GNEWS_KEY = import.meta.env.VITE_GNEWS_API_KEY;

        if (GNEWS_KEY) {
          const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=5&apikey=${GNEWS_KEY}`
          );
          const data = await response.json();
          if (data.articles) {
            const articles = data.articles.map((article, index) => ({
              id: index + 1,
              title: article.title,
              summary: article.description || "Read more about this story...",
              category: "Technology",
              time: timeAgoFromDate(article.publishedAt),
              image: article.image || `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop`,
              url: article.url,
            }));
            setDailyNews(articles);
            setNewsLoading(false);
            return;
          }
        }

        // Option B: Fallback to static news if no API key yet
        throw new Error("No API key set");

      } catch (error) {
        console.log("Using fallback news data. Add VITE_GNEWS_API_KEY to .env for real news.");
        // ✅ Fallback static news so UI never breaks
        setDailyNews([
          {
            id: 1,
            title: "Tech Giants Announce Revolutionary AI Breakthrough",
            summary: "Major technology companies have unveiled a new AI system that promises to transform digital interaction.",
            category: "Technology",
            time: "2 hours ago",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
            url: "#"
          },
          {
            id: 2,
            title: "Global Climate Summit Reaches Historic Agreement",
            summary: "World leaders have agreed on ambitious new targets to combat climate change.",
            category: "Environment",
            time: "4 hours ago",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
            url: "#"
          },
          {
            id: 3,
            title: "SpaceX Successfully Launches New Satellite Constellation",
            summary: "Elon Musk's company has deployed another batch of satellites, expanding global internet coverage.",
            category: "Space",
            time: "6 hours ago",
            image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop",
            url: "#"
          },
          {
            id: 4,
            title: "Breakthrough in Renewable Energy Storage",
            summary: "Scientists develop new battery technology that could revolutionize clean energy storage.",
            category: "Science",
            time: "8 hours ago",
            image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop",
            url: "#"
          },
          {
            id: 5,
            title: "Major Sports League Announces Expansion Plans",
            summary: "The league revealed plans to add new teams and expand into international markets.",
            category: "Sports",
            time: "10 hours ago",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
            url: "#"
          }
        ]);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ✅ Real weather via Open-Meteo (completely free, no API key needed)
  useEffect(() => {
    const updateWeather = async (lat, lon) => {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
        );
        const weatherJson = await weatherRes.json();

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
          { headers: { "User-Agent": "Connectify-Social-App" } }
        );
        const geoJson = await geoRes.json();
        const city =
          geoJson?.address?.city ||
          geoJson?.address?.town ||
          geoJson?.address?.village ||
          geoJson?.address?.county ||
          "Your area";
        const state = geoJson?.address?.state || "";

        setWeather({
          location: state ? `${city}, ${state}` : city,
          temperature: `${Math.round(weatherJson.current.temperature_2m)}°C`,
          condition: weatherCodeMap[weatherJson.current.weather_code] || "Unknown",
          humidity: `${weatherJson.current.relative_humidity_2m}%`,
          wind: `${Math.round(weatherJson.current.wind_speed_10m)} km/h`,
        });
        setWeatherError("");
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeatherError("Weather unavailable");
      }
    };

    if (!navigator.geolocation) {
      setWeatherError("Geolocation unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => updateWeather(pos.coords.latitude, pos.coords.longitude),
      () => setWeatherError("Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Helper: convert ISO date to "X hours ago"
  const timeAgoFromDate = (dateString) => {
    if (!dateString) return "Recently";
    const now = new Date();
    const then = new Date(dateString);
    const diffHours = Math.floor((now - then) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const handleLogout = () => logout();
  const handleNewsClick = (news) => { setSelectedNews(news); setShowNewsModal(true); };
  const getStatusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "away") return "bg-yellow-500";
    if (status === "busy") return "bg-red-500";
    return "bg-gray-400";
  };
  const handlePollClick = (poll) => { setCurrentPoll(poll); setShowPollModal(true); };
  const handlePollVote = (pollId, optionId) => setPollVotes(prev => ({ ...prev, [pollId]: optionId }));
  const closePollModal = () => { setShowPollModal(false); setCurrentPoll(null); };

  const menuItems = [
    { id: "home", label: "Home", icon: faHome, path: "/", badge: null },
    { id: "profile", label: "Profile", icon: faUser, path: `/profile/${currentUser?.id}`, badge: null },
    { id: "friends", label: "Friends", icon: faUsers, path: "/friends", badge: "3" },
    { id: "events", label: "Events", icon: faCalendar, path: "/events", badge: "5" },
    { id: "saved", label: "Saved", icon: faBookmark, path: "/saved", badge: null },
    { id: "notifications", label: "Notifications", icon: faBell, path: "/notifications", badge: "12" },
    { id: "messages", label: "Messages", icon: faComments, path: "/messages", badge: "2" },
    { id: "videos", label: "Videos", icon: faVideo, path: "/videos", badge: null },
    { id: "photos", label: "Photos", icon: faImages, path: "/photos", badge: null }
  ];

  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: faCog, path: "/settings" },
    { id: "help", label: "Help & Support", icon: faQuestionCircle, path: "/help" },
    { id: "logout", label: "Logout", icon: faSignOutAlt, path: null, onClick: handleLogout }
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
<div className="flex flex-col bg-white border-r border-gray-200 w-64">      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Connectify
          </span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={currentUser?.profilePic
                ? `http://localhost:8800/uploads/posts/${currentUser.profilePic}`
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-300"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{currentUser?.name || "User"}</h3>
            <p className="text-sm text-gray-500 truncate">@{currentUser?.username || "username"}</p>
          </div>
        </div>
      </div>

      {/* ✅ Real Weather Widget — Open-Meteo (no API key needed) */}
      {weather && (
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Weather</h3>
              <FontAwesomeIcon icon={faCloudSun} className="text-lg" />
            </div>
            <div className="text-2xl font-bold mb-1">{weather.temperature}</div>
            <div className="text-sm opacity-90">{weather.condition}</div>
            <div className="text-xs opacity-75 mt-1">{weather.location}</div>
            <div className="flex space-x-3 mt-2 text-xs opacity-75">
              <span>💧 {weather.humidity}</span>
              <span>💨 {weather.wind}</span>
            </div>
          </div>
        </div>
      )}
      {!weather && weatherError && (
        <div className="p-4 border-b border-gray-100">
          <div className="bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl p-4 text-white">
            <div className="font-semibold text-sm">Weather</div>
            <div className="text-xs opacity-90 mt-1">{weatherError}</div>
          </div>
        </div>
      )}

      {/* Quick Polls */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Polls</h3>
        <div className="space-y-3">
          {quickPolls.map((poll) => (
            <div
              key={poll.id}
              onClick={() => handlePollClick(poll)}
              className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{poll.question}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{poll.totalVotes} votes</span>
                <span>{poll.timeLeft}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Who's Online — powered by randomuser.me */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs mr-2" />
          Who&apos;s Online
        </h3>
        {onlineFriendsLoading ? (
          <div className="flex items-center text-gray-400 text-sm py-2">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Loading...
          </div>
        ) : (
          <div className="space-y-2">
            {onlineFriends.slice(0, 3).map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <div className="relative">
                  <img src={friend.profilePic} alt={friend.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(friend.status)}`}></div>
                </div>
                <span className="text-sm text-gray-700 truncate">{friend.name}</span>
              </div>
            ))}
            {onlineFriends.length > 3 && (
              <div className="text-xs text-gray-500">+{onlineFriends.length - 3} more online</div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
    <div className="py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 mx-2 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-lg ${isActive(item.path) ? "text-white" : "text-gray-600 group-hover:text-purple-600"}`}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${isActive(item.path) ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* ✅ Daily News — GNews API with fallback */}
        <div className="mt-6 px-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FontAwesomeIcon icon={faNewspaper} className="text-blue-500 mr-2" />
            Daily News
          </h3>
          {newsLoading ? (
            <div className="flex items-center text-gray-400 text-sm py-2">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Loading news...
            </div>
          ) : (
            <div className="space-y-3">
              {dailyNews.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  onClick={() => handleNewsClick(news)}
                  className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <img src={news.image} alt={news.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{news.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{news.category}</span>
                        <FontAwesomeIcon icon={faClock} />
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleNewsClick(dailyNews[0])}
                className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All News
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-gray-100 py-4">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className="flex items-center justify-between px-4 py-3 mx-2 rounded-xl transition-all duration-200 cursor-pointer group text-gray-700 hover:bg-gray-100"
            >
              {item.onClick ? (
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={item.icon} className="text-lg text-gray-600 group-hover:text-red-600" />
                  <span className="font-medium group-hover:text-red-600">{item.label}</span>
                </div>
              ) : (
                <Link to={item.path} className="flex items-center space-x-3 w-full">
                  <FontAwesomeIcon icon={item.icon} className="text-lg text-gray-600 group-hover:text-purple-600" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* News Modal */}
      {showNewsModal && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Daily News</h2>
                <button
                  onClick={() => setShowNewsModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>
              <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{selectedNews.category}</span>
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{selectedNews.time}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedNews.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{selectedNews.summary}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => selectedNews.url !== "#" && window.open(selectedNews.url, "_blank")}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Read Full Article
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poll Modal */}
      {showPollModal && currentPoll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Quick Poll</h2>
                <button onClick={closePollModal} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{currentPoll.question}</h3>
              <div className="space-y-3 mb-4">
                {currentPoll.options.map((option) => {
                  const percentage = (option.votes / currentPoll.totalVotes) * 100;
                  const isVoted = pollVotes[currentPoll.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePollVote(currentPoll.id, option.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        isVoted ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm opacity-75">{option.votes} votes</span>
                      </div>
                      <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-white/40 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="text-center text-sm text-gray-500">
                <p>{currentPoll.totalVotes} total votes • {currentPoll.timeLeft}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leftbar;
