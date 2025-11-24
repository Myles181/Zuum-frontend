import React from 'react';
import { FiShare2 } from 'react-icons/fi';
import { IoRocketOutline, IoRocketSharp } from 'react-icons/io5';
import ReactionButton from '../../details/Reactions';


const VideoInfo = ({ 
  data, 
  profile, 
  onUserClick, 
  onShare, 
  onPromote, 
  isShared, 
  isPromoted 
}) => {
  return (
    <div className="bg-white p-4">
      <h1 className="text-xl font-bold">{data.caption}</h1>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onUserClick(data.profile_id)}
        >
          <img
            src={data.profile_picture}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{data.username}</h3>
          </div>
        </div>
        
        <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm font-medium">
          Follow
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
        <ReactionButton
          postId={data.id}
          reactions={data.reactions}
          profileId={profile?.id} 
        />
        
        <button 
          onClick={onShare}
          className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
        >
          {isShared ? (
            <FiShare2 className="text-blue-500 text-xl" />
          ) : (
            <FiShare2 className="text-xl" />
          )}
          <span>Share</span>
        </button>
        
        <button 
          onClick={onPromote}
          className="flex items-center space-x-1 text-gray-700 hover:text-purple-500 transition-colors"
        >
          {isPromoted ? (
            <IoRocketSharp className="text-purple-500 text-xl" />
          ) : (
            <IoRocketOutline className="text-xl" />
          )}
          <span>Promote</span>
        </button>
      </div>
      
      <div className="mt-4 bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-800">{data.description || "No description provided"}</p>
      </div>
    </div>
  );
};

export default VideoInfo;