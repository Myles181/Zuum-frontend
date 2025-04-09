import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComment, FaShareAlt, FaHeart, FaMusic, FaShare, FaStream, FaPodcast, FaBroadcastTower, FaLock } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import a from "../../../assets/icons/Mask group1.svg";
import b from "../../../assets/icons/dots-icon.svg";
import c from "../../../assets/image/11429433 1.svg";
import AudioPlayerControls from "./AudioPlayerControls";
import useAudioPosts from "../../../../Hooks/audioPosts/useCreateAudio";
import ReactionButton from "../../details/Reactions";
import ShareModal from "../../details/Share";
import CommentModal from "../../details/Comments";
import StreamingPlatformsModal from "../../details/Streams";

const AudioPost = React.forwardRef(({ 
  post, 
  isActive, 
  onTap, 
  onLike,
  currentTime,
  duration,
  showTapIcon,
  tapIconType,
  setAudioRef,
  onTimeUpdate,
  onLoadedMetadata,
  isLocked = true,
  ...props
}, ref) => {
  const navigate = useNavigate();
  const { loading, error, posts } = useAudioPosts(1, 10, post.id);
  const data = posts.length > 0 ? posts[0] : null;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showStreamingModal, setShowStreamingModal] = useState(false);

  const toggleStreamingModal = (e) => {
    e.stopPropagation();
    setShowStreamingModal(!showStreamingModal);
  };

  const handleVisitProfile = () => {
    navigate(`/profile/${data?.profile_id}`);
  };

  return (
    <div
      {...props}
      ref={ref}
      className="h-screen w-full snap-start relative flex items-center justify-center snap-slide"
      onClick={onTap}
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-70"
        style={{ backgroundImage: `url(${post.cover_photo || c})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Main content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaMusic className="text-white text-xl" />
            <span className="text-white font-semibold text-sm">
              {post.artist || "Original Sound"}
            </span>
          </div>
          <img
            src={b}
            className="w-6 h-6 cursor-pointer"
            alt="Options"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Cover image */}
        <div className="flex-1 flex px-5 items-center justify-center">
          <img
            src={post.cover_photo || c}
            alt="Music Cover"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        
        {/* Bottom actions */}
        <div className="absolute bottom-20 left-0 right-0 p-4 z-30 flex justify-between items-end">
          <div className="flex-1 flex items-center space-x-3 mb-8">
            <div 
              className="flex items-center space-x-3 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${data?.profile_id}`);
              }}
            >
              <img
                src={data?.profile_picture || a}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-white">{post.username}</h4>
                <p className="text-white text-sm">{post.caption}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-3 bg-black/50 py-2 rounded-full">
            <ReactionButton
              postId={post}
              reactions={data?.reactions}
              profileId={data?.profile_id}
            />
            <CommentModal comments={data?.comments} postId={data?.id} />
            
            {/* Streaming platforms button */}
            <button 
  onClick={toggleStreamingModal}
  className="text-white hover:text-gray-200 transition-colors p-2"
>
  <FaBroadcastTower className="text-xl" />
</button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <FaShare className="text-xl" />
            </button>
            
            <div>
              <MdCampaign className="text-2xl text-white cursor-pointer" />
            </div>
          </div>
      
        </div>
        {isLocked && (
            <div 
              className="bg-black/70 backdrop-blur-sm p-2 mx-3 mb-15 rounded-xl w-[80%]  border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-800 p-3 rounded-full">
                  <FaLock className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h5 className="text-white text-[15px]">This audio is locked</h5>
                 
                </div>
                <button 
                  onClick={handleVisitProfile}
                  className="bg-[#2D8C72] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#257a63] transition-colors"
                >
                  Visit
                </button>
              </div>
            </div>
          )}
      </div>
      
      {/* Audio player controls */}
      <AudioPlayerControls 
        isActive={isActive}
        audioSrc={post.audio_upload}
        setAudioRef={setAudioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        currentTime={currentTime}
        duration={duration}
        showTapIcon={showTapIcon}
        tapIconType={tapIconType}
      />

      {/* Share modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={`${window.location.origin}/music/${post}`}
        title={data?.caption || "Check out this track"}
      />

      {/* Streaming platforms modal (bottom sheet) */}
      <StreamingPlatformsModal
        isOpen={showStreamingModal}
        onClose={() => setShowStreamingModal(false)}
        platforms={{
          spotify: data?.spotify,
          apple_music: data?.apple_music,
          youtube_music: data?.youtube_music,
          boomplay: data?.boomplay,
          audiomark: data?.audiomark
        }}
      />
     
    </div>
  );
});

export default AudioPost;