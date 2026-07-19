import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Post from "../components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faHashtag, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const Explore = () => {
  const [activeHashtag, setActiveHashtag] = useState(null);

  const {
    data: hashtags = [],
    isPending: hashtagsPending,
  } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: () => makeRequest.get("/posts/hashtags/trending").then((res) => res.data),
  });

  const {
    data: posts = [],
    isPending: postsPending,
    error: postsError,
  } = useQuery({
    queryKey: ["explore-posts", activeHashtag],
    queryFn: () => {
      const endpoint = activeHashtag
        ? `/posts/filter?hashtag=${encodeURIComponent(activeHashtag)}`
        : "/posts/explore";
      return makeRequest.get(endpoint).then((res) => res.data);
    },
  });

  const stats = useMemo(() => {
    const totalLikes = posts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + Number(post.comments || 0), 0);
    return {
      posts: posts.length,
      totalLikes,
      totalComments,
    };
  }, [posts]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-700 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
              <FontAwesomeIcon icon={faCompass} />
              <span>Explore + Hashtag System</span>
            </div>
            <h1 className="text-3xl font-semibold">Discover posts outside your circle</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Browse random discoverability picks or switch into hashtag mode to inspect what the community is talking about right now.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-white/60">Posts</p>
              <p className="mt-1 text-xl font-semibold">{stats.posts}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-white/60">Likes</p>
              <p className="mt-1 text-xl font-semibold">{stats.totalLikes}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-white/60">Comments</p>
              <p className="mt-1 text-xl font-semibold">{stats.totalComments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
              <FontAwesomeIcon icon={faHashtag} />
              <span>Trending Hashtags</span>
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Tap a hashtag to refocus the feed</h2>
          </div>
          {activeHashtag ? (
            <button
              type="button"
              onClick={() => setActiveHashtag(null)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Clear filter
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {hashtagsPending ? (
            <p className="text-sm text-slate-400">Loading hashtags...</p>
          ) : (
            hashtags.map((tag) => (
              <button
                key={tag.hashtag}
                type="button"
                onClick={() => setActiveHashtag(tag.hashtag)}
                className={`rounded-full border px-4 py-2 text-left transition ${
                  activeHashtag === tag.hashtag
                    ? "border-transparent bg-slate-950 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="font-semibold">#{tag.hashtag}</div>
                <div className={`text-xs ${activeHashtag === tag.hashtag ? "text-white/70" : "text-slate-500"}`}>
                  {tag.postCount} posts · {tag.userCount} creators
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-600">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="text-cyan-600" />
        <span>{activeHashtag ? `Showing posts for #${activeHashtag}` : "Showing explore recommendations"}</span>
      </div>

      <div className="mt-4">
        {postsPending ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm">
            Loading explore feed...
          </div>
        ) : postsError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-600 shadow-sm">
            Could not load explore posts.
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">No posts found</h3>
            <p className="mt-2 text-sm text-slate-500">Try another hashtag or clear the filter to go back to explore mode.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
