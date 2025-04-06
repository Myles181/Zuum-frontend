import React from "react";
import { useNavigate } from "react-router-dom";
import c from "../../assets/image/11429433 1.svg";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import Spinner from "../Spinner";

const MusicSection = ({ userId }) => {
  // Fetch all audio posts (no user filter at the hook level)
  const { posts = [], loading, error } = useAudioPosts(1, 10);
  const navigate = useNavigate();

  // Filter client‑side for this user's posts
  const filteredPosts = posts.filter((post) => post.profile_id === userId);

  const handleMusicClick = (postId) => {
    navigate(`/music/${postId}`);
  };

  return (
    <div className="music-section p-1 flex flex-col items-center mb-20 mt-10">
      {/* Music Grid */}
      <div className="music-list grid grid-cols-3 gap-1 w-full max-w-6xl px-1">
        {loading && (
        <div className="col-span-full flex justify-center items-center">
        <Spinner /> {/* Show spinner while loading */}
      </div>
        )}
        {error && (
          <p className="text-red-500 col-span-full">{error}</p>
        )}

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="music-item bg-white rounded-lg shadow-lg p-1 flex flex-col justify-center items-center text-center transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleMusicClick(post.id)}
            >
              <img
                src={post.cover_photo || c}
                alt="Cover"
                className="cover w-full h-30 object-cover rounded-lg"
              />
              <div className="mt-3">
                <p className="text-sm text-gray-500">{post.type}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-gray-600 col-span-full text-center">
              No audio posts found.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default MusicSection;
