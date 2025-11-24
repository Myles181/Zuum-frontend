import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";

const TrackHeader = ({
  data,
  isOwner,
  handleDeleteAudio,
  handleUserClick,
  c // Default image import
}) => {
  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative w-75 h-70 md:w-72 md:h-72 mx-auto mb-8"
      >
        <div className="absolute  inset-0 rounded-2xl shadow-xl shadow-gray-400/20"></div>
        <img
          src={data.cover_photo || c}
          alt="Cover"
          className="relative z-10 w-full h-full object-cover rounded-2xl border border-white/20"
        />
        {isOwner && (
          <button
            onClick={handleDeleteAudio}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-20"
          >
            <FaTrash className="text-red-500 text-sm" />
          </button>
        )}
      </motion.div>
      
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.caption}</h1>
        <p className="text-gray-600">{data.type}</p>
        
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="inline-block mt-4"
          onClick={() => handleUserClick(data.profile_id)}
        >
          <div className="flex items-center justify-center space-x-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all">
            <img
              src={data.profile_picture || c}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-800 font-medium">{data.username}</span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TrackHeader;