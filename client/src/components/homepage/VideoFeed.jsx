import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import d from "../../assets/icons/Vector2.png";
import e from "../../assets/icons/stream-icon.svg";
import { FaHeart, FaComment } from "react-icons/fa";
import {useVideoPosts} from "../../../Hooks/videoPosts/useCreateVideo";

const VideoFeed = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { loading, error, posts, pagination } = useVideoPosts(page, limit);
  const navigate = useNavigate();

  // State to track thumbnail loading
  const [thumbnailLoading, setThumbnailLoading] = useState({});

  // Extract video thumbnail
  const generateThumbnail = (videoUrl, postId) => {
    setThumbnailLoading((prev) => ({ ...prev, [postId]: true })); // Set loading state for this post

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Prevent CORS issues if applicable
    video.currentTime = 2; // Capture a frame at 2 seconds

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a data URL (thumbnail)
      const thumbnailUrl = canvas.toDataURL("image/png");

      // Update the thumbnails state and clear loading state
      setThumbnails((prev) => ({ ...prev, [postId]: thumbnailUrl }));
      setThumbnailLoading((prev) => ({ ...prev, [postId]: false }));
    };

    video.onerror = () => {
      // Handle video loading errors
      setThumbnailLoading((prev) => ({ ...prev, [postId]: false }));
    };
  };

  // Store generated thumbnails
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    posts.forEach((post) => {
      if (post.video_upload && !thumbnails[post.id]) {
        generateThumbnail(post.video_upload, post.id);
      }
    });
  }, [posts]);

  const handlePostClick = (postId) => {
    navigate(`/video/${postId}`);
  };

  // Handle pagination navigation
  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Video Feed</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-102"
            onClick={() => handlePostClick(post.id)}
          >
            <div className="user-info flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.profile_picture || a}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {post.username || "Olusteve"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {post.artist || "Artist"}
                  </p>
                </div>
              </div>
              <img src={b} className="w-6 h-6 cursor-pointer" alt="Options" />
            </div>

            <div className="post-media relative">
              {thumbnailLoading[post.id] ? ( // Show spinner if thumbnail is loading
                <div className="w-full h-48 flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <img
                  src={thumbnails[post.id]} // Use the generated thumbnail
                  alt="Video Thumbnail"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="play-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img src={d} alt="Play" className="w-10 h-10" />
              </div>
            </div>

            <div className="post-caption p-4">
              <p className="text-sm text-gray-700">
                <strong>{post.caption || "My African Reggae"}</strong> by{" "}
                {post.username || "Olusteve"}
              </p>
            </div>

            <div className="post-actions flex items-center space-x-6 p-4 border-t border-gray-100">
              <span className="action flex items-center space-x-2">
                <FaHeart className="text-gray-500" />
                <span className="text-sm text-gray-600">{post.likes || 0}</span>
              </span>
              <span className="action flex items-center space-x-2">
                <FaComment className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {post.comments?.length || 0}
                </span>
              </span>
            </div>

            <div className="post-buttons flex justify-end space-x-4 p-4 bg-gray-50">
              <a
                href="../PromotionAddCardSubscription/index.html"
                className="bg-white border border-gray-300 text-green-500 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Promote
              </a>
              <a
                href="#"
                className="bg-white text-green-500 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={e} alt="Stream" className="w-4 h-4" /> Stream Video
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8 mb-10">
        <button
          onClick={handlePrevPage}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.hasNext}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoFeed;