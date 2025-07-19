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

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState(null);
  const playButtonTimeout = useRef(null);

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
          <div className="absolute inset-0 bg-black z-20" />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="video thumbnail"
              className="absolute inset-0 w-full h-full object-cover z-20"
            />
          )}
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
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-black/70 rounded-full p-5 cursor-pointer">
            {isPlaying ? <FaPause className="text-white text-4xl" /> : <FaPlay className="text-white text-4xl" />}
          </div>
        </div>
      )}

      {/* Animated progress bar */}
      <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 h-1 bg-gray-400 z-20">
        <div
          className="h-full bg-[#2D8C72] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        {isVideoLoading && (
          <div className="absolute top-0 left-0 h-full bg-[#2D8C72]/70" style={{
            width: '30%',
            animation: 'loadingBar 0.5s infinite ease-in-out',
          }}/>
        )}
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