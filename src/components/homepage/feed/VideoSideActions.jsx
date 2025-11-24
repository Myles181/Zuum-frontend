import React, { useState } from "react";
import { FaHeart, FaComment, FaShareAlt, FaShare } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import a from "../../../assets/icons/Mask group1.svg";
import b from "../../../assets/icons/dots-icon.svg";

import ShareModal from "../../details/Share";
import { useNavigate } from "react-router-dom";
import ReactionButton from "../../details/VideoReactions";
import CommentModal from "../../details/VideoComments";

const VideoSideActions = ({ post, data, profileId }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  // Debug logging
  console.log('VideoSideActions props:', { post, data, profileId });
  console.log('Video post data:', data);
  console.log('Video reactions:', data?.reactions);
  console.log('Video comments:', data?.comments);

  return (
    <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 p-4 z-30 flex justify-between items-end">
      {/* Profile Section */}
      <div 
        className="flex-1 flex items-center space-x-3"  
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${data?.profile_id}`);
        }}
      >
        <img
          src={data?.profile_picture || a}
          alt="Profile"
          className="max-w-10 max-h-10 sm:max-w-12 sm:max-h-12 rounded-full border-2 border-white bg-gray-800 shadow-lg hover:scale-105 transition-transform duration-200"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm sm:text-base truncate drop-shadow-lg">{post.username}</h4>
          <p className="text-white text-xs sm:text-sm truncate drop-shadow-lg opacity-90">{post.caption}</p>
        </div>
      </div>
      
      {/* Redesigned Side Actions Container */}
      <div className="flex flex-col items-center space-y-6 sm:space-y-8 ml-4">
        {/* Like/Reaction Button */}
        <div className="flex flex-col items-center group">
          <ReactionButton
            postId={post.id}
            reactions={data?.reactions}
            profileId={profileId}
          />
        </div>
        
        {/* Comment Button */}
        <div className="flex flex-col items-center group">
          <CommentModal 
            comments={data?.comments || []} 
            postId={post?.id} 
          />
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
        
        {/* Campaign/Promotion Button */}
        <div className="flex flex-col items-center group">
          <div className="relative">
            <button className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 hover:scale-110 group-hover:shadow-lg border border-white/20">
              <MdCampaign className="text-white text-lg sm:text-xl" />
            </button>
            {/* Campaign label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                Promote
              </span>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={`${window.location.origin}/video/${post.id}`}
        title={data?.title ?? 'Check this out'}
        postId={post.id}
      />
    </div>
  );
};

export default VideoSideActions;