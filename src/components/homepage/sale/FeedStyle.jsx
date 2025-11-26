import { FaLock, FaPlay, FaPause, FaRegHeart, FaComment } from "react-icons/fa";
import { motion } from "framer-motion";

const LockedState = ({ 
  post, 
  isPlaying, 
  togglePlayPause, 
  handleLockClick 
}) => {
  return (
    <motion.div 
      key="locked"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full min-h-[500px]"
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-md opacity-70"
        style={{ backgroundImage: `url(${post.cover_photo})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img
              src={post.profile_picture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <h4 className="font-medium text-white">{post.username}</h4>
              <p className="text-xs text-white/80">{post.artist}</p>
            </div>
          </div>
          
          <motion.button 
            onClick={handleLockClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <FaLock className="text-white text-lg" />
          </motion.button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-48 h-48 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/20"
          >
            <img
              src={post.cover_photo}
              alt="Music Cover"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{post.caption}</h2>
            <p className="text-white/80">{post.type} • {post.duration}</p>
          </div>
          
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <FaPause className="text-white" />
                <span className="text-white/90">Pause Preview</span>
              </>
            ) : (
              <>
                <FaPlay className="text-white" />
                <span className="text-white/90">Play 10s Preview</span>
              </>
            )}
          </motion.button>
        </div>
        
        <div className="flex justify-between text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <FaRegHeart />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LockedState;