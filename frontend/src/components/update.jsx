import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCamera, faImage } from "@fortawesome/free-solid-svg-icons";

const Update = ({ setOpenUpdate, user }) => {
  const [profile, setProfile] = useState(null);
  const [cover, setCover] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [info, setInfo] = useState({
    username: user?.username || "",
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    instagram: user?.instagramProfile || "",
    website: user?.website || "",
  });

  useEffect(() => {
    if (user) {
      setInfo({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        instagram: user.instagramProfile || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
      throw new Error("Failed to upload file");
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userData) => makeRequest.put('/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setOpenUpdate(false);
      setIsLoading(false);
    },
    onError: (err) => {
      setError("Failed to update profile. Please try again.");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let coverUrl = user.coverPic;
      let profileUrl = user.profilePic;

      if (cover) {
        coverUrl = await upload(cover);
      }
      if (profile) {
        profileUrl = await upload(profile);
      }

      mutation.mutate({
        ...info,
        coverPic: coverUrl,
        profilePic: profileUrl,
      });
    } catch (err) {
      setError("Failed to upload files. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-purple-100">Update your profile information</p>
            </div>
            <button
              onClick={() => setOpenUpdate(false)}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mx-auto">
                    <img
                      src={
                        profile
                          ? URL.createObjectURL(profile)
                          : user?.profilePic
                          ? `http://localhost:8800/uploads/posts/${user.profilePic}`
                          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Cover Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Picture
                </label>
                <div className="relative">
                  <div className="w-full h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={
                        cover
                          ? URL.createObjectURL(cover)
                          : user?.coverPic
                          ? `http://localhost:8800/uploads/posts/${user.coverPic}`
                          : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=100&fit=crop"
                      }
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faImage} className="text-white text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCover(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={info.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={info.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={info.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={info.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={info.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setOpenUpdate(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

Update.propTypes = {
  setOpenUpdate: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Update;
