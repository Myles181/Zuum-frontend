import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import c from "../../assets/image/11429433 1.svg";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio"; // Import the useAudioPosts hook

const MusicSection = ({ userId }) => {
  const { posts, loading, error } = useAudioPosts(1, 10, null, userId); // Fetch audio posts for the specified user
  const navigate = useNavigate(); // Initialize useNavigate

  console.log(userId); // Debugging userId
  console.log(posts); // Debugging API response

  // Filter posts where profile__id matches userId
  const filteredPosts = posts.filter((post) => post.profile_id === userId);

  // Function to handle music item click
  const handleMusicClick = (postId) => {
    navigate(`/music/${postId}`); // Navigate to the music details page
  };

  return (
    <div className="music-section p-1 flex flex-col items-center mb-20 mt-10">
      {/* Music Grid */}
      <div className="music-list grid grid-cols-3 gap-1 w-full max-w-6xl px-1">
        {loading && <p className="text-center col-span-full">Loading music posts...</p>}
        {/* {error && <p className="text-red-500 col-span-full">{error}</p>} */}

        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="music-item bg-white rounded-lg shadow-lg p-1 flex flex-col justify-center items-center text-center transition transform hover:scale-105 cursor-pointer"
              onClick={() => handleMusicClick(post.id)} // Add click handler
            >
              <img
                src={post.cover_photo || c}
                alt="Cover"
                className="cover w-full h-30 object-fit rounded-lg"
              />
              <div className="mt-3">
                <p className="text-sm text-gray-500">{post.type}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-600 col-span-full text-center">No audio posts found.</p>
        )}
      </div>
    </div>
  );
};

export default MusicSection;