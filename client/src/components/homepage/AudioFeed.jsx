import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Spinner from "../Spinner"; // Adjust the import path as needed
import a from "../../assets/icons/Mask group1.svg"; // Adjust the import path as needed
import b from "../../assets/icons/dots-icon.svg"; // Adjust the import path as needed
import c from "../../assets/image/11429433 1.svg"; // Adjust the import path as needed
import d from "../../assets/icons/Vector2.png"; // Adjust the import path as needed
import e from "../../assets/icons/stream-icon.svg"; // Adjust the import path as needed
import { FaHeart, FaComment } from "react-icons/fa"; // React Icons for like and comment
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";

const AudioFeed = () => {
  const [page, setPage] = useState(1);
  const limit = 10; // Number of posts per page
  const { loading, error, posts, pagination } = useAudioPosts(page, limit);
  const navigate = useNavigate(); // Initialize useNavigate

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

  // Handle post click to navigate to post details
  const handlePostClick = (postId) => {
    navigate(`/music/${postId}`); // Navigate to the post details page
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Audio Feed</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-102"
            onClick={() => handlePostClick(post.id)} // Add onClick handler
          >
            {/* User Info Section */}
            <div className="user-info flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.profile_picture || post.image || a}
                  alt="Profile"
                  className="profile-pic w-12 h-12 rounded-full object-cover border-2 border-gray-200"
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
              <img
                src={b}
                className="menu-icon w-6 h-6 cursor-pointer"
                alt="Options"
              />
            </div>

            {/* Post Media Section */}
            <div className="post-media relative">
              <img
                src={post.cover_photo || c}
                alt="Music Cover"
                className="w-full h-48 object-cover" // Fixed height for all images
              />
            </div>

            {/* Post Caption Section */}
            <div className="post-caption p-4 ">
              <p className="text-sm text-gray-800 ">
                <strong className="text-lg">{post.caption || "My African Reggae"}</strong> by{" "}
                {post.username || "Olusteve"}
              </p>
            </div>

            {/* Post Actions Section */}
            <div className="post-actions flex items-center space-x-6 p-4 border-t border-gray-100">
              <span className="action flex items-center space-x-2">
                <FaHeart className="text-gray-500" /> {/* Like icon */}
                <span className="text-sm text-gray-600">{post.likes || 0}</span>{" "}
                {/* Like count */}
              </span>
              <span className="action flex items-center space-x-2">
                <FaComment className="text-gray-500" /> {/* Comment icon */}
                <span className="text-sm text-gray-600">
                  {post.comments?.length || 0}
                </span>{" "}
                {/* Comment count */}
              </span>
            </div>

            {/* Post Buttons Section */}
            <div className="post-buttons flex justify-end space-x-4 p-4 bg-gray-50">
              <a
                href="../PromotionAddCardSubscription/index.html"
                className="promote bg-white border border-gray-300 text-green-500 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent post click when promoting
              >
                Promote
              </a>
              <a
                href="#"
                className="stream bg-white text-green-500 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent post click when streaming
              >
                <img src={e} alt="Stream" className="w-4 h-4" /> Stream Music
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

export default AudioFeed;