import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaComment, FaShare, FaMusic } from "react-icons/fa";
import ReactPlayer from "react-player";

import defaultProfilePic from "../../../assets/icons/Mask group1.svg";
import { useGetVideoPost } from "../../../../Hooks/videoPosts/useCreateVideo";
import ReactionButton from "../../details/VideoReactions";
import CommentModal from "../../details/VideoComments";
import ShareModal from "../../details/Share";
import BottomNav from "../BottomNav";
import Spinner from "../../Spinner";

const VideoViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play by default
  const [isMuted, setIsMuted] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  // Using the video post hook to fetch single video
  const { data: videoData, loading, error } = useGetVideoPost(id);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-white text-xl mb-4">{error}</div>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="text-white text-xl mb-4">Video not found</div>
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-black">
      {/* Video Player */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ReactPlayer
          ref={playerRef}
          url={videoData.video_url}
          playing={isPlaying}
          muted={isMuted}
          volume={volume}
          width="100%"
          height="100%"
          style={{ objectFit: "cover" }}
          onClick={handlePlayPause}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
            },
          }}
        />
        
        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 z-10 flex items-center justify-center"
            onClick={handlePlayPause}
          >
            <div className="bg-black/50 rounded-full p-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-black/50 p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Volume control */}
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute} className="text-white">
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-purple-500"
          />
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center space-y-6">
        {/* Profile picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={videoData.profile_picture || defaultProfilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500 rounded-full p-1">
              <FaHeart className="text-white text-xs" />
            </div>
          </div>
        </div>
        
        {/* Reaction button */}
        <ReactionButton
          postId={videoData.id}
          reactions={videoData.reactions}
        />
        
        {/* Comment button */}
        <button 
          onClick={() => setIsCommentModalOpen(true)}
          className="flex flex-col items-center text-white"
        >
          <FaComment className="text-2xl" />
          <span className="text-xs">{videoData.comments?.length || 0}</span>
        </button>
        
        {/* Share button */}
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="flex flex-col items-center text-white"
        >
          <FaShare className="text-2xl" />
          <span className="text-xs">{videoData.shares || 0}</span>
        </button>
        
        {/* Music/sound */}
        {videoData.audio && (
          <div className="rounded-full border border-white p-2 animate-spin-slow">
            <FaMusic className="text-white" />
          </div>
        )}
      </div>
      
      {/* Video info at bottom left */}
      <div className="absolute left-4 bottom-28 z-20 max-w-xs">
        <h3 className="text-white font-bold text-lg">{videoData.username}</h3>
        <p className="text-white text-sm">{videoData.caption}</p>
        
        {/* Music/sound info */}
        {videoData.audio && (
          <div className="flex items-center mt-2">
            <FaMusic className="text-white mr-2" />
            <span className="text-white text-sm">{videoData.audio.name}</span>
          </div>
        )}
      </div>
      
      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        comments={videoData.comments} 
        postId={videoData.id}
      />
      
     
      
      <BottomNav />
    </div>
  );
};

export default VideoViewerPage;