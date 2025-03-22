import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';
import { useGetAudioPosts } from '../../../Hooks/audioPosts/useCreateAudio'; // Hook for music posts
import { useGetVideoPosts } from '../../../Hooks/videoPosts/useCreateVideo'; // Hook for video posts
import Spinner from '../Spinner';


const Feed = () => {
  const [page, setPage] = useState(1); // Pagination state
  const limit = 10; // Number of posts per page
  const { data: audioPostsData, loading: audioLoading, error: audioError } = useGetAudioPosts(page, limit); // Fetch music posts
  const { data: videoPostsData, loading: videoLoading, error: videoError } = useGetVideoPosts(page, limit); // Fetch video posts
  const [posts, setPosts] = useState([]); // Store all loaded posts (both music and video)
  const observerRef = useRef(null);

  // Combine music and video posts
  useEffect(() => {
    if (audioPostsData?.posts || videoPostsData?.posts) {
      const newAudioPosts = audioPostsData?.posts || [];
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
  }, [audioPostsData, videoPostsData]);

  // Infinite scroll logic
  useEffect(() => {
    if (!observerRef.current || audioLoading || videoLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Load more when last post is visible
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [audioLoading, videoLoading]);

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
    return <p style={{ color: 'red' }}>{audioError || videoError}</p>;
  }

  return (
    <section className="feed p-4 mb-10 mt-10">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post
            key={post.id} // Ensure the key is unique
            postId={post.id}
            postType={post.type} // Pass the post type (music or video)
            ref={index === posts.length - 1 ? observerRef : null}
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </section>
  );
};

export default Feed;