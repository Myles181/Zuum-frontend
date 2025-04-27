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

  

  return (
    <div className="absolute bottom-20 left-0 right-0 p-4 z-30 flex justify-between items-end">
      <div className="flex-1 flex items-center space-x-3"  onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${data?.profile_id}`);
          }}>
        <img
          src={data?.profile_picture || a}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white object-cover"
         
        />
        <div>
          <h4 className="font-bold text-white">{post.username}</h4>
          <p className="text-white text-sm">{post.caption}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-3 bg-black/50 py-2 rounded-full">
        <ReactionButton
          postId={post.id}
          reactions={data?.reactions}
          profileId={profileId}
        />
        
        <CommentModal 
              comments={data?.comments || []} 
              postId={post?.id} 
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
        
        <div>
          <MdCampaign className="text-2xl text-white cursor-pointer" />
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