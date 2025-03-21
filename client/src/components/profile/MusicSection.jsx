import React, { useState } from 'react';
import c from "../../assets/image/11429433 1.svg";
import { useGetAudioPosts } from '../../../Hooks/audioPosts/useCreateAudio';

const MusicSection = () => {
  const [page, setPage] = useState(1);
  const limit = 9; // Ensures even distribution in the grid
  const { data, loading, error } = useGetAudioPosts(page, limit);

  console.log(data); // Debugging API response

  return (
    <div className="music-section  p-1 flex flex-col items-center mb-20 mt-10">


      {/* Music Grid */}
      <div className="music-list grid grid-cols-3 gap-1 w-full max-w-6xl px-1">
        {loading && <p className="text-center col-span-full">Loading music posts...</p>}
        {error && <p className="text-red-500 col-span-full">{error}</p>}

        {data && data.posts?.length > 0 ? (
          data.posts.map((post) => (
            <div
              key={post.id}
              className="music-item bg-white rounded-lg shadow-lg p-1 flex flex-col justify-center items-center text-center transition transform hover:scale-105"
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
          !loading && <p className="text-gray-600 col-span-full text-center">No audio posts available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {data && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={data.posts.length < limit || loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicSection;