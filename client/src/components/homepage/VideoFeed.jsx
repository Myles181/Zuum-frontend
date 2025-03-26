import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import c from "../../assets/image/11429433 1.svg";
import { FaHeart, FaComment, FaShareAlt, FaPlay } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import { useVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo";

const VideoFeed = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const limit = 10;
  const navigate = useNavigate();
  const observer = useRef(null);

  const { loading, error, posts, pagination } = useVideoPosts(page, limit);
  const [thumbnails, setThumbnails] = useState({});
  const [thumbnailLoading, setThumbnailLoading] = useState({});

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prevPosts) => {
        const newPosts = posts.filter((p) => !prevPosts.some((prev) => prev.id === p.id));
        return [...prevPosts, ...newPosts];
      });
    }
  }, [posts]);

  // Modified thumbnail generation with error handling
  const generateThumbnail = useCallback((videoUrl, postId) => {
    setThumbnailLoading((prev) => ({ ...prev, [postId]: true }));
    
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; // Important for CORS
    video.src = videoUrl;
    video.currentTime = 2;

    video.onloadeddata = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/png");
        setThumbnails((prev) => ({ ...prev, [postId]: thumbnailUrl }));
      } catch (error) {
        console.error("Error generating thumbnail:", error);
        // Fallback to cover photo or default image
        setThumbnails((prev) => ({ ...prev, [postId]: c }));
      } finally {
        setThumbnailLoading((prev) => ({ ...prev, [postId]: false }));
      }
    };

    video.onerror = () => {
      console.error("Error loading video for thumbnail");
      setThumbnails((prev) => ({ ...prev, [postId]: c }));
      setThumbnailLoading((prev) => ({ ...prev, [postId]: false }));
    };
  }, []);

  useEffect(() => {
    allPosts.forEach((post) => {
      if (post.video_upload && !thumbnails[post.id] && !thumbnailLoading[post.id]) {
        generateThumbnail(post.video_upload, post.id);
      }
    });
  }, [allPosts, generateThumbnail, thumbnails, thumbnailLoading]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && pagination.hasNext) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, pagination.hasNext]
  );

  const handlePostClick = (postId) => {
    navigate(`/video/${postId}`);
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="mt-15 mb-15">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allPosts.length > 0 ? (
          allPosts.map((post, index) => (
            <div
              key={post.id}
              ref={index === allPosts.length - 1 ? lastPostRef : null}
              className="relative shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-102 h-full"
              onClick={() => handlePostClick(post.id)}
            >
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-2xl opacity-40 z-0"
                style={{ 
                  backgroundImage: `url(${thumbnails[post.id] || post.cover_photo || c})` 
                }}
              />
              <div className="absolute inset-0 bg-black/30 z-0" />

              <div className="relative z-10 bg-white/80 backdrop-blur-md h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-gray-100">
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
                      <p className="text-sm text-gray-500">{post.artist || "Artist"}</p>
                    </div>
                  </div>
                  <img src={b} className="w-6 h-6 cursor-pointer" alt="Options" />
                </div>

                <div className="relative">
                  {thumbnailLoading[post.id] ? (
                    <div className="w-full h-48 flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={thumbnails[post.id] || post.cover_photo || c}
                        alt="Video Thumbnail"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-3">
                          <FaPlay className="text-white text-xl" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {post.caption || "Untitled Video"}
                  </p>
                </div>

                <div className="flex items-center space-x-3 p-2 border-t border-gray-100">
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <FaHeart className="text-gray-500" />
                    <span className="text-sm text-gray-600">{post.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <FaComment className="text-gray-500" />
                    <span className="text-sm text-gray-600">{post.comments?.length || 0}</span>
                  </span>
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <MdCampaign className="text-gray-500" />
                    <span className="text-sm text-gray-600">Promote</span>
                  </span>
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <FaShareAlt className="text-gray-500" />
                    <span className="text-sm text-gray-600">Share</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No videos available</p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center my-4">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default VideoFeed;