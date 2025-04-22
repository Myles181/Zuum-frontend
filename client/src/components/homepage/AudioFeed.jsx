// AudioFeed.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import useAudioPosts from "../../../Hooks/audioPosts/useCreateAudio";
import AudioPost from "./feed/AudioPost";
import { useFetchBeats } from "../../../Hooks/beats/useBeats";

const AudioFeed = ({profile}) => {
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
  const audioRefs = useRef([]);

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

  console.log(beats);
  

  const combinedContent = useMemo(() => {
    return [...allPosts, ...allBeats].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [allPosts, allBeats]);

  useEffect(() => {
    if (posts.length) {
      setAllPosts((prev) => [
        ...prev,
        ...posts
          .filter((p) => !prev.some((q) => q.id === p.id))
          .map((post) => ({
            ...post,
            isLiked: post.isLiked || false,
            type: "audio",
          })),
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
            setCurrentIndex(Number(entry.target.dataset.index));
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6,
      }
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
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ overscrollBehavior: "none" }}
    >
      {combinedContent.map((content, idx) => (
        <AudioPost
          profile={profile}
          key={`${content.type}-${content.id}`}
          post={content}
          isActive={idx === currentIndex}
          onTap={() => handleTap(idx)}
          currentTime={currentTime}
          duration={duration}
          showTapIcon={showTapIcon && idx === currentIndex}
          tapIconType={tapIconType}
          data-index={idx}
          ref={idx === combinedContent.length - 1 ? lastPostRef : null}
          setAudioRef={(el) => (audioRefs.current[idx] = el)}
          onTimeUpdate={(e) => handleTimeUpdate(idx, e)}
          onLoadedMetadata={(e) => handleLoadedMetadata(idx, e)}
          isLocked={content.type === "beat"}
          contentType={content.type}
        />
      ))}

      {(postsLoading || beatsLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default AudioFeed;
