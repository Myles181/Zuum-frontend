import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import Spinner from "../Spinner";
import { useVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo";

const VideoSection = ({ userId }) => {
  const { posts = [], loading, error } = useVideoPosts(1, 10, null);
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState({});

  // only this user's posts
  const filteredPosts = posts.filter(post => post.profile_id === userId);

  // navigate on click
  const handleVideoClick = (postId) => {
    navigate(`/video/${postId}`);
  };

  // extract a frame at 2s for thumbnail
  const generateThumbnail = (videoUrl, postId) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.currentTime = 2;

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const thumb = canvas.toDataURL("image/png");
      setThumbnails(prev => ({ ...prev, [postId]: thumb }));
    };

    video.onerror = () => {
      console.error("Thumbnail extraction failed for", postId);
    };
  };

  // kick off thumbnails
  useEffect(() => {
    filteredPosts.forEach(post => {
      if (post.video_upload && !thumbnails[post.id]) {
        generateThumbnail(post.video_upload, post.id);
      }
    });
  }, [filteredPosts]);

  return (
    <div className="video-section mb-20 mt-10">
      <div className="video-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
        {loading && (
          <div className="col-span-full flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}
        {error && (
          <p className="text-red-500 col-span-full text-center">{error}</p>
        )}
        {!loading && !error && filteredPosts.length === 0 && (
          <p className="text-gray-600 col-span-full text-center py-10">
            No video posts found.
          </p>
        )}

        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => handleVideoClick(post.id)}
            className="cursor-pointer group flex flex-col"
          >
            {/* Square thumbnail with overlay */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              {thumbnails[post.id] ? (
                <img
                  src={thumbnails[post.id]}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-gray-100">
                  <Spinner />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaPlay className="text-white text-3xl" />
              </div>
            </div>

            {/* Truncated caption */}
            <p
              className="mt-2 text-sm text-gray-700 block w-full truncate"
              title={post.caption}
            >
              {post.caption || "Untitled"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSection;
