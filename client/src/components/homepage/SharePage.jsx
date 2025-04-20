import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMusic, FaHeart, FaComment, FaShare } from "react-icons/fa";

import ReactionButton from "../details/Reactions";
import CommentModal from "../details/Comments";
import ShareModal from "../details/Share";
import defaultCover from "../../assets/image/11429433 1.svg";
import defaultProfilePic from "../../assets/icons/Mask group1.svg";
import AudioPlayerControls from "./feed/AudioPlayerControls";
import { useGetAudioPost } from "../../../Hooks/audioPosts/useCreateAudio";
import BottomNav from "./BottomNav";

const SharedAudioPage = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioRef, setAudioRef] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
   

  // Using the hook to fetch data instead of mock data
  const { data: audioData, loading, error } = useGetAudioPost(shareId);

  const handleAudioTap = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading shared audio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
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

  if (!audioData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl mb-4">Shared audio not found</div>
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
    <div className="h-screen w-full relative flex items-center justify-center bg-gray-900">
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-70"
        style={{ backgroundImage: `url(${audioData.cover_photo || defaultCover})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-black/50 p-1 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
            
              <span className="text-xs px-2 py-0.5 rounded-full text-white bg-purple-500">
                SHARED
              </span>
            </div>
          </div>
        </div>
        
        {/* Cover image */}
        <div className="flex-1 flex px-5 items-center justify-center" onClick={handleAudioTap}>
          <img
            src={audioData.cover_photo || defaultCover}
            alt="Music Cover"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        
        {/* Bottom actions */}
        <div className="absolute bottom-28 left-0 right-0 p-4 z-30 flex justify-between items-end">
          <div className="flex-1 flex items-center space-x-3">
            <div className="flex items-center space-x-3 flex-1">
              <img
                src={audioData.profile_picture || defaultProfilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-white">{audioData.username || audioData.artist}</h4>
                <p className="text-white text-sm">{audioData.caption || audioData.title || "Shared Audio"}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-3 bg-black/50 py-2 rounded-full">
            <ReactionButton
              postId={audioData.id}
              reactions={audioData.reactions}
              profileId={null} // User may not be logged in when viewing shared content
            />
            
            <CommentModal 
              comments={audioData.comments} 
              postId={audioData.id} 
            />
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <FaShare className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Audio player controls */}
      <AudioPlayerControls 
        isActive={true}
        audioSrc={audioData.audio_upload}
        setAudioRef={setAudioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        currentTime={currentTime}
        duration={duration}
        showTapIcon={!isPlaying}
        tapIconType="play"
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={audioData.caption || audioData.title || "Shared Audio"}
      />
      <BottomNav />
    </div>
  );
};

export default SharedAudioPage;