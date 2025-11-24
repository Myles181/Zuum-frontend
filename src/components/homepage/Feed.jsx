import React, { useState, useEffect } from "react";
import Post from "./Post";
// import { useGetVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo"; // Hook for video posts
import Spinner from "../Spinner";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";

const Feed = () => {
  const [page, setPage] = useState(1); // Pagination state
  const limit = 10; // Number of posts per page

  // Fetch audio posts using the custom hook
  const {
    loading: audioLoading,
    error: audioError,
    posts: audioPosts,
    pagination: audioPagination,
  } = useAudioPosts(page, limit);

  // Fetch video posts using the video hook
  // const {
  //   data: videoPostsData,
  //   loading: videoLoading,
  //   error: videoError,
  // } = useGetVideoPosts(page, limit);

  const [posts, setPosts] = useState([]); // Store all loaded posts (both music and video)

  // Combine music and video posts
  useEffect(() => {
    if (audioPosts?.length > 0 || videoPostsData?.posts?.length > 0) {
      const newAudioPosts = audioPosts || [];
      const newVideoPosts = videoPostsData?.posts || [];
      const combinedPosts = [...newAudioPosts, ...newVideoPosts];

      // Filter out duplicate posts before appending new posts
      setPosts((prevPosts) => {
        const uniquePosts = combinedPosts.filter(
          (newPost) => !prevPosts.some((prevPost) => prevPost.id === newPost.id)
        );
        return [...prevPosts, ...uniquePosts];
      });
    }
  }, [audioPosts, videoPostsData]);

  // Handle pagination
  const handleNextPage = () => {
    if (audioPagination.hasNext || videoPostsData?.pagination?.hasNext) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (audioPagination.hasPrev || videoPostsData?.pagination?.hasPrev) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Show loading state
  if (audioLoading || videoLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
        <Spinner /> {/* Show the spinner while loading */}
      </div>
    );
  }

  // Show error state
  if (audioError || videoError) {
    return <p style={{ color: "red" }}>{audioError || videoError}</p>;
  }
  console.log(posts);
  

  return (
    <section className="feed p-4 mb-10 mt-10">
      <h1>{posts.lenght}</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id} // Ensure the key is unique
            postId={post.id}
            postType={post.type === undefined ? "video" : "music"} // Set postType to "video" if undefined, else "music"
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          disabled={!audioPagination.hasPrev && !videoPostsData?.pagination?.hasPrev}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {Math.max(audioPagination.totalPages, videoPostsData?.pagination?.totalPages || 0)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!audioPagination.hasNext && !videoPostsData?.pagination?.hasNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Feed;