import React, { useEffect, useState } from "react";
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
  const [showStatus, setShowStatus] = useState(true);

  // Handle status visibility with fade-out effect
  useEffect(() => {
    // Always show status initially, then fade out after 2 seconds regardless of state
    setShowStatus(true);
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isActive]); // Trigger when isActive changes (play/pause state changes)

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
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          {tapIconType === "play" ? (
            <FaPlay className="text-white text-6xl bg-black/50 rounded-full p-4" />
          ) : (
            <FaPause className="text-white text-6xl bg-black/50 rounded-full p-4" />
          )}
        </div>
      )}
      
      {/* Status indicator - moved even higher up with fade effect */}
      <div className={`absolute bottom-40 sm:bottom-44 left-0 right-0 flex items-center justify-center z-40 transition-opacity duration-500 ${showStatus ? 'opacity-100' : 'opacity-30'}`}>
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-white/90 text-sm font-medium">
            {isActive ? 'Playing' : 'Paused'}
          </span>
          {isPreview && (
            <span className="text-yellow-400 text-xs font-medium bg-yellow-400/20 px-2 py-0.5 rounded-full">
              Preview
            </span>
          )}
        </div>
      </div>
      
      {/* Enhanced bottom progress bar - moved even higher up */}
      <div className="absolute bottom-28 sm:bottom-32 left-0 right-0 px-4 z-30">
        {/* Progress bar container with glassmorphism effect */}
        <div className="relative w-full h-4 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-2xl overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse" />
          
          {/* Progress track with gradient */}
          <div className="relative h-full w-full bg-gradient-to-r from-gray-800/70 to-gray-700/70 rounded-full">
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
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-purple-500 animate-pulse">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              </div>
            </div>
            
            {/* Time indicators */}
            <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-white/90 font-medium">
              <span className="bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatTime(currentTime)}
              </span>
              <span className="bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {formatTime(duration)}
              </span>
            </div>
            
            {/* Waveform effect overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="flex items-end justify-center h-full space-x-0.5">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-white/80 rounded-full animate-pulse"
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
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-bounce"
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