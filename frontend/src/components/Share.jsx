import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaperPlane, faVideo, faSmile, faMapMarkerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [isStory, setIsStory] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log("Upload error:", err);
      throw new Error("Failed to upload file");
    }
  };

  const queryClient = useQueryClient();

  // Post mutation
  const postMutation = useMutation({
    mutationFn: (newPost) => makeRequest.post('/posts', newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setFile(null);
      setDesc("");
      setError("");
    },
    onError: (err) => {
      console.log("Post error:", err);
      setError("Failed to create post. Please try again.");
    },
  });

  // Story mutation
  const storyMutation = useMutation({
    mutationFn: (newStory) => makeRequest.post('/stories', newStory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      setFile(null);
      setShowStoryModal(false);
      setError("");
    },
    onError: (err) => {
      console.log("Story error:", err);
      setError("Failed to create story. Please try again.");
    },
  });

  const handleShare = async (e) => {
    e.preventDefault();
    if (!file && !desc) {
      setError("Please add some content or an image to share.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let imgUrl = "";
      if (file) {
        imgUrl = await upload();
      }
      
      if (isStory) {
        await storyMutation.mutateAsync({ img: imgUrl, caption: desc });
      } else {
        await postMutation.mutateAsync({ desc, img: imgUrl });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      if (isStory) {
        setShowStoryModal(true);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-full ring-2 ring-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-0.5">
              <img 
                alt="Profile" 
                src={
                  currentUser?.profilePic 
                    ? `http://localhost:8800/uploads/posts/${currentUser.profilePic}` 
                    : "http://localhost:8800/default/default_profile.png"
                } 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{currentUser?.name || "User"}</div>
            <div className="text-sm text-gray-500">@{currentUser?.username || "username"}</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Post Type Toggle */}
        <div className="flex space-x-2 mb-6">
          <button
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              !isStory 
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsStory(false)}
          >
            Post
          </button>
          <button
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isStory 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsStory(true)}
          >
            Story
          </button>
        </div>

        {/* Content Input */}
        <textarea
          type="text"
          placeholder={isStory ? "Add a caption to your story..." : `What's on your mind, ${currentUser?.name || "User"}?`}
          className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-6">
            {/* Image Upload */}
            <label className="flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-all duration-200 hover:scale-105">
              <FontAwesomeIcon icon={faImage} className="text-xl" />
              <span className="text-sm font-medium">Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Video Upload */}
            <label className="flex items-center space-x-2 cursor-pointer text-green-500 hover:text-green-600 transition-all duration-200 hover:scale-105">
              <FontAwesomeIcon icon={faVideo} className="text-xl" />
              <span className="text-sm font-medium">Video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Feeling */}
            <button className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-600 transition-all duration-200 hover:scale-105">
              <FontAwesomeIcon icon={faSmile} className="text-xl" />
              <span className="text-sm font-medium">Feeling</span>
            </button>

            {/* Location */}
            <button className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-all duration-200 hover:scale-105">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
              <span className="text-sm font-medium">Location</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              (!file && !desc) || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : isStory 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            }`}
            onClick={handleShare}
            disabled={(!file && !desc) || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sharing...</span>
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                {isStory ? "Share Story" : "Share Post"}
              </>
            )}
          </button>
        </div>

        {/* Preview */}
        {file && (
          <div className="mt-6">
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="max-w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <button
                onClick={() => setFile(null)}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create Story</h3>
              <button
                onClick={() => setShowStoryModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
              </button>
            </div>
            <textarea
              placeholder="Add a caption to your story..."
              className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStoryModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={!file}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all font-medium"
              >
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Share;

