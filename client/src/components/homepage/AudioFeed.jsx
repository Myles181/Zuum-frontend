import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import c from "../../assets/image/11429433 1.svg";
import e from "../../assets/icons/stream-icon.svg";
import { FaHeart, FaComment } from "react-icons/fa";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";

const AudioFeed = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { loading, error, posts, pagination } = useAudioPosts(page, limit);
  const navigate = useNavigate();

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

  const handlePostClick = (postId) => {
    navigate(`/music/${postId}`);
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

  console.log(posts);
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Audio Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-102"
            onClick={() => handlePostClick(post.id)}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.profile_picture || post.image || a}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{post.username || "Olusteve"}</h4>
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

            <div className="p-4">
              <p className="text-sm text-gray-800">
                <strong className="text-lg">{post.caption || "My African Reggae"}</strong> by {post.username || "Olusteve"}
              </p>
            </div>

            <div className="flex items-center space-x-6 p-4 border-t border-gray-100">
              <span className="flex items-center space-x-2">
                <FaHeart className="text-gray-500" />
                <span className="text-sm text-gray-600">{post.likes || 0}</span>
              </span>
              <span className="flex items-center space-x-2">
                <FaComment className="text-gray-500" />
                <span className="text-sm text-gray-600">{post.comments || 0}</span>
              </span>
            </div>

            <div className="flex justify-end space-x-4 p-4 bg-gray-50">
              <a
                href="#"
                className="bg-white text-green-500 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={e} alt="Stream" className="w-4 h-4" /> Stream Music
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 mt-8 mb-10">
        <button
          onClick={handlePrevPage}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.hasNext}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AudioFeed;
