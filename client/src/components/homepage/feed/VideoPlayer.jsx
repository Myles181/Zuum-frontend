import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import VideoSideActions from "./VideoSideActions";
import { useGetVideoPost } from "../../../../Hooks/videoPosts/useCreateVideo";
import ShareModal from "../../details/Share";

const VideoPlayer = ({ post, index, isCurrent, defaultThumbnail, profileId, setVideoRef, onManualPause }) => {
  const { data, loading: postLoading, error } = useGetVideoPost(post?.id);
  const videoRef = useRef(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false); // Track manual pause state
  const [showStatus, setShowStatus] = useState(true);

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState(null);
  const playButtonTimeout = useRef(null);

  // Handle status visibility with fade-out effect
  useEffect(() => {
    // Always show status initially, then fade out after 2 seconds regardless of state
    setShowStatus(true);
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isPlaying]); // Trigger when isPlaying changes (play/pause state changes)

  // Set video ref for feed control
  useEffect(() => {
    if (setVideoRef) {
      setVideoRef(videoRef.current);
    }
  }, [setVideoRef]);

  // Generate thumbnail from video
  useEffect(() => {
    if (post.video_upload) {
      let video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = post.video_upload;

      const handleLoadedMetadata = () => {
        const seekTime = Math.min(2, video.duration / 2);
        video.currentTime = seekTime;
      };
      
      const handleSeeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL("image/png"));
        } catch (err) {
          console.error("Thumbnail generation error:", err);
          setThumbnail(post.cover_photo || null);
        }
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("seeked", handleSeeked);
      video.addEventListener("error", () => setThumbnail(post.cover_photo || null));

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("seeked", handleSeeked);
        video.pause();
        video.src = "";
        video.load();
        video = null;
      };
    } else if (post.cover_photo) {
      setThumbnail(post.cover_photo);
    }
  }, [post.video_upload, post.cover_photo]);

  // Handle auto-play from feed
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isCurrent && !isManuallyPaused) {
      console.log(`Video ${index} is now current - auto-playing`);
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          console.log(`Successfully auto-played video at index ${index}`);
        })
        .catch((error) => {
          console.warn(`Failed to auto-play video at index ${index}:`, error);
          setIsPlaying(false);
        });
    } else if (!isCurrent) {
      console.log(`Video ${index} is no longer current - pausing`);
      videoRef.current.pause();
      setIsPlaying(false);
      setIsManuallyPaused(false); // Reset manual pause when switching away
    }
  }, [isCurrent, index, isManuallyPaused]);

  // Update progress
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (vid && vid.duration) {
      setProgress((vid.currentTime / vid.duration) * 100);
    }
  };

  // Toggle play/pause on click
  const handleVideoClick = () => {
    const vid = videoRef.current;
    if (!vid) return;
    
    if (vid.paused) {
      console.log(`Manual play for video ${index}`);
      setIsManuallyPaused(false);
      if (onManualPause) onManualPause(false); // Notify feed
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      console.log(`Manual pause for video ${index}`);
      setIsManuallyPaused(true);
      if (onManualPause) onManualPause(true); // Notify feed
      vid.pause();
      setIsPlaying(false);
    }
    
    setShowPlayButton(true);
    clearTimeout(playButtonTimeout.current);
    playButtonTimeout.current = setTimeout(() => setShowPlayButton(false), 800);
  };

  // Video load events
  const handleCanPlay = () => setIsVideoLoading(false);
  const handleError = () => {
    console.error("Video failed to load");
    setIsVideoLoading(false);
  };

  return (
    <div
      className="relative w-full h-screen snap-start bg-black"
      style={{ scrollSnapAlign: "start" }}
      onClick={handleVideoClick}
    >
      {/* Loading overlay: black bg with thumbnail (if any) */}
      {isVideoLoading && (
        <>
          <div className="absolute inset-0 bg-black z-30" />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="video thumbnail"
              className="absolute inset-0 w-full h-full object-cover z-30"
            />
          )}
          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white font-medium">Loading...</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actual video */}
      <video
        ref={videoRef}
        src={post.video_upload}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onCanPlay={handleCanPlay}
        onError={handleError}
        style={{ display: isVideoLoading ? "none" : "block" }}
      />

      {/* Play/Pause button overlay */}
      {showPlayButton && isCurrent && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-black/70 rounded-full p-5 cursor-pointer">
            {isPlaying ? <FaPause className="text-white text-4xl" /> : <FaPlay className="text-white text-4xl" />}
          </div>
        </div>
      )}

      {/* Status indicator - moved even higher up with fade effect */}
      <div className={`absolute bottom-28 sm:bottom-32 left-0 right-0 flex items-center justify-center z-30 transition-opacity duration-500 ${showStatus ? 'opacity-100' : 'opacity-30'}`}>
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-white/90 text-sm font-medium">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Animated progress bar - moved even higher up */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 px-4 z-20">
        <div className="relative w-full h-4 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-2xl overflow-hidden">
          {/* Background track */}
          <div className="relative h-full w-full bg-gradient-to-r from-gray-800/70 to-gray-700/70 rounded-full">
            {/* Progress bar */}
            <div
              className="h-full bg-gradient-to-r from-[#2D8C72] to-green-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
              
              {/* Progress indicator dot */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-[#2D8C72] animate-pulse">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              </div>
            </div>
            
            {/* Loading animation overlay */}
            {isVideoLoading && (
              <div className="absolute top-0 left-0 h-full bg-[#2D8C72]/70 rounded-full" style={{
                width: '30%',
                animation: 'loadingBar 0.5s infinite ease-in-out',
              }}/>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      {/* Side actions & share */}
      <VideoSideActions post={post} data={data} profileId={profileId} />
      <ShareModal />
    </div>
  );
};

export default VideoPlayer;