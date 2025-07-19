import React, { useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayerControls = ({
  isActive,
  audioSrc,
  setAudioRef,
  onTimeUpdate,
  onLoadedMetadata,
  currentTime,
  duration,
  showTapIcon,
  tapIconType,
  onClick,
  isPreview = false
}) => {
  const audioRef = (el) => {
    setAudioRef(el);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* hidden audio */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        preload="auto"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
      
      {/* tap icon */}
      {showTapIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          {tapIconType === "play" ? (
            <FaPlay className="text-white text-6xl bg-black/50 rounded-full p-4" />
          ) : (
            <FaPause className="text-white text-6xl bg-black/50 rounded-full p-4" />
          )}
        </div>
      )}
      
      {/* Enhanced bottom progress bar */}
      <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 px-4 z-20">
        {/* Progress bar container with glassmorphism effect */}
        <div className="relative w-full h-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse" />
          
          {/* Progress track with gradient */}
          <div className="relative h-full w-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full">
            {/* Main progress bar with animated gradient */}
            <div
              className="relative h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
              
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-pink-400/50 blur-sm rounded-full" />
              
              {/* Progress indicator dot */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-500 animate-pulse">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              </div>
            </div>
            
            {/* Time indicators */}
            <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-white/80 font-medium">
              <span className="bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatTime(currentTime)}
              </span>
              <span className="bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatTime(duration)}
              </span>
            </div>
            
            {/* Waveform effect overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="flex items-end justify-center h-full space-x-0.5">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-white/60 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${Math.random() * 1 + 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center mt-2 space-x-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-white/70 text-xs font-medium">
            {isActive ? 'Playing' : 'Paused'}
          </span>
          {isPreview && (
            <span className="text-yellow-400 text-xs font-medium bg-yellow-400/20 px-2 py-0.5 rounded-full">
              Preview
            </span>
          )}
        </div>
      </div>
    </>
  );
};

// Helper function to format time
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default React.memo(AudioPlayerControls);