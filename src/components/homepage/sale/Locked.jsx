import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LockedState from "./FeedStyle";
import UnlockedState from "./SaleDetails";


const LockedMusicPlayer = ({ post }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Default data
  const defaultData = {
    username: "Olusteve",
    artist: "Artist",
    caption: "Untitled Track",
    likes: 243,
    comments: 56,
    cover_photo: "https://source.unsplash.com/random/600x600/?album,cover",
    profile_picture: "https://source.unsplash.com/random/100x100/?artist",
    price: "2.99",
    duration: "3:45",
    type: "Single",
    description: "This captivating track blends electronic elements with organic instrumentation, creating a unique sonic experience that transports listeners to another dimension.",
    bpm: 128,
    key: "D Minor",
    releaseDate: "May 2023",
    tags: ["Electronic", "Ambient", "Chill"],
    streamingLinks: {
      spotify: "#",
      apple: "#",
      youtube: "#",
      soundcloud: "#"
    }
  };

  post = { ...defaultData, ...post };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLockClick = () => {
    setIsLocked(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      clearInterval(timerRef.current);
    } else {
      audioRef.current.play();
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    if (!duration) setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleBuyClick = () => {
    // Removed alert popup
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto bg-white  shadow-lg overflow-hidden font-sans">
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={post.audio_upload || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setDuration(audioRef.current.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          clearInterval(timerRef.current);
          setTimeLeft(10);
        }}
      />

      <AnimatePresence>
        {isLocked ? (
          <LockedState
            post={post}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            handleLockClick={handleLockClick}
          />
        ) : (
            // ran out of naming ideas, so this is the unlocked state
          <UnlockedState
            post={post}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            currentTime={currentTime}
            duration={duration}
            timeLeft={timeLeft}
            formatTime={formatTime}
            handleBuyClick={handleBuyClick}
            setIsLiked={setIsLiked}
            isLiked={isLiked}
            setIsLocked={setIsLocked}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LockedMusicPlayer;