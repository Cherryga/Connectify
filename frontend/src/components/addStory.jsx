import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from 'prop-types';

const AddStory = ({ setAddStory }) => {
  AddStory.propTypes = {
    setAddStory: PropTypes.func.isRequired,
  };
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const storyMutation = useMutation({
    mutationFn: (newStory) => makeRequest.post('/stories', newStory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      setAddStory(false);
      setFile(null);
      setCaption("");
    },
  });

  const handleShare = async (e) => {
    e.preventDefault();
    if (!file) return;

    let imgUrl = await upload();
    storyMutation.mutate({ img: imgUrl, caption });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Create Story</h3>
          <button
            onClick={() => setAddStory(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4">
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photo or Video
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setFile(null)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faImage} className="text-gray-400 text-xl" />
                    </div>
                  </div>
                  <p className="text-gray-500 mb-4">Drag and drop your file here, or click to browse</p>
                  <div className="flex space-x-2 justify-center">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                      <FontAwesomeIcon icon={faImage} />
                      <span>Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <label className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
                      <FontAwesomeIcon icon={faVideo} />
                      <span>Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption (optional)
            </label>
            <textarea
              placeholder="Add a caption to your story..."
              className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setAddStory(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              disabled={!file}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                !file
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              Share Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStory;
