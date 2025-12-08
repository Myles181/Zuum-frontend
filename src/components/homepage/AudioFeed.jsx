import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import AudioPost from "./feed/AudioPost";
import { useFetchBeats } from "../../../Hooks/beats/useBeats";

const AudioFeed = ({ profile }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [beatsPage, setBeatsPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [allBeats, setAllBeats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTapIcon, setShowTapIcon] = useState(false);
  const [tapIconType, setTapIconType] = useState("play");
  const limit = 10;
  const beatsLimit = 10;
  const containerRef = useRef(null);
  const loadObserver = useRef(null);
  const iconTimeout = useRef(null);
  const scrollObserver = useRef(null);
  const audioRefs = useRef(new Map()); // Use Map for better ref management
  const currentAudioRef = useRef(null); // Track currently playing audio
  const manuallyPausedRef = useRef(new Set()); // Track manually paused audio

  const {
    loading: postsLoading,
    error: postsError,
    posts,
    pagination: postsPagination,
  } = useAudioPosts(page, limit);

  const {
    loading: beatsLoading,
    error: beatsError,
    beats,
    pagination: beatsPagination,
  } = useFetchBeats({ initialPage: beatsPage, initialLimit: beatsLimit });

  console.log(posts);

  // Merge and sort all posts by timestamp (newest first)
  const sortedContent = useMemo(() => {
    const merged = [
      ...allPosts.map(post => ({
        ...post,
        type: "audio",
        created_at: post.created_at || post.createdAt || post.date_created || new Date().toISOString()
      })),
      ...allBeats.map(beat => ({
        ...beat,
        type: "beat",
        created_at: beat.created_at || beat.createdAt || beat.date_created || new Date().toISOString()
      }))
    ];

    // Sort by created_at timestamp (newest first)
    return merged.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [allPosts, allBeats]);

  // Update audio posts
  useEffect(() => {
    if (posts?.length) {
      setAllPosts((prev) => {
        const newPosts = posts
          .filter((p) => !prev.some((q) => q.id === p.id && q.type === "audio"))
          .map((post) => ({ 
            ...post, 
            isLiked: post.isLiked || false, 
            type: "audio",
            created_at: post.created_at || post.createdAt || post.date_created || new Date().toISOString()
          }));
        return [...prev, ...newPosts];
      });
    }
  }, [posts]);

  // Update beat posts
  useEffect(() => {
    if (beats?.length) {
      setAllBeats((prev) => {
        const newBeats = beats
          .filter((b) => !prev.some((q) => q.id === b.id && q.type === "beat"))
          .map((beat) => ({
            ...beat,
            type: "beat",
            audio_upload: beat.audio_upload || beat.audio_file,
            cover_photo: beat.cover_photo || beat.cover_image,
            username: beat.username || beat.artist,
            caption: beat.caption || beat.title,
            price: beat.amount ? beat.amount / 100 : 0,
            created_at: beat.created_at || beat.createdAt || beat.date_created || new Date().toISOString()
          }));
        return [...prev, ...newBeats];
      });
    }
  }, [beats]);

  const lastPostRef = useCallback(
    (node) => {
      if (postsLoading || beatsLoading) return;
      if (loadObserver.current) loadObserver.current.disconnect();

      loadObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (postsPagination.hasNext) setPage((p) => p + 1);
            if (beatsPagination.hasNext) setBeatsPage((p) => p + 1);
          }
        },
        { threshold: 0.5 }
      );

      if (node) loadObserver.current.observe(node);
    },
    [postsLoading, beatsLoading, postsPagination.hasNext, beatsPagination.hasNext]
  );

  // Improved intersection observer for scroll detection
  useEffect(() => {
    if (!containerRef.current || !sortedContent.length) return;

    // Disconnect previous observer
    if (scrollObserver.current) {
      scrollObserver.current.disconnect();
    }

    scrollObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newIndex = Number(entry.target.dataset.index);
            console.log(`Audio post ${newIndex} is now visible`);
            setCurrentIndex(newIndex);
            // Clear manual pause state when switching to a new post
            manuallyPausedRef.current.clear();
          }
        });
      },
      { 
        root: containerRef.current, 
        threshold: 0.7, // Increased threshold for better detection
        rootMargin: "0px"
      }
    );

    const slides = containerRef.current.querySelectorAll(".snap-slide");
    slides.forEach((slide) => {
      scrollObserver.current.observe(slide);
    });

    return () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
    };
  }, [sortedContent]);

  // Improved audio playback control
  useEffect(() => {
    console.log(`Audio playback control: currentIndex = ${currentIndex}, total posts = ${sortedContent.length}`);
    
    // ALWAYS stop all audio first when currentIndex changes
    audioRefs.current.forEach((audioEl, idx) => {
      if (audioEl) {
        console.log(`Stopping audio at index ${idx} (currentIndex changed to ${currentIndex})`);
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    });

    // Clear current audio ref since we stopped everything
    currentAudioRef.current = null;

    // Play current audio automatically (unless manually paused)
    const currentAudio = audioRefs.current.get(currentIndex);
    if (currentAudio && !manuallyPausedRef.current.has(currentIndex)) {
      console.log(`Auto-playing audio at index ${currentIndex}`);
      currentAudioRef.current = currentAudio;
      currentAudio.play().catch((e) => {
        console.warn(`Failed to auto-play audio at index ${currentIndex}:`, e);
      });
    } else if (currentAudio && manuallyPausedRef.current.has(currentIndex)) {
      console.log(`Audio at index ${currentIndex} is manually paused - not auto-playing`);
      currentAudioRef.current = currentAudio;
    } else {
      console.log(`No audio element found for index ${currentIndex}`);
      currentAudioRef.current = null;
    }
  }, [currentIndex, sortedContent.length]);

  // Debug logging
  useEffect(() => {
    console.log(`Current audio index: ${currentIndex}, Total posts: ${sortedContent.length}`);
  }, [currentIndex, sortedContent.length]);

  const handleTap = useCallback((idx) => {
    const audio = audioRefs.current.get(idx);
    if (!audio) return;

    if (audio.paused) {
      // If this is not the current audio, stop all others first
      if (idx !== currentIndex) {
        audioRefs.current.forEach((otherAudio, otherIdx) => {
          if (otherIdx !== idx && otherAudio) {
            otherAudio.pause();
            otherAudio.currentTime = 0;
          }
        });
        setCurrentIndex(idx);
        manuallyPausedRef.current.clear(); // Clear manual pause when switching
      }
      
      // Remove from manually paused set and play
      manuallyPausedRef.current.delete(idx);
      audio.play().catch((e) => console.warn("Manual play error", e));
      setTapIconType("pause");
    } else {
      // Add to manually paused set and pause
      manuallyPausedRef.current.add(idx);
      audio.pause();
      setTapIconType("play");
    }

    setShowTapIcon(true);
    clearTimeout(iconTimeout.current);
    iconTimeout.current = setTimeout(() => setShowTapIcon(false), 800);
  }, [currentIndex]);

  const handleTimeUpdate = useCallback(
    (idx, e) => {
      if (idx === currentIndex) setCurrentTime(e.target.currentTime);
    },
    [currentIndex]
  );

  const handleLoadedMetadata = useCallback(
    (idx, e) => {
      if (idx === currentIndex) setDuration(e.target.duration);
    },
    [currentIndex]
  );

  // Improved audio ref setter
  const setAudioRef = useCallback((idx, el) => {
    if (el) {
      audioRefs.current.set(idx, el);
      console.log(`Audio ref set for index ${idx}`);
    } else {
      audioRefs.current.delete(idx);
      console.log(`Audio ref removed for index ${idx}`);
    }
  }, []);

  if (postsError || beatsError) {
    return <p className="text-red-500 text-center">{postsError || beatsError}</p>;
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

        {sortedContent.length > 0 ? (
          sortedContent.map((content, idx) => (
            <div 
              key={`${content.type}-${content.id}`} 
              className="snap-slide w-full h-full" 
              data-index={idx}
              ref={idx === sortedContent.length - 1 ? lastPostRef : null}
            >
              <AudioPost
                profile={profile}
                post={content}
                isActive={idx === currentIndex}
                onTap={() => handleTap(idx)}
                currentTime={currentTime}
                duration={duration}
                showTapIcon={showTapIcon && idx === currentIndex}
                tapIconType={tapIconType}
                setAudioRef={(el) => setAudioRef(idx, el)}
                onTimeUpdate={(e) => handleTimeUpdate(idx, e)}
                onLoadedMetadata={(e) => handleLoadedMetadata(idx, e)}
                isLocked={content.type === "beat"}
                contentType={content.type}
              />
            </div>
          ))
        ) : (
          <div className="h-full w-full flex items-center justify-center snap-start">
            <p className="text-white text-sm sm:text-base">No audio available</p>
          </div>
        )}

        {(postsLoading || beatsLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioFeed;