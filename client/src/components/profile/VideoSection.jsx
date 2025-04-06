import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Spinner from "../Spinner"; // Adjust the import path
import {useVideoPosts} from "../../../Hooks/videoPosts/useCreateVideo"; // Import the useVideoPosts hook

const VideoSection = ({ userId }) => {
  const { posts, loading, error } = useVideoPosts(1, 10, null); // Fetch video posts for the specified user
  const navigate = useNavigate(); // Initialize useNavigate
  const [thumbnails, setThumbnails] = useState({}); // State to store video thumbnails

  console.log(userId); // Debugging userId
  console.log(posts); // Debugging API response
  

  // Filter posts where profile__id matches userId
  const filteredPosts = posts.filter((post) => post.profile_id === userId);

  // Function to handle video item click
  const handleVideoClick = (postId) => {
    navigate(`/video/${postId}`); // Navigate to the video details page
  };

  // Function to extract thumbnail from video
  const generateThumbnail = (videoUrl, postId) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Prevent CORS issues
    video.currentTime = 2; // Capture a frame at 2 seconds

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a data URL (thumbnail)
      const thumbnailUrl = canvas.toDataURL("image/png");

      // Update the thumbnails state
      setThumbnails((prev) => ({ ...prev, [postId]: thumbnailUrl }));
    };

    video.onerror = () => {
      console.error("Failed to load video for thumbnail extraction.");
    };
  };

  // Generate thumbnails for all video posts
  useEffect(() => {
    if (filteredPosts.length > 0) {
      filteredPosts.forEach((post) => {
        if (post.video_upload && !thumbnails[post.id]) {
          generateThumbnail(post.video_upload, post.id);
        }
      });
    }
  }, [filteredPosts]);

  return (
    <div className="video-section p-1 flex flex-col items-center mb-20 mt-10">
      {/* Video Grid */}
      <div className="video-list grid grid-cols-3 gap-1 w-full max-w-6xl px-1">
        {loading && (
          <div className="col-span-full flex justify-center items-center">
            <Spinner /> {/* Show spinner while loading */}
          </div>
        )}
        {error && <p className="text-red-500 col-span-full text-center">{error}</p>}

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="video-item bg-white rounded-lg shadow-lg p-1 flex flex-col justify-center items-center text-center transition transform hover:scale-105 cursor-pointer"
              onClick={() => handleVideoClick(post.id)} // Add click handler
            >
              {/* Display thumbnail or spinner */}
              {thumbnails[post.id] ? (
                <img
                  src={thumbnails[post.id]}
                  alt="Video Thumbnail"
                  className="w-full h-30 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-30 flex justify-center items-center">
                  <Spinner /> {/* Show spinner while thumbnail is being generated */}
                </div>
              )}
              <div className="mt-3">
                <p className="text-sm text-gray-500">{post.caption}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-gray-600 col-span-full text-center">
              No video posts found.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default VideoSection;