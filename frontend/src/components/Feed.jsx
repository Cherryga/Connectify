import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faMagnifyingGlass,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { makeRequest } from "../axios";
import Post from "./Post";

const PAGE_SIZE = 5;

const fakeCreators = [
  { id: "fake-user-1", name: "Mia Carter", username: "miavibes", profilePic: "https://i.pravatar.cc/150?img=32" },
  { id: "fake-user-2", name: "Noah Blake", username: "noahonfilm", profilePic: "https://i.pravatar.cc/150?img=12" },
  { id: "fake-user-3", name: "Aarav Shah", username: "aarav.daily", profilePic: "https://i.pravatar.cc/150?img=15" },
  { id: "fake-user-4", name: "Zara Reed", username: "zarastudio", profilePic: "https://i.pravatar.cc/150?img=25" },
];

const fakeCaptions = [
  "Late night city lights and a playlist that fixes everything.",
  "Small progress still counts. Showing up again tomorrow.",
  "This corner cafe has somehow become my whole personality.",
  "Tried a new edit style today and honestly it feels cleaner.",
  "If this post reaches you, drink water and keep building.",
  "Weekend dump. Coffee, code, sunset, repeat.",
  "One of those days where the sky looked fake.",
  "Posting this because the colors felt too good to waste.",
];

const buildFakePost = (index) => {
  const creator = fakeCreators[index % fakeCreators.length];
  return {
    id: `fake-post-${index}`,
    type: "fake",
    name: creator.name,
    username: creator.username,
    profilePic: creator.profilePic,
    desc: fakeCaptions[index % fakeCaptions.length],
    img: `https://picsum.photos/seed/socialpulse-${index}/900/900`,
    likes: 120 + index * 17,
    comments: 12 + (index % 7) * 4,
    saves: 8 + (index % 5) * 3,
    createdAt: new Date(Date.now() - (index + 1) * 45 * 60 * 1000).toISOString(),
  };
};

const mixPosts = (realPosts, count) => {
  const mixed = [];
  const fakePosts = Array.from({ length: count }, (_, index) => buildFakePost(index));

  realPosts.forEach((post, index) => {
    mixed.push({ ...post, type: "real" });

    const firstFake = fakePosts[index * 2];
    const secondFake = fakePosts[index * 2 + 1];

    if (firstFake) mixed.push(firstFake);
    if (secondFake && index % 2 === 0) mixed.push(secondFake);
  });

  if (!realPosts.length) {
    return fakePosts;
  }

  return mixed.concat(fakePosts.slice(realPosts.length * 2));
};

const FeedSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div key={item} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
        <div className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
        </div>
        <div className="h-72 bg-gray-200" />
      </div>
    ))}
  </div>
);

const FakePostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src={post.profilePic} alt={post.name} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">{post.name}</h3>
            <p className="text-sm text-gray-500">@{post.username}</p>
          </div>
        </div>
        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-600">Suggested</span>
      </div>

      <img src={post.img} alt="Suggested content" className="w-full max-h-[520px] object-cover" />

      <div className="p-4">
        <p className="leading-relaxed text-gray-900">{post.desc}</p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked((value) => !value)} className={`inline-flex items-center gap-2 ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}>
              <FontAwesomeIcon icon={faHeart} />
              <span>{post.likes + (liked ? 1 : 0)}</span>
            </button>

            <div className="inline-flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={faComment} />
              <span>{post.comments}</span>
            </div>
          </div>

          <button onClick={() => setSaved((value) => !value)} className={`inline-flex items-center gap-2 ${saved ? "text-blue-500" : "text-gray-600 hover:text-blue-500"}`}>
            <FontAwesomeIcon icon={faBookmark} />
            <span>{post.saves + (saved ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

const Feed = () => {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", "following"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      makeRequest.get(`/posts?page=${pageParam}&limit=${PAGE_SIZE}`).then((res) => res.data),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length + 1 : undefined,
  });

  const allPosts = (data?.pages || []).flatMap((page) => page);
  const postMap = new Map();
  allPosts.forEach((post) => postMap.set(post.id, post));
  const realPosts = Array.from(postMap.values());
  const mixedFeed = mixPosts(realPosts, displayCount + 18);
  const value = searchTerm.trim().toLowerCase();

  const filteredFeed = value
    ? mixedFeed.filter((post) =>
        [post.desc, post.username, post.name].filter(Boolean).join(" ").toLowerCase().includes(value)
      )
    : mixedFeed;

  const visibleFeed = filteredFeed.slice(0, displayCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
        if (entries[0].isIntersecting) {
          setDisplayCount((current) => current + 8);
        }
      },
      { rootMargin: "160px 0px", threshold: 0.1 }
    );

    const element = loadMoreRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await makeRequest.get("/posts?page=1&limit=1");
        const latestIncoming = response.data?.[0];
        const latestKnown = realPosts[0];

        if (latestIncoming && latestKnown && latestIncoming.id !== latestKnown.id) {
          setNewPostsAvailable(true);
        }
      } catch (pollError) {
        console.warn("Feed refresh check failed", pollError);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [realPosts]);

  const handleRefresh = async () => {
    setNewPostsAvailable(false);
    setDisplayCount(12);
    await queryClient.invalidateQueries({ queryKey: ["feed"] });
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  if (isPending) return <FeedSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
        <p className="font-medium text-red-600">Could not load the feed.</p>
        <button onClick={handleRefresh} className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
          <FontAwesomeIcon icon={faRefresh} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {newPostsAvailable ? (
        <div className="sticky top-4 z-30 flex justify-center">
          <button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-blue-700">
            <FontAwesomeIcon icon={faRefresh} />
            Show new posts
          </button>
        </div>
      ) : null}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your feed</h2>
            <p className="mt-1 text-sm text-gray-500">Real uploaded posts mixed with suggested cards so the feed keeps moving like Instagram.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">Real posts</div>
              <div className="text-lg font-semibold text-gray-900">{realPosts.length}</div>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-gray-500">Visible cards</div>
              <div className="text-lg font-semibold text-gray-900">{visibleFeed.length}</div>
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search captions or usernames"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {visibleFeed.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No posts match this search</h3>
          <p className="mt-2 text-sm text-gray-500">Try another keyword and the mixed feed will show again.</p>
        </div>
      ) : (
        visibleFeed.map((item) =>
          item.type === "fake" ? <FakePostCard key={item.id} post={item} /> : <Post key={item.id} post={item} />
        )
      )}

      <div ref={loadMoreRef} className="flex justify-center py-6">
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            <span className="text-sm">Loading more real posts...</span>
          </div>
        ) : (
          <div className="text-xs text-gray-300">
            {visibleFeed.length < filteredFeed.length || hasNextPage ? "Scroll for more" : "You are caught up for now"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
