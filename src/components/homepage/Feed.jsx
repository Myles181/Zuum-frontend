import React, { useState, useEffect, useMemo } from "react";
import Post from "./Post";
// import { useGetVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo"; // Hook for video posts
import Spinner from "../Spinner";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import { useFetchBeats } from "../../../Hooks/beats/useBeats";

const Feed = () => {
  const [page, setPage] = useState(1); // Pagination state
  const [beatsPage, setBeatsPage] = useState(1); // Pagination state for beats
  const limit = 10; // Number of posts per page

  // Fetch audio posts using the custom hook
  const {
    loading: audioLoading,
    error: audioError,
    posts: audioPosts,
    pagination: audioPagination,
  } = useAudioPosts(page, limit);

  // Fetch beats using the beats hook
  const {
    loading: beatsLoading,
    error: beatsError,
    beats,
    pagination: beatsPagination,
  } = useFetchBeats({ initialPage: beatsPage, initialLimit: limit });

  const [allAudioPosts, setAllAudioPosts] = useState([]); // Store all loaded audio posts
  const [allBeats, setAllBeats] = useState([]); // Store all loaded beats

  // Update audio posts
  useEffect(() => {
    if (audioPosts?.length > 0) {
      setAllAudioPosts((prevPosts) => {
        const newPosts = audioPosts.filter(
          (newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
    }
  }, [audioPosts]);

  // Update beats
  useEffect(() => {
    if (beats?.length > 0) {
      setAllBeats((prevBeats) => {
        const newBeats = beats
          .filter((newBeat) => !prevBeats.some((prevBeat) => prevBeat.id === newBeat.id))
          .map((beat) => ({
            ...beat,
            type: "beat", // Mark as beat type
            created_at: beat.created_at || beat.createdAt || beat.date_created || new Date().toISOString()
          }));
        return [...prevBeats, ...newBeats];
      });
    }
  }, [beats]);

  // Combine and sort all posts by timestamp (newest first)
  const sortedPosts = useMemo(() => {
    const combined = [
      ...allAudioPosts.map(post => ({
        ...post,
        type: "audio",
        created_at: post.created_at || post.createdAt || post.date_created || new Date().toISOString()
      })),
      ...allBeats
    ];

    // Sort by created_at timestamp (newest first)
    return combined.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [allAudioPosts, allBeats]);

  // Handle pagination
  const handleNextPage = () => {
    if (audioPagination.hasNext) {
      setPage((prevPage) => prevPage + 1);
    }
    if (beatsPagination.hasNext) {
      setBeatsPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (audioPagination.hasPrev) {
      setPage((prevPage) => Math.max(1, prevPage - 1));
    }
    if (beatsPagination.hasPrev) {
      setBeatsPage((prevPage) => Math.max(1, prevPage - 1));
    }
  };

  // Show loading state
  if (audioLoading || beatsLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner /> {/* Show the spinner while loading */}
      </div>
    );
  }

  // Show error state
  if (audioError || beatsError) {
    return <p style={{ color: "red" }}>{audioError || beatsError}</p>;
  }

  return (
    <section className="feed p-4 mb-10 mt-10">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Post
            key={`${post.type}-${post.id}`} // Ensure the key is unique with type
            postId={post.id}
            postType={post.type === "beat" ? "beat" : "music"} // Set postType based on type
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={!audioPagination.hasPrev && !beatsPagination.hasPrev}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {Math.max(page, beatsPage)} of {Math.max(audioPagination.totalPages || 0, beatsPagination.totalPages || 0)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!audioPagination.hasNext && !beatsPagination.hasNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Feed;