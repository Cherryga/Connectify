import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faChevronLeft,
  faChevronRight,
  faClock,
  faComment,
  faHeart,
  faShare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { makeRequest } from "../axios";
import { getMediaUrl, getProfileUrl } from "../utils/config";

const fakeStoryUsers = [
  { id: "fake-story-1", username: "sarah_travels", name: "Sarah Johnson", profilePic: "https://i.pravatar.cc/150?img=1", location: "Maldives" },
  { id: "fake-story-2", username: "mike_photography", name: "Mike Chen", profilePic: "https://i.pravatar.cc/150?img=3", location: "Studio" },
  { id: "fake-story-3", username: "emma_fitness", name: "Emma Davis", profilePic: "https://i.pravatar.cc/150?img=5", location: "Gym" },
  { id: "fake-story-4", username: "alex_tech", name: "Alex Thompson", profilePic: "https://i.pravatar.cc/150?img=7", location: "Tech Hub" },
];

const buildFakeStories = () =>
  fakeStoryUsers.map((user, index) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    profilePic: user.profilePic,
    createdAt: new Date(Date.now() - (index + 2) * 60 * 60 * 1000).toISOString(),
    storyUrl: `https://picsum.photos/seed/socialpulse-story-${index}/500/900`,
    profileUrl: user.profilePic,
    location: user.location,
    fake: true,
  }));

const formatTimeAgo = (dateString) => {
  const storyDate = new Date(dateString);
  const diffInHours = Math.floor((Date.now() - storyDate) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
};

const Stories = () => {
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [likedStories, setLikedStories] = useState(new Set());
  const [savedStories, setSavedStories] = useState(new Set());

  const { isPending, error, data = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const stories = useMemo(() => {
    const realStories = data.map((story) => ({
      ...story,
      profileUrl: getProfileUrl(story.profilePic),
      storyUrl: getMediaUrl(story.img),
      fake: false,
    }));

    return [...realStories, ...buildFakeStories()];
  }, [data]);

  const selectedStory = stories[selectedStoryIndex];

  const handleLike = (storyId) => {
    setLikedStories((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) next.delete(storyId);
      else next.add(storyId);
      return next;
    });
  };

  const handleSave = (storyId) => {
    setSavedStories((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) next.delete(storyId);
      else next.add(storyId);
      return next;
    });
  };

  const closeViewer = () => {
    setShowStoryViewer(false);
    setSelectedStoryIndex(0);
  };

  const showNextStory = () => {
    if (selectedStoryIndex >= stories.length - 1) {
      closeViewer();
      return;
    }
    setSelectedStoryIndex((current) => current + 1);
  };

  const showPrevStory = () => {
    if (selectedStoryIndex <= 0) return;
    setSelectedStoryIndex((current) => current - 1);
  };

  if (isPending) {
    return (
      <div className="mb-6 flex h-32 items-center justify-center rounded-2xl bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-red-200 bg-white p-6 text-center">
        <div className="mb-2 text-lg text-red-500">Failed to load stories</div>
        <div className="text-gray-500">Please refresh after the API server is running.</div>
      </div>
    );
  }

  return (
    <div className="relative mb-6">
      <div className="flex space-x-4 overflow-x-auto rounded-2xl bg-white p-4 shadow-sm scrollbar-hide">
        {stories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            onClick={() => {
              setSelectedStoryIndex(index);
              setShowStoryViewer(true);
            }}
            className="flex flex-shrink-0 flex-col items-center"
          >
            <div className={`h-20 w-20 overflow-hidden rounded-full p-0.5 ring-4 ${story.fake ? "ring-orange-400" : "ring-blue-400"}`}>
              <img src={story.storyUrl} alt={story.name || story.username} className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="mt-2 text-center">
              <p className="w-20 truncate text-xs font-medium text-gray-900">{story.name || story.username}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(story.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>

      {showStoryViewer && selectedStory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative h-full w-full max-w-md">
            <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedStory.profileUrl} alt={selectedStory.name || selectedStory.username} className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                  <div className="text-white">
                    <h3 className="font-semibold">{selectedStory.name || selectedStory.username}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatTimeAgo(selectedStory.createdAt)}</span>
                      {selectedStory.location ? <span>• {selectedStory.location}</span> : null}
                    </div>
                  </div>
                </div>
                <button onClick={closeViewer} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>

            <img src={selectedStory.storyUrl} alt="Story" className="h-full w-full object-cover" />

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(selectedStory.id)} className={`flex h-10 w-10 items-center justify-center rounded-full ${likedStories.has(selectedStory.id) ? "bg-red-500 text-white" : "bg-white/20 text-white"}`}>
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
                <button onClick={() => handleSave(selectedStory.id)} className={`flex h-10 w-10 items-center justify-center rounded-full ${savedStories.has(selectedStory.id) ? "bg-yellow-500 text-white" : "bg-white/20 text-white"}`}>
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
              </div>
            </div>

            <button onClick={showPrevStory} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button onClick={showNextStory} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Stories;
