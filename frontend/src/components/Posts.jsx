/* eslint-disable react/prop-types */
import { makeRequest } from "../axios";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Posts = ({ userId }) => {
  const params = useParams();
  const targetUserId = userId || params.id;

  const { isPending, error, data } = useQuery({
    queryKey: ['posts', targetUserId],
    queryFn: () =>
      makeRequest.get(`/posts${targetUserId ? `?userId=${targetUserId}` : ''}`).then((res) => {
        return res.data;
      }),
    retry: 1,
    retryDelay: 1000,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-2">Failed to load posts</div>
        <div className="text-gray-500">Please try refreshing the page</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📷</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-500">
          {targetUserId ? "This user hasn't posted anything yet." : "Start sharing your moments!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;