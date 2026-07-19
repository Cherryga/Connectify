export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8800";

export const getMediaUrl = (path, fallback = "/default/default_profile.png") => {
  if (!path) {
    return path === "" ? `${API_BASE_URL}${fallback}` : fallback.startsWith("http") ? fallback : `${API_BASE_URL}${fallback}`;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/uploads/posts/${path}`;
};

export const getProfileUrl = (profilePic) => getMediaUrl(profilePic, "/default/default_profile.png");
