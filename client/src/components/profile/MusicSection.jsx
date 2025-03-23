import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import c from "../../assets/image/11429433 1.svg";
import { useGetUserAudioPosts } from '../../../Hooks/audioPosts/useCreateAudio';


const MusicSection = () => {
  const { data, loading, error } = useGetUserAudioPosts(); // Fetch the authenticated user's audio posts
  const navigate = useNavigate(); // Initialize useNavigate

  console.log(data); // Debugging API response

  // Function to handle music item click
  const handleMusicClick = (postId) => {
    navigate(`/music/${postId}`); // Navigate to the music details page
  };

  return (
    <div className="music-section p-1 flex flex-col items-center mb-20 mt-10">
      {/* Music Grid */}
      <div className="music-list grid grid-cols-3 gap-1 w-full max-w-6xl px-1">
        {loading && <p className="text-center col-span-full">Loading your music posts...</p>}
        {error && <p className="text-red-500 col-span-full">{error}</p>}

        {data && data.length > 0 ? (
          data.map((post) => (
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
          !loading && <p className="text-gray-600 col-span-full text-center">You have no audio posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default MusicSection;