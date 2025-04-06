import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaShare } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactionButton from "../../details/Reactions";
import { useState } from "react";

const AudioPlayerControls = ({
  isPlaying,
  data,
  togglePlayPause,
  currentTime,
  duration,
  handleSeek,
  volume,
  isMuted,
  toggleMute,
  handleVolumeChange,
  formatTime,
  postId,
  reactions,
  userId,
  setIsShareModalOpen
}) => {

    console.log(userId);
    
   

  return (
    <div className="rounded-2xl p-6 mb-8 ">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#2D8C72] rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
      
      {/* Main Controls */}
      <div className="flex items-center justify-around mb-4">
       
        
        <motion.button
          onClick={togglePlayPause}
          whileTap={{ scale: 0.95 }}
          className="bg-[#2D8C72]  text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {isPlaying ? (
            <FaPause className="text-xl" />
          ) : (
            <FaPlay className="text-xl ml-0.5" />
          )}
        </motion.button>
        
       
      </div>

      <div className="flex items-center justify-between mb-4">
      

                   <ReactionButton
  postId={postId}
  reactions={reactions}
  profileId={userId}
/>


<button 
  onClick={() => setIsShareModalOpen(true)}
  className="text-gray-600 hover:text-gray-900 transition-colors p-2"
>
  <FaShare className="text-xl" />
</button>



</div>
      
      {/* Volume Controls */}
    
    </div>
  );
};

export default AudioPlayerControls;