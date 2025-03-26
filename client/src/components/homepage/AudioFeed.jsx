import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import c from "../../assets/image/11429433 1.svg";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";

const AudioFeed = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]); // Stores all fetched posts
  const limit = 10;
  const navigate = useNavigate();
  const observer = useRef(null);

  console.log("Fetching audio posts for page:", page);

  const { loading, error, posts, pagination } = useAudioPosts(page, limit);

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prevPosts) => {
        // Prevent duplicates by checking post IDs
        const newPosts = posts.filter((p) => !prevPosts.some((prev) => prev.id === p.id));
        return [...prevPosts, ...newPosts];
      });
    }
  }, [posts]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && pagination.hasNext) {
            console.log("Loading more posts...");
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
    console.log("Navigating to post:", postId);
    navigate(`/music/${postId}`);
  };

  if (error) {
    console.error("Error fetching data:", error);
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
                style={{ backgroundImage: `url(${post.cover_photo})` }}
              />
              <div className="absolute inset-0 bg-black/30 z-0" />

              <div className="relative z-10 bg-white/80 backdrop-blur-md h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.profile_picture || post.image || a}
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
                  <img
                    src={post.cover_photo || c}
                    alt="Music Cover"
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-2">
  <p className="text-lg font-semibold text-gray-900">
    {post.caption || "Untitled Track"}
  </p>

</div>


                <div className="flex items-center space-x-3 p-2 border-t border-gray-100">
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <FaHeart className="text-gray-500" />
                    <span className="text-sm text-gray-600">{post.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded-md">
                    <FaComment className="text-gray-500" />
                    <span className="text-sm text-gray-600">{post.comments || 0}</span>
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
          <p className="text-center text-gray-500">No posts available</p>
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

export default AudioFeed;
