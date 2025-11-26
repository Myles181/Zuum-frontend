import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import c from "../../assets/image/11429433 1.svg";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import Spinner from "../Spinner";

const MusicSection = ({ userId }) => {
  const { posts = [], loading, error } = useAudioPosts(1, 10);
  const navigate = useNavigate();

  console.log(posts);
  

  const filteredPosts = posts.filter(post => post.profile_id === userId);

  // When a user clicks on a track in the grid, open the shared-audio viewer
  // so it uses the same full-screen experience as shared links.
  const handleMusicClick = (postId) => {
    navigate(`/shared-audio/${postId}`);
  };

  return (
    <div className="music-section mb-8 mt-4">
      <div className="music-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
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
            No audio posts found.
          </p>
        )}

        {filteredPosts.map(post => (
          <div
            key={post.id}
            onClick={() => handleMusicClick(post.id)}
            className="cursor-pointer group flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <img
                src={post.cover_photo || c}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <FaPlay className="text-white text-3xl" />
              </div>
            </div>

            {/* Truncated Name */}
            <p
              className="mt-2 text-sm text-gray-700 block w-full truncate"
              title={post.caption}
            >
              {post.caption  || "Untitled"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicSection;
