import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaMusic, 
  FaLock, 
  FaShoppingCart, 
  FaHeart, 
  FaComment, 
  FaShareAlt,
  FaBroadcastTower,
  FaShare
} from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import a from "../../../assets/icons/Mask group1.svg";
import b from "../../../assets/icons/dots-icon.svg";
import c from "../../../assets/image/11429433 1.svg";
import AudioPlayerControls from "./AudioPlayerControls";
import ReactionButton from "../../details/Reactions";
import ShareModal from "../../details/Share";
import CommentModal from "../../details/Comments";
import StreamingPlatformsModal from "../../details/Streams";
import useProfile from "../../../../Hooks/useProfile";
import useAudioPosts from "../../../../Hooks/audioPosts/useCreateAudio";
import { Share, Share2 } from "lucide-react";

const AudioPost = React.forwardRef(({ 
  post, 
  profile,
  isActive, 
  onTap, 
  currentTime,
  duration,
  showTapIcon,
  tapIconType,
  setAudioRef,
  onTimeUpdate,
  onLoadedMetadata,
  contentType = 'audio',
  ...props
}, ref) => {
  const navigate = useNavigate();
 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { loading, error, posts } = useAudioPosts(1, 10, post.id);
  const data = posts.length > 0 ? posts[0] : null;
  const [showStreamingModal, setShowStreamingModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const isBeat = contentType === 'beat';
  

  const handleBeatAction = (e) => {
    e.stopPropagation();
    navigate(`/beats/${post.id}`);
  };

  const handlePurchaseClick = (e) => {
    e.stopPropagation();
    setShowPurchaseModal(true);
  };

  const toggleStreamingModal = (e) => {
    e.stopPropagation();
    setShowStreamingModal(!showStreamingModal);
  };

  const getContentInfo = () => {
    if (isBeat) {
      return {
        title: post.caption || 'Untitled Beat',
        artist: post.artist || post.username || 'Producer',
        badgeText: 'BEAT',
        badgeColor: 'bg-yellow-500',
      };
    }
    return {
      title: post.caption || 'Audio',
      artist: post.artist || post.username || 'Original Sound',
      badgeText: 'AUDIO',
      badgeColor: 'bg-purple-500'
    };
  };

  const contentInfo = getContentInfo();

  if (isBeat) {
    return (
      <div
        {...props}
        ref={ref}
        className="h-screen w-full snap-start relative flex items-center justify-center snap-slide bg-black"
        onClick={handleBeatAction}
      >
        {/* Beat background */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-50"
          style={{ backgroundImage: `url(${post.cover_photo || c})` }}
        />
        
        {/* Beat content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center  justify-center p-6 text-center">
          {/* Promotional badge */}
          <div className="absolute top-6 left-6 flex items-center mt-10 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold">
            <MdCampaign className="mr-1" />
            PROMOTIONAL BEAT
          </div>
          
          {/* Cover art with pulse animation */}
          <div className="relative mb-8">
            <img
              src={post.cover_photo || c}
              alt="Beat Cover"
              className="w-64 h-64 object-cover rounded-lg border-4 border-white/20 shadow-xl"
            />
            <div className="absolute inset-0 rounded-lg border-4 border-transparent animate-ping opacity-20" />
          </div>
          
          {/* Beat info */}
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">{contentInfo.title}</h2>
            <p className="text-gray-300 mb-4">{contentInfo.artist}</p>
            
          
            {/* Price/CTA */}
            <div className="bg-black/70 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FaLock className="text-yellow-500 mr-2" />
                  <span className="text-white font-medium">This beat is locked </span>
                </div>
                <span className="text-green-400 font-bold text-lg"> 
                 ₦{post.amount || '49.99'}
                </span>
              </div>
              <button 
                onClick={handlePurchaseClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <FaShoppingCart className="mr-2" />
                View Beat
              </button>
            </div>
          </div>
          
          {/* Audio controls for preview */}
          <div className="absolute bottom-0 left-0 right-0 px-6">
            <AudioPlayerControls 
              isActive={isActive}
              audioSrc={post.preview_audio || post.audio_upload}
              setAudioRef={setAudioRef}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              currentTime={currentTime}
              duration={duration}
              showTapIcon={showTapIcon}
              tapIconType={tapIconType}
              onClick={e => e.stopPropagation()}
              isPreview={true}
            />
            <p className="text-center text-gray-400 mb-15 text-xs mt-2">
              Preview only - Purchase for full version
            </p>
          </div>
        </div>
        
      
        
        {/* Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={`${window.location.origin}/beats/${post.id}`}
          title={contentInfo.title}
          postId={post.id}
        />
      </div>
    );
  }

  // Regular Audio Post
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
      <div className="relative z-10 w-full h-full">
        {/* Top bar */}
        <div className="absolute top-13 sm:top-12 left-0 right-0 p-4 z-30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaMusic className="text-white text-xl" />
            <span className="text-white font-semibold text-sm">
              {contentInfo.artist}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${contentInfo.badgeColor}`}>
              {contentInfo.badgeText}
            </span>
          </div>
          <img
            src={b}
            className="w-6 h-6 cursor-pointer"
            alt="Options"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Cover image - fills entire space */}
        <div className="w-full h-full flex items-center justify-center px-5">
          <img
            src={post.cover_photo || c}
            alt="Music Cover"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        
        {/* Bottom actions */}
        <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 p-4 z-10 flex justify-between items-end">
          <div className="flex-1 flex items-center space-x-3">
            <div 
              className="flex items-center space-x-3 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (profile?.id) {
                  navigate(`/profile/${post.profile_id}`);
                } 
              }}
            >
              <img
                src={post.profile_picture || a}
                alt="Profile"
                className="max-w-10 max-h-10 sm:max-w-12 sm:max-h-12 rounded-full border-2 border-white bg-gray-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm sm:text-base truncate">{post.username || post.artist}</h4>
                <p className="text-white text-xs sm:text-sm truncate">{contentInfo.title}</p>
              </div>
            </div>
          </div>
          
          {/* Redesigned Side Actions Container */}
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 ml-4">
            {/* Like/Reaction Button */}
            <div className="flex flex-col items-center group">
              <ReactionButton
                postId={post?.id}
                reactions={data?.reactions || []}
                profileId={profile?.id}
              />
            </div>
            
            {/* Comment Button */}
            <div className="flex flex-col items-center group">
              <CommentModal 
                comments={data?.comments || []} 
                postId={post?.id} 
              />
            </div>
            
            {/* Streaming Button */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <button 
                  onClick={toggleStreamingModal}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 hover:scale-110 group-hover:shadow-lg border border-white/20"
                >
                  <FaBroadcastTower className="text-white text-lg sm:text-xl" />
                </button>
                {/* Streaming label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                    Stream
                  </span>
                </div>
              </div>
            </div>
            
            {/* Share Button */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShareModalOpen(true);
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 group-hover:shadow-lg"
                >
                  <FaShare className="text-white text-lg sm:text-xl" />
                </button>
                {/* Share label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                    Share
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        onClick={e => e.stopPropagation()}
      />

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={`${window.location.origin}/music/${post.id}`}
        title={contentInfo.title}
        postId={post.id}
      />

      <StreamingPlatformsModal
        isOpen={showStreamingModal}
        onClose={() => setShowStreamingModal(false)}
        platforms={{
          spotify: post.spotify,
          apple_music: post.apple_music,
          youtube_music: post.youtube_music,
          boomplay: post.boomplay,
          audiomark: post.audiomark
        }}
      />
    </div>
  );
});

export default AudioPost;