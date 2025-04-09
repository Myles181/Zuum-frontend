import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import AudioPost from "./feed/AudioPost";


const AudioFeed = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTapIcon, setShowTapIcon] = useState(false);
  const [tapIconType, setTapIconType] = useState("play");
  const limit = 10;
  const containerRef = useRef(null);
  const loadObserver = useRef(null);
  const iconTimeout = useRef(null);
  const scrollObserver = useRef(null);
  const audioRefs = useRef([]); // Added back audioRefs
  const { loading, error, posts, pagination } = useAudioPosts(page, limit);
  
  

  // Merge newly fetched posts
  useEffect(() => {
    if (!posts.length) return;
    setAllPosts((prev) => {
      const filtered = posts.filter((p) => !prev.some((q) => q.id === p.id));
      return [
        ...prev,
        ...filtered.map((post) => ({ ...post, isLiked: post.isLiked || false })),
      ];
    });
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
      threshold: 0.6,
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

  // Auto-play the active audio
  useEffect(() => {
    audioRefs.current.forEach((audioEl, idx) => {
      if (!audioEl) return;
      if (idx === currentIndex) {
        audioEl.play().catch(() => {});
      } else {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    });
  }, [currentIndex, allPosts]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(iconTimeout.current);
      if (scrollObserver.current) scrollObserver.current.disconnect();
    };
  }, []);

  const handleTap = useCallback((idx) => {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setTapIconType("pause");
    } else {
      audio.pause();
      setTapIconType("play");
    }
    setShowTapIcon(true);
    clearTimeout(iconTimeout.current);
    iconTimeout.current = setTimeout(() => setShowTapIcon(false), 800);
  }, []);

  const handleLike = useCallback((postId) => {
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  }, []);

  const handleTimeUpdate = useCallback((idx, e) => {
    if (idx === currentIndex) {
      setCurrentTime(e.target.currentTime);
    }
  }, [currentIndex]);

  const handleLoadedMetadata = useCallback((idx, e) => {
    if (idx === currentIndex) {
      setDuration(e.target.duration);
    }
  }, [currentIndex]);

  const setAudioRef = useCallback((idx, el) => {
    audioRefs.current[idx] = el;
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ overscrollBehavior: "none" }}
    >
      {allPosts.length > 0 ? (
        allPosts.map((post, idx) => (
          <AudioPost
            key={post.id}
            post={post}
            isActive={idx === currentIndex}
            onTap={() => handleTap(idx)}
            onLike={() => handleLike(post.id)}
            currentTime={currentTime}
            duration={duration}
            showTapIcon={showTapIcon && idx === currentIndex}
            tapIconType={tapIconType}
            data-index={idx}
            ref={idx === allPosts.length - 1 ? lastPostRef : null}
            setAudioRef={(el) => setAudioRef(idx, el)}
            onTimeUpdate={(e) => handleTimeUpdate(idx, e)}
            onLoadedMetadata={(e) => handleLoadedMetadata(idx, e)}
          />
        ))
      ) : (
        <div className="h-screen w-full flex items-center justify-center">
          <p className="text-white">No posts available</p>
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

export default AudioFeed;