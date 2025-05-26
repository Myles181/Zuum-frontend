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
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const limit = 10;
  const beatsLimit = 10;
  const containerRef = useRef(null);
  const loadObserver = useRef(null);
  const iconTimeout = useRef(null);
  const scrollObserver = useRef(null);
  const audioRefs = useRef([]);
  const backgroundAudioRef = useRef(null);

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

  const combinedContent = useMemo(
    () => [...allPosts, ...allBeats].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    ),
    [allPosts, allBeats]
  );

  // Update current audio URL when index changes
  useEffect(() => {
    if (combinedContent.length > 0 && currentIndex < combinedContent.length) {
      const currentContent = combinedContent[currentIndex];
      const audioUrl = currentContent.type === "audio" 
        ? currentContent.audio_upload 
        : currentContent.audio_file || currentContent.audio_upload;
      setCurrentAudioUrl(audioUrl || null);
    }
  }, [currentIndex, combinedContent]);

  // Sync background audio with current audio
  useEffect(() => {
    if (backgroundAudioRef.current && currentAudioUrl) {
      backgroundAudioRef.current.src = currentAudioUrl;
      backgroundAudioRef.current.load();
    }
  }, [currentAudioUrl]);

  useEffect(() => {
    if (posts.length) {
      setAllPosts((prev) => [
        ...prev,
        ...posts
          .filter((p) => !prev.some((q) => q.id === p.id))
          .map((post) => ({ ...post, isLiked: post.isLiked || false, type: "audio" })),
      ]);
    }
  }, [posts]);

  useEffect(() => {
    if (beats?.length) {
      setAllBeats((prev) => [
        ...prev,
        ...beats
          .filter((b) => !prev.some((q) => q.id === b.id))
          .map((beat) => ({
            ...beat,
            type: "beat",
            audio_upload: beat.audio_upload || beat.audio_file,
            cover_photo: beat.cover_photo || beat.cover_image,
            username: beat.username || beat.artist,
            caption: beat.caption || beat.title,
            price: beat.amount ? beat.amount / 100 : 0,
          })),
      ]);
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

  useEffect(() => {
    if (!containerRef.current || !combinedContent.length) return;

    scrollObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newIndex = Number(entry.target.dataset.index);
            setCurrentIndex(newIndex);
          }
        });
      },
      { root: containerRef.current, threshold: 0.6 }
    );

    const slides = containerRef.current.querySelectorAll(".snap-slide");
    slides.forEach((slide) => scrollObserver.current.observe(slide));

    return () => scrollObserver.current?.disconnect();
  }, [combinedContent]);

  useEffect(() => {
    audioRefs.current.forEach((audioEl, idx) => {
      if (!audioEl) return;
      if (idx === currentIndex) {
        audioEl.play().catch((e) => console.warn("Playback failed", e));
      } else {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    });
  }, [currentIndex, combinedContent]);

  const handleTap = useCallback((idx) => {
    const audio = audioRefs.current[idx];
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((e) => console.warn("Playback error", e));
      setTapIconType("pause");
    } else {
      audio.pause();
      setTapIconType("play");
    }

    setShowTapIcon(true);
    clearTimeout(iconTimeout.current);
    iconTimeout.current = setTimeout(() => setShowTapIcon(false), 800);
  }, []);

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

  if (postsError || beatsError) {
    return <p className="text-red-500 text-center">{postsError || beatsError}</p>;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden ">
      {/* Blurred background audio visualization */}
      {currentAudioUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <audio
            ref={backgroundAudioRef}
            autoPlay
            loop
            muted
            className="hidden"
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-black/70 to-black filter blur-2xl opacity-70">
            {/* You could add audio visualization here if desired */}
          </div>
        </div>
      )}

      {/* Phone container */}
      <div className="relative flex justify-center items-center w-full h-full">
        <div
          ref={containerRef}
          className="h-full w-full md:w-[414px] md:my-4 overflow-y-scroll snap-y snap-mandatory bg-black relative z-10"
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

          {combinedContent.map((content, idx) => (
            <div 
              key={`${content.type}-${content.id}`}
              className="snap-slide w-full h-full"
              data-index={idx}
              ref={idx === combinedContent.length - 1 ? lastPostRef : null}
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
                setAudioRef={(el) => (audioRefs.current[idx] = el)}
                onTimeUpdate={(e) => handleTimeUpdate(idx, e)}
                onLoadedMetadata={(e) => handleLoadedMetadata(idx, e)}
                isLocked={content.type === "beat"}
                contentType={content.type}
              />
            </div>
          ))}

          {(postsLoading || beatsLoading) && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioFeed;