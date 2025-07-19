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
  const videoRefs = useRef(new Map()); // Use Map for better ref management
  const currentVideoRef = useRef(null); // Track currently playing video
  const manuallyPausedRef = useRef(new Set()); // Track manually paused videos
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

  // Improved intersection observer for scroll detection
  useEffect(() => {
    if (!containerRef.current || allPosts.length === 0) return;
    
    // Disconnect previous observer
    if (scrollObserver.current) {
      scrollObserver.current.disconnect();
    }
    
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.7, // Increased threshold for better detection
    };

    scrollObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newIndex = Number(entry.target.dataset.index);
          console.log(`Video post ${newIndex} is now visible`);
          setCurrentIndex(newIndex);
          // Clear manual pause state when switching to a new post
          manuallyPausedRef.current.clear();
        }
      });
    }, options);

    const slides = containerRef.current.querySelectorAll(".snap-slide");
    slides.forEach((slide) => {
      scrollObserver.current.observe(slide);
    });

    return () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
    };
  }, [allPosts]);

  // Improved video playback control
  useEffect(() => {
    console.log(`Video playback control: currentIndex = ${currentIndex}, total videos = ${allPosts.length}`);
    
    // ALWAYS stop all videos first when currentIndex changes
    videoRefs.current.forEach((videoEl, idx) => {
      if (videoEl) {
        console.log(`Stopping video at index ${idx} (currentIndex changed to ${currentIndex})`);
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    // Clear current video ref since we stopped everything
    currentVideoRef.current = null;

    // Play current video automatically (unless manually paused)
    const currentVideo = videoRefs.current.get(currentIndex);
    if (currentVideo && !manuallyPausedRef.current.has(currentIndex)) {
      console.log(`Auto-playing video at index ${currentIndex}`);
      currentVideoRef.current = currentVideo;
      currentVideo.play().catch((e) => {
        console.warn(`Failed to auto-play video at index ${currentIndex}:`, e);
      });
    } else if (currentVideo && manuallyPausedRef.current.has(currentIndex)) {
      console.log(`Video at index ${currentIndex} is manually paused - not auto-playing`);
      currentVideoRef.current = currentVideo;
    } else {
      console.log(`No video element found for index ${currentIndex}`);
      currentVideoRef.current = null;
    }
  }, [currentIndex, allPosts.length]);

  // Debug logging
  useEffect(() => {
    console.log(`Current video index: ${currentIndex}, Total videos: ${allPosts.length}`);
  }, [currentIndex, allPosts.length]);

  // Improved video ref setter
  const setVideoRef = useCallback((idx, el) => {
    if (el) {
      videoRefs.current.set(idx, el);
      console.log(`Video ref set for index ${idx}`);
    } else {
      videoRefs.current.delete(idx);
      console.log(`Video ref removed for index ${idx}`);
    }
  }, []);

  // Handle manual pause state from VideoPlayer
  const handleManualPause = useCallback((idx, isPaused) => {
    if (isPaused) {
      manuallyPausedRef.current.add(idx);
      console.log(`Video ${idx} manually paused`);
    } else {
      manuallyPausedRef.current.delete(idx);
      console.log(`Video ${idx} manually resumed`);
    }
  }, []);

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
    <div className="flex justify-center w-full h-full bg-black">
      {/* Container with responsive dimensions */}
      <div
        ref={containerRef}
        className="feed-container h-full w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto overflow-y-scroll snap-y snap-mandatory bg-black relative"
        style={{ 
          overscrollBehavior: "none",
          scrollBehavior: "smooth",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maxWidth: "100%", // Ensure it doesn't exceed screen width on mobile
          height: "100vh", // Force full viewport height
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
              className="snap-slide w-full h-full" 
              data-index={index}
              ref={index === allPosts.length - 1 ? lastPostRef : null}
            >
              <VideoPlayer
                post={post}
                index={index}
                isCurrent={index === currentIndex}
                defaultThumbnail={c}
                profileId={profile?.id}
                setVideoRef={(el) => setVideoRef(index, el)}
                onManualPause={(isPaused) => handleManualPause(index, isPaused)}
              />
            </div>
          ))
        ) : (
          <div className="h-full w-full flex items-center justify-center snap-start">
            <p className="text-white text-sm sm:text-base">No videos available</p>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoFeed;