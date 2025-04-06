import React, { useState, useRef } from "react";
import { FaLock, FaPlay, FaPause, FaRegHeart, FaComment } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for the feed
const mockFeedData = [
  {
    id: 1,
    username: "Olusteve",
    artist: "Artist 1",
    caption: "Neon Dreams",
    likes: 243,
    comments: 56,
    cover_photo: "https://source.unsplash.com/random/600x600/?electronic",
    profile_picture: "https://source.unsplash.com/random/100x100/?dj",
    price: "2.99",
    duration: "3:45",
    type: "Single",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    username: "BeatMaster",
    artist: "Artist 2",
    caption: "Midnight Grooves",
    likes: 187,
    comments: 32,
    cover_photo: "https://source.unsplash.com/random/600x600/?music",
    profile_picture: "https://source.unsplash.com/random/100x100/?producer",
    price: "3.49",
    duration: "4:12",
    type: "EP",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    username: "SynthWave",
    artist: "Artist 3",
    caption: "Retro Future",
    likes: 512,
    comments: 89,
    cover_photo: "https://source.unsplash.com/random/600x600/?synthwave",
    profile_picture: "https://source.unsplash.com/random/100x100/?musician",
    price: "1.99",
    duration: "2:58",
    type: "Single",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    username: "BassLord",
    artist: "Artist 4",
    caption: "Deep Resonance",
    likes: 321,
    comments: 42,
    cover_photo: "https://source.unsplash.com/random/600x600/?bass",
    profile_picture: "https://source.unsplash.com/random/100x100/?artist",
    price: "4.99",
    duration: "5:21",
    type: "Album",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
];

const FeedItem = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

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

  const handleLockClick = () => {
    setIsLocked(false);
  };

  const handleBackClick = () => {
    setIsLocked(true);
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    clearInterval(timerRef.current);
    setTimeLeft(10);
  };

  return (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg bg-white">
      <audio 
        ref={audioRef} 
        src={post.audio_url}
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
            timeLeft={timeLeft}
          />
        ) : (
          <UnlockedState 
            post={post}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            handleBackClick={handleBackClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const LockedState = ({ post, isPlaying, togglePlayPause, handleLockClick, timeLeft }) => {
  return (
    <motion.div 
      key="locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full min-h-[500px]"
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md opacity-70"
        style={{ backgroundImage: `url(${post.cover_photo})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img
              src={post.profile_picture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <h4 className="font-medium text-white">{post.username}</h4>
              <p className="text-xs text-white/80">{post.artist}</p>
            </div>
          </div>
          
          <motion.button 
            onClick={handleLockClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <FaLock className="text-white text-lg" />
          </motion.button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/20"
          >
            <img
              src={post.cover_photo}
              alt="Music Cover"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{post.caption}</h2>
            <p className="text-white/80">{post.type} • {post.duration}</p>
          </div>
          
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <FaPause className="text-white" />
                <span className="text-white/90">Pause ({timeLeft}s)</span>
              </>
            ) : (
              <>
                <FaPlay className="text-white" />
                <span className="text-white/90">Play 10s Preview</span>
              </>
            )}
          </motion.button>
        </div>
        
        <div className="flex justify-between text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <FaRegHeart />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UnlockedState = ({ post, isPlaying, togglePlayPause, handleBackClick }) => {
  return (
    <motion.div 
      key="unlocked"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{post.caption}</h2>
        <button 
          onClick={handleBackClick}
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </button>
      </div>
      
      <div className="flex justify-center mb-6">
        <img
          src={post.cover_photo}
          alt="Music Cover"
          className="w-64 h-64 rounded-xl object-cover shadow-md"
        />
      </div>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">{post.artist}</p>
        <p className="text-gray-500">{post.type} • {post.duration}</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <motion.button
          onClick={togglePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#2D8C72] text-white px-8 py-3 rounded-full flex items-center space-x-2"
        >
          {isPlaying ? (
            <FaPause className="text-xl" />
          ) : (
            <FaPlay className="text-xl" />
          )}
          <span>{isPlaying ? "Pause" : "Play Full Track"}</span>
        </motion.button>
      </div>
      
      <div className="flex justify-between text-gray-500 text-sm">
        <div className="flex items-center space-x-1">
          <FaRegHeart />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaComment />
          <span>{post.comments}</span>
        </div>
      </div>
    </motion.div>
  );
};

const PurchaseFeed = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Music Feed</h1>
      
      <div className="space-y-4">
        {mockFeedData.map(post => (
          <FeedItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PurchaseFeed;