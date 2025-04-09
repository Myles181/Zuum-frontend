import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaComment, FaShareAlt, FaPlay, FaPause, FaMusic } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import VideoSideActions from "./VideoSideActions";
import a from "../../../assets/icons/Mask group1.svg";
import b from "../../../assets/icons/dots-icon.svg";
import { useGetVideoPost } from "../../../../Hooks/videoPosts/useCreateVideo";
import useProfile from "../../../../Hooks/useProfile";
import ShareModal from "../../details/Share";

const VideoPlayer = ({ post, index, isCurrent, defaultThumbnail, profileId }) => {
  const { data, loading, error } = useGetVideoPost(post?.id);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [thumbnail, setThumbnail] = useState(post.cover_photo || defaultThumbnail);
  const playButtonTimeout = useRef(null);
 

  console.log(data);


  // Generate thumbnail
  useEffect(() => {
    if (post.video_upload && !post.cover_photo) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = post.video_upload;
      video.currentTime = 2;
      video.onloadeddata = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/png");
          setThumbnail(thumbnailUrl);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          setThumbnail(defaultThumbnail);
        }
      };
      video.onerror = () => {
        console.error("Error loading video for thumbnail");
        setThumbnail(defaultThumbnail);
      };
    }
  }, [post.video_upload, post.cover_photo, defaultThumbnail]);

  // Auto-play current video
  useEffect(() => {
    if (videoRef.current) {
      if (isCurrent) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isCurrent]);

  const handleVideoClick = () => {
    togglePlayPause();
    setShowPlayButton(true);

    if (playButtonTimeout.current) {
      clearTimeout(playButtonTimeout.current);
    }
    playButtonTimeout.current = setTimeout(() => {
      setShowPlayButton(false);
    }, 800);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  return (
    <div
      className="relative w-full h-screen snap-start"
      style={{ scrollSnapAlign: "start" }}
      onClick={handleVideoClick}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={post.video_upload}
        poster={thumbnail}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
       
      />

     
      {/* Play/Pause button */}
      {showPlayButton && isCurrent && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/70 rounded-full p-5 cursor-pointer">
            {isPlaying ? (
              <FaPause className="text-white text-4xl" />
            ) : (
              <FaPlay className="text-white text-4xl" />
            )}
          </div>
        </div>
      )}

     
       {/* Progress bar */}
       <div className="absolute bottom-0  left-0 right-0 h-1 mb-13 bg-gray-400 z-20">
        <div
          className="h-full bg-[#2D8C72] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>


      {/* Side actions */}
      <VideoSideActions post={post}  data={data} profileId={profileId} />


     
    </div>

    
  );
};

export default VideoPlayer;