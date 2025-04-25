import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import c from "../../assets/image/11429433 1.svg";
import { useVideoPosts } from "../../../Hooks/videoPosts/useCreateVideo";
import VideoPlayer from "./feed/VideoPlayer";
import useProfile from "../../../Hooks/useProfile";


const VideoFeed = ({profile}) => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const limit = 10;
  const containerRef = useRef(null);
  const loadObserver = useRef(null);
  const scrollObserver = useRef(null);
  const { loading, error, posts, pagination } = useVideoPosts(page, limit);


  // Load posts
  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prevPosts) => {
        const newPosts = posts.filter((p) => !prevPosts.some((prev) => prev.id === p.id));
        return [...prevPosts, ...newPosts];
      });
    }
  }, [posts]);

  // Infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (loadObserver.current) loadObserver.current.disconnect();
      loadObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && pagination.hasNext) {
            setPage((p) => p + 1);
          }
        },
        { threshold: 0.5 }
      );
      if (node) loadObserver.current.observe(node);
    },
    [loading, pagination.hasNext]
  );

  // Track current visible slide
  useEffect(() => {
    if (!containerRef.current || allPosts.length === 0) return;
    
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6, // Match the audio feed threshold
    };

    scrollObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentIndex(Number(entry.target.dataset.index));
        }
      });
    }, options);

    const slides = containerRef.current.querySelectorAll(".snap-slide");
    slides.forEach((slide) => scrollObserver.current.observe(slide));

    return () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
    };
  }, [allPosts]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollObserver.current) scrollObserver.current.disconnect();
      if (loadObserver.current) loadObserver.current.disconnect();
    };
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ 
        overscrollBehavior: "none",
        scrollBehavior: "smooth",
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Hide scrollbar for Chrome/Safari */}
      <style>{`
        .snap-y::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {allPosts.length > 0 ? (
        allPosts.map((post, index) => (
          <div 
            key={post.id} 
            className="snap-slide" 
            data-index={index}
            ref={index === allPosts.length - 1 ? lastPostRef : null}
          >
            <VideoPlayer
              post={post}
              index={index}
              isCurrent={index === currentIndex}
              defaultThumbnail={c}
              profileId={profile?.id}
            />
          </div>
        ))
      ) : (
        <div className="h-screen w-full flex items-center justify-center snap-start">
          <p className="text-white">No videos available</p>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default VideoFeed;