import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBookmark,
  faCircle,
  faClock,
  faCloudSun,
  faComments,
  faCompass,
  faHome,
  faNewspaper,
  faSignOutAlt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { getProfileUrl } from "../utils/config";

const fallbackNews = [
  {
    id: 1,
    title: "Creators are leaning into community-first storytelling",
    summary: "Audience participation is becoming a key differentiator for social products.",
    category: "Culture",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop",
    url: "#",
  },
  {
    id: 2,
    title: "Short-form video keeps reshaping discovery",
    summary: "Platforms are rewarding quick loops, remixability, and clear hooks.",
    category: "Media",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop",
    url: "#",
  },
];

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  61: "Rain",
  71: "Snow",
  80: "Showers",
  95: "Thunderstorm",
};

const timeAgoFromDate = (dateString) => {
  if (!dateString) return "Recently";
  const diffHours = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

const statusColor = (index) => (index % 3 === 0 ? "bg-amber-400" : "bg-emerald-500");

const Leftbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [news, setNews] = useState([]);

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: () => makeRequest.get("/relationships/friends").then((res) => res.data),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => makeRequest.get("/notifications").then((res) => res.data),
  });

  const { data: savedPosts = [] } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: () => makeRequest.get("/posts/saved").then((res) => res.data),
  });

  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const unreadNotifications = notifications.filter((item) => !item.read);

  useEffect(() => {
    const gnewsKey = import.meta.env.VITE_GNEWS_API_KEY;
    if (!gnewsKey) {
      setNews(fallbackNews);
      return;
    }

    fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=3&apikey=${gnewsKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.articles) throw new Error("Missing articles");
        setNews(
          data.articles.map((article, index) => ({
            id: index + 1,
            title: article.title,
            summary: article.description || "Read more about this story.",
            category: "Technology",
            time: timeAgoFromDate(article.publishedAt),
            image: article.image || fallbackNews[0].image,
            url: article.url,
          }))
        );
      })
      .catch(() => setNews(fallbackNews));

    if (!navigator.geolocation) {
      setWeatherError("Geolocation unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
          );
          const weatherJson = await weatherRes.json();
          setWeather({
            location: "Your area",
            temperature: `${Math.round(weatherJson.current.temperature_2m)}°F`,
            condition: weatherCodeMap[weatherJson.current.weather_code] || "Unknown",
            humidity: `${weatherJson.current.relative_humidity_2m}%`,
            wind: `${Math.round(weatherJson.current.wind_speed_10m)} mph`,
          });
        } catch (err) {
          console.error(err);
          setWeatherError("Weather unavailable");
        }
      },
      () => setWeatherError("Location permission denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const menuItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: faHome, path: "/", badge: null },
      { id: "profile", label: "Profile", icon: faUser, path: `/profile/${currentUser?.id}`, badge: null },
      { id: "explore", label: "Explore", icon: faCompass, path: "/explore", badge: null },
    ],
    [currentUser?.id]
  );

  const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <div className="flex h-full w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-950 p-6 text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
            <span className="text-lg font-bold">S</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">SocialPulse</p>
            <p className="text-lg font-semibold">Community Panel</p>
          </div>
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center gap-3">
            <img src={getProfileUrl(currentUser?.profilePic)} alt="Profile" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/25" />
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{currentUser?.name || "User"}</h3>
              <p className="truncate text-sm text-white/65">@{currentUser?.username || "username"}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-2xl bg-white/10 px-3 py-2">
              <p className="text-white/55">Friends</p>
              <p className="font-semibold">{friends.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2">
              <p className="text-white/55">Saved</p>
              <p className="font-semibold">{savedPosts.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-3 py-2">
              <p className="text-white/55">Stories</p>
              <p className="font-semibold">{stories.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <nav className="space-y-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition ${isActive(item.path) ? "bg-slate-950 text-white shadow-lg" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={item.icon} className={isActive(item.path) ? "text-white" : "text-slate-400"} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {weather ? (
          <section className="rounded-3xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-600 p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Weather sync</p>
                <h3 className="mt-1 font-semibold">{weather.location}</h3>
              </div>
              <FontAwesomeIcon icon={faCloudSun} className="text-xl text-white/80" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold">{weather.temperature}</p>
                <p className="text-sm text-white/80">{weather.condition}</p>
              </div>
              <div className="text-right text-xs text-white/80">
                <p>Humidity {weather.humidity}</p>
                <p>Wind {weather.wind}</p>
              </div>
            </div>
          </section>
        ) : weatherError ? (
          <section className="rounded-3xl bg-slate-900 p-4 text-white">
            <p className="text-sm font-medium">Weather sync</p>
            <p className="mt-1 text-sm text-white/65">{weatherError}</p>
          </section>
        ) : null}

        <section className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <FontAwesomeIcon icon={faUsers} className="text-slate-400" />
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Friends</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{friends.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <FontAwesomeIcon icon={faBookmark} className="text-slate-400" />
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Saved</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{savedPosts.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <FontAwesomeIcon icon={faBell} className="text-slate-400" />
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Alerts</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{unreadNotifications.length}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center font-semibold text-slate-900">
            <FontAwesomeIcon icon={faCircle} className="mr-2 text-[10px] text-emerald-500" />
            Your Friends
          </h3>
          <div className="space-y-3">
            {friends.length ? (
              friends.slice(0, 6).map((friend, index) => (
                <Link key={friend.id} to={`/profile/${friend.id}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50">
                  <div className="relative">
                    <img src={getProfileUrl(friend.profilePic)} alt={friend.name} className="h-10 w-10 rounded-2xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${statusColor(index)}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{friend.name}</p>
                    <p className="truncate text-xs text-slate-500">@{friend.username}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400">Follow people to build your sidebar network.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center font-semibold text-slate-900">
            <FontAwesomeIcon icon={faNewspaper} className="mr-2 text-sky-500" />
            Daily News
          </h3>
          <div className="space-y-3">
            {news.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedNews(item)} className="flex w-full items-start gap-3 rounded-2xl bg-slate-50 p-3 text-left transition hover:bg-slate-100">
                <img src={item.image} alt={item.title} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-slate-900">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700">{item.category}</span>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center font-semibold text-slate-900">
            <FontAwesomeIcon icon={faComments} className="mr-2 text-sky-500" />
            Live Alerts
          </h3>
          <div className="space-y-3">
            {notifications.length ? (
              notifications.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAlert(item)}
                  className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${item.read ? "bg-slate-50 hover:bg-slate-100" : "bg-fuchsia-50 hover:bg-fuchsia-100"}`}
                >
                  <img src={getProfileUrl(item.fromUser?.profilePic)} alt={item.fromUser?.username} className="h-10 w-10 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{item.fromUser?.username || "Someone"}</span> {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{item.time || timeAgoFromDate(item.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-400">New likes, follows, and comments will appear here.</p>
            )}
          </div>
        </section>

        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-600">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {selectedAlert ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="flex items-center gap-4">
              <img src={getProfileUrl(selectedAlert.fromUser?.profilePic)} alt={selectedAlert.fromUser?.username} className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedAlert.fromUser?.name || selectedAlert.fromUser?.username}</h2>
                <p className="text-sm text-slate-500">@{selectedAlert.fromUser?.username}</p>
              </div>
            </div>
            <p className="mt-5 text-slate-700">{selectedAlert.message}</p>
            <p className="mt-2 text-sm text-slate-400">{selectedAlert.time || timeAgoFromDate(selectedAlert.createdAt)}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setSelectedAlert(null)} className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedNews ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Daily News</h2>
              <button type="button" onClick={() => setSelectedNews(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                ×
              </button>
            </div>
            <img src={selectedNews.image} alt={selectedNews.title} className="h-56 w-full rounded-3xl object-cover" />
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">{selectedNews.title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{selectedNews.summary}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => selectedNews.url !== "#" && window.open(selectedNews.url, "_blank")} className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-white">
                Read Full Article
              </button>
              <button type="button" onClick={() => setSelectedNews(null)} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-slate-700">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Leftbar;
